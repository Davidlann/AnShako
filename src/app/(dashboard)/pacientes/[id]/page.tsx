import * as React from "react";
import { notFound } from "next/navigation";
import { FichaPaciente } from "@/components/pacientes/ficha-paciente";
import { getPacienteById, getPacientes } from "@/lib/services/pacientes";
import { getCitas } from "@/lib/services/citas";
import { getFacturas } from "@/lib/services/facturas";

export async function generateStaticParams() {
  try {
    const pacientes = await getPacientes();
    return pacientes.map((p) => ({
      id: p.id,
    }));
  } catch {
    return [];
  }
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PacienteDetallePage({ params }: PageProps) {
  const { id } = await params;

  const [paciente, citas, facturas] = await Promise.all([
    getPacienteById(id),
    getCitas(),
    getFacturas(),
  ]);

  if (!paciente) {
    notFound();
  }

  return (
    <FichaPaciente
      paciente={paciente}
      citas={citas}
      facturas={facturas}
    />
  );
}
