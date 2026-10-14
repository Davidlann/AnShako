"use client";

import * as React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNavigation } from "@/components/layout/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Desktop Sidebar */}
      <React.Suspense fallback={<div className="hidden md:flex w-64 h-screen border-r border-slate-200 bg-white" />}>
        <Sidebar className="hidden md:flex sticky top-0" />
      </React.Suspense>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0 pb-16 md:pb-0">
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          <React.Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Cargando datos clínicos...</div>}>
            {children}
          </React.Suspense>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <React.Suspense fallback={null}>
        <MobileNavigation />
      </React.Suspense>
    </div>
  );
}
