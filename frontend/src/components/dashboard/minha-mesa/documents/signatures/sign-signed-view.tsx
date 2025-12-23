'use client';

import React from 'react';
import { BadgeCheck, Download, Calendar, FileCheck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { signatureService } from '@/services/signature';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

export const SignSignedView = () => {
    // Buscar documentos assinados do backend
    const { data: signatures, isLoading } = useQuery({
        queryKey: ['signed-signatures'],
        queryFn: () => signatureService.getMySignedDocuments(),
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p>Carregando documentos assinados...</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {(signatures || []).map((assignment) => {
                const title = assignment.signature_request_title || assignment.document_name || 'Documento sem título';
                const signedAt = assignment.signed_at || assignment.updated_at;
                
                return (
                <div
                    key={assignment.id}
                    className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-card border border-border rounded-xl gap-4"
                >
                    {/* Left: Icon & Info */}
                    <div className="flex items-start gap-4 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                            <BadgeCheck className="w-5 h-5 text-green-600" />
                        </div>

                        <div className="flex flex-col gap-1">
                            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                                {title}
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Badge variant="outline" className="text-[10px] text-green-700 border-green-200 bg-green-50">Assinado</Badge>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="text-xs">Você assinou em {signedAt ? new Date(signedAt).toLocaleDateString('pt-BR') : 'data desconhecida'}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </h3>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> Assinado em {signedAt ? new Date(signedAt).toLocaleDateString('pt-BR') : 'data desconhecida'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                        <Button variant="outline" size="sm" className="gap-2">
                            <Download className="w-4 h-4" /> Baixar
                        </Button>
                    </div>
                </div>
                );
            })}

            {(!signatures || signatures.length === 0) && (
                <div className="text-center py-12 text-muted-foreground bg-card/50 rounded-xl border border-dashed border-border">
                    <FileCheck className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>Nenhum documento assinado encontrado.</p>
                </div>
            )}
        </div>
    );
};
