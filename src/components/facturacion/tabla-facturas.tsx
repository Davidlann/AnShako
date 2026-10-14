"use client";

import * as React from "react";
import { Factura, Paciente, EstadoFactura, MetodoPago } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { formatCurrency } from "@/lib/utils";
import {
  Search,
  Plus,
  Download,
  CheckCircle,
  FileText,
} from "lucide-react";

interface TablaFacturasProps {
  initialFacturas: Factura[];
  pacientes: Paciente[];
}

export function TablaFacturas({ initialFacturas, pacientes }: TablaFacturasProps) {
  const [facturas, setFacturas] = React.useState<Factura[]>(initialFacturas);
  const [filtroEstado, setFiltroEstado] = React.useState<"todas" | "pagada" | "pendiente">("todas");
  const [search, setSearch] = React.useState("");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [facturaSeleccionada, setFacturaSeleccionada] = React.useState<Factura | null>(null);

  // New Invoice form states
  const [pacienteId, setPacienteId] = React.useState(pacientes[0]?.id || "");
  const [concepto, setConcepto] = React.useState("Sesión de Fisioterapia (60 min)");
  const [precio, setPrecio] = React.useState(55);
  const [cantidad, setCantidad] = React.useState(1);
  const [metodoPago, setMetodoPago] = React.useState<MetodoPago>("tarjeta");
  const [estado, setEstado] = React.useState<EstadoFactura>("pagada");

  const facturasFiltradas = facturas.filter((f) => {
    const matchFiltro =
      filtroEstado === "todas" ? true : f.estado === filtroEstado;
    const matchSearch =
      f.numero.toLowerCase().includes(search.toLowerCase()) ||
      f.pacienteNombre.toLowerCase().includes(search.toLowerCase()) ||
      f.pacienteDni.toLowerCase().includes(search.toLowerCase());
    return matchFiltro && matchSearch;
  });

  const handleCrearFactura = (e: React.FormEvent) => {
    e.preventDefault();
    const paciente = pacientes.find((p) => p.id === pacienteId);
    const subtotal = precio * cantidad;
    const ivaTotal = 0; // Exento de IVA sanitario en España (art 20 LIVA)
    const total = subtotal + ivaTotal;

    const nuevaFactura: Factura = {
      id: `fac-${Date.now()}`,
      numero: `FAC-2026-00${facturas.length + 45}`,
      pacienteId,
      pacienteNombre: paciente
        ? `${paciente.nombre} ${paciente.apellidos}`
        : "Paciente General",
      pacienteDni: paciente?.dni || "00000000X",
      fechaEmision: new Date().toISOString().split("T")[0],
      lineas: [
        {
          id: `lin-${Date.now()}`,
          concepto,
          cantidad,
          precioUnitario: precio,
          ivaPorcentaje: 0,
          subtotal,
          total,
        },
      ],
      subtotal,
      ivaTotal,
      total,
      estado,
      metodoPago: estado === "pagada" ? metodoPago : undefined,
    };

    setFacturas([nuevaFactura, ...facturas]);
    setModalOpen(false);
  };

  const handleMarcarPagada = (facturaId: string, metodo: MetodoPago) => {
    setFacturas((prev) =>
      prev.map((f) =>
        f.id === facturaId
          ? { ...f, estado: "pagada", metodoPago: metodo }
          : f
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Filters */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-800 p-0.5 bg-white dark:bg-slate-900">
            <button
              onClick={() => setFiltroEstado("todas")}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                filtroEstado === "todas"
                  ? "bg-teal-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
              }`}
            >
              Todas ({facturas.length})
            </button>
            <button
              onClick={() => setFiltroEstado("pagada")}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                filtroEstado === "pagada"
                  ? "bg-teal-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
              }`}
            >
              Cobradas ({facturas.filter((f) => f.estado === "pagada").length})
            </button>
            <button
              onClick={() => setFiltroEstado("pendiente")}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                filtroEstado === "pendiente"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
              }`}
            >
              Pendientes (
              {facturas.filter((f) => f.estado === "pendiente").length})
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar factura o paciente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 shadow-xs"
            />
          </div>
        </div>

        {/* Emit Invoice Button */}
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" />
          <span>Emitir Factura / Recibo</span>
        </Button>
      </div>

      {/* Invoices Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold uppercase border-b border-slate-200 dark:border-slate-800 tracking-wider">
              <tr>
                <th className="py-3 px-4">Nº Factura</th>
                <th className="py-3 px-4">Paciente</th>
                <th className="py-3 px-4">Conceptos</th>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Método</th>
                <th className="py-3 px-4">Importe</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {facturasFiltradas.map((factura) => (
                <tr
                  key={factura.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                    {factura.numero}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                      {factura.pacienteNombre}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {factura.pacienteDni}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs truncate text-slate-600 dark:text-slate-300">
                    {factura.lineas.map((l) => l.concepto).join(", ")}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {factura.fechaEmision}
                  </td>
                  <td className="py-3.5 px-4">
                    {factura.metodoPago ? (
                      <span className="capitalize font-medium text-slate-700 dark:text-slate-300">
                        {factura.metodoPago}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">-</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-sm text-slate-900 dark:text-slate-100">
                    {formatCurrency(factura.total)}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={
                        factura.estado === "pagada"
                          ? "success"
                          : factura.estado === "pendiente"
                          ? "warning"
                          : "danger"
                      }
                    >
                      {factura.estado.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {factura.estado === "pendiente" && (
                        <button
                          onClick={() => handleMarcarPagada(factura.id, "tarjeta")}
                          title="Cobrar factura ahora con tarjeta"
                          className="px-2 py-1 rounded bg-teal-50 text-teal-700 hover:bg-teal-100 text-[11px] font-semibold flex items-center gap-1 dark:bg-teal-950 dark:text-teal-300"
                        >
                          <CheckCircle className="h-3 w-3" />
                          Cobrar
                        </button>
                      )}
                      <button
                        onClick={() => setFacturaSeleccionada(factura)}
                        title="Ver detalle del recibo"
                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Emitir Factura */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Emitir Factura / Recibo Oficial"
        description="Emisión de factura simplificada o completa con exención sanitaria de IVA"
        maxWidth="lg"
      >
        <form onSubmit={handleCrearFactura} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Paciente a facturar *
            </label>
            <select
              value={pacienteId}
              onChange={(e) => setPacienteId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              required
            >
              {pacientes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} {p.apellidos} - {p.dni}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Concepto del Servicio *
            </label>
            <input
              type="text"
              value={concepto}
              onChange={(e) => setConcepto(e.target.value)}
              placeholder="Ej. Sesión Fisioterapia Deportiva (60 min)"
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Precio (€)
              </label>
              <input
                type="number"
                value={precio}
                onChange={(e) => setPrecio(Number(e.target.value))}
                min="0"
                step="5"
                className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Cantidad
              </label>
              <input
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
                min="1"
                className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Estado del Cobro
              </label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value as EstadoFactura)}
                className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="pagada">Cobrada (Pagada)</option>
                <option value="pendiente">Pendiente de Cobro</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Método de Cobro
              </label>
              <select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value as MetodoPago)}
                disabled={estado === "pendiente"}
                className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 disabled:opacity-50"
              >
                <option value="tarjeta">Tarjeta (TPV)</option>
                <option value="bizum">Bizum</option>
                <option value="efectivo">Efectivo</option>
                <option value="transferencia">Transferencia Bancaria</option>
              </select>
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3.5 border border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex justify-between py-1 text-slate-600 dark:text-slate-300">
              <span>Subtotal:</span>
              <span className="font-semibold">{precio * cantidad} €</span>
            </div>
            <div className="flex justify-between py-1 text-slate-500">
              <span>IVA (0% - Exención Sanitaria Art. 20 LIVA):</span>
              <span>0,00 €</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white">
              <span>Total Factura:</span>
              <span className="text-teal-600">{precio * cantidad} €</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" size="sm" variant="primary">
              Generar y Guardar Factura
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Detalle Factura */}
      {facturaSeleccionada && (
        <Modal
          isOpen={!!facturaSeleccionada}
          onClose={() => setFacturaSeleccionada(null)}
          title={`Detalle Factura ${facturaSeleccionada.numero}`}
          description="Documento oficial y justificante de cobro"
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    Clínica Sanabria & Co.
                  </h4>
                  <p className="text-slate-500 text-[11px]">
                    CIF: B-89210349 · Calle Mayor 45, Madrid
                  </p>
                </div>
                <Badge
                  variant={
                    facturaSeleccionada.estado === "pagada"
                      ? "success"
                      : "warning"
                  }
                >
                  {facturaSeleccionada.estado.toUpperCase()}
                </Badge>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block">Facturar a:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {facturaSeleccionada.pacienteNombre}
                  </span>
                  <span className="text-slate-500 block">
                    DNI: {facturaSeleccionada.pacienteDni}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block">Fecha emisión:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {facturaSeleccionada.fechaEmision}
                  </span>
                  <span className="text-slate-500 block">
                    Método: {facturaSeleccionada.metodoPago || "Pendiente"}
                  </span>
                </div>
              </div>
            </div>

            {/* Line items */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 font-semibold text-[11px]">
                  <tr>
                    <th className="p-2.5">Concepto</th>
                    <th className="p-2.5 text-center">Cant.</th>
                    <th className="p-2.5 text-right">Precio</th>
                    <th className="p-2.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {facturaSeleccionada.lineas.map((l) => (
                    <tr key={l.id}>
                      <td className="p-2.5 text-slate-800 dark:text-slate-200">
                        {l.concepto}
                      </td>
                      <td className="p-2.5 text-center">{l.cantidad}</td>
                      <td className="p-2.5 text-right">{l.precioUnitario} €</td>
                      <td className="p-2.5 text-right font-bold">{l.total} €</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center text-sm font-bold pt-2">
              <span>Total a pagar:</span>
              <span className="text-base text-teal-600">
                {formatCurrency(facturaSeleccionada.total)}
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFacturaSeleccionada(null)}
              >
                Cerrar
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => window.print()}
              >
                <Download className="h-3.5 w-3.5" />
                Imprimir Factura
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
