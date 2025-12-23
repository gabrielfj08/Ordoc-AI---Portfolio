'use client';

import React from 'react';
import { Folder, MoreVertical, Pencil, Trash2, Brain, Sparkles, Tag, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { dashboardService, SmartCategory } from '@/services/dashboard';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

export const CategoriesView = () => {
    const { data: categories, isLoading } = useQuery({
        queryKey: ['smart-categories'],
        queryFn: () => dashboardService.getSmartCategories(),
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p>Analisando documentos e padrões de categorização...</p>
            </div>
        );
    }

    const suggestedCategories = categories?.filter((c: SmartCategory) => c.isAiSuggested) || [];
    const regularCategories = categories?.filter((c: SmartCategory) => !c.isAiSuggested) || [];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* AI Suggestions Section */}
            {suggestedCategories.length > 0 && (
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 bg-orange-100 rounded-lg">
                            <Sparkles className="w-4 h-4 text-orange-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-foreground">Sugestões Inteligentes</h2>
                        <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-200 ml-2">
                            Novos Padrões Detectados
                        </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {suggestedCategories.map((cat: SmartCategory) => (
                            <div
                                key={cat.id}
                                className="group relative flex flex-col justify-between p-4 bg-orange-50/30 border border-orange-200/60 rounded-xl"
                            >
                                <div className="absolute top-3 right-3">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Badge className="bg-white hover:bg-white text-orange-600 border-orange-200 shadow-sm gap-1 pl-1 cursor-help">
                                                    <Brain className="w-3 h-3" /> {(cat.confidence! * 100).toFixed(0)}%
                                                </Badge>
                                            </TooltipTrigger>
                                            <TooltipContent className="max-w-[250px]">
                                                <p className="font-semibold mb-1">Por que sugerimos esta categoria?</p>
                                                <p className="text-xs opacity-90">{cat.suggestionReason}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>

                                <div className="flex items-start justify-between mb-3 mt-1">
                                    <div className="w-10 h-10 flex items-center justify-center -ml-2 rounded-lg bg-orange-100">
                                        <Tag className="w-5 h-5 text-orange-600" />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-foreground text-base mb-1">{cat.name}</h3>
                                    <p className="text-xs text-muted-foreground mb-3">{cat.description}</p>

                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {cat.tags?.map((tag: string) => (
                                            <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-white border border-orange-200 rounded text-muted-foreground">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700 text-white gap-2 mt-auto shadow-sm">
                                    <Plus className="w-4 h-4" /> Criar Categoria
                                </Button>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Regular Categories Section */}
            <section>
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Folder className="w-5 h-5 text-orange-600" /> Minhas Categorias
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {regularCategories.map((cat: SmartCategory) => (
                        <div
                            key={cat.id}
                            className="group relative flex flex-col justify-between p-4 bg-card border border-border rounded-xl"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="w-10 h-10 flex items-center justify-center -ml-2">
                                    <Folder className={`w-6 h-6 ${cat.status === 'archived' ? 'text-muted-foreground' : 'text-orange-500'} fill-orange-50`} />
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
                                <h3 className={`font-semibold text-base mb-1 ${cat.status === 'archived' ? 'text-muted-foreground' : 'text-foreground'}`}>{cat.name}</h3>
                                <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2.5em]">{cat.description}</p>
                            </div>

                            <div className="flex items-center justify-between mt-4 border-t border-border/50 pt-3">
                                <Badge variant="secondary" className="text-[10px] font-normal">
                                    {cat.docCount} documentos
                                </Badge>
                                <span className={`text-[10px] font-medium ${cat.status === 'active' ? 'text-green-600' : 'text-muted-foreground'}`}>
                                    {cat.status === 'active' ? 'Ativo' : 'Arquivado'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};
