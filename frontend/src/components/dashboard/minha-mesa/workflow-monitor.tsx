'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export const WorkflowMonitor = () => {
    return (
        <Card className="p-4 border-border shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <div className="flex items-center justify-between mb-3">
                <div>
                    <h2 className="text-sm font-semibold text-foreground">Workflows mais ativos</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Processos com maior volume de documentos circulando.
                    </p>
                </div>
                <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground">Ver todos <ArrowRight className="ml-1 w-3 h-3" /></Button>
            </div>
            <div className="space-y-2">
                <div className="rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors px-3 py-2.5 flex items-start justify-between gap-3 cursor-pointer">
                    <div>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-[0.18em] mb-1">Contratos</p>
                        <p className="text-sm font-medium text-foreground">Aprovação de Contratos Administrativos</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            <span className="font-medium text-foreground">24 documentos</span> em trânsito • Tempo médio: 3.2 dias
                        </p>
                    </div>
                </div>

                <div className="rounded-xl border border-amber-200/50 bg-amber-50/50 dark:bg-amber-900/10 px-3 py-2.5 flex items-start justify-between gap-3 cursor-pointer">
                    <div>
                        <p className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-[0.18em] mb-1">Licitações</p>
                        <p className="text-sm font-medium text-foreground">Processo Licitatório Completo</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            <span className="font-medium text-foreground">8 processos</span> ativos • Próximo: Abertura de propostas
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
};
