"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus, AlertCircle, CheckCircle } from "lucide-react";
import { signUp } from "@/lib/services/auth";
import { Button } from "@/components/ui/button";

export default function RegistroPage() {
  const router = useRouter();

  const [nombreCompleto, setNombreCompleto] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordConfirm, setPasswordConfirm] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [gdprAceptado, setGdprAceptado] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== passwordConfirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (!gdprAceptado) {
      setError("Debes aceptar la política de privacidad para continuar.");
      return;
    }

    setLoading(true);
    const result = await signUp(email, password, nombreCompleto);

    if (result) {
      setError(result.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/60 dark:shadow-slate-950/60 border border-slate-200/80 dark:border-slate-800 p-8 text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-teal-100 dark:bg-teal-900/40 mb-4">
          <CheckCircle className="h-7 w-7 text-teal-600 dark:text-teal-400" />
        </div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
          ¡Cuenta creada!
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
          Te hemos enviado un correo de confirmación a{" "}
          <strong className="text-slate-700 dark:text-slate-300">{email}</strong>.
          Haz clic en el enlace para activar tu cuenta.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/login")}
        >
          Ir a iniciar sesión
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/60 dark:shadow-slate-950/60 border border-slate-200/80 dark:border-slate-800 p-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
          Crear cuenta
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Gestiona tu consulta de forma segura y cumpliendo el RGPD
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre completo */}
        <div className="space-y-1.5">
          <label
            htmlFor="nombre"
            className="block text-xs font-medium text-slate-700 dark:text-slate-300"
          >
            Nombre completo
          </label>
          <input
            id="nombre"
            type="text"
            autoComplete="name"
            required
            value={nombreCompleto}
            onChange={(e) => setNombreCompleto(e.target.value)}
            placeholder="Dra. María López García"
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-teal-500 focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-colors"
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-xs font-medium text-slate-700 dark:text-slate-300"
          >
            Email profesional
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@clinica.com"
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-teal-500 focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-colors"
          />
        </div>

        {/* Contraseña */}
        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="block text-xs font-medium text-slate-700 dark:text-slate-300"
          >
            Contraseña{" "}
            <span className="text-slate-400 font-normal">(mín. 8 caracteres)</span>
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 pr-10 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-teal-500 focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Confirmar contraseña */}
        <div className="space-y-1.5">
          <label
            htmlFor="passwordConfirm"
            className="block text-xs font-medium text-slate-700 dark:text-slate-300"
          >
            Confirmar contraseña
          </label>
          <input
            id="passwordConfirm"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-teal-500 focus:bg-white dark:focus:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-colors"
          />
        </div>

        {/* GDPR Checkbox */}
        <div className="flex items-start gap-3 rounded-lg bg-teal-50/50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/30 p-3">
          <input
            id="gdpr"
            type="checkbox"
            required
            checked={gdprAceptado}
            onChange={(e) => setGdprAceptado(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
          />
          <label
            htmlFor="gdpr"
            className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed cursor-pointer"
          >
            Acepto el tratamiento de mis datos personales conforme a la{" "}
            <a
              href="/politica-privacidad"
              className="text-teal-600 hover:text-teal-700 underline"
              target="_blank"
            >
              Política de Privacidad
            </a>{" "}
            y el RGPD. Los datos de los pacientes son datos de salud (categoría especial) y serán tratados con las garantías del Art. 9 RGPD.
          </label>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 px-3 py-2.5">
            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
            <p className="text-xs text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Botón */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Creando cuenta...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Crear cuenta
            </span>
          )}
        </Button>
      </form>

      <p className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
        ¿Ya tienes cuenta?{" "}
        <Link
          href="/login"
          className="font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 transition-colors"
        >
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
