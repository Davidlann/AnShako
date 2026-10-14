"use client";

import * as React from "react";
import { ResumenCaja } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  CreditCard,
  Banknote,
  Smartphone,
  Landmark,
  TrendingUp,
  Clock,
  ArrowUpRight,
} from "lucide-react";

interface ResumenCajaProps {
  resumen: ResumenCaja;
}

export function ResumenCajaComponent({ resumen }: ResumenCajaProps) {
  return (
    <div className="space-y-6">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Facturado Mes */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Facturación Mensual
            </span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {formatCurrency(resumen.ingresosTotalesMes)}
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <ArrowUpRight className="h-3 w-3" /> +14.2%
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Comparado con el mes anterior
          </p>
        </div>

        {/* Ingresos Hoy */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Caja de Hoy
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Banknote className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {formatCurrency(resumen.ingresosHoy)}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            3 cobros completados hoy
          </p>
        </div>

        {/* Pendiente de Cobro */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pendiente de Cobro
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-600">
              {formatCurrency(resumen.facturasPendientesCobro)}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            1 factura en espera de abono
          </p>
        </div>

        {/* Ticket Medio */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Ticket Medio / Sesión
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
              <CreditCard className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              56,80 €
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Media ponderada fisioterapia y psicología
          </p>
        </div>
      </div>

      {/* Methods Distribution */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
          Desglose de Ingresos por Método de Pago
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <div className="p-2.5 rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
              <CreditCard className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Tarjeta (TPV)</p>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {formatCurrency(resumen.cobrosPorMetodo.tarjeta)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <div className="p-2.5 rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
              <Smartphone className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Bizum Profesional</p>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {formatCurrency(resumen.cobrosPorMetodo.bizum)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <Banknote className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Efectivo en Caja</p>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {formatCurrency(resumen.cobrosPorMetodo.efectivo)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <div className="p-2.5 rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              <Landmark className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Transferencia</p>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {formatCurrency(resumen.cobrosPorMetodo.transferencia)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
