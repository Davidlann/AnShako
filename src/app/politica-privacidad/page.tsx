import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export const metadata = {
  title: "Política de Privacidad | Anshako",
  description:
    "Política de privacidad y protección de datos de Anshako conforme al RGPD y la LOPDGDD.",
};

export default function PoliticaPrivacidadPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Cabecera */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-teal-600 hover:text-teal-700 dark:text-teal-400 transition-colors mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver a Anshako
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 dark:bg-teal-900/40">
              <Shield className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Política de Privacidad
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Última actualización: octubre de 2026
              </p>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-8 prose prose-sm prose-slate dark:prose-invert max-w-none">
          <div className="rounded-lg bg-teal-50 dark:bg-teal-950/30 border border-teal-100 dark:border-teal-900/30 p-4 mb-6 text-sm text-teal-800 dark:text-teal-300 not-prose">
            <p className="font-semibold mb-1">Base legal aplicable</p>
            <p className="text-xs leading-relaxed">
              Este documento cumple con el <strong>Reglamento (UE) 2016/679 (RGPD)</strong>, la{" "}
              <strong>Ley Orgánica 3/2018 (LOPDGDD)</strong> y la{" "}
              <strong>Ley 41/2002 de Autonomía del Paciente</strong>. Los datos de salud son datos de
              categoría especial conforme al Art. 9 RGPD y reciben protección reforzada.
            </p>
          </div>

          <h2>1. Responsable del tratamiento</h2>
          <p>
            El responsable del tratamiento es el profesional sanitario o entidad clínica que utiliza
            Anshako como herramienta de gestión de su consulta. Anshako actúa como <strong>encargado
            del tratamiento</strong> en los términos del Art. 28 RGPD.
          </p>

          <h2>2. Datos personales que tratamos</h2>
          <p>
            A través de Anshako se pueden tratar las siguientes categorías de datos:
          </p>
          <ul>
            <li>
              <strong>Datos identificativos:</strong> nombre, apellidos, DNI/NIE, fecha de nacimiento,
              dirección, email, teléfono.
            </li>
            <li>
              <strong>Datos de salud (categoría especial, Art. 9 RGPD):</strong> diagnósticos,
              historial clínico, notas SOAP, puntos de dolor, medicación, antecedentes, tratamientos.
            </li>
            <li>
              <strong>Datos económicos:</strong> facturas y métodos de pago.
            </li>
            <li>
              <strong>Datos de acceso:</strong> email del profesional y registros de autenticación.
            </li>
          </ul>

          <h2>3. Finalidad y base jurídica del tratamiento</h2>
          <table>
            <thead>
              <tr>
                <th>Finalidad</th>
                <th>Base jurídica</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Gestión de la historia clínica</td>
                <td>Art. 9.2.h RGPD + Ley 41/2002</td>
              </tr>
              <tr>
                <td>Emisión de facturas</td>
                <td>Art. 6.1.b RGPD (ejecución contractual)</td>
              </tr>
              <tr>
                <td>Gestión de citas y agenda</td>
                <td>Art. 6.1.b RGPD</td>
              </tr>
              <tr>
                <td>Cumplimiento de obligaciones legales</td>
                <td>Art. 6.1.c RGPD</td>
              </tr>
              <tr>
                <td>Comunicaciones con el paciente</td>
                <td>Consentimiento (Art. 6.1.a RGPD)</td>
              </tr>
            </tbody>
          </table>

          <h2>4. Conservación de los datos</h2>
          <p>
            Los datos de salud se conservarán durante el tiempo mínimo establecido por la normativa
            autonómica de sanidad aplicable (<strong>mínimo 5 años</strong> desde el alta del paciente
            en la mayoría de las comunidades autónomas). Los datos de facturación se conservarán{" "}
            <strong>6 años</strong> conforme al Código de Comercio.
          </p>

          <h2>5. Destinatarios de los datos</h2>
          <p>
            Los datos no se ceden a terceros salvo obligación legal. Anshako utiliza{" "}
            <strong>Supabase</strong> (Supabase Inc., con servidores en la Unión Europea) como
            infraestructura de base de datos, amparada en las cláusulas contractuales estándar de la
            Comisión Europea para transferencias internacionales.
          </p>

          <h2>6. Derechos de los pacientes (afectados)</h2>
          <p>Los pacientes cuyos datos son gestionados mediante Anshako tienen derecho a:</p>
          <ul>
            <li>
              <strong>Acceso</strong> a sus datos personales (Art. 15 RGPD)
            </li>
            <li>
              <strong>Rectificación</strong> de datos inexactos (Art. 16 RGPD)
            </li>
            <li>
              <strong>Supresión</strong> (&quot;derecho al olvido&quot;) cuando proceda (Art. 17 RGPD)
            </li>
            <li>
              <strong>Limitación</strong> del tratamiento (Art. 18 RGPD)
            </li>
            <li>
              <strong>Portabilidad</strong> de sus datos en formato estructurado (Art. 20 RGPD)
            </li>
            <li>
              <strong>Oposición</strong> al tratamiento (Art. 21 RGPD)
            </li>
          </ul>
          <p>
            Para ejercer estos derechos, los pacientes deben dirigirse directamente al profesional
            sanitario responsable. Asimismo, tienen derecho a reclamar ante la{" "}
            <strong>Agencia Española de Protección de Datos (AEPD)</strong> en{" "}
            <a href="https://www.aepd.es" target="_blank" rel="noreferrer">
              www.aepd.es
            </a>
            .
          </p>

          <h2>7. Seguridad de los datos</h2>
          <p>
            Anshako implementa las siguientes medidas de seguridad técnica y organizativa:
          </p>
          <ul>
            <li>Autenticación de usuarios mediante email y contraseña con sesiones cifradas (JWT)</li>
            <li>
              Cifrado en tránsito mediante TLS 1.3 en todas las comunicaciones
            </li>
            <li>
              Control de acceso a nivel de fila (Row Level Security) en la base de datos: solo
              usuarios autenticados pueden acceder a los datos
            </li>
            <li>Sin acceso anónimo a ningún dato clínico</li>
            <li>Copias de seguridad automáticas gestionadas por Supabase</li>
          </ul>

          <h2>8. Cookies y sesiones</h2>
          <p>
            Anshako utiliza únicamente <strong>cookies de sesión estrictamente necesarias</strong>{" "}
            para mantener la autenticación del profesional. No se utilizan cookies de seguimiento,
            publicidad ni analítica de terceros.
          </p>

          <h2>9. Contacto</h2>
          <p>
            Para cualquier consulta relativa a la privacidad o protección de datos, contacta con el
            profesional sanitario responsable de tu tratamiento. Para cuestiones relacionadas con la
            plataforma Anshako, escribe a{" "}
            <a href="mailto:privacidad@anshako.com">privacidad@anshako.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
