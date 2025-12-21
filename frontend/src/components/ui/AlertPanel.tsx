'use client';

/**
 * AlertPanel - Panel for displaying multiple alerts with filtering
 */

import React, { useState } from 'react';
import { Bell, Filter, CheckCheck, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AlertBanner } from './AlertBanner';
import { Button } from './button';
import { Badge } from './badge';
import type { ProactiveAlert } from '@/services/intelligence';

interface AlertPanelProps {
    alerts: ProactiveAlert[];
    loading?: boolean;
    onAccept?: (alert: ProactiveAlert) => void;
    onReject?: (alert: ProactiveAlert) => void;
    onModify?: (alert: ProactiveAlert) => void;
    onDismiss?: (alert: ProactiveAlert) => void;
    onAcceptAll?: () => void;
    className?: string;
}

type FilterStatus = 'all' | 'pending' | 'resolved';

export function AlertPanel({
    alerts,
    loading = false,
    onAccept,
    onReject,
    onModify,
    onDismiss,
    onAcceptAll,
    className,
}: AlertPanelProps) {
    const [filter, setFilter] = useState<FilterStatus>('pending');

    const filteredAlerts = alerts.filter((alert) => {
        if (filter === 'all') return true;
        if (filter === 'pending') return alert.user_response === 'pending';
        return alert.user_response !== 'pending';
    });

    const pendingCount = alerts.filter((a) => a.user_response === 'pending').length;
    const criticalCount = alerts.filter(
        (a) => a.user_response === 'pending' && (a.severity === 'critical' || a.severity === 'error')
    ).length;

    return (
        <div className={cn('rounded-lg border bg-card', className)}>
            {/* Header */}
            <div className="flex items-center justify-between border-b px-4 py-3">
                <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-semibold">Alertas de Inteligência</h3>
                    {pendingCount > 0 && (
                        <Badge variant="secondary" className="ml-1">
                            {pendingCount} pendente{pendingCount > 1 ? 's' : ''}
                        </Badge>
                    )}
                    {criticalCount > 0 && (
                        <Badge variant="destructive" className="ml-1">
                            {criticalCount} crítico{criticalCount > 1 ? 's' : ''}
                        </Badge>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {/* Filter */}
                    <div className="flex items-center rounded-lg border bg-muted/30 p-0.5">
                        <FilterButton
                            active={filter === 'pending'}
                            onClick={() => setFilter('pending')}
                        >
                            Pendentes
                        </FilterButton>
                        <FilterButton
                            active={filter === 'resolved'}
                            onClick={() => setFilter('resolved')}
                        >
                            Resolvidos
                        </FilterButton>
                        <FilterButton
                            active={filter === 'all'}
                            onClick={() => setFilter('all')}
                        >
                            Todos
                        </FilterButton>
                    </div>

                    {/* Accept All */}
                    {onAcceptAll && pendingCount > 0 && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={onAcceptAll}
                            className="text-xs"
                        >
                            <CheckCheck className="h-3 w-3 mr-1" />
                            Aceitar Todos
                        </Button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        <span className="ml-2 text-sm text-muted-foreground">Carregando alertas...</span>
                    </div>
                ) : filteredAlerts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <Bell className="h-12 w-12 text-muted-foreground/30 mb-3" />
                        <p className="text-sm text-muted-foreground">
                            {filter === 'pending'
                                ? 'Nenhum alerta pendente'
                                : filter === 'resolved'
                                    ? 'Nenhum alerta resolvido'
                                    : 'Nenhum alerta encontrado'}
                        </p>
                    </div>
                ) : (
                    filteredAlerts.map((alert) => (
                        <AlertBanner
                            key={alert.id}
                            alert={alert}
                            onAccept={onAccept}
                            onReject={onReject}
                            onModify={onModify}
                            onDismiss={onDismiss}
                        />
                    ))
                )}
            </div>

            {/* Footer */}
            {alerts.length > 0 && (
                <div className="border-t px-4 py-2 text-xs text-muted-foreground">
                    {alerts.length} alerta{alerts.length > 1 ? 's' : ''} no total
                </div>
            )}
        </div>
    );
}

function FilterButton({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                'px-3 py-1 text-xs font-medium rounded-md transition-colors',
                active
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
            )}
        >
            {children}
        </button>
    );
}

export default AlertPanel;
