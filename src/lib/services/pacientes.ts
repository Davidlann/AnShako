import { createClient } from "@/lib/supabase/client";
import { Paciente, PuntoDolor, NotaSOAP } from "@/types";
import { MOCK_PACIENTES } from "@/lib/mock-data";

interface PuntoDolorRow {
  id: string;
  paciente_id: string;
  x: number | string;
  y: number | string;
  vista: "anterior" | "posterior";
  region: string;
  descripcion?: string | null;
  intensidad: number;
  fecha: string;
}

interface NotaSOAPRow {
  id: string;
  paciente_id: string;
  fecha: string;
  profesional: string;
  s: string;
  o: string;
  a: string;
  p: string;
}

interface PacienteRow {
  id: string;
  nombre: string;
  apellidos: string;
  dni: string;
  email?: string | null;
  telefono: string;
  fecha_nacimiento: string;
  genero: "masculino" | "femenino" | "otro";
  profesion?: string | null;
  direccion?: string | null;
  alergias?: string[] | null;
  antecedentes?: string[] | null;
  medicacion?: string[] | null;
  fecha_registro: string;
  estado: "activo" | "inactivo" | "alta";
  puntos_dolor?: PuntoDolorRow[];
  notas_soap?: NotaSOAPRow[];
}

// Función auxiliar para mapear de snake_case (BD) a camelCase (Frontend)
export function mapPacienteFromDB(raw: PacienteRow): Paciente {
  return {
    id: raw.id,
    nombre: raw.nombre,
    apellidos: raw.apellidos,
    dni: raw.dni,
    email: raw.email || "",
    telefono: raw.telefono,
    fechaNacimiento: raw.fecha_nacimiento,
    genero: raw.genero,
    profesion: raw.profesion || undefined,
    direccion: raw.direccion || undefined,
    alergias: raw.alergias || [],
    antecedentes: raw.antecedentes || [],
    medicacion: raw.medicacion || [],
    fechaRegistro: raw.fecha_registro,
    estado: raw.estado,
    puntosDolor: (raw.puntos_dolor || []).map((p: PuntoDolorRow) => ({
      id: p.id,
      x: Number(p.x),
      y: Number(p.y),
      vista: p.vista,
      region: p.region,
      descripcion: p.descripcion || "",
      intensidad: p.intensidad,
      fecha: p.fecha,
    })),
    notasEvolutivas: (raw.notas_soap || []).map((n: NotaSOAPRow) => ({
      id: n.id,
      pacienteId: n.paciente_id,
      fecha: n.fecha,
      profesional: n.profesional,
      s: n.s,
      o: n.o,
      a: n.a,
      p: n.p,
    })),
  };
}

// Obtener todos los pacientes con puntos de dolor y notas SOAP
export async function getPacientes(): Promise<Paciente[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("pacientes")
      .select(`
        *,
        puntos_dolor (*),
        notas_soap (*)
      `)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      if (error) console.warn("Supabase getPacientes:", error.message);
      return MOCK_PACIENTES;
    }

    return (data as unknown as PacienteRow[]).map(mapPacienteFromDB);
  } catch (err) {
    console.warn("Fallo de conexión con Supabase. Usando mock-data.", err);
    return MOCK_PACIENTES;
  }
}

// Obtener un paciente específico por ID
export async function getPacienteById(id: string): Promise<Paciente | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("pacientes")
      .select(`
        *,
        puntos_dolor (*),
        notas_soap (*)
      `)
      .eq("id", id)
      .single();

    if (error || !data) {
      const mock = MOCK_PACIENTES.find((p) => p.id === id);
      return mock || null;
    }

    return mapPacienteFromDB(data as unknown as PacienteRow);
  } catch {
    const mock = MOCK_PACIENTES.find((p) => p.id === id);
    return mock || null;
  }
}

// Crear un nuevo paciente en Supabase
export async function createPaciente(
  paciente: Omit<Paciente, "id" | "puntosDolor" | "notasEvolutivas">
): Promise<Paciente> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("pacientes")
    .insert([
      {
        nombre: paciente.nombre,
        apellidos: paciente.apellidos,
        dni: paciente.dni,
        email: paciente.email,
        telefono: paciente.telefono,
        fecha_nacimiento: paciente.fechaNacimiento,
        genero: paciente.genero,
        profesion: paciente.profesion,
        direccion: paciente.direccion,
        alergias: paciente.alergias || [],
        antecedentes: paciente.antecedentes || [],
        medicacion: paciente.medicacion || [],
        fecha_registro: paciente.fechaRegistro,
        estado: paciente.estado,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Error al crear paciente en Supabase: ${error.message}`);
  }

  return mapPacienteFromDB({ ...(data as PacienteRow), puntos_dolor: [], notas_soap: [] });
}

// Agregar punto de dolor en el modelo anatómico
export async function addPuntoDolor(
  pacienteId: string,
  punto: Omit<PuntoDolor, "id" | "fecha">
): Promise<PuntoDolor> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("puntos_dolor")
    .insert([
      {
        paciente_id: pacienteId,
        x: punto.x,
        y: punto.y,
        vista: punto.vista,
        region: punto.region,
        descripcion: punto.descripcion,
        intensidad: punto.intensidad,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Error al registrar punto de dolor: ${error.message}`);
  }

  const row = data as unknown as PuntoDolorRow;
  return {
    id: row.id,
    x: Number(row.x),
    y: Number(row.y),
    vista: row.vista,
    region: row.region,
    descripcion: row.descripcion || "",
    intensidad: row.intensidad,
    fecha: row.fecha,
  };
}

// Eliminar punto de dolor
export async function deletePuntoDolor(puntoId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("puntos_dolor")
    .delete()
    .eq("id", puntoId);

  if (error) {
    throw new Error(`Error al eliminar punto de dolor: ${error.message}`);
  }
}

// Agregar nota evolutiva SOAP
export async function addNotaSOAP(
  pacienteId: string,
  nota: Omit<NotaSOAP, "id">
): Promise<NotaSOAP> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("notas_soap")
    .insert([
      {
        paciente_id: pacienteId,
        fecha: nota.fecha,
        profesional: nota.profesional,
        s: nota.s,
        o: nota.o,
        a: nota.a,
        p: nota.p,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Error al registrar nota SOAP: ${error.message}`);
  }

  const row = data as unknown as NotaSOAPRow;
  return {
    id: row.id,
    pacienteId: row.paciente_id,
    fecha: row.fecha,
    profesional: row.profesional,
    s: row.s,
    o: row.o,
    a: row.a,
    p: row.p,
  };
}
