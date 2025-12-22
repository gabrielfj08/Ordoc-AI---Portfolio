'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const WorkflowMonitor = () => {
    return (
        <Card className="p-5 border-border shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-base font-semibold text-foreground">Workflows mais ativos</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Processos com maior volume de documentos circulando.
                    </p>
                </div>
                <Link href="/dashboard?view=workflows">
                    <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground font-medium">Ver todos <ArrowRight className="ml-1.5 w-3.5 h-3.5" /></Button>
                </Link>
            </div>
            <div className="space-y-3">
                <div className="rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors p-3.5 flex items-start justify-between gap-3 cursor-pointer">
                    <div>
                        <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Contratos</p>
                        <p className="text-base font-medium text-foreground mb-0.5">Aprovação de Contratos Administrativos</p>
                        <p className="text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">24 documentos</span> em trânsito • Tempo médio: 3.2 dias
                        </p>
                    </div>
                </div>

                <div className="rounded-xl border border-amber-200/50 bg-amber-50/50 dark:bg-amber-900/10 p-3.5 flex items-start justify-between gap-3 cursor-pointer">
                    <div>
                        <p className="text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider mb-1">Licitações</p>
                        <p className="text-base font-medium text-foreground mb-0.5">Processo Licitatório Completo</p>
                        <p className="text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">8 processos</span> ativos • Próximo: Abertura de propostas
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
};
