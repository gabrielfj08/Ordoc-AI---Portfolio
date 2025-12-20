'use client';

import React from 'react';
import { Folder, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock Data matching existing page
const categories = [
    { id: 1, name: 'Financeiro', description: 'Documentos fiscais, faturas e comprovantes', docCount: 154, status: 'Ativo', lastUpdate: '12/12/2024' },
    { id: 2, name: 'Recursos Humanos', description: 'Contratos, holerites e feedback', docCount: 89, status: 'Ativo', lastUpdate: '10/12/2024' },
    { id: 3, name: 'Jurídico', description: 'Contratos legais, termos e NDAs', docCount: 234, status: 'Ativo', lastUpdate: '15/12/2024' },
    { id: 4, name: 'Marketing', description: 'Assets de marca, campanhas e briefings', docCount: 45, status: 'Ativo', lastUpdate: '01/12/2024' },
    { id: 5, name: 'Operacional', description: 'Manuais, procedimentos e relatórios diários', docCount: 312, status: 'Ativo', lastUpdate: '18/12/2024' },
    { id: 6, name: 'Projetos', description: 'Documentação técnica de projetos', docCount: 67, status: 'Arquivado', lastUpdate: '20/11/2024' },
];

export const CategoriesView = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {categories.map((cat) => (
                <div
                    key={cat.id}
                    className="group relative flex flex-col justify-between p-4 bg-card hover:bg-accent/50 border border-border hover:border-primary/30 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
                >
                    <div className="flex items-start justify-between mb-2">
                        <div className="w-10 h-10 flex items-center justify-center -ml-2">
                            {/* Updated to Orange for consistency */}
                            <Folder className="w-6 h-6 text-orange-500 fill-orange-50" />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem><Pencil className="w-4 h-4 mr-2" /> Editar</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive"><Trash2 className="w-4 h-4 mr-2" /> Excluir</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div>
                        <h3 className="font-semibold text-foreground text-base mb-1">{cat.name}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2.5em]">{cat.description}</p>
                    </div>

                    <div className="flex items-center justify-between mt-4 border-t border-border/50 pt-3">
                        <Badge variant="secondary" className="text-[10px] font-normal">
                            {cat.docCount} documentos
                        </Badge>
                        <span className={`text-[10px] font-medium ${cat.status === 'Ativo' ? 'text-green-600' : 'text-muted-foreground'}`}>
                            {cat.status}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};
