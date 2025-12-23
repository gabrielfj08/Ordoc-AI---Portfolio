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
import reportsService, { Report } from '@/services/reports';
import toast from 'react-hot-toast';

import { CreateReportDialog } from './create-report-dialog';

export const ReportsManager = () => {
    const [reports, setReports] = React.useState<Report[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [isCreateOpen, setIsCreateOpen] = React.useState(false);

    const loadReports = async () => {
        try {
            const data = await reportsService.getReports();
            setReports(data);
        } catch (error) {
            console.error('Falha ao carregar relatórios', error);
            toast.error('Não foi possível carregar os relatórios.');
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        loadReports();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await reportsService.deleteReport(id);
            setReports(prev => prev.filter(r => r.id !== id));
            toast.success('Relatório excluído.');
        } catch (error) {
            toast.error('Erro ao excluir relatório.');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Filtrar relatórios..." className="pl-9 bg-background" />
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={() => setIsCreateOpen(true)} className="bg-orange-600 hover:bg-orange-700 text-white gap-2">
                        <Plus className="w-4 h-4" /> Novo Relatório
                    </Button>
                </div>
            </div>

            <CreateReportDialog
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSuccess={loadReports}
            />

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
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">Carregando relatórios...</TableCell>
                                </TableRow>
                            ) : reports.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Nenhum relatório encontrado.</TableCell>
                                </TableRow>
                            ) : (
                                reports.map((report) => (
                                    <TableRow key={report.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                {report.format === 'excel' || report.format === 'csv' || report.format === 'json' ? (
                                                    <FileSpreadsheet className="w-4 h-4 text-green-600" />
                                                ) : (
                                                    <FileText className="w-4 h-4 text-red-500" />
                                                )}
                                                {report.title}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="font-mono text-xs uppercase">
                                                {report.format}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {new Date(report.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            {report.status === 'generating' ? (
                                                <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 animate-pulse">
                                                    Processando
                                                </Badge>
                                            ) : report.status === 'completed' ? (
                                                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                                                    Pronto
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                                                    {report.status}
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                    disabled={report.status !== 'completed'}
                                                    onClick={() => window.open(reportsService.getDownloadUrl(report.id), '_blank')}
                                                >
                                                    <Download className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                    onClick={() => handleDelete(report.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
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
