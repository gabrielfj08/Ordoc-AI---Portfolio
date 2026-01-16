'use client';

import { useIntegrationServices } from '@/hooks/queries/useIntegrations';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Server, Activity, AlertCircle } from 'lucide-react';

export function IntegrationServicesList() {
    const { data: services, isLoading, error } = useIntegrationServices({ status: 'active' });

    if (isLoading) {
        return (
            <Card className="p-6">
                <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2">Carregando serviços...</span>
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="p-6">
                <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-5 w-5" />
                    <p>Erro ao carregar serviços de integração</p>
                </div>
            </Card>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-500';
            case 'inactive':
                return 'bg-gray-500';
            case 'maintenance':
                return 'bg-yellow-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'active':
                return 'Ativo';
            case 'inactive':
                return 'Inativo';
            case 'maintenance':
                return 'Manutenção';
            default:
                return status;
        }
    };

    const getServiceTypeLabel = (type: string) => {
        switch (type) {
            case 'gov_br':
                return 'Gov.br';
            case 'receita_federal':
                return 'Receita Federal';
            case 'serasa':
                return 'Serasa';
            case 'serpro':
                return 'SERPRO';
            case 'custom':
                return 'Personalizado';
            default:
                return type;
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Serviços de Integração</h3>
                <Badge variant="outline">{services?.length || 0} serviços</Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {services?.map((service) => (
                    <Card key={service.id} className="p-4">
                        <div className="space-y-3">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                    <Server className="h-4 w-4 text-muted-foreground" />
                                    <h4 className="font-medium">{service.name}</h4>
                                </div>
                                <div className={`w-2 h-2 rounded-full ${getStatusColor(service.status)}`} />
                            </div>

                            {service.description && (
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {service.description}
                                </p>
                            )}

                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary">
                                    {getServiceTypeLabel(service.service_type)}
                                </Badge>
                                <Badge variant="outline">{getStatusLabel(service.status)}</Badge>
                                {service.is_public && <Badge variant="outline">Público</Badge>}
                            </div>

                            {service.rate_limit_config && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Activity className="h-3 w-3" />
                                    <span>
                                        Limite: {service.rate_limit_config.requests_per_minute || 'N/A'}{' '}
                                        req/min
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>
                                    Por {service.created_by_name || service.created_by.slice(0, 8)}
                                </span>
                                <span>{new Date(service.created_at).toLocaleDateString('pt-BR')}</span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {!services || services.length === 0 && (
                <Card className="p-6">
                    <div className="text-center text-muted-foreground">
                        <p>Nenhum serviço de integração ativo encontrado</p>
                    </div>
                </Card>
            )}
        </div>
    );
}
