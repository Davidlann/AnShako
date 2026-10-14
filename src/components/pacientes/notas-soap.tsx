"use client";

import * as React from "react";
import { NotaSOAP } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Calendar } from "lucide-react";

interface NotasSOAPProps {
  notas: NotaSOAP[];
  onAddNota?: (nota: Omit<NotaSOAP, "id" | "fecha">) => void;
  readOnly?: boolean;
}

export function NotasSOAP({ notas, onAddNota, readOnly = false }: NotasSOAPProps) {
  const [showForm, setShowForm] = React.useState(false);

  // Form states
  const [profesional, setProfesional] = React.useState(
    "Dr. Carlos Sanabria (Fisioterapeuta Col. 4821)"
  );
  const [s, setS] = React.useState("");
  const [o, setO] = React.useState("");
  const [a, setA] = React.useState("");
  const [p, setP] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddNota) return;

    onAddNota({
      pacienteId: notas[0]?.pacienteId || "pac-001",
      profesional,
      s,
      o,
      a,
      p,
    });

    setS("");
    setO("");
    setA("");
    setP("");
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText className="h-4 w-4 text-teal-600" />
            <span>Notas Evolutivas SOAP ({notas.length})</span>
          </h3>
          <p className="text-xs text-slate-500">
            Registro estructurado: Subjetivo, Objetivo, Análisis y Plan de tratamiento.
          </p>
        </div>

        {!readOnly && (
          <Button
            size="sm"
            onClick={() => setShowForm(!showForm)}
            variant={showForm ? "outline" : "primary"}
          >
            {showForm ? "Cancelar" : <><Plus className="h-4 w-4" /> Nueva Nota SOAP</>}
          </Button>
        )}
      </div>

      {/* New SOAP Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-teal-200 bg-white p-6 shadow-md dark:border-teal-900/60 dark:bg-slate-900 animate-fade-in space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-sm font-bold text-teal-800 dark:text-teal-300">
              Registrar Nueva Evolución Clínica (SOAP)
            </span>
            <span className="text-xs text-slate-400">
              {new Date().toLocaleDateString("es-ES")}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Profesional Responsable
            </label>
            <input
              type="text"
              value={profesional}
              onChange={(e) => setProfesional(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              required
            />
          </div>

          {/* S - Subjetivo */}
          <div className="rounded-xl border border-blue-200/80 bg-blue-50/20 p-3.5 dark:border-blue-900/40 dark:bg-blue-950/20">
            <label className="flex items-center gap-1.5 text-xs font-bold text-blue-800 dark:text-blue-300 mb-1">
              <span className="h-5 w-5 rounded-md bg-blue-600 text-white flex items-center justify-center text-[10px]">
                S
              </span>
              Subjetivo (Lo que refiere el paciente: dolor EVA, sensaciones, evolución)
            </label>
            <textarea
              value={s}
              onChange={(e) => setS(e.target.value)}
              rows={2}
              placeholder="Refiere mejoría del 40%, dolor punzante en cara externa de rodilla..."
              className="w-full rounded-lg border border-blue-200 bg-white p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-blue-900 dark:bg-slate-800 dark:text-slate-200"
              required
            />
          </div>

          {/* O - Objetivo */}
          <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/20 p-3.5 dark:border-emerald-900/40 dark:bg-emerald-950/20">
            <label className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-1">
              <span className="h-5 w-5 rounded-md bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                O
              </span>
              Objetivo (Exploración física, test ortopédicos, goniometría, signos)
            </label>
            <textarea
              value={o}
              onChange={(e) => setO(e.target.value)}
              rows={2}
              placeholder="Test de Lachman negativo, flexión activa a 125°, palpación dolorosa en..."
              className="w-full rounded-lg border border-emerald-200 bg-white p-2.5 text-xs text-slate-800 focus:border-emerald-500 focus:outline-none dark:border-emerald-900 dark:bg-slate-800 dark:text-slate-200"
              required
            />
          </div>

          {/* A - Análisis */}
          <div className="rounded-xl border border-purple-200/80 bg-purple-50/20 p-3.5 dark:border-purple-900/40 dark:bg-purple-950/20">
            <label className="flex items-center gap-1.5 text-xs font-bold text-purple-800 dark:text-purple-300 mb-1">
              <span className="h-5 w-5 rounded-md bg-purple-600 text-white flex items-center justify-center text-[10px]">
                A
              </span>
              Análisis / Juicio Clínico (Diagnóstico fisioterápico o psicológico)
            </label>
            <textarea
              value={a}
              onChange={(e) => setA(e.target.value)}
              rows={2}
              placeholder="Evolución favorable de tendinopatía en fase subaguda sin signos de recaída..."
              className="w-full rounded-lg border border-purple-200 bg-white p-2.5 text-xs text-slate-800 focus:border-purple-500 focus:outline-none dark:border-purple-900 dark:bg-slate-800 dark:text-slate-200"
              required
            />
          </div>

          {/* P - Plan */}
          <div className="rounded-xl border border-amber-200/80 bg-amber-50/20 p-3.5 dark:border-amber-900/40 dark:bg-amber-950/20">
            <label className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 mb-1">
              <span className="h-5 w-5 rounded-md bg-amber-600 text-white flex items-center justify-center text-[10px]">
                P
              </span>
              Plan Terapéutico (Técnicas aplicadas, pauta de ejercicios a domicilio, cita)
            </label>
            <textarea
              value={p}
              onChange={(e) => setP(e.target.value)}
              rows={2}
              placeholder="Terapia manual, punción seca, 3x12 sentadilla isométrica, cita el jueves..."
              className="w-full rounded-lg border border-amber-200 bg-white p-2.5 text-xs text-slate-800 focus:border-amber-500 focus:outline-none dark:border-amber-900 dark:bg-slate-800 dark:text-slate-200"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowForm(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" size="sm" variant="primary">
              Guardar en Historial Clínico
            </Button>
          </div>
        </form>
      )}

      {/* List of Previous SOAP Notes */}
      <div className="space-y-4">
        {notas.map((nota, index) => (
          <div
            key={nota.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900"
          >
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-teal-50 text-teal-700 px-2 py-0.5 text-xs font-bold dark:bg-teal-950/60 dark:text-teal-300">
                  Sesión #{notas.length - index}
                </span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {nota.profesional}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Calendar className="h-3.5 w-3.5" />
                <span>{nota.fecha}</span>
              </div>
            </div>

            {/* SOAP Grid */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* S */}
              <div className="rounded-xl border border-blue-100 bg-blue-50/20 p-3.5 dark:border-blue-900/30 dark:bg-blue-950/20">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="h-4 w-4 rounded bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                    S
                  </span>
                  <span className="text-xs font-bold text-blue-900 dark:text-blue-300">
                    Subjetivo
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {nota.s}
                </p>
              </div>

              {/* O */}
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/20 p-3.5 dark:border-emerald-900/30 dark:bg-emerald-950/20">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="h-4 w-4 rounded bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                    O
                  </span>
                  <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                    Objetivo
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {nota.o}
                </p>
              </div>

              {/* A */}
              <div className="rounded-xl border border-purple-100 bg-purple-50/20 p-3.5 dark:border-purple-900/30 dark:bg-purple-950/20">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="h-4 w-4 rounded bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold">
                    A
                  </span>
                  <span className="text-xs font-bold text-purple-900 dark:text-purple-300">
                    Análisis Clínico
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {nota.a}
                </p>
              </div>

              {/* P */}
              <div className="rounded-xl border border-amber-100 bg-amber-50/20 p-3.5 dark:border-amber-900/30 dark:bg-amber-950/20">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="h-4 w-4 rounded bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold">
                    P
                  </span>
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-300">
                    Plan Terapéutico
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {nota.p}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
