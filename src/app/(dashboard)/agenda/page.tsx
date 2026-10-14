"use client";

import * as React from "react";
import { CalendarioAgenda } from "@/components/agenda/calendario-agenda";
import { getCitas } from "@/lib/services/citas";
import { getPacientes } from "@/lib/services/pacientes";
import { Cita, Paciente } from "@/types";

export default function AgendaPage() {
  const [citas, setCitas] = React.useState<Cita[]>([]);
  const [pacientes, setPacientes] = React.useState<Paciente[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
       try {
         const [citasData, pacientesData] = await Promise.all([
           getCitas(),
           getPacientes(),
         ]);
         setCitas(citasData);
         setPacientes(pacientesData);
       } catch (err) {
         console.error("Error al cargar datos de la agenda:", err);
       } finally {
         setLoading(false);
       }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Agenda y Planificador de Consultas
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Gestiona las sesiones de fisioterapia, psicología y salas de tratamiento en tiempo real conectadas a Supabase.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="animate-spin inline-block h-5 w-5 border-2 border-teal-600 border-t-transparent rounded-full mb-2" />
          <p>Cargando citas y pacientes desde Supabase...</p>
        </div>
      ) : (
        <CalendarioAgenda citas={citas} pacientes={pacientes} />
      )}
    </div>
  );
}
