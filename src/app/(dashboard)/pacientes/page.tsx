"use client";

import * as React from "react";
import { ListaPacientes } from "@/components/pacientes/lista-pacientes";
import { MOCK_PACIENTES } from "@/lib/mock-data";

export default function PacientesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Directorio de Pacientes
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Base de datos clínica con acceso a historias médicas, evolutivos SOAP y modelos anatómicos.
        </p>
      </div>

      <ListaPacientes initialPacientes={MOCK_PACIENTES} />
    </div>
  );
}
