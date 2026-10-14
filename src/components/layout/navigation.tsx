"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarDays, Users, Receipt, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Inicio", href: "/", icon: LayoutDashboard },
  { name: "Agenda", href: "/agenda", icon: CalendarDays },
  { name: "Pacientes", href: "/pacientes", icon: Users },
  { name: "Facturas", href: "/facturacion", icon: Receipt },
  { name: "Ajustes", href: "/ajustes", icon: Settings },
];

export function MobileNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 border-t border-slate-200 bg-white/95 px-2 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 md:hidden">
      <div className="grid w-full grid-cols-5 items-center justify-around">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-1 text-[11px] font-medium transition-colors",
                isActive
                  ? "text-teal-600 dark:text-teal-400 font-semibold"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
