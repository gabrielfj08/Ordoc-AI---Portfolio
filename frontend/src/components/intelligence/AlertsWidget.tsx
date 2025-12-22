'use client';

/**
 * AlertsWidget - Widget compacto de alertas para dashboard principal
 *
 * Exibe alertas pendentes em tempo real na sidebar do dashboard
 */

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, AlertCircle, AlertTriangle, Info, XCircle, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import intelligenceService, { ProactiveAlert } from '@/services/intelligence';
import { useIntelligence } from '@/hooks/useIntelligence';

export function AlertsWidget() {
  const { alerts, loadAlerts, acceptAlert, rejectAlert, analyzing } = useIntelligence();
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    // Carregar alertas inicialmente
    loadAlerts();

    // Recarregar a cada 30 segundos para tempo real
    const interval = setInterval(() => {
      loadAlerts();
    }, 30000);

    return () => clearInterval(interval);
  }, [loadAlerts]);

  const pendingAlerts = alerts.filter(a => a.user_response === 'pending');
  const criticalAlerts = pendingAlerts.filter(
    a => a.severity === 'critical' || a.severity === 'error'
  );

  const displayAlerts = pendingAlerts.slice(0, 3); // Mostrar apenas 3 alertas

  return (
    <div className="rounded-lg border bg-card shadow-sm">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Bell className={cn(
            'h-5 w-5',
            criticalAlerts.length > 0 ? 'text-red-500 animate-pulse' : 'text-muted-foreground'
          )} />
          <h3 className="font-semibold text-sm">Alertas de IA</h3>
          {pendingAlerts.length > 0 && (
            <span className={cn(
              'text-xs px-2 py-0.5 rounded-full font-medium',
              criticalAlerts.length > 0
                ? 'bg-red-100 text-red-700'
                : 'bg-blue-100 text-blue-700'
            )}>
              {pendingAlerts.length}
            </span>
          )}
        </div>
        <ChevronRight className={cn(
          'h-4 w-4 transition-transform',
          expanded ? 'rotate-90' : ''
        )} />
      </button>

      {/* Content */}
      {expanded && (
        <div className="border-t">
          {analyzing ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              <span className="ml-2 text-xs text-muted-foreground">Carregando...</span>
            </div>
          ) : displayAlerts.length === 0 ? (
            <div className="p-4 text-center">
              <Bell className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">Nenhum alerta pendente</p>
            </div>
          ) : (
            <div className="divide-y">
              {displayAlerts.map((alert) => (
                <AlertItem
                  key={alert.id}
                  alert={alert}
                  onAccept={() => acceptAlert(alert).then(() => loadAlerts())}
                  onReject={() => rejectAlert(alert).then(() => loadAlerts())}
                />
              ))}
            </div>
          )}

          {/* Footer */}
          {pendingAlerts.length > 0 && (
            <div className="border-t p-3 bg-muted/30">
              <Link
                href="/dashboard/ordoc-intelligence?tab=alerts"
                className="flex items-center justify-center gap-1 text-xs text-primary hover:underline font-medium"
              >
                Ver todos os {pendingAlerts.length} alertas
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface AlertItemProps {
  alert: ProactiveAlert;
  onAccept: () => void;
  onReject: () => void;
}

function AlertItem({ alert, onAccept, onReject }: AlertItemProps) {
  const [showActions, setShowActions] = useState(false);

  const severityIcons = {
    info: Info,
    warning: AlertTriangle,
    error: AlertCircle,
    critical: XCircle,
  };

  const severityColors = {
    info: 'text-blue-500',
    warning: 'text-amber-500',
    error: 'text-red-500',
    critical: 'text-purple-500',
  };

  const Icon = severityIcons[alert.severity];

  return (
    <div
      className="p-3 hover:bg-muted/50 transition-colors cursor-pointer"
      onClick={() => setShowActions(!showActions)}
    >
      <div className="flex items-start gap-2">
        <Icon className={cn('h-4 w-4 mt-0.5 flex-shrink-0', severityColors[alert.severity])} />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium line-clamp-1">{alert.title}</p>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{alert.message}</p>

          {showActions && (
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAccept();
                }}
                className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
              >
                Aceitar
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReject();
                }}
                className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
              >
                Rejeitar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AlertsWidget;
