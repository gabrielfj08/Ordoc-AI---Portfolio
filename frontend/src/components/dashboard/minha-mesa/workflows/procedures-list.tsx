'use client';

import React from 'react';
import {
    PlayCircle,
    MoreVertical,
    Clock,
    FileText,
    Users,
    ChevronRight,
    CheckCircle2
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

// Mock Data
const mockProcedures = [
    { id: 1, name: 'Admissão de Funcionário - João Silva', status: 'active', progress: 65, tasks_total: 8, tasks_done: 5, created_at: '2024-12-15' },
    { id: 2, name: 'Aprovação de Compra - Notebooks Dell', status: 'active', progress: 20, tasks_total: 5, tasks_done: 1, created_at: '2024-12-18' },
    { id: 3, name: 'Revisão de Contrato Anual', status: 'completed', progress: 100, tasks_total: 12, tasks_done: 12, created_at: '2024-11-20' },
    { id: 4, name: 'Onboarding Cliente - TechSolutions', status: 'active', progress: 45, tasks_total: 10, tasks_done: 4, created_at: '2024-12-10' },
];

export const ProceduresList = () => {
    return (
        <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {mockProcedures.map((proc) => (
                <div
                    key={proc.id}
                    className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-card hover:bg-accent/50 border border-border hover:border-primary/30 rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer gap-4"
                >
                    {/* Left: Icon & Info */}
                    <div className="flex items-start gap-4 flex-1">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${proc.status === 'completed' ? 'bg-green-50' : 'bg-blue-50'}`}>
                            {proc.status === 'completed' ? (
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                            ) : (
                                <PlayCircle className="w-5 h-5 text-blue-600" />
                            )}
                        </div>

                        <div className="flex flex-col gap-1">
                            <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                                {proc.name}
                                {proc.status === 'active' && <Badge variant="outline" className="text-[10px] text-blue-600 border-blue-200 bg-blue-50">Em Andamento</Badge>}
                                {proc.status === 'completed' && <Badge variant="outline" className="text-[10px] text-green-600 border-green-200 bg-green-50">Concluído</Badge>}
                            </h3>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> Iniciado em {proc.created_at}
                                </span>
                                <span className="flex items-center gap-1">
                                    <FileText className="w-3 h-3" /> {proc.tasks_total} etapas
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Middle: Progress */}
                    <div className="flex flex-col gap-1.5 w-full sm:w-48">
                        <div className="flex justify-between text-xs mb-0.5">
                            <span className="text-muted-foreground">Progresso</span>
                            <span className="font-medium">{proc.progress}%</span>
                        </div>
                        <Progress value={proc.progress} className="h-2" indicatorClassName={proc.status === 'completed' ? 'bg-green-500' : 'bg-blue-600'} />
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
                                <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                                <DropdownMenuItem>Pausar</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">Cancelar</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            ))}
        </div>
    );
};
