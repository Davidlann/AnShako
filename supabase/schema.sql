-- ==============================================================================
-- ANSHAKO - SISTEMA DE GESTIÓN CLÍNICA
-- Esquema de Base de Datos PostgreSQL para Supabase
-- ==============================================================================

-- 1. Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 2. TABLA: PACIENTES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pacientes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(150) NOT NULL,
    dni VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(150),
    telefono VARCHAR(30) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    genero VARCHAR(20) NOT NULL CHECK (genero IN ('masculino', 'femenino', 'otro')),
    profesion VARCHAR(150),
    direccion TEXT,
    alergias TEXT[] DEFAULT '{}',
    antecedentes TEXT[] DEFAULT '{}',
    medicacion TEXT[] DEFAULT '{}',
    fecha_registro DATE DEFAULT CURRENT_DATE,
    estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo', 'alta')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices de búsqueda frecuente
CREATE INDEX IF NOT EXISTS idx_pacientes_dni ON pacientes(dni);
CREATE INDEX IF NOT EXISTS idx_pacientes_nombre ON pacientes(nombre, apellidos);

-- ------------------------------------------------------------------------------
-- 3. TABLA: PUNTOS DE DOLOR (Modelo Anatómico Interactivo)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS puntos_dolor (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
    x NUMERIC(5,2) NOT NULL, -- Coordenada relativa en porcentaje (0 - 100)
    y NUMERIC(5,2) NOT NULL, -- Coordenada relativa en porcentaje (0 - 100)
    vista VARCHAR(20) NOT NULL CHECK (vista IN ('anterior', 'posterior')),
    region VARCHAR(150) NOT NULL,
    descripcion TEXT,
    intensidad INTEGER NOT NULL CHECK (intensidad BETWEEN 1 AND 10), -- Escala EVA
    fecha DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_puntos_dolor_paciente ON puntos_dolor(paciente_id);

-- ------------------------------------------------------------------------------
-- 4. TABLA: NOTAS EVOLUTIVAS SOAP (Historial Clínico)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notas_soap (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
    fecha VARCHAR(50) NOT NULL, -- Timestamp legible formateado
    profesional VARCHAR(150) NOT NULL,
    s TEXT NOT NULL, -- Subjetivo: reporte del paciente
    o TEXT NOT NULL, -- Objetivo: exploración física y tests
    a TEXT NOT NULL, -- Análisis / Diagnóstico funcional
    p TEXT NOT NULL, -- Plan terapéutico y pauta de ejercicios
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notas_soap_paciente ON notas_soap(paciente_id);

-- ------------------------------------------------------------------------------
-- 5. TABLA: CITAS / AGENDA
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS citas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paciente_id UUID REFERENCES pacientes(id) ON DELETE SET NULL,
    paciente_nombre VARCHAR(250) NOT NULL,
    paciente_telefono VARCHAR(50),
    fecha DATE NOT NULL,
    hora_inicio VARCHAR(10) NOT NULL, -- Formato '09:30'
    hora_fin VARCHAR(10) NOT NULL,    -- Formato '10:30'
    tipo VARCHAR(50) NOT NULL,        -- Fisioterapia, Psicología, etc.
    estado VARCHAR(20) DEFAULT 'confirmada' CHECK (estado IN ('confirmada', 'pendiente', 'en_curso', 'completada', 'cancelada')),
    sala VARCHAR(100),
    notas TEXT,
    precio NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_citas_fecha ON citas(fecha);
CREATE INDEX IF NOT EXISTS idx_citas_paciente ON citas(paciente_id);

-- ------------------------------------------------------------------------------
-- 6. TABLA: FACTURAS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS facturas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    numero VARCHAR(50) NOT NULL UNIQUE, -- Ej: 'FAC-2026-0041'
    paciente_id UUID REFERENCES pacientes(id) ON DELETE SET NULL,
    paciente_nombre VARCHAR(250) NOT NULL,
    paciente_dni VARCHAR(20) NOT NULL,
    fecha_emision DATE DEFAULT CURRENT_DATE,
    fecha_vencimiento DATE,
    subtotal NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    iva_total NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    total NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    estado VARCHAR(20) DEFAULT 'pagada' CHECK (estado IN ('pagada', 'pendiente', 'anulada')),
    metodo_pago VARCHAR(30) CHECK (metodo_pago IN ('efectivo', 'tarjeta', 'bizum', 'transferencia')),
    observaciones TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_facturas_numero ON facturas(numero);
CREATE INDEX IF NOT EXISTS idx_facturas_paciente ON facturas(paciente_id);

-- ------------------------------------------------------------------------------
-- 7. TABLA: LÍNEAS DE FACTURA
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS lineas_factura (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    factura_id UUID NOT NULL REFERENCES facturas(id) ON DELETE CASCADE,
    concepto VARCHAR(250) NOT NULL,
    cantidad INTEGER NOT NULL DEFAULT 1,
    precio_unitario NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    iva_porcentaje NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    subtotal NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    total NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lineas_factura ON lineas_factura(factura_id);

-- ------------------------------------------------------------------------------
-- 8. POLÍTICAS DE SEGURIDAD (RLS - Row Level Security)
-- Habilitamos acceso completo para usuarios autenticados y clave anónima del MVP.
-- ------------------------------------------------------------------------------
ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE puntos_dolor ENABLE ROW LEVEL SECURITY;
ALTER TABLE notas_soap ENABLE ROW LEVEL SECURITY;
ALTER TABLE citas ENABLE ROW LEVEL SECURITY;
ALTER TABLE facturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE lineas_factura ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acceso total a pacientes" ON pacientes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total a puntos_dolor" ON puntos_dolor FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total a notas_soap" ON notas_soap FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total a citas" ON citas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total a facturas" ON facturas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total a lineas_factura" ON lineas_factura FOR ALL USING (true) WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 9. DATOS DE PRUEBA INICIALES (Semilla opcional)
-- ------------------------------------------------------------------------------
INSERT INTO pacientes (id, nombre, apellidos, dni, email, telefono, fecha_nacimiento, genero, profesion, direccion, alergias, antecedentes, medicacion, estado)
VALUES
('b3c847d0-1234-4567-89ab-cdef01234561', 'Elena', 'García Martínez', '48291038B', 'elena.garcia@email.com', '612 345 678', '1988-04-12', 'femenino', 'Diseñadora Gráfica', 'Calle Mayor 45, 3ºB, Madrid', ARRAY['Penicilina', 'Látex'], ARRAY['Hernia discal L5-S1 en 2021', 'Bruxismo'], ARRAY['Enantyum ocasional'], 'activo'),
('b3c847d0-1234-4567-89ab-cdef01234562', 'Marcos', 'Alonso Navarro', '53920194C', 'marcos.alonso@empresa.es', '678 901 234', '1994-09-28', 'masculino', 'Desarrollador de Software', 'Av. Diagonal 210, Barcelona', ARRAY[]::TEXT[], ARRAY['Esguince de tobillo derecho en 2023'], ARRAY[]::TEXT[], 'activo'),
('b3c847d0-1234-4567-89ab-cdef01234563', 'Sofía', 'Vázquez Morales', '20193847X', 'sofia.vazquez@psico.com', '644 112 233', '1982-11-05', 'femenino', 'Profesora de Secundaria', 'Plaza España 12, Valencia', ARRAY['Polen', 'Ácaros'], ARRAY['Episodio depresivo en 2019', 'Migrañas'], ARRAY['Sertralina 50mg'], 'activo'),
('b3c847d0-1234-4567-89ab-cdef01234564', 'Javier', 'Ruiz Ortega', '71829402L', 'j.ruiz@transportes.com', '633 887 766', '1975-06-19', 'masculino', 'Conductor Profesional', 'Calle Río Segura 8, Murcia', ARRAY[]::TEXT[], ARRAY['Hipertensión', 'Menisco operado en 2015'], ARRAY['Enalapril 10mg'], 'activo')
ON CONFLICT (dni) DO NOTHING;

INSERT INTO puntos_dolor (paciente_id, x, y, vista, region, descripcion, intensidad, fecha)
VALUES
('b3c847d0-1234-4567-89ab-cdef01234561', 50.00, 58.00, 'posterior', 'Zona lumbar baja L5-S1', 'Dolor sordo irradiado a glúteo derecho al estar sentada más de 2h.', 7, '2026-10-10'),
('b3c847d0-1234-4567-89ab-cdef01234561', 50.00, 22.00, 'posterior', 'Trapecio superior bilateral', 'Sobrecarga tensional por pantallas.', 5, '2026-10-12'),
('b3c847d0-1234-4567-89ab-cdef01234562', 43.00, 78.00, 'anterior', 'Tendón rotuliano derecho', 'Molestia punzante al iniciar carrera o bajar escaleras.', 6, '2026-10-12');

INSERT INTO notas_soap (paciente_id, fecha, profesional, s, o, a, p)
VALUES
('b3c847d0-1234-4567-89ab-cdef01234561', '2026-10-10 10:30', 'Dr. Carlos Sanabria (Fisioterapeuta Col. 4821)', 'Refiere dolor lumbar punzante de intensidad 7/10 en EVA. Empeora con sedestación prolongada.', 'Test de Lasègue negativo. Contractura reactiva en cuadrado lumbar derecho.', 'Lumbalgia mecánica subaguda secundaria a sobrecarga postural.', 'Terapia manual miofascial y ejercicios de control lumbo-pélvico.');

INSERT INTO citas (paciente_id, paciente_nombre, paciente_telefono, fecha, hora_inicio, hora_fin, tipo, estado, sala, notas, precio)
VALUES
('b3c847d0-1234-4567-89ab-cdef01234561', 'Elena García Martínez', '612 345 678', '2026-10-14', '09:30', '10:30', 'Fisioterapia', 'en_curso', 'Cabina 1 - Fisioterapia Avanzada', 'Revisión de ejercicios y punción seca.', 55.00),
('b3c847d0-1234-4567-89ab-cdef01234562', 'Marcos Alonso Navarro', '678 901 234', '2026-10-14', '11:00', '12:00', 'Rehabilitación', 'confirmada', 'Gimnasio Terapéutico', 'Sentadillas excéntricas en cuña.', 50.00),
('b3c847d0-1234-4567-89ab-cdef01234563', 'Sofía Vázquez Morales', '644 112 233', '2026-10-14', '16:00', '17:00', 'Psicología', 'confirmada', 'Despacho 2 - Psicología Clínica', 'Sesión 4: Límites asertivos.', 65.00),
('b3c847d0-1234-4567-89ab-cdef01234564', 'Javier Ruiz Ortega', '633 887 766', '2026-10-14', '17:30', '18:30', 'Fisioterapia', 'pendiente', 'Cabina 2', 'Primera sesión del bono de hombro doloroso.', 55.00);

INSERT INTO facturas (id, numero, paciente_id, paciente_nombre, paciente_dni, fecha_emision, subtotal, iva_total, total, estado, metodo_pago, observaciones)
VALUES
('a1a2a3a4-0001-4000-8000-000000000001', 'FAC-2026-0041', 'b3c847d0-1234-4567-89ab-cdef01234564', 'Javier Ruiz Ortega', '71829402L', '2026-10-13', 60.00, 0.00, 60.00, 'pagada', 'tarjeta', 'Pago completado en TPV físico.'),
('a1a2a3a4-0002-4000-8000-000000000002', 'FAC-2026-0042', 'b3c847d0-1234-4567-89ab-cdef01234561', 'Elena García Martínez', '48291038B', '2026-10-10', 240.00, 0.00, 240.00, 'pagada', 'bizum', 'Bono 5 Sesiones activo.'),
('a1a2a3a4-0003-4000-8000-000000000003', 'FAC-2026-0043', 'b3c847d0-1234-4567-89ab-cdef01234562', 'Marcos Alonso Navarro', '53920194C', '2026-10-12', 50.00, 0.00, 50.00, 'pagada', 'efectivo', 'Sesión Fisioterapia deportiva.'),
('a1a2a3a4-0004-4000-8000-000000000004', 'FAC-2026-0044', 'b3c847d0-1234-4567-89ab-cdef01234563', 'Sofía Vázquez Morales', '20193847X', '2026-10-14', 65.00, 0.00, 65.00, 'pendiente', NULL, 'Pendiente de cobro al terminar sesión.')
ON CONFLICT (numero) DO NOTHING;

INSERT INTO lineas_factura (factura_id, concepto, cantidad, precio_unitario, iva_porcentaje, subtotal, total)
VALUES
('a1a2a3a4-0001-4000-8000-000000000001', 'Primera Consulta Fisioterapia y Valoración', 1, 60.00, 0.00, 60.00, 60.00),
('a1a2a3a4-0002-4000-8000-000000000002', 'Bono 5 Sesiones Terapia Manual y Readaptación', 1, 240.00, 0.00, 240.00, 240.00),
('a1a2a3a4-0003-4000-8000-000000000003', 'Sesión de Fisioterapia Deportiva (60 min)', 1, 50.00, 0.00, 50.00, 50.00),
('a1a2a3a4-0004-4000-8000-000000000004', 'Sesión de Psicoterapia Individual (60 min)', 1, 65.00, 0.00, 65.00, 65.00);
