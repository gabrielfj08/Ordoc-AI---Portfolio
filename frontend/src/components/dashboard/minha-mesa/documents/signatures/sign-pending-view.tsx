'use client';

import React from 'react';
import { FileSignature, PenTool, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Mock data based on existing page logic
const mockPending = [
    { id: '1', title: 'Contrato de Prestação de Serviços - Adsum', status: 'pending', received_at: '2024-12-19T10:00:00', can_sign: true },
    { id: '2', title: 'Aditivo Contratual 03/2024', status: 'pending', received_at: '2024-12-20T08:30:00', can_sign: true },
    { id: '3', title: 'Termo de Aceite - LGPD', status: 'pending', received_at: '2024-12-18T14:15:00', can_sign: true },
];

export const SignPendingView = () => {
    // In real implementation, useQuery with signatureService

    return (
        <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {mockPending.map((doc) => (
                <div
                    key={doc.id}
                    className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-card hover:bg-accent/50 border border-border hover:border-primary/30 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer gap-4"
                >
                    {/* Left: Icon & Info */}
                    <div className="flex items-start gap-4 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                            <FileSignature className="w-5 h-5 text-orange-600" />
                        </div>

                        <div className="flex flex-col gap-1">
                            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                                {doc.title}
                                <Badge variant="outline" className="text-[10px] text-yellow-700 border-yellow-200 bg-yellow-50">Pendente</Badge>
                            </h3>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> Recebido em {new Date(doc.received_at).toLocaleDateString('pt-BR')}
                                </span>
                                <span className="flex items-center gap-1 text-orange-600 font-medium">
                                    <AlertCircle className="w-3 h-3" /> Requer Assinatura
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                        <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white gap-2" disabled={!doc.can_sign}>
                            <PenTool className="w-4 h-4" /> Assinar
                        </Button>
                    </div>
                </div>
            ))}

            {mockPending.length === 0 && (
                <div className="text-center py-12 text-muted-foreground bg-card/50 rounded-xl border border-dashed border-border">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500 opacity-50" />
                    <h3 className="text-lg font-medium text-foreground">Tudo em dia!</h3>
                    <p>Nenhum documento aguardando sua assinatura.</p>
                </div>
            )}
        </div>
    );
};
