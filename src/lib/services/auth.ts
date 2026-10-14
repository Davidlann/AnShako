"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export interface AuthError {
  message: string;
}

// ─── Iniciar sesión ───────────────────────────────────────────────────────────
export async function signIn(
  email: string,
  password: string
): Promise<AuthError | null> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { message: traducirErrorAuth(error.message) };
  }
  return null;
}

// ─── Registrar nuevo profesional ─────────────────────────────────────────────
export async function signUp(
  email: string,
  password: string,
  nombreCompleto: string
): Promise<AuthError | null> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nombre_completo: nombreCompleto },
    },
  });
  if (error) {
    return { message: traducirErrorAuth(error.message) };
  }
  return null;
}

// ─── Cerrar sesión ────────────────────────────────────────────────────────────
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

// ─── Solicitar reset de contraseña ───────────────────────────────────────────
export async function resetPassword(email: string): Promise<AuthError | null> {
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/update-password`,
  });
  if (error) {
    return { message: traducirErrorAuth(error.message) };
  }
  return null;
}

// ─── Actualizar contraseña (tras link de email) ───────────────────────────────
export async function updatePassword(
  newPassword: string
): Promise<AuthError | null> {
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) {
    return { message: traducirErrorAuth(error.message) };
  }
  return null;
}

// ─── Obtener usuario actual ───────────────────────────────────────────────────
export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// ─── Obtener perfil del profesional ──────────────────────────────────────────
export async function getProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data;
}

// ─── Actualizar perfil del profesional ───────────────────────────────────────
export async function updateProfile(updates: {
  nombre_completo?: string;
  numero_colegiado?: string;
  especialidad?: string;
  nombre_clinica?: string;
  telefono_clinica?: string;
  direccion_clinica?: string;
  nif_clinica?: string;
}): Promise<AuthError | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { message: "No autenticado" };

  const { error } = await supabase
    .from("profiles")
    .upsert({ id: user.id, ...updates, updated_at: new Date().toISOString() });

  if (error) return { message: error.message };
  return null;
}

// ─── Traducir mensajes de error de Supabase Auth al español ──────────────────
function traducirErrorAuth(mensaje: string): string {
  const traducciones: Record<string, string> = {
    "Invalid login credentials":
      "Email o contraseña incorrectos. Verifica tus datos.",
    "Email not confirmed":
      "Debes confirmar tu email antes de iniciar sesión. Revisa tu bandeja de entrada.",
    "User already registered": "Ya existe una cuenta con este email.",
    "Password should be at least 6 characters":
      "La contraseña debe tener al menos 6 caracteres.",
    "Unable to validate email address: invalid format":
      "El formato del email no es válido.",
    "Email rate limit exceeded":
      "Demasiados intentos. Espera unos minutos e inténtalo de nuevo.",
    "Invalid email or password":
      "Email o contraseña incorrectos. Verifica tus datos.",
    "Too many requests":
      "Demasiados intentos. Por favor, espera unos minutos.",
    "Signup is disabled": "El registro está desactivado temporalmente.",
    "For security purposes, you can only request this after":
      "Por seguridad, espera unos minutos antes de volver a solicitarlo.",
  };

  for (const [key, value] of Object.entries(traducciones)) {
    if (mensaje.includes(key)) return value;
  }

  return "Ha ocurrido un error. Por favor, inténtalo de nuevo.";
}
