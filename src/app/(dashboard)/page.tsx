"use client";

import * as React from "react";
import Link from "next/link";
import {
  CalendarDays,
  Users,
  Receipt,
  TrendingUp,
  Clock,
  ArrowRight,
  Activity,
  Sparkles,
} from "lucide-react";
import { getCitas } from "@/lib/services/citas";
import { getPacientes } from "@/lib/services/pacientes";
import { getResumenCaja } from "@/lib/services/facturas";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TarjetaCita } from "@/components/agenda/tarjeta-cita";
import { Cita, Paciente, ResumenCaja } from "@/types";
import { MOCK_CITAS, MOCK_PACIENTES, MOCK_RESUMEN_CAJA } from "@/lib/mock-data";

export default function DashboardPage() {
  const [citas, setCitas] = React.useState<Cita[]>(MOCK_CITAS);
  const [pacientes, setPacientes] = React.useState<Paciente[]>(MOCK_PACIENTES);
  const [resumen, setResumen] = React.useState<ResumenCaja>(MOCK_RESUMEN_CAJA);

  React.useEffect(() => {
    async function loadDashboardData() {
      try {
        const [citasData, pacientesData, resumenData] = await Promise.all([
          getCitas(),
          getPacientes(),
          getResumenCaja(),
        ]);
        setCitas(citasData);
        setPacientes(pacientesData);
        setResumen(resumenData);
      } catch (err) {
        console.warn("Cargando datos con fallback:", err);
      }
    }
    loadDashboardData();
  }, []);

  const citasHoy = citas.filter((c) => c.fecha === "2026-10-14");

  return (
    <div className="space-y-8">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-md mb-3">
            <Sparkles className="h-3.5 w-3.5 text-teal-200" />
            <span>Panel de Gestión Integral · Anshako</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Buenos días, Dr. Carlos Sanabria
          </h1>
          <p className="mt-2 text-sm text-teal-100 leading-relaxed">
            Tienes <span className="font-bold underline">{citasHoy.length} citas programadas</span> para la jornada de hoy. Todas las historias clínicas y consentimientos informados están sincronizados con la normativa sanitaria.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link href="/agenda">
              <Button size="sm" className="bg-white text-teal-800 hover:bg-teal-50 border-0 font-semibold shadow-xs">
                <CalendarDays className="h-4 w-4" />
                Ver Agenda de Hoy
              </Button>
            </Link>
            <Link href="/pacientes">
              <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-medium">
                <Users className="h-4 w-4" />
                Directorio de Pacientes
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative Background Circles */}
        <div className="absolute -right-8 -bottom-10 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute right-32 -top-12 h-48 w-48 rounded-full bg-teal-400/20 blur-xl pointer-events-none" />
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Citas Hoy */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Citas Hoy
            </span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400">
              <CalendarDays className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {citasHoy.length}
            </span>
            <span className="text-xs font-semibold text-teal-600">
              {citasHoy.filter((c) => c.estado === "en_curso").length > 0 ? "1 en curso" : "Jornada activa"}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Próxima: 11:00 con Marcos Alonso
          </p>
        </div>

        {/* Pacientes Activos */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Pacientes Activos
            </span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {pacientes.length}
            </span>
            <span className="text-xs font-semibold text-emerald-600">
              Sincronizados
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Fisioterapia y psicología clínica
          </p>
        </div>

        {/* Facturado Mes */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Facturado Mes
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {formatCurrency(resumen.ingresosTotalesMes)}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Caja hoy: {formatCurrency(resumen.ingresosHoy)}
          </p>
        </div>

        {/* Cobros Pendientes */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Pendiente de Cobro
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <Receipt className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-600">
              {formatCurrency(resumen.facturasPendientesCobro)}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Sesiones pendientes de abono
          </p>
        </div>
      </div>

      {/* Main Two Columns: Today's Schedule & Quick Clinical Access */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's appointments (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="h-4 w-4 text-teal-600" />
                <span>Citas de la Jornada (Miércoles 14 Oct)</span>
              </h2>
              <p className="text-xs text-slate-500">
                Consulta en tiempo real el estado y la sala asignada
              </p>
            </div>
            <Link
              href="/agenda"
              className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:underline"
            >
              <span>Ver calendario completo</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {citasHoy.map((cita) => (
              <TarjetaCita key={cita.id} cita={cita} />
            ))}
          </div>
        </div>

        {/* Patients & Quick Links (1 col) */}
        <div className="space-y-6">
          {/* Quick Patients */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Pacientes Recientes
              </h3>
              <Link
                href="/pacientes"
                className="text-xs font-medium text-teal-600 hover:underline"
              >
                Ver todos
              </Link>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2">
              {pacientes.slice(0, 3).map((paciente) => (
                <div
                  key={paciente.id}
                  className="py-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 font-bold text-teal-700 text-xs dark:bg-teal-950 dark:text-teal-300">
                      {paciente.nombre[0]}
                      {paciente.apellidos[0]}
                    </div>
                    <div>
                      <Link
                        href={`/pacientes/${paciente.id}`}
                        className="text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-teal-600 block"
                      >
                        {paciente.nombre} {paciente.apellidos}
                      </Link>
                      <span className="text-[11px] text-slate-400">
                        {paciente.puntosDolor?.length || 0} puntos de dolor · {paciente.notasEvolutivas?.length || 0} SOAP
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/pacientes/${paciente.id}`}
                    className="p-1 text-slate-400 hover:text-teal-600 rounded transition-colors"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Features Highlight */}
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-teal-50/30 p-5 dark:border-slate-800 dark:from-slate-900 dark:to-teal-950/20">
            <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 font-bold text-xs mb-2">
              <Activity className="h-4 w-4" />
              <span>Conectado a Base de Datos Supabase</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Módulo de notas evolutivas <strong>SOAP</strong>, mapa anatómico interactivo con escala <strong>EVA</strong> y facturación médica persistente en PostgreSQL.
            </p>
            <div className="flex flex-wrap gap-1.5 text-[10px] font-semibold">
              <span className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                PostgreSQL
              </span>
              <span className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                Supabase SSR
              </span>
              <span className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                RLS Activo
              </span>
              <span className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                CRUD Completo
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
