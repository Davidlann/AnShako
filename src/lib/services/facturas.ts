import { createClient } from "@/lib/supabase/client";
import { Factura, EstadoFactura, MetodoPago, ResumenCaja } from "@/types";
import { MOCK_FACTURAS, MOCK_RESUMEN_CAJA } from "@/lib/mock-data";

interface LineaFacturaRow {
  id: string;
  concepto: string;
  cantidad: number;
  precio_unitario: number | string;
  iva_porcentaje: number | string;
  subtotal: number | string;
  total: number | string;
}

interface FacturaRow {
  id: string;
  numero: string;
  paciente_id?: string | null;
  paciente_nombre: string;
  paciente_dni: string;
  fecha_emision: string;
  fecha_vencimiento?: string | null;
  subtotal: number | string;
  iva_total: number | string;
  total: number | string;
  estado: EstadoFactura;
  metodo_pago?: MetodoPago | null;
  observaciones?: string | null;
  lineas_factura?: LineaFacturaRow[];
}

export function mapFacturaFromDB(raw: FacturaRow): Factura {
  return {
    id: raw.id,
    numero: raw.numero,
    pacienteId: raw.paciente_id || "",
    pacienteNombre: raw.paciente_nombre,
    pacienteDni: raw.paciente_dni,
    fechaEmision: raw.fecha_emision,
    fechaVencimiento: raw.fecha_vencimiento || undefined,
    subtotal: Number(raw.subtotal),
    ivaTotal: Number(raw.iva_total),
    total: Number(raw.total),
    estado: raw.estado,
    metodoPago: raw.metodo_pago || undefined,
    observaciones: raw.observaciones || undefined,
    lineas: (raw.lineas_factura || []).map((l: LineaFacturaRow) => ({
      id: l.id,
      concepto: l.concepto,
      cantidad: l.cantidad,
      precioUnitario: Number(l.precio_unitario),
      ivaPorcentaje: Number(l.iva_porcentaje),
      subtotal: Number(l.subtotal),
      total: Number(l.total),
    })),
  };
}

export async function getFacturas(): Promise<Factura[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("facturas")
      .select(`
        *,
        lineas_factura (*)
      `)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      if (error) console.warn("Supabase getFacturas:", error.message);
      return MOCK_FACTURAS;
    }

    return (data as unknown as FacturaRow[]).map(mapFacturaFromDB);
  } catch (err) {
    console.warn("Fallo de conexión con Supabase. Usando facturas mock.", err);
    return MOCK_FACTURAS;
  }
}

export async function createFactura(
  factura: Omit<Factura, "id">
): Promise<Factura> {
  const supabase = createClient();

  const { data: facturaData, error: facturaError } = await supabase
    .from("facturas")
    .insert([
      {
        numero: factura.numero,
        paciente_id: factura.pacienteId || null,
        paciente_nombre: factura.pacienteNombre,
        paciente_dni: factura.pacienteDni,
        fecha_emision: factura.fechaEmision,
        fecha_vencimiento: factura.fechaVencimiento || null,
        subtotal: factura.subtotal,
        iva_total: factura.ivaTotal,
        total: factura.total,
        estado: factura.estado,
        metodo_pago: factura.metodoPago || null,
        observaciones: factura.observaciones || null,
      },
    ])
    .select()
    .single();

  if (facturaError) {
    throw new Error(`Error al crear factura: ${facturaError.message}`);
  }

  // Insert line items
  if (factura.lineas && factura.lineas.length > 0) {
    const lineasToInsert = factura.lineas.map((l) => ({
      factura_id: facturaData.id,
      concepto: l.concepto,
      cantidad: l.cantidad,
      precio_unitario: l.precioUnitario,
      iva_porcentaje: l.ivaPorcentaje,
      subtotal: l.subtotal,
      total: l.total,
    }));

    const { data: lineasData, error: lineasError } = await supabase
      .from("lineas_factura")
      .insert(lineasToInsert)
      .select();

    if (lineasError) {
      console.error("Error al insertar líneas de factura:", lineasError);
    }

    return mapFacturaFromDB({
      ...(facturaData as FacturaRow),
      lineas_factura: (lineasData as LineaFacturaRow[]) || [],
    });
  }

  return mapFacturaFromDB({ ...(facturaData as FacturaRow), lineas_factura: [] });
}

export async function updateEstadoFactura(
  id: string,
  estado: EstadoFactura,
  metodoPago?: MetodoPago
): Promise<void> {
  const supabase = createClient();
  const updateData: Record<string, unknown> = { estado };
  if (metodoPago) updateData.metodo_pago = metodoPago;

  const { error } = await supabase
    .from("facturas")
    .update(updateData)
    .eq("id", id);

  if (error) {
    throw new Error(`Error al actualizar estado de la factura: ${error.message}`);
  }
}

export async function getResumenCaja(): Promise<ResumenCaja> {
  try {
    const facturas = await getFacturas();
    const hoy = "2026-10-14";

    let ingresosTotalesMes = 0;
    let ingresosHoy = 0;
    let facturasPendientesCobro = 0;
    const cobrosPorMetodo = {
      tarjeta: 0,
      bizum: 0,
      efectivo: 0,
      transferencia: 0,
    };

    facturas.forEach((f) => {
      if (f.estado === "pagada") {
        ingresosTotalesMes += f.total;
        if (f.fechaEmision === hoy) {
          ingresosHoy += f.total;
        }
        if (f.metodoPago && f.metodoPago in cobrosPorMetodo) {
          cobrosPorMetodo[f.metodoPago as keyof typeof cobrosPorMetodo] += f.total;
        }
      } else if (f.estado === "pendiente") {
        facturasPendientesCobro += f.total;
      }
    });

    return {
      ingresosTotalesMes,
      ingresosHoy,
      facturasPendientesCobro,
      cobrosPorMetodo,
    };
  } catch {
    return MOCK_RESUMEN_CAJA;
  }
}
