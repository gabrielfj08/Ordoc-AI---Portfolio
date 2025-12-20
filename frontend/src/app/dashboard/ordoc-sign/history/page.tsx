'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
    ArrowLeft,
    History,
    Search,
    Activity,
    User,
    Globe
} from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import signatureService, { SignatureAuditLog } from '@/services/signature';

// Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from '@/components/ui/input';

export default function OrdocSignHistoryPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch logic would go here. Assuming signatureService.getAuditLogs exists and works.
    // We'll mock it if it fails or just try to use it.
    const { data: logsData, isLoading } = useQuery({
        queryKey: ['signature-audit-logs'],
        queryFn: () => signatureService.getAuditLogs(),
    });

    const logs = logsData?.results || [];

    const filteredLogs = logs.filter((log: SignatureAuditLog) =>
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <ProtectedRoute>
            <div className="flex-1 space-y-4 p-8 pt-6">

                {/* Header */}
                <div className="flex items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Histórico de Auditoria</h2>
                        <p className="text-muted-foreground">
                            Registro de todas as operações realizadas no módulo OrdocSign.
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" onClick={() => router.push('/dashboard/ordoc-sign')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center space-x-2 py-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar no histórico..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </div>

                {/* Content */}
                <Card>
                    <CardHeader>
                        <CardTitle>Log de Atividades</CardTitle>
                        <CardDescription>Trilha de auditoria para conformidade e segurança.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex justify-center p-8">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : filteredLogs.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                                <div className="bg-gray-100 p-4 rounded-full">
                                    <Activity className="h-10 w-10 text-gray-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium">Sem registros recentes</h3>
                                    <p className="text-muted-foreground mt-1">
                                        As atividades do sistema aparecerão aqui.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Ação</TableHead>
                                        <TableHead>Descrição</TableHead>
                                        <TableHead>Usuário / IP</TableHead>
                                        <TableHead className="text-right">Data/Hora</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredLogs.map((log: SignatureAuditLog) => (
                                        <TableRow key={log.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Activity className="h-4 w-4 text-blue-500" />
                                                    <span className="capitalize">{log.action.replace('_', ' ')}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-muted-foreground">{log.description}</span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col text-xs text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <User className="h-3 w-3" />
                                                        User #{log.user_id}
                                                    </div>
                                                    {log.ip_address && (
                                                        <div className="flex items-center gap-1">
                                                            <Globe className="h-3 w-3" />
                                                            {log.ip_address}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right whitespace-nowrap">
                                                {new Date(log.created_at).toLocaleString('pt-BR')}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </ProtectedRoute>
    );
}
