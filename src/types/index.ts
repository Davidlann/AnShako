export type Genero = "masculino" | "femenino" | "otro";

export interface PuntoDolor {
  id: string;
  x: number; // Porcentaje relativo (0-100) en el mapa anatómico
  y: number; // Porcentaje relativo (0-100) en el mapa anatómico
  vista: "anterior" | "posterior";
  region: string;
  descripcion: string;
  intensidad: number; // 1 a 10
  fecha: string;
}

export interface NotaSOAP {
  id: string;
  pacienteId: string;
  fecha: string;
  profesional: string;
  s: string; // Subjetivo: relato del paciente, síntomas, EVA
  o: string; // Objetivo: hallazgos físicos, movilidad, palpación, pruebas
  a: string; // Análisis/Evaluación: diagnóstico funcional, juicio clínico
  p: string; // Plan: técnicas realizadas, pauta de ejercicios, próximas citas
}

export interface Paciente {
  id: string;
  nombre: string;
  apellidos: string;
  dni: string;
  email: string;
  telefono: string;
  fechaNacimiento: string;
  genero: Genero;
  profesion?: string;
  direccion?: string;
  alergias?: string[];
  antecedentes?: string[];
  medicacion?: string[];
  puntosDolor: PuntoDolor[];
  notasEvolutivas: NotaSOAP[];
  fechaRegistro: string;
  estado: "activo" | "inactivo" | "alta";
}

export type TipoCita =
  | "Fisioterapia"
  | "Psicología"
  | "Primera Consulta"
  | "Seguimiento"
  | "Rehabilitación"
  | "Osteopatía";

export type EstadoCita =
  | "confirmada"
  | "pendiente"
  | "en_curso"
  | "completada"
  | "cancelada";

export interface Cita {
  id: string;
  pacienteId: string;
  pacienteNombre: string;
  pacienteTelefono: string;
  fecha: string; // YYYY-MM-DD
  horaInicio: string; // HH:mm
  horaFin: string; // HH:mm
  tipo: TipoCita;
  estado: EstadoCita;
  sala?: string;
  notas?: string;
  precio: number;
}

export interface LineaFactura {
  id: string;
  concepto: string;
  cantidad: number;
  precioUnitario: number;
  ivaPorcentaje: number;
  subtotal: number;
  total: number;
}

export type EstadoFactura = "pagada" | "pendiente" | "anulada";
export type MetodoPago = "efectivo" | "tarjeta" | "bizum" | "transferencia";

export interface Factura {
  id: string;
  numero: string; // ej: FAC-2026-0042
  pacienteId: string;
  pacienteNombre: string;
  pacienteDni: string;
  fechaEmision: string;
  fechaVencimiento?: string;
  lineas: LineaFactura[];
  subtotal: number;
  ivaTotal: number;
  total: number;
  estado: EstadoFactura;
  metodoPago?: MetodoPago;
  observaciones?: string;
}

export interface ResumenCaja {
  ingresosTotalesMes: number;
  ingresosHoy: number;
  facturasPendientesCobro: number;
  cobrosPorMetodo: {
    efectivo: number;
    tarjeta: number;
    bizum: number;
    transferencia: number;
  };
}
