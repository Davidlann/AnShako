import { createClient } from "@/lib/supabase/client";
import { Cita } from "@/types";
import { MOCK_CITAS } from "@/lib/mock-data";

interface CitaRow {
  id: string;
  paciente_id?: string | null;
  paciente_nombre: string;
  paciente_telefono?: string | null;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  tipo: Cita["tipo"];
  estado: Cita["estado"];
  sala?: string | null;
  notas?: string | null;
  precio: number | string;
}

export function mapCitaFromDB(raw: CitaRow): Cita {
  return {
    id: raw.id,
    pacienteId: raw.paciente_id || "",
    pacienteNombre: raw.paciente_nombre,
    pacienteTelefono: raw.paciente_telefono || "",
    fecha: raw.fecha,
    horaInicio: raw.hora_inicio,
    horaFin: raw.hora_fin,
    tipo: raw.tipo,
    estado: raw.estado,
    sala: raw.sala || undefined,
    notas: raw.notas || undefined,
    precio: Number(raw.precio),
  };
}

export async function getCitas(fecha?: string): Promise<Cita[]> {
  try {
    const supabase = createClient();
    let query = supabase
      .from("citas")
      .select("*")
      .order("hora_inicio", { ascending: true });

    if (fecha) {
      query = query.eq("fecha", fecha);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      if (error) console.warn("Supabase getCitas:", error.message);
      return fecha ? MOCK_CITAS.filter((c) => c.fecha === fecha) : MOCK_CITAS;
    }

    return (data as unknown as CitaRow[]).map(mapCitaFromDB);
  } catch (err) {
    console.warn("Fallo de conexión con Supabase. Usando citas mock.", err);
    return fecha ? MOCK_CITAS.filter((c) => c.fecha === fecha) : MOCK_CITAS;
  }
}

export async function createCita(cita: Omit<Cita, "id">): Promise<Cita> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("citas")
    .insert([
      {
        paciente_id: cita.pacienteId || null,
        paciente_nombre: cita.pacienteNombre,
        paciente_telefono: cita.pacienteTelefono,
        fecha: cita.fecha,
        hora_inicio: cita.horaInicio,
        hora_fin: cita.horaFin,
        tipo: cita.tipo,
        estado: cita.estado,
        sala: cita.sala,
        notas: cita.notas,
        precio: cita.precio,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Error al crear cita en Supabase: ${error.message}`);
  }

  return mapCitaFromDB(data as unknown as CitaRow);
}

export async function updateCita(id: string, cita: Partial<Cita>): Promise<Cita> {
  const supabase = createClient();
  const updateData: Record<string, unknown> = {};
  if (cita.pacienteId !== undefined) updateData.paciente_id = cita.pacienteId || null;
  if (cita.pacienteNombre !== undefined) updateData.paciente_nombre = cita.pacienteNombre;
  if (cita.pacienteTelefono !== undefined) updateData.paciente_telefono = cita.pacienteTelefono;
  if (cita.fecha !== undefined) updateData.fecha = cita.fecha;
  if (cita.horaInicio !== undefined) updateData.hora_inicio = cita.horaInicio;
  if (cita.horaFin !== undefined) updateData.hora_fin = cita.horaFin;
  if (cita.tipo !== undefined) updateData.tipo = cita.tipo;
  if (cita.estado !== undefined) updateData.estado = cita.estado;
  if (cita.sala !== undefined) updateData.sala = cita.sala;
  if (cita.notas !== undefined) updateData.notas = cita.notas;
  if (cita.precio !== undefined) updateData.precio = cita.precio;

  const { data, error } = await supabase
    .from("citas")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Error al actualizar cita en Supabase: ${error.message}`);
  }

  return mapCitaFromDB(data as unknown as CitaRow);
}

export async function deleteCita(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("citas").delete().eq("id", id);
  if (error) {
    throw new Error(`Error al eliminar cita: ${error.message}`);
  }
}
