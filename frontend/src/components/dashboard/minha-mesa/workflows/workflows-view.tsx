'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    Layout,
    ListTodo,
    Search,
    Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProceduresList } from './procedures-list';
import { CreateProcedureDialog } from './create-procedure-dialog';
import KanbanBoard from '@/components/ordoc-flow/kanban-board';

export const WorkflowsView = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const workflowView = searchParams.get('workflowView') || 'procedures';
    const [isCreateProcOpen, setIsCreateProcOpen] = useState(false);

    const handleViewChange = (view: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('workflowView', view);
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header with Tabs and Search */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant={workflowView === 'procedures' ? 'default' : 'outline'}
                        className={workflowView === 'procedures' ? 'bg-orange-600 hover:bg-orange-700' : ''}
                        onClick={() => handleViewChange('procedures')}
                    >
                        <Layout className="w-4 h-4 mr-2" />
                        Procedimentos
                    </Button>
                    <Button
                        variant={workflowView === 'tasks' ? 'default' : 'outline'}
                        className={workflowView === 'tasks' ? 'bg-orange-600 hover:bg-orange-700' : ''}
                        onClick={() => handleViewChange('tasks')}
                    >
                        <ListTodo className="w-4 h-4 mr-2" />
                        Tarefas
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Buscar..." className="pl-9 w-[200px] h-9 bg-background" disabled title="Busca em breve" />
                    </div>
                    {workflowView === 'procedures' && (
                        <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white gap-2" onClick={() => setIsCreateProcOpen(true)}>
                            <Plus className="w-4 h-4" /> Novo Procedimento
                        </Button>
                    )}
                </div>
            </div>

            {/* Content Area - Full Width */}
            <div className="w-full">
                {workflowView === 'procedures' ? (
                    <ProceduresList />
                ) : (
                    <div className="h-[calc(100vh-250px)] min-h-[500px]">
                        <KanbanBoard />
                    </div>
                )}
            </div>

            <CreateProcedureDialog open={isCreateProcOpen} onOpenChange={setIsCreateProcOpen} />
        </div>
    )
}
