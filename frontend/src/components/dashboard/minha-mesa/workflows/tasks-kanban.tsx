'use client';

import React, { useState } from 'react';
import {
    Circle,
    ArrowRight,
    CheckCircle2,
    Clock,
    MoreVertical,
    Loader2,
    Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import flowService, { Task } from '@/services/flow';
import { toast } from 'react-hot-toast';
import { TaskDetailsDrawer } from './task-details-drawer';
import { CreateTaskDialog } from './create-task-dialog';

const PriorityBadge = ({ priority }: { priority: string }) => {
    const styles = {
        low: 'bg-slate-100 text-slate-700 border-slate-200',
        medium: 'bg-blue-100 text-blue-700 border-blue-200',
        high: 'bg-orange-100 text-orange-700 border-orange-200',
        urgent: 'bg-red-100 text-red-700 border-red-200',
    } as Record<string, string>;

    const labels = {
        low: 'BAIXA',
        medium: 'MÉDIA',
        high: 'ALTA',
        urgent: 'URGENTE',
    } as Record<string, string>;

    return (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${styles[priority] || styles.medium}`}>
            {labels[priority] || priority.toUpperCase()}
        </span>
    );
};

export const TasksKanban = () => {
    const queryClient = useQueryClient();
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

    const { data: tasks, isLoading } = useQuery({
        queryKey: ['tasks'],
        queryFn: () => flowService.getTasks(),
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            flowService.updateTaskStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            toast.success('Tarefa atualizada');
        },
        onError: () => {
            // Revert optimistic update if we did one
            toast.error('Erro ao atualizar tarefa');
        }
    });

    // Column Definitions
    const columns = [
        { id: 'pending', label: 'A Fazer', icon: Circle, color: 'text-slate-500' },
        { id: 'in_progress', label: 'Em Andamento', icon: ArrowRight, color: 'text-blue-500' },
        { id: 'completed', label: 'Concluído', icon: CheckCircle2, color: 'text-green-500' },
    ];

    // filter tasks by column
    const getTasksByStatus = (status: string) => {
        if (!tasks) return [];
        return tasks.filter((t: Task) => t.status === status);
    };

    // Drag Handlers
    const handleDragStart = (e: React.DragEvent, taskId: string) => {
        setDraggedTaskId(taskId);
        e.dataTransfer.setData('taskId', taskId);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = async (e: React.DragEvent, status: string) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');

        if (taskId) {
            updateStatusMutation.mutate({ id: taskId, status });
        }
        setDraggedTaskId(null);
    };

    const handleTaskClick = (task: Task) => {
        setSelectedTask(task);
        setIsDrawerOpen(true);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p>Carregando quadro de tarefas...</p>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full overflow-x-auto pb-4">
                {columns.map((col) => {
                    const colTasks = getTasksByStatus(col.id);
                    return (
                        <div
                            key={col.id}
                            className="flex flex-col h-full min-w-[300px]"
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, col.id)}
                        >
                            {/* Column Header */}
                            <div className="flex items-center justify-between mb-4 px-1">
                                <div className="flex items-center gap-2">
                                    <col.icon className={`w-4 h-4 ${col.color}`} />
                                    <h3 className="font-semibold text-sm text-foreground">{col.label}</h3>
                                    <Badge variant="secondary" className="text-[10px] h-5 px-1.5 min-w-[1.25rem] justify-center">{colTasks.length}</Badge>
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <MoreVertical className="w-3 h-3 text-muted-foreground" />
                                </Button>
                            </div>

                            {/* Column Content */}
                            <div className={`flex-1 bg-secondary/20 rounded-xl p-3 space-y-3 transition-colors ${draggedTaskId ? 'border-2 border-dashed border-primary/10' : ''}`}>
                                {colTasks.map((task: Task) => (
                                    <div
                                        key={task.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, task.id)}
                                        onClick={() => handleTaskClick(task)}
                                        className="group relative bg-card hover:bg-accent/50 border border-border/50 p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing hover:-translate-y-0.5"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <PriorityBadge priority={task.priority} />
                                            <button className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <h4 className="font-medium text-sm text-foreground mb-1 line-clamp-2 leading-tight">{task.name}</h4>
                                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{task.description}</p>

                                        <div className="flex items-center justify-between pt-2 border-t border-border/30">
                                            <div className="flex items-center gap-1.5">
                                                {task.assignee ? (
                                                    <Avatar className="h-5 w-5">
                                                        <AvatarFallback className="text-[10px] bg-orange-100 text-orange-700">
                                                            {task.assignee.name.substring(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                ) : (
                                                    <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center">
                                                        <span className="text-[10px] text-slate-400">?</span>
                                                    </div>
                                                )}
                                                <span className="text-xs text-muted-foreground truncate max-w-[80px]">
                                                    {task.assignee ? task.assignee.name : 'Não atribuído'}
                                                </span>
                                            </div>
                                            {task.deadline && (
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{new Date(task.deadline).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {col.id === 'pending' && (
                                    <Button
                                        variant="ghost"
                                        className="w-full text-xs text-muted-foreground hover:text-primary border border-dashed border-border hover:border-primary/50 h-8"
                                        onClick={() => setIsCreateOpen(true)}
                                    >
                                        <Plus className="w-3 h-3 mr-1" /> Nova Tarefa
                                    </Button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <TaskDetailsDrawer
                task={selectedTask}
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            />

            <CreateTaskDialog
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
            />
        </>
    );
};
