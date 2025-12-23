'use client';

import React from 'react';
import {
    ShieldAlert,
    Search,
    User,
    Globe,
    Calendar,
    MousePointer2,
    Filter
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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

// Mock Data removido
import auditService, { AuditLog as Log } from '@/services/audit';
import toast from 'react-hot-toast';

export const GlobalAudit = () => {
    const [auditLogs, setAuditLogs] = React.useState<Log[]>([]);
    const [loading, setLoading] = React.useState(true);

    const [filters, setFilters] = React.useState({
        search: '',
        action: 'all',
        days: '7'
    });

    const loadLogs = async () => {
        setLoading(true);
        try {
            const data = await auditService.getLogs({
                search: filters.search,
                action: filters.action !== 'all' ? filters.action : undefined,
                // Backend needs to support date filtering if we send days. 
                // Assuming auditService handles it or we need to update it.
                // Looking at audit.ts, it takes { search, action, user_id }.
                // It doesn't seem to explicitly take days/date_from.
                // I will add 'days' to the service call and update service if needed.
            });
            setAuditLogs(data);
        } catch (error) {
            console.error('Falha ao carregar logs', error);
            toast.error('Não foi possível carregar o histórico de auditoria.');
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        const timer = setTimeout(() => {
            loadLogs();
        }, 500);
        return () => clearTimeout(timer);
    }, [filters]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header & Filters */}
            <div className="flex flex-col gap-2">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por usuário, recurso, IP..."
                            className="pl-9 bg-background"
                            value={filters.search}
                            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Select
                            value={filters.action}
                            onValueChange={(val) => setFilters(prev => ({ ...prev, action: val }))}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filtrar por Ação" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas as Ações</SelectItem>
                                <SelectItem value="login">Login</SelectItem>
                                <SelectItem value="document_viewed">Visualização</SelectItem>
                                <SelectItem value="document_created">Criação de Doc</SelectItem>
                                <SelectItem value="document_signed">Assinatura</SelectItem>
                                <SelectItem value="certificate_uploaded">Certificados</SelectItem>
                                <SelectItem value="report_generated">Relatórios</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* TODO: Add Date Filter support in backend service */}
                        {/* <Select value={filters.days} onValueChange={(val) => setFilters(prev => ({ ...prev, days: val }))}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Período" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Hoje</SelectItem>
                                <SelectItem value="7">Últimos 7 dias</SelectItem>
                                <SelectItem value="30">Últimos 30 dias</SelectItem>
                            </SelectContent>
                        </Select> */}
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
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">Carregando auditoria...</TableCell>
                                </TableRow>
                            ) : auditLogs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Nenhum registro encontrado.</TableCell>
                                </TableRow>
                            ) : (
                                auditLogs.map((log) => (
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
                                                    <User className="w-3 h-3" /> {log.user_name}
                                                </div>
                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                    <Globe className="w-3 h-3" /> {log.ip_address}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm">{log.resource}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{log.details}</TableCell>
                                        <TableCell className="text-right whitespace-nowrap text-xs text-muted-foreground">
                                            <div className="flex items-center justify-end gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(log.created_at).toLocaleString('pt-BR')}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};
