'use client';

import React from 'react';
import { BadgeCheck, Download, Calendar, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Mock data based on existing page logic
const mockSigned = [
    { id: '101', title: 'Relatório Trimestral Q3', status: 'signed', signed_at: '2024-11-30T10:00:00' },
    { id: '102', title: 'Autorização de Férias', status: 'signed', signed_at: '2024-11-15T14:20:00' },
];

export const SignSignedView = () => {

    return (
        <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {mockSigned.map((doc) => (
                <div
                    key={doc.id}
                    className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-card hover:bg-accent/50 border border-border hover:border-primary/30 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer gap-4"
                >
                    {/* Left: Icon & Info */}
                    <div className="flex items-start gap-4 flex-1">
                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                            <BadgeCheck className="w-5 h-5 text-green-600" />
                        </div>

                        <div className="flex flex-col gap-1">
                            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                                {doc.title}
                                <Badge variant="outline" className="text-[10px] text-green-700 border-green-200 bg-green-50">Assinado</Badge>
                            </h3>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> Assinado em {new Date(doc.signed_at).toLocaleDateString('pt-BR')}
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
            ))}

            {mockSigned.length === 0 && (
                <div className="text-center py-12 text-muted-foreground bg-card/50 rounded-xl border border-dashed border-border">
                    <FileCheck className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>Nenhum documento assinado encontrado.</p>
                </div>
            )}
        </div>
    );
};
