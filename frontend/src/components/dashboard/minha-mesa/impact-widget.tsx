'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Sparkles, TrendingUp, Clock, FileText } from 'lucide-react';

export const ImpactWidget = () => {
    return (
        <section className="mt-1 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            <Card className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm border-border/60">
                <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-primary" />
                        Impacto estimado do dia
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Se você concluir as principais tarefas hoje, a IA estima:
                    </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 text-xs">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground mb-0.5">Docs processados</p>
                        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <FileText className="w-3 h-3" /> 47 docs
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground mb-0.5">Processos finalizados</p>
                        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> 12 processos
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground mb-0.5">Prazos cumpridos</p>
                        <p className="text-sm font-semibold text-destructive flex items-center gap-1">
                            3 críticos
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground mb-0.5">Economia tempo</p>
                        <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> 4.5 horas
                        </p>
                    </div>
                </div>
            </Card>
        </section>
    );
};
