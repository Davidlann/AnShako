"use client";

import * as React from "react";
import { PuntoDolor } from "@/types";
import { Button } from "@/components/ui/button";
import { Trash2, MapPin } from "lucide-react";

interface ModeloAnatomicoProps {
  puntosDolor: PuntoDolor[];
  onAddPunto?: (punto: Omit<PuntoDolor, "id" | "fecha">) => void;
  onRemovePunto?: (id: string) => void;
  readOnly?: boolean;
}

export function ModeloAnatomico({
  puntosDolor,
  onAddPunto,
  onRemovePunto,
  readOnly = false,
}: ModeloAnatomicoProps) {
  const [vista, setVista] = React.useState<"anterior" | "posterior">("posterior");
  const [puntoSeleccionado, setPuntoSeleccionado] = React.useState<PuntoDolor | null>(null);
  const [clickCoord, setClickCoord] = React.useState<{ x: number; y: number } | null>(null);

  // Form state when clicking on body
  const [region, setRegion] = React.useState("");
  const [descripcion, setDescripcion] = React.useState("");
  const [intensidad, setIntensidad] = React.useState(6);

  const puntosFiltrados = puntosDolor.filter((p) => p.vista === vista);

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (readOnly) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setClickCoord({ x, y });
    setPuntoSeleccionado(null);
  };

  const handleGuardarPunto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clickCoord || !onAddPunto) return;
    onAddPunto({
      x: clickCoord.x,
      y: clickCoord.y,
      vista,
      region: region.trim() || "Zona señalada",
      descripcion: descripcion.trim() || "Dolor localizado",
      intensidad,
    });
    setClickCoord(null);
    setRegion("");
    setDescripcion("");
    setIntensidad(6);
  };


  return (
    <div className="flex flex-col lg:flex-row gap-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      {/* Body Model Column */}
      <div className="flex flex-col items-center flex-1">
        {/* Toggle Anterior / Posterior */}
        <div className="flex items-center gap-2 mb-4 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setVista("anterior");
              setClickCoord(null);
            }}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              vista === "anterior"
                ? "bg-teal-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            Vista Anterior (Frontal)
          </button>
          <button
            type="button"
            onClick={() => {
              setVista("posterior");
              setClickCoord(null);
            }}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              vista === "posterior"
                ? "bg-teal-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            Vista Posterior (Espalda)
          </button>
        </div>

        {/* Anatomical Silhouette Diagram */}
        <div className="relative w-64 h-[420px] bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-center p-2 select-none overflow-hidden">
          <svg
            viewBox="0 0 200 400"
            className="w-full h-full cursor-crosshair"
            onClick={handleSvgClick}
          >
            {/* Anatomical Human Body Silhouette */}
            <g fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-80">
              {/* Head & Neck */}
              <circle cx="100" cy="35" r="22" className="fill-teal-50 dark:fill-teal-950/20" />
              <path d="M92 57 L92 70 M108 57 L108 70" />

              {/* Shoulders & Arms */}
              <path d="M92 70 C70 72, 45 80, 36 100 L24 165 C22 175, 20 195, 22 210" />
              <path d="M108 70 C130 72, 155 80, 164 100 L176 165 C178 175, 180 195, 178 210" />

              {/* Torso */}
              <path d="M60 95 C62 135, 68 180, 68 200 C68 220, 80 230, 100 230 C120 230, 132 220, 132 200 C132 180, 138 135, 140 95" />

              {/* Spine / Chest details depending on view */}
              {vista === "posterior" ? (
                /* Spine curve */
                <path
                  d="M100 70 L100 220"
                  strokeDasharray="4 4"
                  strokeWidth="1.5"
                  className="stroke-teal-400"
                />
              ) : (
                /* Clavicles & Sternum */
                <>
                  <path d="M75 75 Q100 85 125 75" strokeWidth="1.5" className="stroke-teal-400" />
                  <path d="M100 85 L100 145" strokeWidth="1.5" className="stroke-teal-400" />
                </>
              )}

              {/* Legs */}
              <path d="M72 230 C70 270, 68 310, 72 355 L74 385" />
              <path d="M92 230 C90 270, 88 310, 88 355 L86 385" />
              <path d="M108 230 C110 270, 112 310, 112 355 L114 385" />
              <path d="M128 230 C130 270, 132 310, 128 355 L126 385" />
            </g>

            {/* Pain Points Rendered on Silhouette */}
            {puntosFiltrados.map((punto) => (
              <g
                key={punto.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setPuntoSeleccionado(punto);
                  setClickCoord(null);
                }}
                className="cursor-pointer group"
              >
                <circle
                  cx={`${punto.x}%`}
                  cy={`${punto.y}%`}
                  r="9"
                  className={
                    punto.intensidad > 6
                      ? "fill-rose-500 fill-opacity-80 stroke-white stroke-2 animate-pulse"
                      : punto.intensidad > 3
                      ? "fill-amber-500 fill-opacity-80 stroke-white stroke-2"
                      : "fill-emerald-500 fill-opacity-80 stroke-white stroke-2"
                  }
                />
                <text
                  x={`${punto.x}%`}
                  y={`${punto.y}%`}
                  dy="3.5"
                  textAnchor="middle"
                  className="text-[9px] font-bold fill-white pointer-events-none select-none"
                >
                  {punto.intensidad}
                </text>
              </g>
            ))}

            {/* Temporary Pin Point being added */}
            {clickCoord && (
              <circle
                cx={`${clickCoord.x}%`}
                cy={`${clickCoord.y}%`}
                r="8"
                className="fill-teal-500 fill-opacity-60 stroke-teal-700 stroke-2 animate-ping"
              />
            )}
          </svg>

          {/* Hint text */}
          {!readOnly && !clickCoord && (
            <div className="absolute bottom-2 text-center text-[10px] text-slate-400 bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded-full pointer-events-none">
              Haz clic sobre el cuerpo para registrar un dolor
            </div>
          )}
        </div>
      </div>

      {/* Details & Pain Points List Column */}
      <div className="flex-1 flex flex-col justify-between">
        {/* If adding a point */}
        {clickCoord && (
          <form
            onSubmit={handleGuardarPunto}
            className="rounded-xl border border-teal-200 bg-teal-50/40 p-4 dark:border-teal-900 dark:bg-teal-950/30 animate-fade-in mb-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-teal-200 dark:border-teal-800">
              <span className="text-xs font-bold text-teal-800 dark:text-teal-300 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-teal-600" />
                Nuevo Punto de Dolor ({vista.toUpperCase()})
              </span>
              <button
                type="button"
                onClick={() => setClickCoord(null)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Cancelar
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Región anatómica
                </label>
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="Ej. Trapecio, L4-L5, Menisco interno"
                  required
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Intensidad EVA (1 - 10):{" "}
                  <span className="font-bold text-teal-700">{intensidad}/10</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={intensidad}
                  onChange={(e) => setIntensidad(Number(e.target.value))}
                  className="mt-2 w-full accent-teal-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="mt-2">
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                Descripción / Tipo de molestia
              </label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={2}
                placeholder="Punzante, quemazón, irradiado, rigidez matutina..."
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="mt-3 flex justify-end gap-2">
              <Button type="submit" size="sm" variant="primary">
                Guardar en Anatomía
              </Button>
            </div>
          </form>
        )}

        {/* Existing pain points list */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Puntos Marcados ({puntosFiltrados.length} en vista {vista})
          </h4>

          {puntosFiltrados.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-4 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl">
              No hay zonas de dolor registradas en la vista {vista}.
            </p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {puntosFiltrados.map((p) => {
                const isSelected = puntoSeleccionado?.id === p.id;

                return (
                  <div
                    key={p.id}
                    onClick={() => setPuntoSeleccionado(p)}
                    className={`flex items-start justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "border-teal-500 bg-teal-50/30 dark:bg-teal-950/20"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span
                        className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5 ${
                          p.intensidad > 6
                            ? "bg-rose-500"
                            : p.intensidad > 3
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                        }`}
                      >
                        {p.intensidad}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                            {p.region}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            EVA {p.intensidad}/10
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {p.descripcion}
                        </p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Registrado: {p.fecha}
                        </span>
                      </div>
                    </div>

                    {!readOnly && onRemovePunto && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemovePunto(p.id);
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        title="Eliminar punto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Leve (1-3)
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Moderado (4-6)
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Severo (7-10)
            </span>
          </div>
          <span className="font-mono text-[10px]">Escala EVA</span>
        </div>
      </div>
    </div>
  );
}
