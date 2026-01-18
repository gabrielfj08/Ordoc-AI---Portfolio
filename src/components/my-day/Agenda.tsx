'use client';

// src/components/my-day/Agenda.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export const Agenda = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mock de datas críticas injetadas pela IA
  const today = new Date();
  const criticalDate = new Date(today);
  criticalDate.setDate(today.getDate() + 3);
  const criticalDates = [criticalDate];
  return (
    <Card className="border-none shadow-sm bg-card overflow-hidden h-full flex flex-col relative group">
      <CardHeader className="flex flex-row items-center justify-between pb-2 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-primary">📅</span>
          <CardTitle className="text-sm font-semibold text-foreground">Agenda Cognitiva</CardTitle>
        </div>
        <Button variant="link" size="xs" className="text-primary font-bold">
          VER TODAS
        </Button>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col">
        {!mounted ? (
          <div className="flex flex-col items-center justify-center p-8 text-center flex-1">
            <div className="w-full h-48 bg-slate-50 animate-pulse rounded-lg flex items-center justify-center">
              <span className="text-xs text-slate-300 font-medium">Sincronizando Agenda...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="px-4 relative group/calendar">
              <Calendar
                mode="single"
                selected={criticalDate}
                modifiers={{ critical: criticalDates }}
                modifiersStyles={{
                  critical: {
                    color: 'white',
                    backgroundColor: 'hsl(var(--primary))',
                    fontWeight: 'bold',
                    boxShadow: '0 0 10px hsl(var(--primary) / 0.5)'
                  }
                }}
                className="rounded-md border-none w-full"
                classNames={{
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary/90",
                  day_today: "bg-muted text-foreground font-bold"
                }}
              />

              {/* Popover flutuante para Hover Simulation */}
              <div className="opacity-0 group-hover/calendar:opacity-100 absolute top-10 left-1/2 -translate-x-1/2 bg-popover/95 text-popover-foreground text-xs p-3 rounded-xl backdrop-blur-md shadow-2xl transition-all duration-300 w-48 z-50 pointer-events-none border border-border animate-in fade-in zoom-in-50 slide-in-from-bottom-2">
                <div className="flex items-center gap-2 border-b border-border pb-1 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                  <p className="font-bold text-primary uppercase tracking-wider text-xs">Ação Crítica</p>
                </div>
                <p className="leading-relaxed text-muted-foreground">
                  O contrato <strong className="text-foreground">&quot;Empresa XYZ&quot;</strong> atinge a caducidade em 3 dias.
                </p>
                <div className="mt-2 bg-primary/10 text-primary px-1.5 py-0.5 rounded text-xs inline-block font-mono border border-primary/20">
                  ⚠️ Risco: Perda de prazo
                </div>
              </div>
            </div>

            {/* Notas de Tarefas Rápidas abaixo do calendário */}
            <div className="p-4 space-y-3 border-t border-border mt-auto">
              <div className="pl-3 border-l-2 border-primary relative">
                <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <h4 className="text-xs font-bold text-foreground">Reunião de Diretoria</h4>
                <p className="text-xs text-muted-foreground">14:00 - 15:30</p>
              </div>
              <div className="pl-3 border-l-2 border-border">
                <h4 className="text-xs font-bold text-foreground">Revisão de Contratos</h4>
                <p className="text-xs text-muted-foreground">16:00 - 17:00</p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};