import * as React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-slate-50 to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
      {/* Logo / Marca */}
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-teal-600 shadow-lg mb-4">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-7 h-7 text-white"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Anshako
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Gestión clínica profesional
          </p>
        </div>

        {children}

        {/* Footer GDPR */}
        <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-600 leading-relaxed">
          Al usar Anshako aceptas nuestra{" "}
          <a
            href="/politica-privacidad"
            className="underline hover:text-teal-600 transition-colors"
            target="_blank"
          >
            Política de Privacidad
          </a>{" "}
          conforme al RGPD y la LOPDGDD.
        </p>
      </div>
    </div>
  );
}
