"use client";

import * as React from "react";
import { Clock, Phone, MapPin } from "lucide-react";
import { Cita, EstadoCita } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TarjetaCitaProps {
  cita: Cita;
  onClick?: () => void;
  compact?: boolean;
}

export function TarjetaCita({ cita, onClick, compact = false }: TarjetaCitaProps) {
  const estadoBadgeVariant: Record<
    EstadoCita,
    "success" | "warning" | "info" | "purple" | "default"
  > = {
    confirmada: "success",
    en_curso: "purple",
    pendiente: "warning",
    completada: "info",
    cancelada: "default",
  };

  const estadoLabel: Record<EstadoCita, string> = {
    confirmada: "Confirmada",
    en_curso: "En Consulta",
    pendiente: "Pendiente",
    completada: "Finalizada",
    cancelada: "Cancelada",
  };

  const tipoBorderColors: Record<string, string> = {
    Fisioterapia: "border-l-teal-500",
    Psicología: "border-l-indigo-500",
    Rehabilitación: "border-l-emerald-500",
    "Primera Consulta": "border-l-amber-500",
    Seguimiento: "border-l-sky-500",
    Osteopatía: "border-l-purple-500",
  };

  if (compact) {
    return (
      <div
        onClick={onClick}
        className={cn(
          "group relative flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-2.5 shadow-xs transition-all hover:shadow-md hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 border-l-4 cursor-pointer",
          tipoBorderColors[cita.tipo] || "border-l-teal-500"
        )}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            {cita.horaInicio} - {cita.horaFin}
          </span>
          <Badge variant={estadoBadgeVariant[cita.estado]} className="text-[10px] px-1.5 py-0">
            {estadoLabel[cita.estado]}
          </Badge>
        </div>
        <p className="mt-1 font-medium text-xs text-slate-900 dark:text-slate-100 truncate">
          {cita.pacienteNombre}
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
          {cita.tipo}
        </p>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs transition-all hover:shadow-md hover:border-teal-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-700 border-l-4 cursor-pointer",
        tipoBorderColors[cita.tipo] || "border-l-teal-500"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-slate-900 dark:text-slate-100 group-hover:text-teal-600 transition-colors">
              {cita.pacienteNombre}
            </span>
            <Badge variant={estadoBadgeVariant[cita.estado]}>
              {estadoLabel[cita.estado]}
            </Badge>
          </div>
          <span className="inline-block text-xs font-medium text-teal-700 dark:text-teal-400 mt-0.5">
            {cita.tipo}
          </span>
        </div>
        <div className="text-right">
          <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
            {cita.precio} €
          </span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2.5">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          <span>
            {cita.horaInicio} - {cita.horaFin}
          </span>
        </div>
        {cita.sala && (
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            <span className="truncate">{cita.sala}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <Phone className="h-3.5 w-3.5 text-slate-400" />
          <span>{cita.pacienteTelefono}</span>
        </div>
        {cita.notas && (
          <div className="text-[11px] italic text-slate-400 truncate col-span-full">
            &ldquo;{cita.notas}&rdquo;
          </div>
        )}
      </div>
    </div>
  );
}
