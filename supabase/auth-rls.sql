-- ==============================================================================
-- ANSHAKO - SEGURIDAD Y AUTENTICACIÓN GDPR
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ==============================================================================
-- Este script:
-- 1. Crea la tabla de perfiles de usuario vinculada a auth.users
-- 2. Elimina las políticas permisivas actuales (que incluían anon)
-- 3. Crea políticas RLS estrictas: solo usuarios autenticados
-- 4. Crea trigger para crear perfil automáticamente al registrarse
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. TABLA: PROFILES (Perfil del profesional sanitario)
-- Vinculada 1:1 con auth.users de Supabase
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre_completo VARCHAR(200) NOT NULL,
    email VARCHAR(150) NOT NULL,
    numero_colegiado VARCHAR(50),           -- Nº colegiado: Col. XXXX
    especialidad VARCHAR(100),              -- Fisioterapeuta, Psicólogo, etc.
    nombre_clinica VARCHAR(200),
    telefono_clinica VARCHAR(30),
    direccion_clinica TEXT,
    nif_clinica VARCHAR(20),                -- Para la cabecera de facturas
    logo_url TEXT,
    gdpr_aceptado_en TIMESTAMPTZ,           -- Fecha de aceptación de privacidad
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS en profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Cada usuario solo puede ver y editar su propio perfil
DROP POLICY IF EXISTS "Perfil propio" ON profiles;
CREATE POLICY "Perfil propio" ON profiles
    FOR ALL TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- 2. TRIGGER: Crear perfil automáticamente al registrarse un nuevo usuario
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, nombre_completo, gdpr_aceptado_en)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'nombre_completo', ''),
        NOW()
    );
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 3. REVOCAR ACCESO ANÓNIMO Y APLICAR RLS SOLO PARA AUTHENTICATED
-- GDPR: Datos de salud (Art. 9 RGPD) = solo usuarios autenticados
-- ------------------------------------------------------------------------------

-- Revocar permisos de anon en todas las tablas clínicas
REVOKE ALL ON pacientes FROM anon;
REVOKE ALL ON puntos_dolor FROM anon;
REVOKE ALL ON notas_soap FROM anon;
REVOKE ALL ON citas FROM anon;
REVOKE ALL ON facturas FROM anon;
REVOKE ALL ON lineas_factura FROM anon;

-- Eliminar políticas permisivas anteriores
DROP POLICY IF EXISTS "Acceso total a pacientes" ON pacientes;
DROP POLICY IF EXISTS "Acceso total a puntos_dolor" ON puntos_dolor;
DROP POLICY IF EXISTS "Acceso total a notas_soap" ON notas_soap;
DROP POLICY IF EXISTS "Acceso total a citas" ON citas;
DROP POLICY IF EXISTS "Acceso total a facturas" ON facturas;
DROP POLICY IF EXISTS "Acceso total a lineas_factura" ON lineas_factura;

-- Crear nuevas políticas: SOLO authenticated
-- En una clínica multiusuario futura, aquí se añadiría user_id a cada tabla.
-- Por ahora: cualquier usuario autenticado de la clínica accede a todos los datos.
CREATE POLICY "Solo autenticados - pacientes"
    ON pacientes FOR ALL TO authenticated
    USING (true) WITH CHECK (true);

CREATE POLICY "Solo autenticados - puntos_dolor"
    ON puntos_dolor FOR ALL TO authenticated
    USING (true) WITH CHECK (true);

CREATE POLICY "Solo autenticados - notas_soap"
    ON notas_soap FOR ALL TO authenticated
    USING (true) WITH CHECK (true);

CREATE POLICY "Solo autenticados - citas"
    ON citas FOR ALL TO authenticated
    USING (true) WITH CHECK (true);

CREATE POLICY "Solo autenticados - facturas"
    ON facturas FOR ALL TO authenticated
    USING (true) WITH CHECK (true);

CREATE POLICY "Solo autenticados - lineas_factura"
    ON lineas_factura FOR ALL TO authenticated
    USING (true) WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 4. TABLA: REGISTRO DE CONSENTIMIENTO GDPR (Trazabilidad)
-- Art. 7 RGPD: La prueba del consentimiento debe conservarse
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS consentimientos_gdpr (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paciente_id UUID NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
    tipo VARCHAR(100) NOT NULL,             -- 'tratamiento_datos', 'cesion_datos', etc.
    version VARCHAR(20) NOT NULL DEFAULT '1.0',
    aceptado BOOLEAN NOT NULL DEFAULT true,
    ip_address INET,                        -- IP del dispositivo (opcional)
    user_agent TEXT,                        -- Navegador/dispositivo (opcional)
    fecha TIMESTAMPTZ DEFAULT NOW(),
    creado_por UUID REFERENCES auth.users(id)
);

ALTER TABLE consentimientos_gdpr ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Solo autenticados - consentimientos"
    ON consentimientos_gdpr FOR ALL TO authenticated
    USING (true) WITH CHECK (true);

-- Revocar acceso anon también aquí
REVOKE ALL ON consentimientos_gdpr FROM anon;

-- Grants para authenticated y service_role
GRANT ALL ON profiles TO authenticated, service_role;
GRANT ALL ON consentimientos_gdpr TO authenticated, service_role;
