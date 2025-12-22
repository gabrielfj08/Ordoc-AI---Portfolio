'use client';

/**
 * AlertsMetrics - Exibe métricas e estatísticas de alertas
 */

import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Clock, TrendingUp, Shield, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import intelligenceService, { ProactiveAlert } from '@/services/intelligence';

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  trend?: number;
  trendLabel?: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
}

function MetricCard({ title, value, icon: Icon, trend, trendLabel, variant = 'default', className }: MetricCardProps) {
  const variants = {
    default: 'bg-blue-50 text-blue-700 border-blue-200',
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    error: 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <div className={cn('rounded-lg border p-4', variants[variant], className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-wider opacity-70">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {trend !== undefined && (
            <div className="flex items-center gap-1 mt-2 text-xs">
              <TrendingUp className={cn('h-3 w-3', trend >= 0 ? 'rotate-0' : 'rotate-180')} />
              <span>
                {trend > 0 ? '+' : ''}{trend}% {trendLabel || 'vs. semana anterior'}
              </span>
            </div>
          )}
        </div>
        <div className="ml-4">
          <Icon className="h-8 w-8 opacity-50" />
        </div>
      </div>
    </div>
  );
}

export function AlertsMetrics() {
  const [alerts, setAlerts] = useState<ProactiveAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAlerts() {
      try {
        const data = await intelligenceService.getAlerts();
        setAlerts(data);
      } catch (error) {
        console.error('Failed to load alerts:', error);
      } finally {
        setLoading(false);
      }
    }

    loadAlerts();
  }, []);

  // Calcular métricas
  const totalAlerts = alerts.length;
  const pendingAlerts = alerts.filter(a => a.user_response === 'pending').length;
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' || a.severity === 'error').length;
  const complianceAlerts = alerts.filter(a => a.alert_type === 'compliance').length;
  const acceptedAlerts = alerts.filter(a => a.user_response === 'accepted').length;
  const acceptanceRate = totalAlerts > 0 ? Math.round((acceptedAlerts / totalAlerts) * 100) : 0;

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-lg border bg-card p-4 animate-pulse">
            <div className="h-4 bg-muted rounded w-1/2 mb-4" />
            <div className="h-8 bg-muted rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <MetricCard
        title="Total de Alertas"
        value={totalAlerts}
        icon={FileText}
        variant="default"
      />

      <MetricCard
        title="Pendentes"
        value={pendingAlerts}
        icon={Clock}
        variant="warning"
      />

      <MetricCard
        title="Críticos"
        value={criticalAlerts}
        icon={AlertCircle}
        variant="error"
      />

      <MetricCard
        title="Compliance"
        value={complianceAlerts}
        icon={Shield}
        variant="default"
      />

      <MetricCard
        title="Taxa de Aceitação"
        value={`${acceptanceRate}%`}
        icon={CheckCircle}
        variant="success"
      />

      <MetricCard
        title="Aceitos"
        value={acceptedAlerts}
        icon={CheckCircle}
        variant="success"
      />
    </div>
  );
}

export default AlertsMetrics;
