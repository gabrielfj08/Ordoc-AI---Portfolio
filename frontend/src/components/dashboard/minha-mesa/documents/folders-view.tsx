'use client';

import React from 'react';
import { Folder, AlertTriangle, Info, CheckCircle, MoreVertical, Pencil, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { dashboardService, IntelligentFolder } from '@/services/dashboard';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

export const FoldersView = () => {
    const { data: folders, isLoading } = useQuery({
        queryKey: ['folders-with-insights'],
        queryFn: () => dashboardService.getFoldersWithInsights(),
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                <Folder className="w-8 h-8 animate-pulse text-primary/50" />
                <p>Analisando saúde das pastas...</p>
            </div>
        );
    }

    const healthColor = (status: string) => {
        switch (status) {
            case 'healthy':
                return 'text-green-600 bg-green-100';
            case 'needs_attention':
                return 'text-orange-600 bg-orange-100';
            case 'critical':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const healthIcon = (status: string) => {
        switch (status) {
            case 'healthy':
                return <CheckCircle className="w-3.5 h-3.5" />;
            case 'needs_attention':
                return <Info className="w-3.5 h-3.5" />;
            case 'critical':
                return <AlertTriangle className="w-3.5 h-3.5" />;
            default:
                return <Info className="w-3.5 h-3.5" />;
        }
    };

    const healthLabel = (status: string) => {
        switch (status) {
            case 'healthy':
                return 'Saudável';
            case 'needs_attention':
                return 'Atenção Necessária';
            case 'critical':
                return 'Crítico';
            default:
                return 'Desconhecido';
        }
    };

    const insightIcon = (type: string) => {
        switch (type) {
            case 'warning':
                return <AlertTriangle className="w-3.5 h-3.5" />;
            case 'success':
                return <CheckCircle className="w-3.5 h-3.5" />;
            case 'info':
            default:
                return <Info className="w-3.5 h-3.5" />;
        }
    };

    const insightColor = (type: string) => {
        switch (type) {
            case 'warning':
                return 'text-orange-700 bg-orange-50 border-orange-200';
            case 'success':
                return 'text-green-700 bg-green-50 border-green-200';
            case 'info':
            default:
                return 'text-blue-700 bg-blue-50 border-blue-200';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <Folder className="w-5 h-5 text-orange-600" /> Minhas Pastas com Insights
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                        Análise inteligente da saúde e organização das suas pastas
                    </p>
                </div>
            </div>

            {/* Folders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {folders?.map((folder: IntelligentFolder) => (
                    <div
                        key={folder.id}
                        className="group relative flex flex-col justify-between p-4 bg-card hover:bg-accent/50 border border-border hover:border-primary/30 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-10 h-10 flex items-center justify-center -ml-2 rounded-lg bg-gradient-to-br from-orange-100 to-amber-100">
                                <Folder className="w-6 h-6 text-orange-600" />
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem><Eye className="w-4 h-4 mr-2" /> Abrir</DropdownMenuItem>
                                    <DropdownMenuItem><Pencil className="w-4 h-4 mr-2" /> Renomear</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive"><Trash2 className="w-4 h-4 mr-2" /> Excluir</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Folder Info */}
                        <div className="mb-3">
                            <h3 className="font-semibold text-foreground text-base mb-1">{folder.name}</h3>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{folder.documentCount} documento{folder.documentCount !== 1 ? 's' : ''}</span>
                                {folder.pendingActions > 0 && (
                                    <>
                                        <span>•</span>
                                        <span className="text-orange-600 font-medium">{folder.pendingActions} ações pendentes</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Health Status */}
                        <div className="mb-3">
                            <Badge className={`${healthColor(folder.healthStatus)} border-0 gap-1.5 font-medium`}>
                                {healthIcon(folder.healthStatus)}
                                {healthLabel(folder.healthStatus)}
                            </Badge>
                        </div>

                        {/* Insights */}
                        <div className="space-y-2">
                            {folder.insights.map((insight, idx) => (
                                <div
                                    key={idx}
                                    className={`flex items-start gap-2 p-2 rounded-lg border text-xs ${insightColor(insight.type)}`}
                                >
                                    <span className="shrink-0 mt-0.5">{insightIcon(insight.type)}</span>
                                    <div className="flex-1">
                                        <p>{insight.message}</p>
                                        {insight.count && insight.count > 0 && (
                                            <p className="text-[10px] opacity-70 mt-0.5">({insight.count} itens)</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Last Accessed */}
                        {folder.lastAccessed && (
                            <div className="mt-3 pt-3 border-t border-border/30 text-[10px] text-muted-foreground">
                                Último acesso: {new Date(folder.lastAccessed).toLocaleDateString('pt-BR')}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {folders?.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                    <Folder className="w-12 h-12 opacity-30" />
                    <p>Nenhuma pasta encontrada</p>
                </div>
            )}
        </div>
    );
};
