"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  User,
  Clock,
  ShieldCheck,
  Save,
  CheckCircle,
} from "lucide-react";

export default function AjustesPage() {
  const [guardado, setGuardado] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setGuardado(true);
    setTimeout(() => setGuardado(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Configuración y Ajustes de Clínica
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Personaliza los datos del centro sanitario, horarios y parámetros de facturación.
        </p>
      </div>

      {guardado && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300 animate-fade-in">
          <CheckCircle className="h-4 w-4" />
          <span>Configuración guardada correctamente.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Clinic Identity */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <Building2 className="h-5 w-5 text-teal-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Datos del Centro Sanitario
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nombre Comercial de la Clínica
              </label>
              <input
                type="text"
                defaultValue="Clínica Sanabria Fisioterapia & Salud"
                className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                CIF / NIF Sanitario
              </label>
              <input
                type="text"
                defaultValue="B-89210349"
                className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Dirección Física
              </label>
              <input
                type="text"
                defaultValue="Calle Mayor 45, 1º Izquierda, 28013 Madrid"
                className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Professional Details */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <User className="h-5 w-5 text-teal-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Profesional Titular
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nombre y Apellidos
              </label>
              <input
                type="text"
                defaultValue="Dr. Carlos Sanabria"
                className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nº de Colegiado Profesional
              </label>
              <input
                type="text"
                defaultValue="Col. 4821 (Ilustre Col. de Fisioterapeutas)"
                className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Schedule & Consultation Durations */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <Clock className="h-5 w-5 text-teal-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Horario de Atención y Duración de Citas
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Hora Apertura
              </label>
              <input
                type="time"
                defaultValue="08:30"
                className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Hora Cierre
              </label>
              <input
                type="time"
                defaultValue="20:30"
                className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Duración Estándar de Sesión
              </label>
              <select
                defaultValue="60"
                className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="45">45 minutos</option>
                <option value="50">50 minutos</option>
                <option value="60">60 minutos</option>
                <option value="90">90 minutos</option>
              </select>
            </div>
          </div>
        </div>

        {/* RGPD & Security */}
        <div className="rounded-2xl border border-teal-200 bg-teal-50/40 p-6 dark:border-teal-900/60 dark:bg-teal-950/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              <div>
                <h3 className="text-sm font-bold text-teal-900 dark:text-teal-200">
                  Cumplimiento RGPD & LOPDGDD Sanitaria
                </h3>
                <p className="text-xs text-teal-700 dark:text-teal-400">
                  Cifrado de datos de salud de categoría especial (Art. 9 RGPD).
                </p>
              </div>
            </div>
            <Badge variant="success">Auditoría Aprobada</Badge>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="submit" size="md" variant="primary">
            <Save className="h-4 w-4" />
            <span>Guardar Configuración</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
