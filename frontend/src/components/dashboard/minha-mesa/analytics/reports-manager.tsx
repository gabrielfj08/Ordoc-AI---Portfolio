'use client';

import React from 'react';
import {
    FileText,
    Download,
    Trash2,
    Plus,
    Filter,
    FileSpreadsheet,
    File
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from '@/components/ui/input';

// Mock Data
const mockReports = [
    { id: 1, title: 'Relatório Mensal de Vendas', type: 'PDF', size: '2.4 MB', created_at: '2024-12-19', status: 'ready' },
    { id: 2, title: 'Auditoria de Acessos Q4', type: 'XLSX', size: '850 KB', created_at: '2024-12-18', status: 'ready' },
    { id: 3, title: 'Performance da Equipe', type: 'PDF', size: '1.2 MB', created_at: '2024-12-15', status: 'ready' },
    { id: 4, title: 'Exportação Completa 2024', type: 'CSV', size: '-', created_at: '2024-12-20', status: 'processing' },
];

export const ReportsManager = () => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Filtrar relatórios..." className="pl-9 bg-background" />
                </div>
                <div className="flex items-center gap-2">
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white gap-2">
                        <Plus className="w-4 h-4" /> Novo Relatório
                    </Button>
                </div>
            </div>

            {/* Reports List */}
            <Card className="border-border/50 shadow-sm">
                <CardHeader>
                    <CardTitle>Meus Relatórios</CardTitle>
                    <CardDescription>Gerencie e baixe seus relatórios gerados.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Formato</TableHead>
                                <TableHead>Data</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockReports.map((report) => (
                                <TableRow key={report.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            {report.type === 'XLSX' || report.type === 'CSV' ? (
                                                <FileSpreadsheet className="w-4 h-4 text-green-600" />
                                            ) : (
                                                <FileText className="w-4 h-4 text-red-500" />
                                            )}
                                            {report.title}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="font-mono text-xs">
                                            {report.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {report.created_at}
                                    </TableCell>
                                    <TableCell>
                                        {report.status === 'processing' ? (
                                            <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 animate-pulse">
                                                Processando
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                                                Pronto
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" disabled={report.status !== 'ready'}>
                                                <Download className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
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
