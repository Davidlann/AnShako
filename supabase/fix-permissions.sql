-- ==============================================================================
-- SOLUCIÓN AL ERROR: "permission denied for table ..." (401 Unauthorized)
-- Ejecuta este script en el SQL Editor de tu proyecto en Supabase
-- ==============================================================================

-- 1. Conceder permisos de uso del esquema public
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- 2. Conceder permisos completos sobre todas las tablas existentes a anon y authenticated
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

-- 3. Configurar permisos por defecto para futuras tablas
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

-- 4. Asegurar que las políticas RLS permitan lectura y escritura
ALTER TABLE IF EXISTS pacientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS puntos_dolor ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS notas_soap ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS citas ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS facturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS lineas_factura ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Acceso total a pacientes" ON pacientes;
DROP POLICY IF EXISTS "Acceso total a puntos_dolor" ON puntos_dolor;
DROP POLICY IF EXISTS "Acceso total a notas_soap" ON notas_soap;
DROP POLICY IF EXISTS "Acceso total a citas" ON citas;
DROP POLICY IF EXISTS "Acceso total a facturas" ON facturas;
DROP POLICY IF EXISTS "Acceso total a lineas_factura" ON lineas_factura;

CREATE POLICY "Acceso total a pacientes" ON pacientes FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total a puntos_dolor" ON puntos_dolor FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total a notas_soap" ON notas_soap FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total a citas" ON citas FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total a facturas" ON facturas FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total a lineas_factura" ON lineas_factura FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
