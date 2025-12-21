'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Sparkles, TrendingUp, Clock, FileText } from 'lucide-react';

export const ImpactWidget = () => {
    return (
        <section className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            <Card className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm border-border/60">
                <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-primary" />
                        Impacto estimado do dia
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Se você concluir as principais tarefas hoje, a IA estima:
                    </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                    <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Docs processados</p>
                        <p className="text-base font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                            <FileText className="w-4 h-4" /> 47 docs
                        </p>
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Processos finalizados</p>
                        <p className="text-base font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                            <TrendingUp className="w-4 h-4" /> 12 processos
                        </p>
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Prazos cumpridos</p>
                        <p className="text-base font-semibold text-destructive flex items-center gap-1.5">
                            3 críticos
                        </p>
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Economia tempo</p>
                        <p className="text-base font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                            <Clock className="w-4 h-4" /> 4.5 horas
                        </p>
                    </div>
                </div>
            </Card>
        </section>
    );
};

