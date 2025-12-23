'use client';

import React from 'react';
import { FileSignature, PenTool, CheckCircle, Clock, AlertCircle, Zap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { dashboardService, PrioritySignature } from '@/services/dashboard'; // Note: check import consistency
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { signatureService } from '@/services/signature';
import { SignatureDialog } from './signature-dialog';

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

    const [signingDoc, setSigningDoc] = React.useState<{ id: string, title: string, signer_id: string } | null>(null);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p>Analisando prioridades de assinatura...</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {(signatures || []).map((doc: PrioritySignature) => {
                const impactInfo = getImpactBadge(doc.impact);
                return (
                    <div
                        key={doc.id}
                        className={`group relative flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-card border rounded-xl gap-4 ${doc.impact === 'critical' ? 'border-red-200 bg-red-50/10' : 'border-border'}`}
                    >
                        {/* Left: Icon & Info */}
                        <div className="flex items-start gap-4 flex-1">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${doc.impact === 'critical' ? 'bg-red-100' : 'bg-orange-50'}`}>
                                <FileSignature className={`w-5 h-5 ${doc.impact === 'critical' ? 'text-red-600' : 'text-orange-600'}`} />
                            </div>

                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="font-semibold text-foreground text-sm">
                                        {doc.title}
                                    </h3>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Badge variant="secondary" className={`${impactInfo.className}`}>
                                                    {impactInfo.label} Prioridade
                                                </Badge>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p className="text-xs">
                                                    {doc.impact === 'critical' ? 'Vencido! Ação imediata necessária' :
                                                        doc.impact === 'high' ? 'Pendente há mais de 2 dias' :
                                                            'Aguardando assinaturas'}
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    {doc.priority_score >= 8 && (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="flex items-center text-amber-600">
                                                        <Zap className="w-4 h-4 fill-amber-500 text-amber-600" />
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className="text-xs">Altíssima Prioridade (Score: {doc.priority_score})</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    )}
                                </div>

                                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        Recebido: {formatDate(doc.received_at)}
                                    </span>
                                    {doc.deadline && (
                                        <span className={`flex items-center gap-1 font-medium ${new Date(doc.deadline) < new Date() ? 'text-red-600' : 'text-orange-600'}`}>
                                            <AlertCircle className="w-3 h-3" />
                                            {new Date(doc.deadline) < new Date() ? 'Vencido' : `Vence: ${formatDate(doc.deadline)}`}
                                        </span>
                                    )}
                                    {doc.estimated_time && (
                                        <span className="flex items-center gap-1 text-muted-foreground/80 px-2 border-l border-border">
                                            ~{doc.estimated_time} min leitura
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-center">
                            <Button
                                size="sm"
                                className={`gap-2 text-white ${doc.impact === 'critical' ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-600 hover:bg-orange-700'}`}
                                disabled={!doc.can_sign}
                                onClick={() => {
                                    setSigningDoc({
                                        id: doc.id,
                                        title: doc.title,
                                        signer_id: doc.id // Agora o ID já é o do signer (assignment)
                                    });
                                }}
                            >
                                <PenTool className="w-4 h-4" /> Assinar
                            </Button>
                        </div>
                    </div>
                );
            })}

            {(signatures || []).length === 0 && (
                <div className="text-center py-12 text-muted-foreground bg-card/50 rounded-xl border border-dashed border-border">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500 opacity-50" />
                    <h3 className="text-lg font-medium text-foreground">Tudo em dia!</h3>
                    <p>Nenhum documento crítico requer sua atenção agora.</p>
                </div>
            )}

            {signingDoc && (
                <SignatureDialog
                    isOpen={!!signingDoc}
                    onClose={() => setSigningDoc(null)}
                    signerId={signingDoc.signer_id}
                    documentTitle={signingDoc.title}
                />
            )}
        </div>
    );
};
