'use client';

import React from 'react';
import { FileText, MoreVertical, Pencil, Copy, Trash2, FileCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

// Mock Data matching existing page
const templates = [
    { id: 1, name: 'Contrato de Prestação de Serviços', category: 'Jurídico', version: '1.2', status: 'Ativo', lastUpdate: '10/12/2024' },
    { id: 2, name: 'Proposta Comercial Padrão', category: 'Comercial', version: '2.0', status: 'Ativo', lastUpdate: '15/12/2024' },
    { id: 3, name: 'Termo de Confidencialidade (NDA)', category: 'Jurídico', version: '1.0', status: 'Ativo', lastUpdate: '05/11/2024' },
    { id: 4, name: 'Briefing Inicial de Projeto', category: 'Projetos', version: '3.1', status: 'Rascunho', lastUpdate: '18/12/2024' },
    { id: 5, name: 'Solicitação de Férias', category: 'RH', version: '1.0', status: 'Ativo', lastUpdate: '20/10/2024' },
];

export const TemplatesView = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {templates.map((tmpl) => (
                <div
                    key={tmpl.id}
                    className="group relative flex flex-col justify-between p-4 bg-card hover:bg-accent/50 border border-border hover:border-primary/30 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
                >
                    <div className="flex items-start justify-between mb-2">
                        <div className="w-10 h-10 flex items-center justify-center -ml-2">
                            {/* Updated to Orange to match system */}
                            <FileCode className="w-6 h-6 text-orange-600/90" />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem><Pencil className="w-4 h-4 mr-2" /> Editar</DropdownMenuItem>
                                <DropdownMenuItem><Copy className="w-4 h-4 mr-2" /> Duplicar</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive"><Trash2 className="w-4 h-4 mr-2" /> Excluir</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            {/* Updated Tag Style: Neutral/Subtle like Organization Tag */}
                            <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary/50 border border-border/50 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                                {tmpl.category}
                            </div>
                            <span className="text-[10px] text-muted-foreground/70 bg-secondary px-1.5 py-0.5 rounded">v{tmpl.version}</span>
                        </div>
                        <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-2 min-h-[2.5em]">{tmpl.name}</h3>
                        <p className="text-xs text-muted-foreground">Atualizado em {tmpl.lastUpdate}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};
