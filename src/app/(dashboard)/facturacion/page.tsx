"use client";

import * as React from "react";
import { ResumenCajaComponent } from "@/components/facturacion/resumen-caja";
import { TablaFacturas } from "@/components/facturacion/tabla-facturas";
import { MOCK_FACTURAS, MOCK_PACIENTES, MOCK_RESUMEN_CAJA } from "@/lib/mock-data";

export default function FacturacionPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Facturación y Gestión de Cobros
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Control de ingresos diarios, facturas emitidas, resumen de caja y métodos de pago.
        </p>
      </div>

      {/* Financial Overview Cards */}
      <ResumenCajaComponent resumen={MOCK_RESUMEN_CAJA} />

      {/* Invoices List and Emission */}
      <TablaFacturas
        initialFacturas={MOCK_FACTURAS}
        pacientes={MOCK_PACIENTES}
      />
    </div>
  );
}
