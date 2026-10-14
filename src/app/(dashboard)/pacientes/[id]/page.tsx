import * as React from "react";
import { notFound } from "next/navigation";
import { FichaPaciente } from "@/components/pacientes/ficha-paciente";
import { MOCK_PACIENTES, MOCK_CITAS, MOCK_FACTURAS } from "@/lib/mock-data";

export function generateStaticParams() {
  return MOCK_PACIENTES.map((p) => ({
    id: p.id,
  }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PacienteDetallePage({ params }: PageProps) {
  const { id } = await params;
  const paciente = MOCK_PACIENTES.find((p) => p.id === id);

  if (!paciente) {
    notFound();
  }

  return (
    <FichaPaciente
      paciente={paciente}
      citas={MOCK_CITAS}
      facturas={MOCK_FACTURAS}
    />
  );
}
