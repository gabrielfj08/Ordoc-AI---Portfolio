'use client';

import React from 'react';
import {
    PlayCircle,
    MoreVertical,
    Clock,
    FileText,
    Users,
    ChevronRight,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import flowService, { Procedure } from '@/services/flow';
import { toast } from 'react-hot-toast';

export const ProceduresList = () => {
    const queryClient = useQueryClient();

    const { data: procedures, isLoading } = useQuery({
        queryKey: ['procedures'],
        queryFn: () => flowService.getProcedures(),
    });

    const pauseMutation = useMutation({
        mutationFn: (id: string) => flowService.pauseProcedure(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['procedures'] });
            toast.success('Procedimento pausado com sucesso');
        },
        onError: () => toast.error('Erro ao pausar procedimento')
    });

    const cancelMutation = useMutation({
        mutationFn: (id: string) => flowService.cancelProcedure(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['procedures'] });
            toast.success('Procedimento cancelado com sucesso');
        },
        onError: () => toast.error('Erro ao cancelar procedimento')
    });

    // Função auxiliar para calcular progresso (se não vier do backend)
    const calculateProgress = (proc: Procedure) => {
        if (proc.progress !== undefined) return proc.progress;
        if (proc.tasks_total && proc.tasks_completed) {
            return Math.round((proc.tasks_completed / proc.tasks_total) * 100);
        }
        return 0;
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p>Carregando procedimentos...</p>
            </div>
        );
    }

    if (!procedures || procedures.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 bg-card border border-dashed rounded-xl text-muted-foreground gap-3">
                <FileText className="w-10 h-10 opacity-20" />
                <p>Nenhum procedimento em execução encontrado.</p>
                <Button variant="outline" size="sm" onClick={() => { /* TODO: Open Create Dialog */ }}>
                    Iniciar Procedimento
                </Button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {procedures.map((proc) => {
                const progress = calculateProgress(proc);
                return (
                    <div
                        key={proc.id}
                        className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-card hover:bg-accent/50 border border-border hover:border-primary/30 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer gap-4"
                    >
                        {/* Left: Icon & Info */}
                        <div className="flex items-start gap-4 flex-1">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${proc.status === 'finished' ? 'bg-green-50' : 'bg-blue-50'}`}>
                                {proc.status === 'finished' ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                ) : (
                                    <PlayCircle className="w-5 h-5 text-blue-600" />
                                )}
                            </div>

                            <div className="flex flex-col gap-1">
                                <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                                    {proc.procedure_template_name}
                                    <span className="text-muted-foreground font-normal text-xs">#{proc.process_number}</span>
                                    {proc.status === 'running' && <Badge variant="outline" className="text-[10px] text-blue-600 border-blue-200 bg-blue-50">Em Andamento</Badge>}
                                    {proc.status === 'finished' && <Badge variant="outline" className="text-[10px] text-green-600 border-green-200 bg-green-50">Concluído</Badge>}
                                    {proc.status === 'draft' && <Badge variant="outline" className="text-[10px] text-yellow-600 border-yellow-200 bg-yellow-50">Rascunho</Badge>}
                                    {proc.status === 'archived' && <Badge variant="outline" className="text-[10px] text-gray-600 border-gray-200 bg-gray-50">Arquivado</Badge>}
                                </h3>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> Criado em {new Date(proc.created_at).toLocaleDateString()}
                                    </span>
                                    {proc.tasks_total !== undefined && (
                                        <span className="flex items-center gap-1">
                                            <FileText className="w-3 h-3" /> {proc.tasks_total} etapas
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Middle: Progress */}
                        <div className="flex flex-col gap-1.5 w-full sm:w-48">
                            <div className="flex justify-between text-xs mb-0.5">
                                <span className="text-muted-foreground">Progresso</span>
                                <span className="font-medium">{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-2" indicatorClassName={proc.status === 'finished' ? 'bg-green-500' : 'bg-blue-600'} />
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-center">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => toast('Detalhes em breve')}>Ver Detalhes</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => pauseMutation.mutate(proc.id)}>
                                        {(proc.status === 'running' || proc.status === 'started') ? 'Arquivar/Pausar' : 'Status'}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive" onClick={() => cancelMutation.mutate(proc.id)}>Cancelar</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
