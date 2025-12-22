'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, FileCheck, ShieldCheck, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import dashboardService, { PriorityTask } from '@/services/dashboard';

export const PriorityList = () => {
    const [activeTab, setActiveTab] = useState<'urgente' | 'assinaturas' | 'aprovacoes'>('urgente');
    const [tasks, setTasks] = useState<PriorityTask[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        setLoading(true);
        try {
            const data = await dashboardService.getPriorityTasks('all');
            setTasks(data);
        } catch (error) {
            console.error('Failed to load priority tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filtrar tarefas por tab
    const urgentTasks = tasks.filter(t => t.priority >= 8).slice(0, 5);
    const signatureTasks = tasks.filter(t => t.type === 'signature').slice(0, 5);
    const approvalTasks = tasks.filter(t => t.type === 'approval').slice(0, 5);

    const totalPrioritized = tasks.filter(t => t.priority >= 6).length;

    return (
        <Card className="flex-1 flex flex-col overflow-hidden shadow-sm border-border animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <div className="px-4 pt-4 pb-2 flex items-center justify-between shrink-0">
                <div>
                    <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                        Tarefas que precisam de você hoje
                        <Badge variant="secondary" className="text-xs font-semibold px-2 py-0.5">
                            {totalPrioritized} tarefas priorizadas
                        </Badge>
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Ordenadas por prazo e impacto no processo.
                    </p>
                </div>
            </div>
            <div className="border-t border-border/50 shrink-0"></div>

            {/* Tabs */}
            <div className="px-4 pt-3 flex gap-2 text-sm font-medium shrink-0">
                {[
                    { id: 'urgente', label: 'Urgente' },
                    { id: 'assinaturas', label: 'Assinaturas' },
                    { id: 'aprovacoes', label: 'Aprovações' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-3 py-1.5 rounded-full transition-all duration-200 ${activeTab === tab.id
                            ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                            : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Lista de tarefas */}
            <div className="p-2 sm:p-3 space-y-2 flex-1 overflow-y-auto scrollbar-thin">

                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        <span className="ml-2 text-sm text-muted-foreground">Carregando tarefas...</span>
                    </div>
                ) : (
                    <>
                        {activeTab === 'urgente' && (
                            <div className="space-y-2 animate-in fade-in zoom-in-95 duration-300">
                                {urgentTasks.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground text-sm">
                                        Nenhuma tarefa urgente no momento! 🎉
                                    </div>
                                ) : (
                                    urgentTasks.map((task) => (
                                        <TaskCard key={task.id} task={task} variant="urgent" />
                                    ))
                                )}
                            </div>
                        )}

                        {activeTab === 'assinaturas' && (
                            <div className="space-y-2 animate-in fade-in zoom-in-95 duration-300">
                                {signatureTasks.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground text-sm">
                                        Nenhuma assinatura pendente no momento.
                                    </div>
                                ) : (
                                    signatureTasks.map((task) => (
                                        <TaskCard key={task.id} task={task} variant="signature" />
                                    ))
                                )}
                            </div>
                        )}

                        {activeTab === 'aprovacoes' && (
                            <div className="space-y-2 animate-in fade-in zoom-in-95 duration-300">
                                {approvalTasks.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground text-sm">
                                        Nenhuma aprovação pendente no momento.
                                    </div>
                                ) : (
                                    approvalTasks.map((task) => (
                                        <TaskCard key={task.id} task={task} variant="approval" />
                                    ))
                                )}
                            </div>
                        )}
                    </>
                )}

            </div>
        </Card>
    );
};

// Componente de Card de Tarefa
interface TaskCardProps {
    task: PriorityTask;
    variant: 'urgent' | 'signature' | 'approval';
}

function TaskCard({ task, variant }: TaskCardProps) {
    const getIcon = () => {
        if (task.priority >= 9) return <AlertTriangle className="h-4 w-4" />;
        if (variant === 'signature') return <FileCheck className="h-4 w-4" />;
        return <Clock className="h-4 w-4" />;
    };

    const getIconBg = () => {
        if (task.priority >= 9) return 'bg-destructive/10 text-destructive';
        if (variant === 'signature') return 'bg-blue-100 text-blue-700';
        return 'bg-amber-100 text-amber-700';
    };

    const getActionLabel = () => {
        if (variant === 'signature') return 'Assinar agora';
        if (variant === 'approval') return 'Aprovar';
        return task.type === 'signature' ? 'Assinar agora' : 'Aprovar';
    };

    return (
        <article className="group bg-card hover:bg-accent/50 cursor-pointer border border-border hover:border-primary/30 rounded-xl p-3 flex gap-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="mt-0.5">
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${getIconBg()} text-sm font-semibold`}>
                    {getIcon()}
                </span>
            </div>
            <div className="flex-1 flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                            {task.title}
                        </span>
                        <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                            {task.timeRemaining}
                        </span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-mono">
                        #{task.id.substring(0, 4)}
                    </span>
                </div>
                <p className="text-sm text-muted-foreground leading-snug">
                    {task.description}
                    {task.value && (
                        <> • Valor: <span className="font-medium text-foreground">{task.value}</span></>
                    )}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    <Button size="sm" className="h-7 text-xs rounded-full px-3">
                        {getActionLabel()}
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-xs rounded-full px-3">
                        Ver documento
                    </Button>
                </div>
            </div>
        </article>
    );
}
