'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import dashboardService, { Workflow } from '@/services/dashboard';

export const WorkflowMonitor = () => {
    const [workflows, setWorkflows] = useState<Workflow[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadWorkflows();
    }, []);

    const loadWorkflows = async () => {
        setLoading(true);
        try {
            const data = await dashboardService.getActiveWorkflows();
            setWorkflows(data);
        } catch (error) {
            console.error('Failed to load workflows:', error);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            'Contratos': 'border-blue-200/50 bg-blue-50/50 text-blue-600',
            'Licitações': 'border-amber-200/50 bg-amber-50/50 text-amber-600',
            'Jurídico': 'border-purple-200/50 bg-purple-50/50 text-purple-600',
            'Administrativo': 'border-green-200/50 bg-green-50/50 text-green-600',
            'default': 'border-border bg-card text-primary',
        };
        return colors[category] || colors['default'];
    };

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

            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-sm text-muted-foreground">Carregando workflows...</span>
                </div>
            ) : workflows.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                    Nenhum workflow ativo no momento.
                </div>
            ) : (
                <div className="space-y-3">
                    {workflows.map((workflow) => (
                        <div
                            key={workflow.id}
                            className={`rounded-xl border p-3.5 flex items-start justify-between gap-3 cursor-pointer hover:bg-accent/50 transition-colors ${getCategoryColor(workflow.category)}`}
                        >
                            <div className="flex-1">
                                <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${getCategoryColor(workflow.category)}`}>
                                    {workflow.category}
                                </p>
                                <p className="text-base font-medium text-foreground mb-0.5">{workflow.name}</p>
                                <p className="text-sm text-muted-foreground">
                                    <span className="font-medium text-foreground">{workflow.documentsInTransit} documento{workflow.documentsInTransit !== 1 ? 's' : ''}</span> em trânsito • Tempo médio: {workflow.avgProcessingTime}
                                </p>
                            </div>
                            {workflow.status === 'stalled' && (
                                <div className="flex items-center gap-1 text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                                    <TrendingUp className="w-3 h-3" />
                                    Parado
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
};
