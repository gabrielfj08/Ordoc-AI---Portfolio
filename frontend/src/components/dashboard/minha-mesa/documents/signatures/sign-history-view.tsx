'use client';

import React from 'react';
import { Activity, User, Globe } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card } from '@/components/ui/card';

// Mock Data
const mockLogs = [
    { id: 1, action: 'SIGN_DOCUMENT', description: 'Assinou o documento "Contrato 2024"', user_id: 123, ip_address: '192.168.1.10', created_at: '2024-12-20T10:05:00' },
    { id: 2, action: 'VIEW_DOCUMENT', description: 'Visualizou o documento "Aditivo 03"', user_id: 123, ip_address: '192.168.1.10', created_at: '2024-12-20T09:55:00' },
    { id: 3, action: 'LOGIN', description: 'Login realizado com sucesso', user_id: 123, ip_address: '192.168.1.10', created_at: '2024-12-20T08:00:00' },
];

export const SignHistoryView = () => {
    return (
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 border-border/50 shadow-sm bg-card/50">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[200px]">Ação</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Detalhes</TableHead>
                        <TableHead className="text-right">Data/Hora</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mockLogs.map((log) => (
                        <TableRow key={log.id} className="hover:bg-muted/50">
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-orange-500" />
                                    <span className="text-xs uppercase font-semibold tracking-wide text-muted-foreground">{log.action.replace('_', ' ')}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <span className="text-sm text-foreground">{log.description}</span>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col text-[10px] text-muted-foreground gap-0.5">
                                    <div className="flex items-center gap-1">
                                        <User className="h-3 w-3" /> User #{log.user_id}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Globe className="h-3 w-3" /> {log.ip_address}
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="text-right whitespace-nowrap text-xs text-muted-foreground">
                                {new Date(log.created_at).toLocaleString('pt-BR')}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
};
