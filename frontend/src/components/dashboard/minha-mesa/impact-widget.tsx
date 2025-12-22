'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Sparkles, TrendingUp, Clock, FileText, Loader2 } from 'lucide-react';
import dashboardService, { ImpactEstimate } from '@/services/dashboard';

export const ImpactWidget = () => {
    const [impact, setImpact] = useState<ImpactEstimate | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadImpact();
    }, []);

    const loadImpact = async () => {
        setLoading(true);
        try {
            const data = await dashboardService.getImpactEstimate();
            setImpact(data);
        } catch (error) {
            console.error('Failed to load impact estimate:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                <Card className="p-5 flex items-center justify-center shadow-sm border-border/60">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-sm text-muted-foreground">Calculando impacto...</span>
                </Card>
            </section>
        );
    }

    return (
        <section className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            <Card className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm border-border/60">
                <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-primary" />
                        Impacto estimado do dia
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Se você concluir as principais tarefas hoje:
                    </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                    <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Docs processados</p>
                        <p className="text-base font-semibold text-emerald-600 flex items-center gap-1.5">
                            <FileText className="w-4 h-4" /> {impact?.docsProcessed || 0} docs
                        </p>
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Processos finalizados</p>
                        <p className="text-base font-semibold text-emerald-600 flex items-center gap-1.5">
                            <TrendingUp className="w-4 h-4" /> {impact?.processesCompleted || 0} processos
                        </p>
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Prazos cumpridos</p>
                        <p className="text-base font-semibold text-destructive flex items-center gap-1.5">
                            {impact?.criticalDeadlinesMet || 0} críticos
                        </p>
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Economia tempo</p>
                        <p className="text-base font-semibold text-amber-600 flex items-center gap-1.5">
                            <Clock className="w-4 h-4" /> {impact?.timeSaved || 0}h
                        </p>
                    </div>
                </div>
            </Card>
        </section>
    );
};

