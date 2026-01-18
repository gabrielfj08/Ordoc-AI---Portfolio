'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Loader2,
  Clock,
  FileText,
} from "lucide-react";
import {
  useAlertSeverityCounts,
  useAnalysesList,
  usePatternsList,
  useActivityFeed,
} from "@/hooks/queries/useIntelligence";
import Link from "next/link";
import { useEffect, useState } from "react";

export const AIInsightsCard = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  // Queries para dados em tempo real
  const { data: alertCounts } = useAlertSeverityCounts();
  const { data: recentAnalyses, isLoading: loadingAnalyses } = useAnalysesList({
    status: 'completed',
    page_size: 3,
  });
  const { data: recentPatterns } = usePatternsList({
    is_active: true,
    page_size: 2,
  });
  const { data: activities } = useActivityFeed({ limit: 5, hours: 24 });

  const criticalCount = alertCounts?.critical || 0;
  const highCount = (alertCounts?.high || 0) + (alertCounts?.error || 0);
  const totalAlerts = alertCounts
    ? Object.values(alertCounts).reduce((a, b) => a + b, 0)
    : 0;

  const analyses = recentAnalyses?.results || [];
  const patterns = recentPatterns?.results || [];
  const recentActivities = activities || [];

  // Calcular score de saúde do dia (0-100)
  const healthScore = Math.max(
    0,
    100 - (criticalCount * 20 + highCount * 10)
  );

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  const getHealthLabel = (score: number) => {
    if (score >= 90) return 'Excelente';
    if (score >= 70) return 'Boa';
    if (score >= 50) return 'Atenção';
    return 'Crítica';
  };

  return (
    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 via-white to-blue-50 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-600 rounded-xl shadow-md">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                Inteligência do Dia
                <Badge variant="secondary" className="text-xs">
                  IA Ativa
                </Badge>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Resumo inteligente baseado em padrões e análises
              </p>
            </div>
          </div>

          {/* Score de Saúde */}
          <div className="text-right">
            <div className={`text-3xl font-bold ${getHealthColor(healthScore)}`}>
              {healthScore}
            </div>
            <p className="text-xs text-muted-foreground">
              {getHealthLabel(healthScore)}
            </p>
          </div>
        </div>

        {/* Grid de métricas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Alertas */}
          <div className="p-3 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span className="text-xs font-medium text-slate-600">Alertas</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-800">{totalAlerts}</span>
              {criticalCount > 0 && (
                <Badge variant="destructive" className="text-[10px] h-4">
                  {criticalCount} críticos
                </Badge>
              )}
            </div>
          </div>

          {/* Análises Hoje */}
          <div className="p-3 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-4 w-4 text-purple-600" />
              <span className="text-xs font-medium text-slate-600">Análises</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-800">
                {recentAnalyses?.count || 0}
              </span>
              <span className="text-xs text-muted-foreground">hoje</span>
            </div>
          </div>

          {/* Padrões */}
          <div className="p-3 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium text-slate-600">Padrões</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-800">
                {recentPatterns?.count || 0}
              </span>
              <span className="text-xs text-muted-foreground">ativos</span>
            </div>
          </div>

          {/* Atividade */}
          <div className="p-3 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium text-slate-600">Atividade</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-800">
                {recentActivities.length}
              </span>
              <span className="text-xs text-muted-foreground">24h</span>
            </div>
          </div>
        </div>

        {/* Insights Rápidos */}
        <div className="space-y-3 mb-4">
          <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
            Insights Rápidos
          </h4>

          {mounted && loadingAnalyses ? (
            <div className="flex items-center gap-2 p-3 bg-white rounded-lg">
              <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
              <span className="text-xs text-muted-foreground">
                Analisando documentos...
              </span>
            </div>
          ) : mounted ? (
            <>
              {/* Análises recentes */}
              {analyses.length > 0 && (
                <div className="p-3 bg-white rounded-lg border border-purple-100">
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-purple-600 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-800">
                        {analyses.length} documento{analyses.length > 1 ? 's' : ''} analisado{analyses.length > 1 ? 's' : ''} recentemente
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {analyses[0].document_type &&
                          `Último: ${analyses[0].document_type}`}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Padrões identificados */}
              {patterns.length > 0 && (
                <div className="p-3 bg-white rounded-lg border border-green-100">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-800">
                        Novo padrão identificado
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {patterns[0].pattern_type} ({(patterns[0].confidence * 100).toFixed(0)}% confiança)
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Alertas críticos */}
              {criticalCount > 0 && (
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-red-800">
                        {criticalCount} alerta{criticalCount > 1 ? 's' : ''} crítico{criticalCount > 1 ? 's' : ''} requer{criticalCount === 1 ? '' : 'em'} atenção imediata
                      </p>
                      <Link href="/insights">
                        <Button
                          size="sm"
                          className="mt-2 h-6 text-xs bg-red-600 hover:bg-red-700 text-white"
                        >
                          Ver alertas
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Empty state */}
              {analyses.length === 0 && patterns.length === 0 && criticalCount === 0 && (
                <div className="p-3 bg-white rounded-lg border border-slate-200 text-center">
                  <Sparkles className="h-8 w-8 mx-auto mb-2 text-purple-300" />
                  <p className="text-xs text-muted-foreground">
                    A IA está aprendendo com seu uso diário
                  </p>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* CTA */}
        <Link href="/insights">
          <Button
            variant="outline"
            className="w-full gap-2 text-purple-600 border-purple-200 hover:bg-purple-50"
          >
            <Brain className="h-4 w-4" />
            Ver Dashboard Completo de IA
            <ChevronRight className="h-4 w-4 ml-auto" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
