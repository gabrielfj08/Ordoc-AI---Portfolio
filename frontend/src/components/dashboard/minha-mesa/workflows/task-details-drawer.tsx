'use client';

import React from 'react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
    Calendar,
    User,
    Clock,
    CheckSquare,
    MessageSquare,
    Paperclip,
    MoreVertical
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Task } from '@/services/flow';

interface TaskDetailsDrawerProps {
    task: Task | null;
    isOpen: boolean;
    onClose: () => void;
}

export const TaskDetailsDrawer = ({ task, isOpen, onClose }: TaskDetailsDrawerProps) => {
    if (!task) return null;

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-[400px] sm:w-[540px] flex flex-col h-full p-0 gap-0">
                {/* Header */}
                <div className="p-6 border-b">
                    <div className="flex items-start justify-between mb-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wider font-medium">
                                {task.procedure_info || 'PROC-000/2024'}
                                <span className="w-1 h-1 rounded-full bg-border" />
                                <span>{task.priority === 'urgent' ? 'Urgente' : task.priority}</span>
                            </div>
                            <SheetTitle className="text-xl font-bold font-heading">{task.name}</SheetTitle>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Badge variant={
                                task.status === 'completed' ? 'default' :
                                    task.status === 'in_progress' ? 'secondary' : 'outline'
                            }>
                                {task.status === 'completed' ? 'Concluído' :
                                    task.status === 'in_progress' ? 'Em Andamento' :
                                        task.status === 'pending' ? 'A Fazer' : task.status}
                            </Badge>
                        </div>
                        {task.assignee && (
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground text-right">Responsável</span>
                                <Avatar className="h-8 w-8 border border-border">
                                    <AvatarFallback className="bg-orange-100 text-orange-700 text-xs">
                                        {task.assignee.name.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-6">

                        {/* Description */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold flex items-center gap-2">
                                <FileTextIcon />
                                Descrição
                            </h3>
                            <div className="text-sm text-foreground/80 leading-relaxed p-3 bg-muted/30 rounded-lg border border-border/50">
                                {task.description || "Sem descrição fornecida."}
                            </div>
                        </div>

                        <Separator />

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <span className="text-xs text-muted-foreground">Data de Vencimento</span>
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                    {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'Sem prazo'}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs text-muted-foreground">Criado em</span>
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                    {new Date(task.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Checklist (Mock for now) */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold flex items-center gap-2">
                                    <CheckSquare className="w-4 h-4" />
                                    Checklist
                                </h3>
                                <Button variant="ghost" size="sm" className="h-6 text-xs">+ Item</Button>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-md transition-colors group">
                                    <input type="checkbox" className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                                    <span className="text-sm flex-1">Revisar documentação técnica</span>
                                </div>
                                <div className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-md transition-colors group">
                                    <input type="checkbox" className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                                    <span className="text-sm flex-1">Validar assinaturas</span>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Comments (Mock for now) */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" />
                                Comentários
                            </h3>
                            {/* Placeholder for comments list */}
                            <div className="text-sm text-muted-foreground text-center py-4 italic">
                                Nenhum comentário ainda.
                            </div>
                        </div>

                    </div>
                </ScrollArea>

                {/* Footer */}
                <div className="p-4 border-t bg-muted/20">
                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <input
                                className="w-full h-10 pl-3 pr-10 rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Escreva um comentário..."
                            />
                            <Button size="icon" variant="ghost" className="absolute right-0 top-0 h-10 w-10 text-muted-foreground hover:text-primary">
                                <Paperclip className="h-4 w-4" />
                            </Button>
                        </div>
                        <Button>Enviar</Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

const FileTextIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>
)
