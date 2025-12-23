'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Layout,
    ListTodo,
    Search,
    Plus,
    Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TasksKanban } from './tasks-kanban';
import { ProceduresList } from './procedures-list';
import { CreateProcedureDialog } from './create-procedure-dialog';
import { CreateTaskDialog } from './create-task-dialog';

export const WorkflowsView = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const workflowView = searchParams.get('workflowView') || 'procedures'; // procedures, tasks
    const [isCreateProcOpen, setIsCreateProcOpen] = useState(false);
    const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

    const handleViewChange = (view: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('workflowView', view);
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1"></div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Buscar..." className="pl-9 w-[200px] h-9 bg-background" disabled title="Busca em breve" />
                    </div>
                    {/* Contextual New Button */}
                    {workflowView === 'procedures' ? (
                        <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white gap-2" onClick={() => setIsCreateProcOpen(true)}>
                            <Plus className="w-4 h-4" /> Novo Procedimento
                        </Button>
                    ) : (
                        <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white gap-2" onClick={() => setIsCreateTaskOpen(true)}>
                            <Plus className="w-4 h-4" /> Nova Tarefa
                        </Button>
                    )}
                </div>
            </div>

            {/* View Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* Sidebar Navigation */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-border/50 shadow-sm bg-background/50 backdrop-blur">
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Fluxos</CardTitle>
                        </CardHeader>
                        <CardContent className="p-2 space-y-1">
                            <button
                                onClick={() => handleViewChange('procedures')}
                                className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors ${workflowView === 'procedures' ? 'bg-orange-50 text-orange-700 font-medium' : 'hover:bg-secondary/80 text-foreground'}`}
                            >
                                <Layout className={`w-5 h-5 ${workflowView === 'procedures' ? 'text-orange-600' : 'text-muted-foreground'}`} />
                                <span className="text-sm">Procedimentos</span>
                            </button>
                            <button
                                onClick={() => handleViewChange('tasks')}
                                className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors ${workflowView === 'tasks' ? 'bg-orange-50 text-orange-700 font-medium' : 'hover:bg-secondary/80 text-foreground'}`}
                            >
                                <ListTodo className={`w-5 h-5 ${workflowView === 'tasks' ? 'text-orange-600' : 'text-muted-foreground'}`} />
                                <span className="text-sm">Tarefas</span>
                            </button>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-6">

                    {/* Procedures View */}
                    {workflowView === 'procedures' && (
                        <section>
                            <h2 className="flex items-center gap-2 text-lg font-semibold mb-3">
                                Procedimentos em Execução
                            </h2>
                            <ProceduresList />
                        </section>
                    )}

                    {/* Tasks View (Kanban) */}
                    {workflowView === 'tasks' && (
                        <section className="h-[calc(100vh-250px)] min-h-[500px]">
                            <h2 className="flex items-center gap-2 text-lg font-semibold mb-3">
                                Quadro de Tarefas
                            </h2>
                            <TasksKanban />
                        </section>
                    )}

                </div>
            </div>

            <CreateProcedureDialog open={isCreateProcOpen} onOpenChange={setIsCreateProcOpen} />
            <CreateTaskDialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen} />
        </div>
    )
}
