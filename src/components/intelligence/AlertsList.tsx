'use client';

import { useState } from 'react';
import {
    AlertTriangle,
    CheckCircle2,
    Info,
    X,
    Eye,
    Shield,
    FileWarning,
    Lightbulb,
    AlertCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAlertsList, useMarkAlertAsRead, useDismissAlert } from '@/hooks/queries/useIntelligence';
import { ProactiveAlert } from '@/services/intelligence';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const SEVERITY_CONFIG = {
    critical: {
        icon: AlertTriangle,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        badge: 'destructive',
    },
    high: {
        icon: AlertCircle,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        badge: 'default',
    },
    medium: {
        icon: FileWarning,
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        badge: 'secondary',
    },
    low: {
        icon: Info,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        badge: 'outline',
    },
    info: {
        icon: Lightbulb,
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        badge: 'outline',
    },
};

const ALERT_TYPE_CONFIG = {
    security: {
        icon: Shield,
        label: 'Segurança',
        color: 'text-red-600',
    },
    compliance: {
        icon: CheckCircle2,
        label: 'Compliance',
        color: 'text-blue-600',
    },
    quality: {
        icon: FileWarning,
        label: 'Qualidade',
        color: 'text-amber-600',
    },
    suggestion: {
        icon: Lightbulb,
        label: 'Sugestão',
        color: 'text-purple-600',
    },
    warning: {
        icon: AlertTriangle,
        label: 'Aviso',
        color: 'text-orange-600',
    },
};

// Map backend keys to existing config
const getSeverityConfig = (severity: string) => {
    if (severity === 'error') return SEVERITY_CONFIG.critical;
    if (severity === 'warning') return SEVERITY_CONFIG.high;
    return (SEVERITY_CONFIG as any)[severity] || SEVERITY_CONFIG.info;
};

interface AlertCardProps {
    alert: ProactiveAlert;
    onDismiss?: (id: string) => void;
    onMarkAsRead?: (id: string) => void;
}

function AlertCard({ alert, onDismiss, onMarkAsRead }: AlertCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const severityConfig = getSeverityConfig(alert.severity);
    const typeConfig = ALERT_TYPE_CONFIG[alert.alert_type as keyof typeof ALERT_TYPE_CONFIG] || ALERT_TYPE_CONFIG.warning;
    const SeverityIcon = severityConfig.icon;
    const TypeIcon = typeConfig.icon;

    return (
        <Card
            className={cn(
                'transition-all duration-200',
                severityConfig.borderColor,
                !alert.is_read && 'border-l-4'
            )}
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                        <div className={cn('p-2 rounded-lg', severityConfig.bgColor)}>
                            <SeverityIcon className={cn('h-5 w-5', severityConfig.color)} />
                        </div>

                        <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <CardTitle className="text-base">{alert.title}</CardTitle>
                                <Badge variant={severityConfig.badge as any} className="text-xs">
                                    {alert.severity}
                                </Badge>
                                <Badge variant="outline" className="text-xs gap-1">
                                    <TypeIcon className="h-3 w-3" />
                                    {typeConfig.label}
                                </Badge>
                                {!alert.is_read && (
                                    <Badge variant="default" className="text-xs bg-blue-600">
                                        Novo
                                    </Badge>
                                )}
                            </div>
                            <CardDescription className="text-sm">
                                {alert.message}
                            </CardDescription>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        {alert.document_id && (
                            <Button
                                size="sm"
                                variant="ghost"
                                asChild
                                title="Ver no documento"
                            >
                                <Link href={`/documents?id=${alert.document_id}`}>
                                    <Eye className="h-4 w-4 text-blue-600" />
                                </Link>
                            </Button>
                        )}
                        {!alert.is_read && (
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => onMarkAsRead?.(alert.id!)}
                                title="Marcar como lido"
                            >
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                            </Button>
                        )}
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onDismiss?.(alert.id!)}
                            title="Descartar"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>

            {(alert.suggested_actions && alert.suggested_actions.length > 0) && (
                <CardContent className="pt-0">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Ações sugeridas:</p>
                        <ul className="space-y-1">
                            {alert.suggested_actions.map((action, idx) => (
                                <li key={idx} className="text-sm flex items-start gap-2">
                                    <span className="text-muted-foreground">•</span>
                                    <span>{action.label}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </CardContent>
            )}

            {alert.details && Object.keys(alert.details).length > 0 && (
                <CardContent className="pt-0">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-xs"
                    >
                        {isExpanded ? 'Ocultar' : 'Ver'} detalhes
                    </Button>

                    {isExpanded && (
                        <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                            {Object.entries(alert.details || {}).map(([key, value]) => (
                                <div key={key} className="text-[11px] mb-1">
                                    <span className="font-semibold text-slate-500 uppercase tracking-tight mr-2">{key.replace(/_/g, ' ')}:</span>
                                    <span className="text-slate-700">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            )}
        </Card>
    );
}

export function AlertsList() {
    const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'critical'>('unread');

    // Queries baseadas na tab ativa
    const allAlerts = useAlertsList({ is_dismissed: false }, { enabled: activeTab === 'all' });
    const unreadAlerts = useAlertsList(
        { is_read: false, is_dismissed: false },
        { enabled: activeTab === 'unread' }
    );
    const criticalAlerts = useAlertsList(
        { severity: 'critical', is_dismissed: false },
        { enabled: activeTab === 'critical' }
    );

    const { mutate: markAsRead } = useMarkAlertAsRead();
    const { mutate: dismissAlert } = useDismissAlert();

    // Selecionar dados baseado na tab ativa
    const currentQuery =
        activeTab === 'all' ? allAlerts :
            activeTab === 'unread' ? unreadAlerts :
                criticalAlerts;

    const alerts = currentQuery.data?.results || [];
    const isLoading = currentQuery.isLoading;

    return (
        <div className="space-y-4">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                <TabsList>
                    <TabsTrigger value="unread" className="gap-2">
                        Não lidos
                        {unreadAlerts.data && unreadAlerts.data.count > 0 && (
                            <Badge variant="default" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                                {unreadAlerts.data.count}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="critical" className="gap-2">
                        Críticos
                        {criticalAlerts.data && criticalAlerts.data.count > 0 && (
                            <Badge variant="destructive" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                                {criticalAlerts.data.count}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="all">Todos</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="space-y-4 mt-4">
                    {isLoading ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Carregando alertas...
                        </div>
                    ) : alerts.length === 0 ? (
                        <Card>
                            <CardContent className="py-8 text-center text-muted-foreground">
                                <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-green-600" />
                                <p className="font-medium">Nenhum alerta encontrado</p>
                                <p className="text-sm">Tudo certo por aqui!</p>
                            </CardContent>
                        </Card>
                    ) : (
                        alerts.map((alert) => (
                            <AlertCard
                                key={alert.id}
                                alert={alert}
                                onDismiss={dismissAlert}
                                onMarkAsRead={markAsRead}
                            />
                        ))
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
