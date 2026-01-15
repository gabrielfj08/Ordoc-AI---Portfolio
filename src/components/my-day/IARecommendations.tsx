'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, CheckCircle2, AlertTriangle, Brain, Loader2, ChevronRight } from "lucide-react";
import { useCriticalAlerts, useAlertsList, useDismissAlert } from "@/hooks/queries/useIntelligence";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const SEVERITY_CONFIG = {
  critical: {
    color: 'bg-red-100 text-red-600',
    icon: ShieldAlert,
    label: 'Crítico',
  },
  high: {
    color: 'bg-orange-100 text-orange-700',
    icon: AlertTriangle,
    label: 'Alto Risco',
  },
  medium: {
    color: 'bg-yellow-100 text-yellow-700',
    icon: AlertTriangle,
    label: 'Atenção',
  },
};

export const IARecommendations = () => {
  // Buscar alertas críticos e de alta severidade
  const { data: criticalData, isLoading: loadingCritical } = useCriticalAlerts();
  const { data: highData, isLoading: loadingHigh } = useAlertsList({
    severity: 'high',
    is_dismissed: false,
    page_size: 5,
  });

  const { mutate: dismissAlert } = useDismissAlert();

  const criticalAlerts = criticalData?.results || [];
  const highAlerts = highData?.results || [];

  // Combinar e limitar a 3
  const topAlerts = [...criticalAlerts, ...highAlerts].slice(0, 3);

  const isLoading = loadingCritical || loadingHigh;
  const totalCount = (criticalData?.count || 0) + (highData?.count || 0);

  return (
    <Card className="border-none shadow-sm bg-white overflow-hidden h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-sm font-semibold text-foreground">
              Mitigação de Riscos IA
            </CardTitle>
          </div>
          {totalCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {totalCount}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-2" />
            <p className="text-xs text-muted-foreground">Analisando riscos...</p>
          </div>
        ) : topAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
            <p className="text-sm font-medium text-foreground">Tudo certo!</p>
            <p className="text-xs text-muted-foreground mt-1">
              Nenhum risco crítico identificado
            </p>
          </div>
        ) : (
          <>
            {topAlerts.map((alert) => {
              const severity = alert.severity as 'critical' | 'high' | 'medium';
              const config = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.medium;
              const Icon = config.icon;

              return (
                <div
                  key={alert.id}
                  className="p-3 rounded-xl bg-orange-50/50 border border-orange-100 group hover:bg-orange-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${config.color}`}
                    >
                      {config.label}
                    </span>
                    <Icon size={14} className={severity === 'critical' ? 'text-red-500' : 'text-orange-500'} />
                  </div>

                  <p className="text-xs text-foreground leading-snug font-medium mb-2">
                    {alert.title}
                  </p>

                  <p className="text-[11px] text-muted-foreground leading-snug mb-3">
                    {alert.message}
                  </p>

                  {alert.suggested_actions && alert.suggested_actions.length > 0 && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 h-7 text-xs border-2 border-orange-300 text-orange-600 bg-transparent hover:bg-orange-500 hover:text-white transition-all font-semibold"
                      >
                        <CheckCircle2 size={12} className="mr-1.5" />
                        {alert.suggested_actions[0].substring(0, 20)}
                        {alert.suggested_actions[0].length > 20 ? '...' : ''}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                        onClick={() => dismissAlert(alert.id!)}
                      >
                        ×
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}

            {totalCount > 3 && (
              <Link href="/insights">
                <div className="p-2 text-center hover:bg-muted/50 rounded-lg transition-colors cursor-pointer group">
                  <span className="text-xs text-muted-foreground font-medium group-hover:text-foreground transition-colors flex items-center justify-center gap-1">
                    Ver todos os {totalCount} alertas
                    <ChevronRight size={14} />
                  </span>
                </div>
              </Link>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
