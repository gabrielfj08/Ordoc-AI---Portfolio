'use client';

import React from 'react';
import { FileSignature, PenTool, CheckCircle, Clock, AlertCircle, Zap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import dashboardService, { PrioritySignature } from '@/services/dashboard';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

// Helper para formatar data
const formatDate = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    } catch {
        return dateString;
    }
};

// Helper para badge de impacto
const getImpactBadge = (impact: string) => {
    const styles = {
        critical: 'bg-red-100 text-red-700 border-red-200',
        high: 'bg-orange-100 text-orange-700 border-orange-200',
        medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        low: 'bg-blue-100 text-blue-700 border-blue-200',
    };
    const labels = {
        critical: 'Crítico',
        high: 'Alta',
        medium: 'Média',
        low: 'Baixa',
    };
    return {
        className: styles[impact as keyof typeof styles] || styles.medium,
        label: labels[impact as keyof typeof labels] || 'Média',
    };
};

export const SignPendingView = () => {
    // Buscar assinaturas priorizadas com IA
    const { data: signatures, isLoading } = useQuery({
        queryKey: ['prioritized-signatures'],
        queryFn: () => dashboardService.getPrioritizedSignatures(),
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                <span className="ml-3 text-muted-foreground">Carregando assinaturas...</span>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {signatures && signatures.map((sig) => {
                const impactBadge = getImpactBadge(sig.impact);

                return (
                    <div
                        key={sig.id}
                        className={`group relative flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-card hover:bg-accent/50 border ${sig.priority_score >= 9 ? 'border-red-300/60 bg-red-50/30' : 'border-border'} hover:border-primary/30 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer gap-4`}
                    >
                        {/* Left: Icon & Info */}
                        <div className="flex items-start gap-4 flex-1">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${sig.priority_score >= 9 ? 'bg-red-100' : 'bg-orange-50'}`}>
                                <FileSignature className={`w-5 h-5 ${sig.priority_score >= 9 ? 'text-red-600' : 'text-orange-600'}`} />
                            </div>

                            <div className="flex flex-col gap-1">
                                <h3 className="font-semibold text-foreground text-sm flex items-center gap-2 flex-wrap">
                                    {sig.title}
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Badge variant="outline" className={`text-[10px] border ${impactBadge.className}`}>
                                                    {sig.priority_score >= 9 && <AlertCircle className="w-3 h-3 mr-1" />}
                                                    {impactBadge.label}
                                                </Badge>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p className="text-xs">Prioridade: {sig.priority_score}/10</p>
                                                {sig.deadline && <p className="text-xs">Deadline: {formatDate(sig.deadline)}</p>}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </h3>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> Recebido em {formatDate(sig.received_at)}
                                    </span>
                                    {sig.estimated_time && (
                                        <span className="flex items-center gap-1 text-primary font-medium">
                                            <Zap className="w-3 h-3" /> ~{sig.estimated_time} min
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-center">
                            <Button
                                size="sm"
                                className={`${sig.priority_score >= 9 ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-600 hover:bg-orange-700'} text-white gap-2`}
                                disabled={!sig.can_sign}
                            >
                                <PenTool className="w-4 h-4" /> Assinar
                            </Button>
                        </div>
                    </div>
                );
            })}

            {(!signatures || signatures.length === 0) && (
                <div className="text-center py-12 text-muted-foreground bg-card/50 rounded-xl border border-dashed border-border">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500 opacity-50" />
                    <h3 className="text-lg font-medium text-foreground">Tudo em dia!</h3>
                    <p>Nenhum documento aguardando sua assinatura.</p>
                </div>
            )}
        </div>
    );
};
