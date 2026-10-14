"use client";

import * as React from "react";
import {
  Search,
  Bell,
  Plus,
  Calendar,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onNewPatient?: () => void;
  onNewAppointment?: () => void;
}

const emptySubscribe = () => () => {};

function useCurrentFormattedDate() {
  return React.useSyncExternalStore(
    emptySubscribe,
    () => {
      try {
        const currentDate = new Intl.DateTimeFormat("es-ES", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(new Date());
        return currentDate.charAt(0).toUpperCase() + currentDate.slice(1);
      } catch {
        return "Miércoles, 14 de octubre de 2026";
      }
    },
    () => "Miércoles, 14 de octubre de 2026"
  );
}

export function Header({ onNewPatient, onNewAppointment }: HeaderProps) {
  const formattedDate = useCurrentFormattedDate();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/90 px-6 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90">
      {/* Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="search"
            placeholder="Buscar paciente por nombre, DNI o teléfono..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50/70 pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 transition-colors focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-200"
          />
        </div>
      </div>

      {/* Date & Actions */}
      <div className="flex items-center gap-3">
        {/* Date badge */}
        <div className="hidden lg:flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <Calendar className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
          <span>{formattedDate}</span>
        </div>

        {/* Notifications */}
        <button
          className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
          title="Notificaciones"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-teal-500" />
        </button>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onNewPatient}
            className="hidden sm:inline-flex"
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Nuevo Paciente</span>
          </Button>

          <Button size="sm" variant="primary" onClick={onNewAppointment}>
            <Plus className="h-4 w-4" />
            <span>Nueva Cita</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
