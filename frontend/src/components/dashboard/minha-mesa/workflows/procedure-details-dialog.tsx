'use client';

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Procedure } from '@/services/flow';
import { Clock, FileText, Activity } from 'lucide-react';

interface ProcedureDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    procedure: Procedure | null;
}

export const ProcedureDetailsDialog = ({ open, onOpenChange, procedure }: ProcedureDetailsDialogProps) => {
    if (!procedure) return null;

    const translateStatus = (status: string) => {
        switch (status) {
            case 'running': return { label: 'Em Andamento', color: 'text-orange-700 border-orange-200 bg-orange-50' };
            case 'finished': return { label: 'Concluído', color: 'text-green-700 border-green-200 bg-green-50' };
            case 'draft': return { label: 'Rascunho', color: 'text-yellow-700 border-yellow-200 bg-yellow-50' };
            case 'archived': return { label: 'Arquivado', color: 'text-gray-700 border-gray-200 bg-gray-50' };
            case 'started': return { label: 'Iniciado', color: 'text-blue-700 border-blue-200 bg-blue-50' };
            default: return { label: status, color: 'text-gray-700 border-gray-200 bg-gray-50' };
        }
    };

    const statusInfo = translateStatus(procedure.status);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {procedure.procedure_template_name}
                        <Badge variant="outline" className={`text-xs ${statusInfo.color}`}>
                            {statusInfo.label}
                        </Badge>
                    </DialogTitle>
                    <DialogDescription>
                        Detalhes do processo #{procedure.process_number}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted-foreground font-medium uppercase">Criado em</span>
                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                {new Date(procedure.created_at).toLocaleString()}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted-foreground font-medium uppercase">Prioridade</span>
                            <div className="flex items-center gap-2 text-sm">
                                <Activity className={`w-4 h-4 ${procedure.priority === 'high' ? 'text-red-500' : 'text-blue-500'}`} />
                                {procedure.priority === 'high' ? 'Alta' : 'Normal'}
                            </div>
                        </div>
                        {procedure.tasks_total !== undefined && (
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground font-medium uppercase">Etapas</span>
                                <div className="flex items-center gap-2 text-sm">
                                    <FileText className="w-4 h-4 text-muted-foreground" />
                                    {procedure.tasks_completed || 0} / {procedure.tasks_total} concluídas
                                </div>
                            </div>
                        )}
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-muted-foreground font-medium uppercase">Fonte</span>
                            <div className="text-sm capitalize">{procedure.source === 'internal' ? 'Interna' : 'Externa'}</div>
                        </div>
                    </div>

                    {procedure.description && (
                        <div className="flex flex-col gap-1 bg-muted/50 p-3 rounded-lg">
                            <span className="text-xs text-muted-foreground font-medium uppercase">Descrição</span>
                            <p className="text-sm text-foreground">{procedure.description}</p>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)} variant="outline">
                        FecharDetailsDialog
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
