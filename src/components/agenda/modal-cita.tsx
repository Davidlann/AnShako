"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Cita, Paciente, TipoCita, EstadoCita } from "@/types";

interface ModalCitaProps {
  isOpen: boolean;
  onClose: () => void;
  cita?: Cita | null;
  pacientes: Paciente[];
  onSave: (cita: Partial<Cita>) => void;
}

interface FormInnerProps {
  cita?: Cita | null;
  pacientes: Paciente[];
  onClose: () => void;
  onSave: (cita: Partial<Cita>) => void;
}

function ModalCitaForm({ cita, pacientes, onClose, onSave }: FormInnerProps) {
  const [pacienteId, setPacienteId] = React.useState(
    cita?.pacienteId || pacientes[0]?.id || ""
  );
  const [fecha, setFecha] = React.useState(cita?.fecha || "2026-10-14");
  const [horaInicio, setHoraInicio] = React.useState(cita?.horaInicio || "09:00");
  const [horaFin, setHoraFin] = React.useState(cita?.horaFin || "10:00");
  const [tipo, setTipo] = React.useState<TipoCita>(
    cita?.tipo || "Fisioterapia"
  );
  const [estado, setEstado] = React.useState<EstadoCita>(
    cita?.estado || "confirmada"
  );
  const [sala, setSala] = React.useState(cita?.sala || "Cabina 1");
  const [notas, setNotas] = React.useState(cita?.notas || "");
  const [precio, setPrecio] = React.useState(cita?.precio ?? 55);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedPaciente = pacientes.find((p) => p.id === pacienteId);
    onSave({
      ...(cita ? { id: cita.id } : {}),
      pacienteId,
      pacienteNombre: selectedPaciente
        ? `${selectedPaciente.nombre} ${selectedPaciente.apellidos}`
        : "Paciente General",
      pacienteTelefono: selectedPaciente?.telefono || "",
      fecha,
      horaInicio,
      horaFin,
      tipo,
      estado,
      sala,
      notas,
      precio: Number(precio),
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Paciente selector */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Paciente *
        </label>
        <select
          value={pacienteId}
          onChange={(e) => setPacienteId(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          required
        >
          {pacientes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre} {p.apellidos} - DNI: {p.dni}
            </option>
          ))}
        </select>
      </div>

      {/* Tipo & Estado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Especialidad / Tipo *
          </label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoCita)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="Fisioterapia">Fisioterapia</option>
            <option value="Psicología">Psicología</option>
            <option value="Primera Consulta">Primera Consulta</option>
            <option value="Seguimiento">Seguimiento</option>
            <option value="Rehabilitación">Rehabilitación</option>
            <option value="Osteopatía">Osteopatía</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Estado
          </label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value as EstadoCita)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="confirmada">Confirmada</option>
            <option value="en_curso">En Consulta</option>
            <option value="pendiente">Pendiente</option>
            <option value="completada">Completada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
      </div>

      {/* Fecha y Horas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Fecha *
          </label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Inicio *
          </label>
          <input
            type="time"
            value={horaInicio}
            onChange={(e) => setHoraInicio(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Fin *
          </label>
          <input
            type="time"
            value={horaFin}
            onChange={(e) => setHoraFin(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            required
          />
        </div>
      </div>

      {/* Sala y Precio */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Sala / Cabina
          </label>
          <input
            type="text"
            value={sala}
            onChange={(e) => setSala(e.target.value)}
            placeholder="Ej. Cabina 1"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Precio (€)
          </label>
          <input
            type="number"
            value={precio}
            onChange={(e) => setPrecio(Number(e.target.value))}
            min="0"
            step="5"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          />
        </div>
      </div>

      {/* Notas */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Motivo de consulta / Notas internas
        </label>
        <textarea
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          rows={2}
          placeholder="Ej. Revisión lumbar, traer informe de resonancia..."
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary">
          {cita ? "Guardar Cambios" : "Confirmar Cita"}
        </Button>
      </div>
    </form>
  );
}

export function ModalCita({
  isOpen,
  onClose,
  cita,
  pacientes,
  onSave,
}: ModalCitaProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={cita ? "Editar Cita Clínica" : "Nueva Cita Médica"}
      description="Planifica la sesión clínica, asigna sala y especialidad"
      maxWidth="lg"
    >
      <ModalCitaForm
        key={cita?.id ?? "nueva"}
        cita={cita}
        pacientes={pacientes}
        onClose={onClose}
        onSave={onSave}
      />
    </Modal>
  );
}
