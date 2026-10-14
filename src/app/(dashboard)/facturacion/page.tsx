"use client";

import * as React from "react";
import { ResumenCajaComponent } from "@/components/facturacion/resumen-caja";
import { TablaFacturas } from "@/components/facturacion/tabla-facturas";
import { getFacturas, getResumenCaja } from "@/lib/services/facturas";
import { getPacientes } from "@/lib/services/pacientes";
import { Factura, Paciente, ResumenCaja } from "@/types";
import { MOCK_RESUMEN_CAJA } from "@/lib/mock-data";

export default function FacturacionPage() {
  const [facturas, setFacturas] = React.useState<Factura[]>([]);
  const [pacientes, setPacientes] = React.useState<Paciente[]>([]);
  const [resumen, setResumen] = React.useState<ResumenCaja>(MOCK_RESUMEN_CAJA);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      try {
        const [facturasData, pacientesData, resumenData] = await Promise.all([
          getFacturas(),
          getPacientes(),
          getResumenCaja(),
        ]);
        setFacturas(facturasData);
        setPacientes(pacientesData);
        setResumen(resumenData);
      } catch (err) {
        console.error("Error al cargar datos de facturación de Supabase:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Facturación y Gestión de Cobros
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Control de ingresos diarios, facturas emitidas, resumen de caja y métodos de pago conectados a Supabase.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="animate-spin inline-block h-5 w-5 border-2 border-teal-600 border-t-transparent rounded-full mb-2" />
          <p>Cargando facturas y balances de caja desde Supabase...</p>
        </div>
      ) : (
        <>
          {/* Financial Overview Cards */}
          <ResumenCajaComponent resumen={resumen} />

          {/* Invoices List and Emission */}
          <TablaFacturas
            initialFacturas={facturas}
            pacientes={pacientes}
          />
        </>
      )}
    </div>
  );
}
