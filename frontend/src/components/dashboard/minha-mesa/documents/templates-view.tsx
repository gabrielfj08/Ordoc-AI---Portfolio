'use client';

import React, { useState } from 'react';
import { FileText, MoreVertical, Pencil, Copy, Trash2, FileCode, Sparkles, Brain, Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardService, SmartTemplate } from '@/services/dashboard';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { DeleteTemplateDialog } from './dialogs/delete-template-dialog';
import { EditTemplateDialog } from './dialogs/edit-template-dialog';
import { toast } from 'sonner';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: `${API_BASE_URL}/api/v1`,
});

api.interceptors.request.use((config) => {
    config.headers['X-Subdomain'] = 'demo';
    const token = localStorage.getItem('ordoc_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const TemplatesView = () => {
    const queryClient = useQueryClient();
    const [deletingTemplate, setDeletingTemplate] = useState<SmartTemplate | null>(null);
    const [editingTemplate, setEditingTemplate] = useState<SmartTemplate | null>(null);

    const { data: templates, isLoading } = useQuery({
        queryKey: ['smart-templates'],
        queryFn: () => dashboardService.getSmartTemplates(),
    });

    const duplicateTemplateMutation = useMutation({
        mutationFn: async (template: SmartTemplate) => {
            const response = await api.post(`/ordoc-air/document-templates/${template.id}/duplicate/`);
            return response.data;
        },
        onSuccess: () => {
            toast.success('Template duplicado com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['smart-templates'] });
        },
        onError: (error: any) => {
            const message = error.response?.data?.detail || 'Erro ao duplicar template';
            toast.error(message);
        },
    });

    const handleDuplicate = async (template: SmartTemplate) => {
        await duplicateTemplateMutation.mutateAsync(template);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                <Sparkles className="w-8 h-8 animate-pulse text-primary/50" />
                <p>IA analisando seus fluxos para sugerir templates...</p>
            </div>
        );
    }

    const suggestedTemplates = templates?.filter(t => t.isAiSuggested) || [];
    const regularTemplates = templates?.filter(t => !t.isAiSuggested) || [];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* AI Suggestions */}
            {suggestedTemplates.length > 0 && (
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 bg-orange-100 rounded-lg">
                            <Brain className="w-4 h-4 text-orange-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-foreground">Sugeridos para Automação</h2>
                        <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-200 ml-2">
                            Alta Economia de Tempo
                        </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {suggestedTemplates.map((tmpl) => (
                            <div
                                key={tmpl.id}
                                className="group relative flex flex-col justify-between p-4 bg-orange-50/40 border border-orange-200/60 rounded-xl"
                            >
                                <div className="absolute top-3 right-3">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Badge className="bg-white hover:bg-white text-orange-600 border-orange-200 shadow-sm gap-1 pl-1 cursor-help">
                                                    <Zap className="w-3 h-3 fill-orange-100" /> {(tmpl.confidence! * 100).toFixed(0)}% Utilidade
                                                </Badge>
                                            </TooltipTrigger>
                                            <TooltipContent className="max-w-[250px]">
                                                <p className="font-semibold mb-1">Por que criar este template?</p>
                                                <p className="text-xs opacity-90">{tmpl.suggestionReason}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>

                                <div className="flex items-start justify-between mb-3 mt-1">
                                    <div className="w-10 h-10 flex items-center justify-center -ml-2 rounded-lg bg-orange-100">
                                        <FileCode className="w-5 h-5 text-orange-600" />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/80 border border-orange-200 text-[10px] font-semibold text-orange-700 uppercase tracking-wide">
                                            {tmpl.category}
                                        </div>
                                        <span className="text-[10px] text-muted-foreground bg-orange-100/50 px-1.5 py-0.5 rounded">Rascunho</span>
                                    </div>
                                    <h3 className="font-semibold text-foreground text-base mb-1">{tmpl.name}</h3>
                                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{tmpl.suggestionReason}</p>
                                </div>

                                <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700 text-white gap-2 mt-auto shadow-sm">
                                    <Pencil className="w-4 h-4" /> Criar Template
                                </Button>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Regular Templates */}
            <section>
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-orange-600" /> Meus Templates
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {regularTemplates.map((tmpl) => (
                        <div
                            key={tmpl.id}
                            className="group relative flex flex-col justify-between p-4 bg-card border border-border rounded-xl"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="w-10 h-10 flex items-center justify-center -ml-2">
                                    <FileCode className="w-6 h-6 text-orange-600/90" />
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => setEditingTemplate(tmpl)}>
                                            <Pencil className="w-4 h-4 mr-2" /> Editar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDuplicate(tmpl)}>
                                            <Copy className="w-4 h-4 mr-2" /> Duplicar
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="text-destructive"
                                            onClick={() => setDeletingTemplate(tmpl)}
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" /> Excluir
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary/50 border border-border/50 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                                        {tmpl.category}
                                    </div>
                                    <span className="text-[10px] text-muted-foreground/70 bg-secondary px-1.5 py-0.5 rounded">v{tmpl.version}</span>
                                </div>
                                <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-2 min-h-[2.5em]">{tmpl.name}</h3>
                                <div className="flex justify-between items-center text-xs text-muted-foreground mt-2 pt-2 border-t border-border/30">
                                    <span>{tmpl.lastUpdate}</span>
                                    <span className="flex items-center gap-1"><Copy className="w-3 h-3" /> {tmpl.usageCount} usos</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Diálogos */}
            <EditTemplateDialog
                open={!!editingTemplate}
                template={editingTemplate}
                onOpenChange={(open) => !open && setEditingTemplate(null)}
            />

            <DeleteTemplateDialog
                open={!!deletingTemplate}
                template={deletingTemplate}
                onOpenChange={(open) => !open && setDeletingTemplate(null)}
            />
        </div>
    );
};
