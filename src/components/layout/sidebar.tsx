"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Users,
  Receipt,
  Settings,
  LayoutDashboard,
  Activity,
  HeartPulse,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: "Agenda",
    href: "/agenda",
    icon: CalendarDays,
    badge: "4 hoy",
  },
  {
    name: "Pacientes",
    href: "/pacientes",
    icon: Users,
    badge: null,
  },
  {
    name: "Facturación",
    href: "/facturacion",
    icon: Receipt,
    badge: "1 pend.",
  },
  {
    name: "Ajustes",
    href: "/ajustes",
    icon: Settings,
    badge: null,
  },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-screen w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 select-none",
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center px-6 border-b border-slate-100 dark:border-slate-800">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
            <HeartPulse className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                Anshako
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded dark:bg-teal-950 dark:text-teal-300">
                MVP
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-none">
              Gestión Clínica Inteligente
            </p>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1.5 p-4 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Clínica & Consultas
        </div>
        {navigationItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-teal-50 text-teal-700 shadow-xs dark:bg-teal-950/60 dark:text-teal-300 font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-200"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isActive
                      ? "text-teal-600 dark:text-teal-400"
                      : "text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300"
                  )}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                    isActive
                      ? "bg-teal-600 text-white"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Clinic Pro Info Card */}
      <div className="p-4">
        <div className="rounded-xl border border-teal-100 bg-gradient-to-br from-teal-50/50 to-emerald-50/50 p-3.5 dark:border-teal-900/50 dark:from-teal-950/30 dark:to-emerald-950/30">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 dark:text-teal-300">
            <Activity className="h-4 w-4" />
            <span>Clínica Sanabria & Co.</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Fisioterapia & Psicología
          </p>
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-teal-700 dark:text-teal-400 font-medium">
            <span>RGPD & LOPD Activo</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>
      </div>

      {/* User profile footer */}
      <div className="flex items-center justify-between border-t border-slate-100 p-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 font-bold text-slate-700 text-xs dark:bg-slate-800 dark:text-slate-200">
            CS
          </div>
          <div className="overflow-hidden">
            <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
              Dr. Carlos Sanabria
            </p>
            <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
              Fisioterapeuta Col. 4821
            </p>
          </div>
        </div>
        <button
          title="Cerrar sesión"
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 transition-colors"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
