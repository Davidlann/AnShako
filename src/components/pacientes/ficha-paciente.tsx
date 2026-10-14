"use client";

import * as React from "react";
import { Paciente, NotaSOAP, PuntoDolor, Cita, Factura } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NotasSOAP } from "./notas-soap";
import { ModeloAnatomico } from "./modelo-anatomico";
import { TarjetaCita } from "@/components/agenda/tarjeta-cita";
import {
  addNotaSOAP,
  addPuntoDolor,
  deletePuntoDolor,
} from "@/lib/services/pacientes";
import {
  Phone,
  Mail,
  AlertTriangle,
  Pill,
  Briefcase,
  MapPin,
  Calendar,
  FileCheck,
  ChevronLeft,
  Receipt,
  FileText,
} from "lucide-react";
import Link from "next/link";

interface FichaPacienteProps {
  paciente: Paciente;
  citas?: Cita[];
  facturas?: Factura[];
}

export function FichaPaciente({
  paciente: initialPaciente,
  citas = [],
  facturas = [],
}: FichaPacienteProps) {
  const [paciente, setPaciente] = React.useState<Paciente>(initialPaciente);
  const [activeTab, setActiveTab] = React.useState<
    "soap" | "anatomia" | "citas" | "facturacion"
  >("soap");

  // Calculate age
  const calcularEdad = (fechaNac: string) => {
    const nac = new Date(fechaNac);
    const anioRef = 2026;
    let edad = anioRef - nac.getFullYear();
    if (nac.getMonth() > 9) {
      edad--;
    }
    return Math.max(0, edad);
  };

  const handleAddNota = async (nuevaNota: Omit<NotaSOAP, "id" | "fecha">) => {
    const fechaActualStr = new Date().toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    try {
      const notaGuardada = await addNotaSOAP(paciente.id, {
        ...nuevaNota,
        fecha: fechaActualStr,
      });
      setPaciente((prev) => ({
        ...prev,
        notasEvolutivas: [notaGuardada, ...prev.notasEvolutivas],
      }));
    } catch (err) {
      console.warn("Fallo al guardar nota en Supabase. Guardando localmente:", err);
      const nota: NotaSOAP = {
        ...nuevaNota,
        id: `soap-${Date.now()}`,
        fecha: fechaActualStr,
      };
      setPaciente((prev) => ({
        ...prev,
        notasEvolutivas: [nota, ...prev.notasEvolutivas],
      }));
    }
  };

  const handleAddPunto = async (nuevoPunto: Omit<PuntoDolor, "id" | "fecha">) => {
    try {
      const puntoGuardado = await addPuntoDolor(paciente.id, nuevoPunto);
      setPaciente((prev) => ({
        ...prev,
        puntosDolor: [...prev.puntosDolor, puntoGuardado],
      }));
    } catch (err) {
      console.warn("Fallo al guardar punto en Supabase. Guardando localmente:", err);
      const punto: PuntoDolor = {
        ...nuevoPunto,
        id: `p-${Date.now()}`,
        fecha: new Date().toISOString().split("T")[0],
      };
      setPaciente((prev) => ({
        ...prev,
        puntosDolor: [...prev.puntosDolor, punto],
      }));
    }
  };

  const handleRemovePunto = async (id: string) => {
    setPaciente((prev) => ({
      ...prev,
      puntosDolor: prev.puntosDolor.filter((p) => p.id !== id),
    }));
    try {
      await deletePuntoDolor(id);
    } catch (err) {
      console.error("Error al eliminar punto de dolor en Supabase:", err);
    }
  };

  const citasPaciente = citas.filter((c) => c.pacienteId === paciente.id);
  const facturasPaciente = facturas.filter((f) => f.pacienteId === paciente.id);

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/pacientes"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-teal-600 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Volver al directorio de pacientes
        </Link>
      </div>

      {/* Patient Header Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 font-bold text-teal-700 text-xl dark:bg-teal-950/60 dark:text-teal-300 shadow-xs border border-teal-100 dark:border-teal-900">
              {paciente.nombre[0]}
              {paciente.apellidos[0]}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  {paciente.nombre} {paciente.apellidos}
                </h1>
                <Badge variant="success">Paciente Activo</Badge>
                <span className="text-xs font-mono text-slate-400">
                  DNI: {paciente.dni}
                </span>
              </div>

              <div className="mt-2.5 flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  {paciente.telefono}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  {paciente.email}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  {calcularEdad(paciente.fechaNacimiento)} años (
                  {paciente.fechaNacimiento})
                </span>
                {paciente.profesion && (
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                    {paciente.profesion}
                  </span>
                )}
                {paciente.direccion && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {paciente.direccion}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              Descargar Informe RGPD
            </Button>
            <Button size="sm" variant="primary">
              Agendar Cita
            </Button>
          </div>
        </div>

        {/* Medical Warnings & Background Alerts Banner */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3 pt-5 border-t border-slate-100 dark:border-slate-800">
          {/* Alergias */}
          <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-3 dark:border-rose-900/40 dark:bg-rose-950/20">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 dark:text-rose-400 mb-1">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Alergias Médicas</span>
            </div>
            {paciente.alergias && paciente.alergias.length > 0 ? (
              <div className="flex flex-wrap gap-1 mt-1">
                {paciente.alergias.map((alergia) => (
                  <span
                    key={alergia}
                    className="inline-block bg-rose-100 text-rose-800 px-2 py-0.5 rounded text-[11px] font-semibold dark:bg-rose-900 dark:text-rose-200"
                  >
                    {alergia}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-rose-700/80">Sin alergias conocidas</p>
            )}
          </div>

          {/* Antecedentes */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-3 dark:border-amber-900/40 dark:bg-amber-950/20">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-400 mb-1">
              <FileCheck className="h-3.5 w-3.5" />
              <span>Antecedentes Clínicos</span>
            </div>
            {paciente.antecedentes && paciente.antecedentes.length > 0 ? (
              <ul className="text-xs text-amber-900 dark:text-amber-300 list-disc list-inside">
                {paciente.antecedentes.map((ant, idx) => (
                  <li key={idx} className="truncate">
                    {ant}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-amber-700/80">Sin antecedentes relevantes</p>
            )}
          </div>

          {/* Medicación */}
          <div className="rounded-xl border border-sky-200 bg-sky-50/40 p-3 dark:border-sky-900/40 dark:bg-sky-950/20">
            <div className="flex items-center gap-1.5 text-xs font-bold text-sky-800 dark:text-sky-400 mb-1">
              <Pill className="h-3.5 w-3.5" />
              <span>Medicación Actual</span>
            </div>
            {paciente.medicacion && paciente.medicacion.length > 0 ? (
              <div className="flex flex-wrap gap-1 mt-1">
                {paciente.medicacion.map((med) => (
                  <span
                    key={med}
                    className="inline-block bg-sky-100 text-sky-800 px-2 py-0.5 rounded text-[11px] font-semibold dark:bg-sky-900 dark:text-sky-200"
                  >
                    {med}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-sky-700/80">No toma medicación regular</p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1">
        <button
          onClick={() => setActiveTab("soap")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === "soap"
              ? "bg-teal-600 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400"
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Notas Evolutivas SOAP ({paciente.notasEvolutivas.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("anatomia")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === "anatomia"
              ? "bg-teal-600 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400"
          }`}
        >
          <MapPin className="h-4 w-4" />
          <span>Mapa Anatómico de Dolor ({paciente.puntosDolor.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("citas")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === "citas"
              ? "bg-teal-600 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400"
          }`}
        >
          <Calendar className="h-4 w-4" />
          <span>Historial de Citas ({citasPaciente.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("facturacion")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === "facturacion"
              ? "bg-teal-600 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400"
          }`}
        >
          <Receipt className="h-4 w-4" />
          <span>Facturación ({facturasPaciente.length})</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === "soap" && (
          <NotasSOAP
            notas={paciente.notasEvolutivas}
            onAddNota={handleAddNota}
          />
        )}

        {activeTab === "anatomia" && (
          <div className="space-y-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Modelo Anatómico Interactivo
              </h3>
              <p className="text-xs text-slate-500">
                Haz clic sobre el cuerpo humano para añadir focos de dolor con escala EVA y seguimiento topográfico.
              </p>
            </div>
            <ModeloAnatomico
              puntosDolor={paciente.puntosDolor}
              onAddPunto={handleAddPunto}
              onRemovePunto={handleRemovePunto}
            />
          </div>
        )}

        {activeTab === "citas" && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Sesiones y Consultas del Paciente
            </h3>
            {citasPaciente.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-6 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                No hay citas registradas para este paciente.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {citasPaciente.map((cita) => (
                  <TarjetaCita key={cita.id} cita={cita} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "facturacion" && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Facturas y Recibos
            </h3>
            {facturasPaciente.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-6 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                Sin facturas emitidas para este paciente.
              </p>
            ) : (
              <div className="space-y-3">
                {facturasPaciente.map((fac) => (
                  <div
                    key={fac.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                          {fac.numero}
                        </span>
                        <Badge
                          variant={fac.estado === "pagada" ? "success" : "warning"}
                        >
                          {fac.estado.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {fac.lineas.map((l) => l.concepto).join(", ")}
                      </p>
                      <span className="text-[11px] text-slate-400">
                        Fecha: {fac.fechaEmision} · Método: {fac.metodoPago || "Pendiente"}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-bold text-teal-600">
                        {fac.total} €
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
