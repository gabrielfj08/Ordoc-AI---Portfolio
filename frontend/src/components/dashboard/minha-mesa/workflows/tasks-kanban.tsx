'use client';

import React from 'react';
import {
    Clock,
    MoreVertical,
    User,
    AlertCircle,
    CheckCircle2,
    Circle,
    ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Task } from '@/types/ordoc-flow'; // Assuming types exist or I'll mock

// Mock Data if needed, but I'll try to use the structure from the analysis
const mockTasks = [
    { id: 1, name: 'Revisar Minuta Contratual', description: 'Verificar cláusulas de rescisão', status: 'pending', priority: 'high', due_date: '2024-12-25', assignee: { name: 'Ricardo' } },
    { id: 2, name: 'Aprovar Orçamento TI', description: 'Validar compra de licenças', status: 'in_progress', priority: 'medium', due_date: '2024-12-22', assignee: { name: 'Ana' } },
    { id: 3, name: 'Assinar Termo de Posse', description: 'Assinatura digital pendente', status: 'completed', priority: 'urgent', due_date: '2024-12-20', assignee: { name: 'Ricardo' } },
    { id: 4, name: 'Atualizar Policy de Segurança', description: 'Versão 2.4 com novos protocolos', status: 'pending', priority: 'low', due_date: '2025-01-10', assignee: { name: 'Carlos' } },
    { id: 5, name: 'Feedback Trimestral', description: 'Equipe de Design', status: 'in_progress', priority: 'medium', due_date: '2024-12-23', assignee: { name: 'Julia' } },
];

const PriorityBadge = ({ priority }: { priority: string }) => {
    const styles = {
        low: 'bg-slate-100 text-slate-700 border-slate-200',
        medium: 'bg-blue-50 text-blue-700 border-blue-200',
        high: 'bg-orange-50 text-orange-700 border-orange-200',
        urgent: 'bg-red-50 text-red-700 border-red-200',
    };
    const labels = { low: 'Baixa', medium: 'Média', high: 'Alta', urgent: 'Urgente' };

    // Default to medium if unknown
    const p = (priority in styles) ? priority as keyof typeof styles : 'medium';

    return (
        <span className={`text-xs font-medium px-2 py-0.5 rounded border ${styles[p]} uppercase tracking-wide`}>
            {labels[p]}
        </span>
    );
};

export const TasksKanban = () => {
    // Group tasks by status
    const columns = {
        pending: { label: 'A Fazer', icon: Circle, color: 'text-slate-500', tasks: mockTasks.filter(t => t.status === 'pending') },
        in_progress: { label: 'Em Andamento', icon: ArrowRight, color: 'text-blue-500', tasks: mockTasks.filter(t => t.status === 'in_progress') },
        completed: { label: 'Concluído', icon: CheckCircle2, color: 'text-green-500', tasks: mockTasks.filter(t => t.status === 'completed') },
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full overflow-x-auto pb-4">
            {Object.entries(columns).map(([status, col]) => (
                <div key={status} className="flex flex-col h-full min-w-[300px]">
                    {/* Column Header */}
                    <div className="flex items-center justify-between mb-4 px-1">
                        <div className="flex items-center gap-2">
                            <col.icon className={`w-4 h-4 ${col.color}`} />
                            <h3 className="font-semibold text-sm text-foreground">{col.label}</h3>
                            <Badge variant="secondary" className="text-[10px] h-5 px-1.5 min-w-[1.25rem] justify-center">{col.tasks.length}</Badge>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                            <MoreVertical className="w-3 h-3 text-muted-foreground" />
                        </Button>
                    </div>

                    {/* Column Content */}
                    <div className="flex-1 bg-secondary/20 rounded-xl p-3 space-y-3">
                        {col.tasks.map(task => (
                            <div
                                key={task.id}
                                className="group relative bg-card hover:bg-accent/50 border border-border/50 p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <PriorityBadge priority={task.priority} />
                                    <button className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </div>

                                <h4 className="font-medium text-sm text-foreground mb-1 line-clamp-2">{task.name}</h4>
                                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{task.description}</p>

                                <div className="flex items-center justify-between pt-2 border-t border-border/30">
                                    <div className="flex items-center gap-1.5">
                                        <Avatar className="h-5 w-5">
                                            <AvatarFallback className="text-[10px] bg-orange-100 text-orange-700">{task.assignee.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-xs text-muted-foreground">{task.assignee.name}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Clock className="w-3 h-3" />
                                        <span>{new Date(task.due_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
