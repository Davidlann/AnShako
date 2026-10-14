"use client";

import * as React from "react";
import { CalendarioAgenda } from "@/components/agenda/calendario-agenda";
import { MOCK_CITAS, MOCK_PACIENTES } from "@/lib/mock-data";

export default function AgendaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Agenda y Planificador de Consultas
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Gestiona las sesiones de fisioterapia, psicología y salas de tratamiento en tiempo real.
        </p>
      </div>

      <CalendarioAgenda citas={MOCK_CITAS} pacientes={MOCK_PACIENTES} />
    </div>
  );
}
