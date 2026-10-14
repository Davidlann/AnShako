"use client";

import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Plus,
} from "lucide-react";
import { Cita, Paciente } from "@/types";
import { Button } from "@/components/ui/button";
import { TarjetaCita } from "./tarjeta-cita";
import { ModalCita } from "./modal-cita";

interface CalendarioAgendaProps {
  citas: Cita[];
  pacientes: Paciente[];
}

export function CalendarioAgenda({
  citas: initialCitas,
  pacientes,
}: CalendarioAgendaProps) {
  const [citas, setCitas] = React.useState<Cita[]>(initialCitas);
  const [vista, setVista] = React.useState<"dia" | "semana">("dia");
  const [fechaActual, setFechaActual] = React.useState<string>("2026-10-14");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedCita, setSelectedCita] = React.useState<Cita | null>(null);

  const horasDelDia = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
  ];

  const diasSemana = [
    { fecha: "2026-10-12", nombre: "Lunes", num: "12" },
    { fecha: "2026-10-13", nombre: "Martes", num: "13" },
    { fecha: "2026-10-14", nombre: "Miércoles", num: "14", isToday: true },
    { fecha: "2026-10-15", nombre: "Jueves", num: "15" },
    { fecha: "2026-10-16", nombre: "Viernes", num: "16" },
    { fecha: "2026-10-17", nombre: "Sábado", num: "17" },
  ];

  const citasDelDia = citas.filter((c) => c.fecha === fechaActual);

  const handleSaveCita = (citaData: Partial<Cita>) => {
    if (citaData.id) {
      setCitas((prev) =>
        prev.map((c) => (c.id === citaData.id ? ({ ...c, ...citaData } as Cita) : c))
      );
    } else {
      const nuevaCita: Cita = {
        id: `cit-${Date.now()}`,
        pacienteId: citaData.pacienteId || "",
        pacienteNombre: citaData.pacienteNombre || "",
        pacienteTelefono: citaData.pacienteTelefono || "",
        fecha: citaData.fecha || fechaActual,
        horaInicio: citaData.horaInicio || "09:00",
        horaFin: citaData.horaFin || "10:00",
        tipo: citaData.tipo || "Fisioterapia",
        estado: citaData.estado || "confirmada",
        sala: citaData.sala || "Cabina 1",
        notas: citaData.notas || "",
        precio: citaData.precio || 50,
      };
      setCitas((prev) => [...prev, nuevaCita]);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-800 p-0.5">
            <button
              onClick={() => setVista("dia")}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                vista === "dia"
                  ? "bg-teal-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
              }`}
            >
              Vista Día
            </button>
            <button
              onClick={() => setVista("semana")}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                vista === "semana"
                  ? "bg-teal-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400"
              }`}
            >
              Vista Semana
            </button>
          </div>

          <div className="flex items-center gap-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
            <CalendarIcon className="h-4 w-4 text-teal-600" />
            <span>Miércoles, 14 de Octubre 2026</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 border border-slate-200 dark:border-slate-800 rounded-lg p-1">
            <button
              onClick={() => setFechaActual("2026-10-13")}
              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setFechaActual("2026-10-14")}
              className="px-2 text-xs font-semibold text-teal-600 hover:underline"
            >
              Hoy
            </button>
            <button
              onClick={() => setFechaActual("2026-10-15")}
              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <Button
            size="sm"
            onClick={() => {
              setSelectedCita(null);
              setModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            <span>Nueva Cita</span>
          </Button>
        </div>
      </div>

      {/* Calendar Grid Display */}
      {vista === "dia" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Day Timeline */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 p-5">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-teal-600" />
              <span>Horario de Consultas ({citasDelDia.length} citas programadas)</span>
            </h3>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {horasDelDia.map((hora) => {
                const citasEnHora = citasDelDia.filter((c) =>
                  c.horaInicio.startsWith(hora.split(":")[0])
                );

                return (
                  <div
                    key={hora}
                    className="grid grid-cols-12 py-3 min-h-[72px] items-start gap-4 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/20"
                  >
                    <div className="col-span-2 font-mono text-xs font-semibold text-slate-400">
                      {hora}
                    </div>
                    <div className="col-span-10 flex flex-col gap-2">
                      {citasEnHora.length > 0 ? (
                        citasEnHora.map((cita) => (
                          <TarjetaCita
                            key={cita.id}
                            cita={cita}
                            onClick={() => {
                              setSelectedCita(cita);
                              setModalOpen(true);
                            }}
                          />
                        ))
                      ) : (
                        <div
                          onClick={() => {
                            setSelectedCita(null);
                            setModalOpen(true);
                          }}
                          className="h-9 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg flex items-center justify-center text-xs text-slate-400 hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50/20 transition-all cursor-pointer select-none"
                        >
                          + Hueco disponible
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Side Summary */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-3">
                Resumen de la Jornada
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs p-2 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 font-medium">
                  <span>Citas programadas</span>
                  <span className="font-bold">{citasDelDia.length}</span>
                </div>
                <div className="flex justify-between items-center text-xs p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-medium">
                  <span>Previsión de facturación</span>
                  <span className="font-bold">
                    {citasDelDia.reduce((acc, c) => acc + c.precio, 0)} €
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs p-2 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 font-medium">
                  <span>Especialidades activas</span>
                  <span className="font-bold">Fisio, Psico, Reha</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-3">
                Salas y Gabinetes
              </h4>
              <ul className="space-y-2 text-xs">
                <li className="flex items-center justify-between p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    Cabina 1 (Terapia Manual)
                  </span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                </li>
                <li className="flex items-center justify-between p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    Cabina 2 (Acupuntura / Punción)
                  </span>
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                </li>
                <li className="flex items-center justify-between p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    Despacho 2 (Psicología)
                  </span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        /* Week View */
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-x-auto p-4">
          <div className="grid grid-cols-6 min-w-[700px] gap-3">
            {diasSemana.map((dia) => {
              const citasDia = citas.filter((c) => c.fecha === dia.fecha);
              return (
                <div
                  key={dia.fecha}
                  className={`flex flex-col gap-2 rounded-xl p-3 border ${
                    dia.isToday
                      ? "border-teal-500 bg-teal-50/20 dark:bg-teal-950/20"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/40"
                  }`}
                >
                  <div className="text-center pb-2 border-b border-slate-200 dark:border-slate-700">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {dia.nombre}
                    </p>
                    <p
                      className={`text-lg font-bold ${
                        dia.isToday ? "text-teal-600" : "text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      {dia.num}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 min-h-[300px]">
                    {citasDia.map((c) => (
                      <TarjetaCita
                        key={c.id}
                        cita={c}
                        compact
                        onClick={() => {
                          setSelectedCita(c);
                          setModalOpen(true);
                        }}
                      />
                    ))}
                    {citasDia.length === 0 && (
                      <p className="text-[11px] text-center text-slate-400 mt-6 italic">
                        Sin citas
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Appointment Modal */}
      <ModalCita
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        cita={selectedCita}
        pacientes={pacientes}
        onSave={handleSaveCita}
      />
    </div>
  );
}
