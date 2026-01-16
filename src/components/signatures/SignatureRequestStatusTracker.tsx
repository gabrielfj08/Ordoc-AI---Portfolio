'use client';

import { useSignatureRequest, useSignatureRequestStatus, useRequestSigners } from '@/hooks/queries/useSignature';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Loader2,
    CheckCircle2,
    Clock,
    XCircle,
    Eye,
    Mail,
    AlertCircle,
    FileSignature,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SignatureRequestStatusTrackerProps {
    requestId: string;
}

export function SignatureRequestStatusTracker({ requestId }: SignatureRequestStatusTrackerProps) {
    const { data: request, isLoading } = useSignatureRequest(requestId);
    const { data: status } = useSignatureRequestStatus(requestId); // Auto-refresh every 10s
    const { data: signers } = useRequestSigners(requestId);

    if (isLoading) {
        return (
            <Card className="p-6">
                <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                </div>
            </Card>
        );
    }

    if (!request) {
        return (
            <Card className="p-6">
                <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-5 w-5" />
                    <p>Solicitação não encontrada</p>
                </div>
            </Card>
        );
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'signed':
                return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            case 'pending':
                return <Clock className="h-4 w-4 text-yellow-500" />;
            case 'notified':
                return <Mail className="h-4 w-4 text-blue-500" />;
            case 'viewed':
                return <Eye className="h-4 w-4 text-purple-500" />;
            case 'declined':
                return <XCircle className="h-4 w-4 text-red-500" />;
            case 'expired':
                return <AlertCircle className="h-4 w-4 text-gray-500" />;
            default:
                return <Clock className="h-4 w-4 text-gray-500" />;
        }
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            pending: 'Pendente',
            notified: 'Notificado',
            viewed: 'Visualizado',
            signed: 'Assinado',
            declined: 'Recusado',
            expired: 'Expirado',
        };
        return labels[status] || status;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'draft':
                return 'bg-gray-500';
            case 'pending':
                return 'bg-yellow-500';
            case 'in_progress':
                return 'bg-blue-500';
            case 'completed':
                return 'bg-green-500';
            case 'cancelled':
            case 'rejected':
                return 'bg-red-500';
            case 'expired':
                return 'bg-orange-500';
            default:
                return 'bg-gray-500';
        }
    };

    const progressPercentage = status?.progress_percentage || request.progress_percentage || 0;

    return (
        <div className="space-y-4">
            {/* Status Overview */}
            <Card className="p-6">
                <div className="space-y-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <FileSignature className="h-5 w-5" />
                                {request.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                {request.description}
                            </p>
                        </div>
                        <Badge className={getStatusColor(request.status)}>
                            {request.status === 'draft' && 'Rascunho'}
                            {request.status === 'pending' && 'Pendente'}
                            {request.status === 'in_progress' && 'Em Andamento'}
                            {request.status === 'completed' && 'Concluída'}
                            {request.status === 'cancelled' && 'Cancelada'}
                            {request.status === 'expired' && 'Expirada'}
                            {request.status === 'rejected' && 'Rejeitada'}
                        </Badge>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progresso</span>
                            <span className="font-medium">{progressPercentage}%</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{status?.signed_count || 0} assinados</span>
                            <span>•</span>
                            <span>{status?.pending_count || 0} pendentes</span>
                            <span>•</span>
                            <span>{status?.total_signers || 0} total</span>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t text-sm">
                        <div>
                            <p className="text-muted-foreground">Criado por</p>
                            <p className="font-medium">{request.created_by_name || 'Você'}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Criado em</p>
                            <p className="font-medium">
                                {formatDistanceToNow(new Date(request.created_at), {
                                    addSuffix: true,
                                    locale: ptBR,
                                })}
                            </p>
                        </div>
                        {request.expires_at && (
                            <div>
                                <p className="text-muted-foreground">Prazo</p>
                                <p className="font-medium">
                                    {new Date(request.expires_at).toLocaleDateString('pt-BR')}
                                </p>
                            </div>
                        )}
                        {request.completed_at && (
                            <div>
                                <p className="text-muted-foreground">Concluído em</p>
                                <p className="font-medium">
                                    {new Date(request.completed_at).toLocaleDateString('pt-BR')}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </Card>

            {/* Signers Status */}
            <Card className="p-6">
                <h4 className="font-semibold mb-4">Signatários</h4>
                <div className="space-y-3">
                    {signers?.map((signer) => (
                        <div
                            key={signer.id}
                            className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                        >
                            <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                                {signer.signing_order}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="font-medium">{signer.full_name}</p>
                                <p className="text-sm text-muted-foreground">{signer.email}</p>

                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                    <div className="flex items-center gap-1">
                                        {getStatusIcon(signer.status)}
                                        <span className="text-xs">{getStatusLabel(signer.status)}</span>
                                    </div>

                                    {signer.notified_at && (
                                        <span className="text-xs text-muted-foreground">
                                            • Notificado{' '}
                                            {formatDistanceToNow(new Date(signer.notified_at), {
                                                addSuffix: true,
                                                locale: ptBR,
                                            })}
                                        </span>
                                    )}

                                    {signer.viewed_at && (
                                        <span className="text-xs text-muted-foreground">
                                            • Visualizado{' '}
                                            {formatDistanceToNow(new Date(signer.viewed_at), {
                                                addSuffix: true,
                                                locale: ptBR,
                                            })}
                                        </span>
                                    )}

                                    {signer.signed_at && (
                                        <span className="text-xs text-green-600">
                                            • Assinado{' '}
                                            {formatDistanceToNow(new Date(signer.signed_at), {
                                                addSuffix: true,
                                                locale: ptBR,
                                            })}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
