"use client";

import * as React from "react";
import { ListaPacientes } from "@/components/pacientes/lista-pacientes";
import { getPacientes } from "@/lib/services/pacientes";
import { Paciente } from "@/types";

export default function PacientesPage() {
  const [pacientes, setPacientes] = React.useState<Paciente[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      try {
        const data = await getPacientes();
        setPacientes(data);
      } catch (err) {
        console.error("Error al cargar pacientes de Supabase:", err);
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
          Directorio de Pacientes
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Base de datos clínica con acceso a historias médicas, evolutivos SOAP y modelos anatómicos conectados a Supabase.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="animate-spin inline-block h-5 w-5 border-2 border-teal-600 border-t-transparent rounded-full mb-2" />
          <p>Cargando pacientes desde la base de datos Supabase...</p>
        </div>
      ) : (
        <ListaPacientes initialPacientes={pacientes} />
      )}
    </div>
  );
}
