'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Bell,
    Brain,
    AlertTriangle,
    Shield,
    FileWarning,
    Lightbulb,
    X,
    Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUnreadAlerts, useCriticalAlerts, useMarkAlertAsRead, useDismissAlert } from '@/hooks/queries/useIntelligence';
import { ProactiveAlert } from '@/services/intelligence';
import { cn } from '@/lib/utils';

const SEVERITY_COLORS = {
    critical: 'text-red-600',
    high: 'text-orange-600',
    medium: 'text-amber-600',
    low: 'text-blue-600',
    info: 'text-gray-600',
};

const ALERT_TYPE_ICONS = {
    security: Shield,
    compliance: FileWarning,
    quality: FileWarning,
    suggestion: Lightbulb,
    warning: AlertTriangle,
};

function AlertItem({ alert }: { alert: ProactiveAlert }) {
    const { mutate: markAsRead } = useMarkAlertAsRead();
    const { mutate: dismiss } = useDismissAlert();

    const Icon = ALERT_TYPE_ICONS[alert.alert_type] || AlertTriangle;
    const colorClass = SEVERITY_COLORS[alert.severity] || 'text-gray-600';

    return (
        <div className="p-3 hover:bg-muted/50 transition-colors group">
            <div className="flex items-start gap-3">
                <div className={cn('p-1.5 rounded-lg bg-muted shrink-0', colorClass)}>
                    <Icon className="h-4 w-4" />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium leading-tight">{alert.title}</p>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(alert.id!);
                                }}
                            >
                                <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    dismiss(alert.id!);
                                }}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2">
                        {alert.message}
                    </p>

                    <div className="flex items-center gap-2">
                        <Badge
                            variant={
                                alert.severity === 'critical' ? 'destructive' :
                                    alert.severity === 'high' ? 'default' : 'secondary'
                            }
                            className="text-xs"
                        >
                            {alert.severity}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                            {alert.alert_type}
                        </Badge>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function AlertsIndicator() {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Buscar apenas alertas não lidos para o badge
    const { data: unreadData } = useUnreadAlerts();
    const { data: criticalData } = useCriticalAlerts();

    const unreadCount = unreadData?.count || 0;
    const criticalCount = criticalData?.count || 0;
    const unreadAlerts = unreadData?.results || [];

    // Mostrar badge vermelho se houver críticos, amarelo se houver não lidos
    const hasCritical = criticalCount > 0;
    const hasUnread = unreadCount > 0;

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative rounded-full text-muted-foreground data-[state=open]:bg-accent p-1.5"
                >
                    <Brain size={22} strokeWidth={2.5} className={cn(
                        "size-[22px]",
                        mounted && hasCritical && "text-red-600 animate-pulse",
                        mounted && !hasCritical && hasUnread && "text-amber-600"
                    )} />

                    {mounted && hasUnread && (
                        <span className={cn(
                            "absolute top-0 right-0 h-5 w-5 rounded-full text-[10px] font-bold flex items-center justify-center",
                            hasCritical ? "bg-red-600 text-white" : "bg-amber-500 text-white"
                        )}>
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-[380px] p-0">
                {/* Header */}
                <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Brain className="h-5 w-5 text-purple-600" />
                            <h3 className="font-semibold">Alertas de IA</h3>
                        </div>
                        <Link href="/insights">
                            <Button variant="ghost" size="sm" className="text-xs">
                                Ver todos
                            </Button>
                        </Link>
                    </div>

                    {hasCritical && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="font-medium">
                                {criticalCount} alerta{criticalCount > 1 ? 's' : ''} crítico{criticalCount > 1 ? 's' : ''}
                            </span>
                        </div>
                    )}
                </div>

                {/* Alerts List */}
                <ScrollArea className="h-[400px]">
                    {unreadAlerts.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">
                            <Brain className="h-12 w-12 mx-auto mb-2 text-purple-300" />
                            <p className="font-medium">Nenhum alerta novo</p>
                            <p className="text-sm mt-1">A IA está monitorando tudo!</p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {unreadAlerts.slice(0, 5).map((alert) => (
                                <AlertItem key={alert.id} alert={alert} />
                            ))}
                        </div>
                    )}
                </ScrollArea>

                {/* Footer */}
                {unreadCount > 5 && (
                    <>
                        <DropdownMenuSeparator />
                        <div className="p-3 text-center">
                            <Link href="/insights">
                                <Button variant="ghost" size="sm" className="w-full">
                                    Ver mais {unreadCount - 5} alertas
                                </Button>
                            </Link>
                        </div>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
