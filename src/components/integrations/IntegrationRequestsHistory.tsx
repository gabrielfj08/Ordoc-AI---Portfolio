'use client';

import { useMyIntegrationRequests } from '@/hooks/queries/useIntegrations';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function IntegrationRequestsHistory() {
    const { data: requests, isLoading, error } = useMyIntegrationRequests();

    if (isLoading) {
        return (
            <Card className="p-6">
                <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2">Carregando histórico...</span>
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="p-6">
                <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-5 w-5" />
                    <p>Erro ao carregar histórico de requisições</p>
                </div>
            </Card>
        );
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'success':
                return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            case 'failed':
                return <XCircle className="h-4 w-4 text-red-500" />;
            case 'processing':
            case 'pending':
                return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
            case 'timeout':
                return <Clock className="h-4 w-4 text-yellow-500" />;
            default:
                return <AlertCircle className="h-4 w-4 text-gray-500" />;
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'success':
                return 'Sucesso';
            case 'failed':
                return 'Falhou';
            case 'processing':
                return 'Processando';
            case 'pending':
                return 'Pendente';
            case 'timeout':
                return 'Timeout';
            default:
                return status;
        }
    };

    const getMethodColor = (method: string) => {
        switch (method) {
            case 'GET':
                return 'bg-blue-100 text-blue-800';
            case 'POST':
                return 'bg-green-100 text-green-800';
            case 'PUT':
            case 'PATCH':
                return 'bg-yellow-100 text-yellow-800';
            case 'DELETE':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Histórico de Requisições</h3>
                <Badge variant="outline">{requests?.length || 0} requisições</Badge>
            </div>

            {requests && requests.length > 0 ? (
                <div className="space-y-2">
                    {requests.map((request) => (
                        <Card key={request.id} className="p-4">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5">{getStatusIcon(request.status)}</div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge className={`${getMethodColor(request.method)} text-xs`}>
                                            {request.method}
                                        </Badge>
                                        <span className="text-sm font-medium truncate">
                                            {request.endpoint}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                        <span>{request.service_name || request.service}</span>
                                        <span>•</span>
                                        <span className="capitalize">{getStatusLabel(request.status)}</span>
                                        {request.status_code && (
                                            <>
                                                <span>•</span>
                                                <span>HTTP {request.status_code}</span>
                                            </>
                                        )}
                                        {request.duration_ms && (
                                            <>
                                                <span>•</span>
                                                <span>{request.duration_ms}ms</span>
                                            </>
                                        )}
                                    </div>

                                    {request.error_message && (
                                        <p className="text-xs text-destructive mt-2">
                                            {request.error_message}
                                        </p>
                                    )}

                                    {request.retry_count > 0 && (
                                        <p className="text-xs text-yellow-600 mt-1">
                                            {request.retry_count} tentativa(s) de retry
                                        </p>
                                    )}
                                </div>

                                <div className="text-xs text-muted-foreground text-right">
                                    {formatDistanceToNow(new Date(request.created_at), {
                                        addSuffix: true,
                                        locale: ptBR,
                                    })}
                                </div>
                            </div>

                            {request.response_data && (
                                <details className="mt-3">
                                    <summary className="text-xs font-medium cursor-pointer text-muted-foreground">
                                        Ver resposta
                                    </summary>
                                    <pre className="text-xs bg-muted p-2 rounded-md overflow-auto mt-2 max-h-40">
                                        {JSON.stringify(request.response_data, null, 2)}
                                    </pre>
                                </details>
                            )}
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="p-6">
                    <div className="text-center text-muted-foreground">
                        <p>Nenhuma requisição encontrada</p>
                    </div>
                </Card>
            )}
        </div>
    );
}
