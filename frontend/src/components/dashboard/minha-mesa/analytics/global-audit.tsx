'use client';

import React from 'react';
import {
    ShieldAlert,
    Search,
    User,
    Globe,
    Calendar,
    MousePointer2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// Mock Data
const auditLogs = [
    { id: 1, action: 'USER_LOGIN', user: 'Ricardo Silva', ip: '192.168.1.10', resource: 'Auth System', details: 'Successful login via provider', timestamp: '2024-12-20T10:00:00' },
    { id: 2, action: 'DOCUMENT_DELETE', user: 'Admin User', ip: '10.0.0.5', resource: 'Contrato_V1.pdf', details: 'Deleted from Recycle Bin', timestamp: '2024-12-20T09:45:00' },
    { id: 3, action: 'PERMISSION_CHANGE', user: 'System', ip: '-', resource: 'Group: Financeiro', details: 'Added "View Reports" permission', timestamp: '2024-12-20T08:30:00' },
    { id: 4, action: 'REPORT_GENERATE', user: 'Maria Souza', ip: '192.168.1.25', resource: 'Relatório Mensal', details: 'Generated PDF report', timestamp: '2024-12-19T16:20:00' },
    { id: 5, action: 'API_KEY_CREATE', user: 'Ricardo Silva', ip: '192.168.1.10', resource: 'API Key #992', details: 'Created new API key for extraction', timestamp: '2024-12-19T14:10:00' },
];

export const GlobalAudit = () => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header & Filters */}
            <div className="flex flex-col gap-2">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Buscar por usuário, ação, IP..." className="pl-9 bg-background" />
                    </div>
                </div>
            </div>

            {/* Audit Log Table */}
            <Card className="border-border/50 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-orange-600" />
                        Trilha de Auditoria Global
                    </CardTitle>
                    <CardDescription>Registro imutável de todas as ações críticas do sistema.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Ação</TableHead>
                                <TableHead>Usuário</TableHead>
                                <TableHead>Recurso</TableHead>
                                <TableHead>Detalhes</TableHead>
                                <TableHead className="text-right">Data/Hora</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {auditLogs.map((log) => (
                                <TableRow key={log.id} className="group">
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <MousePointer2 className="w-3 h-3 text-muted-foreground" />
                                            <span className="text-xs font-mono bg-secondary/50 px-1.5 py-0.5 rounded text-foreground">
                                                {log.action}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-xs">
                                            <div className="flex items-center gap-1 font-medium text-foreground">
                                                <User className="w-3 h-3" /> {log.user}
                                            </div>
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <Globe className="w-3 h-3" /> {log.ip}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm">{log.resource}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{log.details}</TableCell>
                                    <TableCell className="text-right whitespace-nowrap text-xs text-muted-foreground">
                                        <div className="flex items-center justify-end gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(log.timestamp).toLocaleString('pt-BR')}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};
