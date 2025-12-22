'use client';

/**
 * InsightsPanel - Exibe insights e descobertas da IA
 */

import React, { useEffect, useState } from 'react';
import { Lightbulb, TrendingUp, Users, Clock, FileText, AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import intelligenceService, { ProactiveAlert } from '@/services/intelligence';

interface InsightItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'error';
  timestamp: string;
}

function InsightItem({ icon: Icon, title, description, severity, timestamp }: InsightItemProps) {
  const severityConfig = {
    info: 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    warning: 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    error: 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
  };

  return (
    <div className={cn('rounded-lg border p-3 transition-colors hover:shadow-sm', severityConfig[severity])}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm">{title}</h4>
          <p className="text-xs mt-1 opacity-80">{description}</p>
          <p className="text-xs mt-2 opacity-60">{timestamp}</p>
        </div>
      </div>
    </div>
  );
}

export function InsightsPanel() {
  const [alerts, setAlerts] = useState<ProactiveAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInsights() {
      try {
        const data = await intelligenceService.getAlerts();
        // Pegar apenas os 6 mais recentes
        setAlerts(data.slice(0, 6));
      } catch (error) {
        console.error('Failed to load insights:', error);
      } finally {
        setLoading(false);
      }
    }

    loadInsights();
  }, []);

  // Gerar insights baseados nos alertas
  const insights = alerts.map((alert) => {
    let icon = Lightbulb;

    if (alert.alert_type === 'compliance') icon = AlertTriangle;
    if (alert.alert_type === 'pattern') icon = TrendingUp;
    if (alert.document_type === 'document') icon = FileText;
    if (alert.document_type === 'user_activity') icon = Users;

    return {
      icon,
      title: alert.title,
      description: alert.message,
      severity: alert.severity === 'critical' || alert.severity === 'error' ? 'error' :
                alert.severity === 'warning' ? 'warning' : 'info',
      timestamp: new Date(alert.created_at).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }),
    };
  });

  return (
    <div className="rounded-lg border bg-card">
      {/* Header */}
      <div className="border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold">Insights e Descobertas</h3>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Análises proativas geradas pela IA
        </p>
      </div>

      {/* Content */}
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">Carregando insights...</span>
          </div>
        ) : insights.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Lightbulb className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">Nenhum insight disponível no momento</p>
            <p className="text-xs text-muted-foreground mt-1">
              A IA está continuamente analisando seus dados
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <InsightItem key={index} {...insight} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {insights.length > 0 && (
        <div className="border-t px-4 py-2">
          <button className="text-xs text-primary hover:underline">
            Ver todos os insights →
          </button>
        </div>
      )}
    </div>
  );
}

export default InsightsPanel;
