"use client";

import * as React from "react";
import Link from "next/link";
import { Paciente } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import {
  Search,
  UserPlus,
  ChevronRight,
  FileText,
} from "lucide-react";

import { createPaciente } from "@/lib/services/pacientes";

interface ListaPacientesProps {
  initialPacientes: Paciente[];
}

export function ListaPacientes({ initialPacientes }: ListaPacientesProps) {
  const [pacientes, setPacientes] = React.useState<Paciente[]>(initialPacientes);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [modalOpen, setModalOpen] = React.useState(false);


  // Form states
  const [nombre, setNombre] = React.useState("");
  const [apellidos, setApellidos] = React.useState("");
  const [dni, setDni] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [telefono, setTelefono] = React.useState("");
  const [fechaNacimiento, setFechaNacimiento] = React.useState("1990-01-01");
  const [genero, setGenero] = React.useState<"masculino" | "femenino" | "otro">("femenino");
  const [profesion, setProfesion] = React.useState("");
  const [alergias, setAlergias] = React.useState("");
  const [antecedentes, setAntecedentes] = React.useState("");

  const pacientesFiltrados = pacientes.filter((p) => {
    const query = searchTerm.toLowerCase();
    return (
      p.nombre.toLowerCase().includes(query) ||
      p.apellidos.toLowerCase().includes(query) ||
      p.dni.toLowerCase().includes(query) ||
      p.telefono.includes(query)
    );
  });

  const handleCrearPaciente = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const nuevo = await createPaciente({
        nombre,
        apellidos,
        dni,
        email,
        telefono,
        fechaNacimiento,
        genero,
        profesion,
        alergias: alergias ? alergias.split(",").map((s) => s.trim()) : [],
        antecedentes: antecedentes ? antecedentes.split(",").map((s) => s.trim()) : [],
        medicacion: [],
        fechaRegistro: new Date().toISOString().split("T")[0],
        estado: "activo",
      });
      setPacientes([nuevo, ...pacientes]);
    } catch (err) {
      console.warn("Fallo al guardar en Supabase. Guardando localmente:", err);
      const fallback: Paciente = {
        id: `pac-${Date.now()}`,
        nombre,
        apellidos,
        dni,
        email,
        telefono,
        fechaNacimiento,
        genero,
        profesion,
        alergias: alergias ? alergias.split(",").map((s) => s.trim()) : [],
        antecedentes: antecedentes ? antecedentes.split(",").map((s) => s.trim()) : [],
        medicacion: [],
        puntosDolor: [],
        notasEvolutivas: [],
        fechaRegistro: new Date().toISOString().split("T")[0],
        estado: "activo",
      };
      setPacientes([fallback, ...pacientes]);
    }
    setModalOpen(false);
    // Reset
    setNombre("");
    setApellidos("");
    setDni("");
    setEmail("");
    setTelefono("");
    setProfesion("");
    setAlergias("");
    setAntecedentes("");
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, DNI, teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 shadow-xs"
          />
        </div>

        {/* New Patient Button */}
        <Button onClick={() => setModalOpen(true)}>
          <UserPlus className="h-4 w-4" />
          <span>Registrar Nuevo Paciente</span>
        </Button>
      </div>

      {/* Patient Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold uppercase border-b border-slate-200 dark:border-slate-800 tracking-wider">
              <tr>
                <th className="py-3 px-4">Paciente</th>
                <th className="py-3 px-4">DNI / Contacto</th>
                <th className="py-3 px-4">Puntos de Dolor</th>
                <th className="py-3 px-4">Notas SOAP</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Ficha Clínica</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {pacientesFiltrados.map((paciente) => (
                <tr
                  key={paciente.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 font-bold text-teal-700 text-xs dark:bg-teal-950/60 dark:text-teal-300">
                        {paciente.nombre[0]}
                        {paciente.apellidos[0]}
                      </div>
                      <div>
                        <Link
                          href={`/pacientes/${paciente.id}`}
                          className="font-bold text-slate-900 hover:text-teal-600 dark:text-slate-100 transition-colors block"
                        >
                          {paciente.nombre} {paciente.apellidos}
                        </Link>
                        <span className="text-[11px] text-slate-400">
                          {paciente.profesion || "Sin ocupación registrada"}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    <div className="font-mono text-slate-800 dark:text-slate-200 font-medium">
                      {paciente.dni}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span>{paciente.telefono}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    {paciente.puntosDolor.length > 0 ? (
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {paciente.puntosDolor.length} áreas activas
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Sin dolores</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
                      <FileText className="h-3.5 w-3.5 text-teal-600" />
                      <span>{paciente.notasEvolutivas.length} registros</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <Badge variant="success">Activo</Badge>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/pacientes/${paciente.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <span>Abrir Historia</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Patient Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Alta de Nuevo Paciente"
        description="Ficha de filiación e historia clínica inicial"
        maxWidth="xl"
      >
        <form onSubmit={handleCrearPaciente} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Roberto"
                className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Apellidos *
              </label>
              <input
                type="text"
                required
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
                placeholder="Ej. Fernández Gómez"
                className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                DNI / NIE *
              </label>
              <input
                type="text"
                required
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                placeholder="12345678Z"
                className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Teléfono *
              </label>
              <input
                type="tel"
                required
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="600 000 000"
                className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Género
              </label>
              <select
                value={genero}
                onChange={(e) => setGenero(e.target.value as "masculino" | "femenino" | "otro")}
                className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <option value="femenino">Femenino</option>
                <option value="masculino">Masculino</option>
                <option value="otro">Otro / No especificado</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Profesión / Ocupación
              </label>
              <input
                type="text"
                value={profesion}
                onChange={(e) => setProfesion(e.target.value)}
                placeholder="Ej. Oficinista, Fontanero..."
                className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Alergias Conocidas (separadas por coma)
              </label>
              <input
                type="text"
                value={alergias}
                onChange={(e) => setAlergias(e.target.value)}
                placeholder="Ej. Penicilina, Látex, AINEs"
                className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Antecedentes / Cirugías
              </label>
              <input
                type="text"
                value={antecedentes}
                onChange={(e) => setAntecedentes(e.target.value)}
                placeholder="Ej. Apendicectomía 2018, Hipertensión"
                className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" size="sm" variant="primary">
              Dar de Alta Paciente
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
