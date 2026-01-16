'use client';

import { useReports, useDeleteReport, useRetryReport } from '@/hooks/queries/useReports';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, MoreVertical, RefreshCw, Trash2, Share2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import reportService from '@/services/reports';

interface ReportsListProps {
    filters?: any;
    onShare?: (reportId: string) => void;
}

export function ReportsList({ filters, onShare }: ReportsListProps) {
    const { data: reports, isLoading } = useReports(filters);
    const deleteMutation = useDeleteReport();
    const retryMutation = useRetryReport();

    const handleDownload = async (reportId: string) => {
        try {
            const blob = await reportService.downloadReport(reportId);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `report-${reportId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading report:', error);
        }
    };

    if (isLoading) {
        return <div className="p-4">Carregando relatórios...</div>;
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <Badge variant="default">Concluído</Badge>;
            case 'processing':
                return <Badge variant="secondary">Processando</Badge>;
            case 'pending':
                return <Badge variant="outline">Pendente</Badge>;
            case 'failed':
                return <Badge variant="destructive">Falhou</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-4">
            {reports?.map((report) => (
                <Card key={report.id} className="p-4">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{report.title}</h3>
                                {getStatusBadge(report.status)}
                            </div>
                            {report.description && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    {report.description}
                                </p>
                            )}
                            <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                                <span>Formato: {report.format.toUpperCase()}</span>
                                {report.file_size && (
                                    <span>
                                        Tamanho: {(report.file_size / 1024 / 1024).toFixed(2)} MB
                                    </span>
                                )}
                                <span>
                                    Criado{' '}
                                    {formatDistanceToNow(new Date(report.created_at), {
                                        addSuffix: true,
                                        locale: ptBR,
                                    })}
                                </span>
                            </div>
                            {report.error_message && (
                                <div className="mt-2 text-sm text-destructive">
                                    Erro: {report.error_message}
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2">
                            {report.status === 'completed' && (
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleDownload(report.id)}
                                >
                                    <Download className="h-4 w-4" />
                                </Button>
                            )}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {report.status === 'completed' && onShare && (
                                        <DropdownMenuItem onClick={() => onShare(report.id)}>
                                            <Share2 className="mr-2 h-4 w-4" />
                                            Compartilhar
                                        </DropdownMenuItem>
                                    )}
                                    {report.status === 'failed' && (
                                        <DropdownMenuItem
                                            onClick={() => retryMutation.mutate(report.id)}
                                        >
                                            <RefreshCw className="mr-2 h-4 w-4" />
                                            Tentar Novamente
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem
                                        onClick={() => deleteMutation.mutate(report.id)}
                                        className="text-destructive"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Deletar
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
