'use client';

import { useSignatureBatch, useSignatureBatchStatus, useProcessBatch, useCancelBatch } from '@/hooks/queries/useSignature';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2, Play, XCircle, CheckCircle2, AlertCircle, Layers } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

interface SignatureBatchStatusTrackerProps {
    batchId: string;
}

export function SignatureBatchStatusTracker({ batchId }: SignatureBatchStatusTrackerProps) {
    const { data: batch, isLoading } = useSignatureBatch(batchId);
    const { data: status } = useSignatureBatchStatus(batchId); // Auto-refresh every 10s
    const processMutation = useProcessBatch();
    const cancelMutation = useCancelBatch();

    const handleProcess = () => {
        processMutation.mutate(batchId, {
            onSuccess: () => {
                toast.success('Lote iniciado com sucesso');
            },
        });
    };

    const handleCancel = () => {
        if (confirm('Tem certeza que deseja cancelar este lote?')) {
            cancelMutation.mutate(batchId, {
                onSuccess: () => {
                    toast.success('Lote cancelado');
                },
            });
        }
    };

    if (isLoading) {
        return (
            <Card className="p-6">
                <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                </div>
            </Card>
        );
    }

    if (!batch) {
        return (
            <Card className="p-6">
                <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-5 w-5" />
                    <p>Lote não encontrado</p>
                </div>
            </Card>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'draft':
                return 'bg-gray-500';
            case 'pending':
                return 'bg-yellow-500';
            case 'processing':
                return 'bg-blue-500';
            case 'completed':
                return 'bg-green-500';
            case 'failed':
                return 'bg-red-500';
            case 'cancelled':
                return 'bg-orange-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle2 className="h-5 w-5 text-green-500" />;
            case 'failed':
                return <XCircle className="h-5 w-5 text-red-500" />;
            case 'processing':
                return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
            case 'cancelled':
                return <XCircle className="h-5 w-5 text-orange-500" />;
            default:
                return <Layers className="h-5 w-5 text-gray-500" />;
        }
    };

    const progressPercentage = status?.progress_percentage || batch.progress_percentage || 0;
    const canProcess = batch.status === 'pending' || batch.status === 'draft';
    const canCancel = batch.status === 'pending' || batch.status === 'processing';

    return (
        <Card className="p-6">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            {getStatusIcon(batch.status)}
                            {batch.name}
                        </h3>
                        {batch.description && (
                            <p className="text-sm text-muted-foreground mt-1">{batch.description}</p>
                        )}
                    </div>
                    <Badge className={getStatusColor(batch.status)}>
                        {batch.status === 'draft' && 'Rascunho'}
                        {batch.status === 'pending' && 'Pendente'}
                        {batch.status === 'processing' && 'Processando'}
                        {batch.status === 'completed' && 'Concluído'}
                        {batch.status === 'failed' && 'Falhou'}
                        {batch.status === 'cancelled' && 'Cancelado'}
                    </Badge>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progresso</span>
                        <span className="font-medium">{progressPercentage}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="p-4 bg-muted/50">
                        <p className="text-xs text-muted-foreground">Total</p>
                        <p className="text-2xl font-bold">
                            {status?.total_documents || batch.total_documents}
                        </p>
                    </Card>
                    <Card className="p-4 bg-blue-50">
                        <p className="text-xs text-muted-foreground">Processados</p>
                        <p className="text-2xl font-bold text-blue-600">
                            {status?.processed_documents || batch.processed_documents}
                        </p>
                    </Card>
                    <Card className="p-4 bg-green-50">
                        <p className="text-xs text-muted-foreground">Sucesso</p>
                        <p className="text-2xl font-bold text-green-600">
                            {status?.successful_signatures || batch.successful_signatures}
                        </p>
                    </Card>
                    <Card className="p-4 bg-red-50">
                        <p className="text-xs text-muted-foreground">Falhas</p>
                        <p className="text-2xl font-bold text-red-600">
                            {status?.failed_signatures || batch.failed_signatures}
                        </p>
                    </Card>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t text-sm">
                    <div>
                        <p className="text-muted-foreground">Criado por</p>
                        <p className="font-medium">{batch.created_by_name || 'Você'}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Criado em</p>
                        <p className="font-medium">
                            {formatDistanceToNow(new Date(batch.created_at), {
                                addSuffix: true,
                                locale: ptBR,
                            })}
                        </p>
                    </div>
                    {batch.started_at && (
                        <div>
                            <p className="text-muted-foreground">Iniciado em</p>
                            <p className="font-medium">
                                {formatDistanceToNow(new Date(batch.started_at), {
                                    addSuffix: true,
                                    locale: ptBR,
                                })}
                            </p>
                        </div>
                    )}
                    {batch.completed_at && (
                        <div>
                            <p className="text-muted-foreground">Concluído em</p>
                            <p className="font-medium">
                                {formatDistanceToNow(new Date(batch.completed_at), {
                                    addSuffix: true,
                                    locale: ptBR,
                                })}
                            </p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 justify-end pt-4 border-t">
                    {canCancel && (
                        <Button
                            variant="outline"
                            onClick={handleCancel}
                            disabled={cancelMutation.isPending}
                        >
                            {cancelMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Cancelando...
                                </>
                            ) : (
                                <>
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Cancelar Lote
                                </>
                            )}
                        </Button>
                    )}
                    {canProcess && (
                        <Button onClick={handleProcess} disabled={processMutation.isPending}>
                            {processMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Iniciando...
                                </>
                            ) : (
                                <>
                                    <Play className="mr-2 h-4 w-4" />
                                    Processar Lote
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
}
