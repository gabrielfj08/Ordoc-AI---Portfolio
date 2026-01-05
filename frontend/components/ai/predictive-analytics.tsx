'use client'

import { useState, useEffect } from 'react'
import {
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Target,
    Zap,
    Brain,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

export interface PredictiveInsight {
    type: 'trend' | 'forecast' | 'anomaly' | 'recommendation'
    title: string
    description: string
    confidence: number
    impact: 'low' | 'medium' | 'high' | 'critical'
    metric?: {
        current: number
        predicted: number
        change: number
        unit: string
    }
    action?: {
        label: string
        description: string
    }
}

export interface PredictiveAnalyticsProps {
    className?: string
    timeframe?: '7d' | '30d' | '90d'
    metrics?: {
        tasks_completed: number[]
        tasks_created: number[]
        documents_uploaded: number[]
        avg_completion_time: number[]
    }
}

export function PredictiveAnalytics({
    className,
    timeframe = '30d',
    metrics,
}: PredictiveAnalyticsProps) {
    const [insights, setInsights] = useState<PredictiveInsight[]>([])
    const [loading, setLoading] = useState(true)

    /**
     * Calcula tendência linear simples
     */
    const calculateTrend = (values: number[]): number => {
        if (values.length < 2) return 0

        const n = values.length
        const sumX = (n * (n + 1)) / 2
        const sumY = values.reduce((a, b) => a + b, 0)
        const sumXY = values.reduce((sum, val, idx) => sum + val * (idx + 1), 0)
        const sumX2 = (n * (n + 1) * (2 * n + 1)) / 6

        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)

        return slope
    }

    /**
     * Prevê próximo valor baseado em tendência
     */
    const forecastNext = (values: number[]): number => {
        if (values.length === 0) return 0

        const trend = calculateTrend(values)
        const lastValue = values[values.length - 1]
        const avgValue = values.reduce((a, b) => a + b, 0) / values.length

        // Previsão = último valor + tendência, com peso no valor médio
        return Math.max(0, lastValue + trend * 0.7 + (avgValue - lastValue) * 0.3)
    }

    /**
     * Detecta anomalias (valores muito fora do padrão)
     */
    const detectAnomalies = (values: number[]): boolean => {
        if (values.length < 3) return false

        const avg = values.reduce((a, b) => a + b, 0) / values.length
        const stdDev = Math.sqrt(
            values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length
        )

        const lastValue = values[values.length - 1]

        // Anomalia se último valor está > 2 desvios padrão
        return Math.abs(lastValue - avg) > stdDev * 2
    }

    /**
     * Gera insights preditivos
     */
    useEffect(() => {
        setLoading(true)

        const generateInsights = () => {
            const newInsights: PredictiveInsight[] = []

            if (!metrics) {
                setLoading(false)
                return
            }

            // 1. Previsão de conclusão de tarefas
            if (metrics.tasks_completed.length > 0) {
                const trend = calculateTrend(metrics.tasks_completed)
                const currentAvg =
                    metrics.tasks_completed.reduce((a, b) => a + b, 0) /
                    metrics.tasks_completed.length
                const predicted = forecastNext(metrics.tasks_completed)
                const change = ((predicted - currentAvg) / currentAvg) * 100

                newInsights.push({
                    type: 'forecast',
                    title: 'Previsão de Produtividade',
                    description:
                        trend > 0
                            ? 'Tendência de aumento na conclusão de tarefas'
                            : trend < 0
                            ? 'Tendência de queda na conclusão de tarefas'
                            : 'Produtividade estável',
                    confidence: Math.min(0.95, 0.6 + metrics.tasks_completed.length * 0.05),
                    impact: Math.abs(change) > 20 ? 'high' : Math.abs(change) > 10 ? 'medium' : 'low',
                    metric: {
                        current: Math.round(currentAvg),
                        predicted: Math.round(predicted),
                        change: Math.round(change),
                        unit: 'tarefas/semana',
                    },
                })
            }

            // 2. Análise de carga de trabalho
            if (metrics.tasks_created.length > 0 && metrics.tasks_completed.length > 0) {
                const avgCreated =
                    metrics.tasks_created.reduce((a, b) => a + b, 0) / metrics.tasks_created.length
                const avgCompleted =
                    metrics.tasks_completed.reduce((a, b) => a + b, 0) /
                    metrics.tasks_completed.length
                const backlogGrowth = avgCreated - avgCompleted

                if (backlogGrowth > 5) {
                    newInsights.push({
                        type: 'anomaly',
                        title: 'Alerta de Acúmulo',
                        description: `Backlog crescendo ~${Math.round(backlogGrowth)} tarefas/semana`,
                        confidence: 0.85,
                        impact: backlogGrowth > 10 ? 'critical' : 'high',
                        action: {
                            label: 'Redistribuir tarefas',
                            description:
                                'Considere redistribuir ou priorizar tarefas para evitar sobrecarga',
                        },
                    })
                }
            }

            // 3. Tempo de conclusão
            if (metrics.avg_completion_time.length > 0) {
                const trend = calculateTrend(metrics.avg_completion_time)
                const currentAvg =
                    metrics.avg_completion_time.reduce((a, b) => a + b, 0) /
                    metrics.avg_completion_time.length
                const predicted = forecastNext(metrics.avg_completion_time)

                if (trend > 0.5) {
                    newInsights.push({
                        type: 'trend',
                        title: 'Tempo de Conclusão Aumentando',
                        description: 'Tarefas estão levando mais tempo para serem concluídas',
                        confidence: 0.78,
                        impact: 'medium',
                        metric: {
                            current: Math.round(currentAvg),
                            predicted: Math.round(predicted),
                            change: Math.round(((predicted - currentAvg) / currentAvg) * 100),
                            unit: 'horas',
                        },
                        action: {
                            label: 'Revisar complexidade',
                            description: 'Analise se tarefas estão muito complexas ou falta recursos',
                        },
                    })
                }
            }

            // 4. Pico de uploads de documentos
            if (metrics.documents_uploaded.length > 0) {
                if (detectAnomalies(metrics.documents_uploaded)) {
                    const lastValue =
                        metrics.documents_uploaded[metrics.documents_uploaded.length - 1]
                    const avg =
                        metrics.documents_uploaded.reduce((a, b) => a + b, 0) /
                        metrics.documents_uploaded.length

                    newInsights.push({
                        type: 'anomaly',
                        title: 'Pico de Upload Detectado',
                        description: `${Math.round(((lastValue - avg) / avg) * 100)}% acima da média`,
                        confidence: 0.92,
                        impact: 'medium',
                        metric: {
                            current: Math.round(avg),
                            predicted: lastValue,
                            change: Math.round(((lastValue - avg) / avg) * 100),
                            unit: 'documentos',
                        },
                    })
                }
            }

            // 5. Recomendação de otimização
            if (metrics.tasks_completed.length > 0) {
                const completionRate =
                    metrics.tasks_completed.reduce((a, b) => a + b, 0) /
                    (metrics.tasks_created.reduce((a, b) => a + b, 0) || 1)

                if (completionRate < 0.7) {
                    newInsights.push({
                        type: 'recommendation',
                        title: 'Oportunidade de Melhoria',
                        description: `Taxa de conclusão de ${Math.round(completionRate * 100)}% - abaixo do ideal`,
                        confidence: 0.88,
                        impact: 'high',
                        action: {
                            label: 'Ativar priorização inteligente',
                            description:
                                'IA pode ajudar a priorizar tarefas para aumentar taxa de conclusão',
                        },
                    })
                }
            }

            setInsights(newInsights)
            setLoading(false)
        }

        const timer = setTimeout(generateInsights, 500)
        return () => clearTimeout(timer)
    }, [metrics, timeframe])

    const getImpactColor = (impact: string) => {
        switch (impact) {
            case 'critical':
                return 'text-red-600 dark:text-red-400'
            case 'high':
                return 'text-orange-600 dark:text-orange-400'
            case 'medium':
                return 'text-yellow-600 dark:text-yellow-400'
            case 'low':
                return 'text-green-600 dark:text-green-400'
            default:
                return 'text-gray-600 dark:text-gray-400'
        }
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'trend':
                return <TrendingUp className="h-5 w-5" />
            case 'forecast':
                return <Target className="h-5 w-5" />
            case 'anomaly':
                return <AlertTriangle className="h-5 w-5" />
            case 'recommendation':
                return <Zap className="h-5 w-5" />
            default:
                return <Brain className="h-5 w-5" />
        }
    }

    if (loading) {
        return (
            <Card className={className}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5 animate-pulse text-purple-600" />
                        Analytics Preditivos
                    </CardTitle>
                    <CardDescription>Analisando padrões e gerando insights...</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div
                                key={i}
                                className="h-24 bg-muted animate-pulse rounded-lg"
                            ></div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (insights.length === 0) {
        return (
            <Card className={className}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-purple-600" />
                        Analytics Preditivos
                    </CardTitle>
                    <CardDescription>
                        Continue usando o sistema para gerar insights preditivos
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-green-500" />
                        <p>Tudo funcionando bem!</p>
                        <p className="text-sm mt-1">
                            Mais dados serão coletados para gerar insights
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    Analytics Preditivos
                </CardTitle>
                <CardDescription>
                    Insights gerados por machine learning baseado em {timeframe} de dados
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {insights.map((insight, index) => (
                        <div
                            key={index}
                            className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                        >
                            <div className="flex items-start gap-3">
                                <div
                                    className={cn(
                                        'mt-0.5',
                                        getImpactColor(insight.impact)
                                    )}
                                >
                                    {getTypeIcon(insight.type)}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold">{insight.title}</h4>
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant={
                                                    insight.impact === 'critical' ||
                                                    insight.impact === 'high'
                                                        ? 'destructive'
                                                        : 'secondary'
                                                }
                                                className="text-xs"
                                            >
                                                {insight.impact}
                                            </Badge>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {insight.description}
                                    </p>

                                    {/* Metric */}
                                    {insight.metric && (
                                        <div className="flex items-center gap-4 text-sm">
                                            <div>
                                                <span className="text-muted-foreground">
                                                    Atual:{' '}
                                                </span>
                                                <span className="font-medium">
                                                    {insight.metric.current} {insight.metric.unit}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {insight.metric.change > 0 ? (
                                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                                ) : (
                                                    <TrendingDown className="h-4 w-4 text-red-600" />
                                                )}
                                                <span
                                                    className={cn(
                                                        'font-medium',
                                                        insight.metric.change > 0
                                                            ? 'text-green-600'
                                                            : 'text-red-600'
                                                    )}
                                                >
                                                    {Math.abs(insight.metric.change)}%
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">
                                                    Previsão:{' '}
                                                </span>
                                                <span className="font-medium">
                                                    {insight.metric.predicted} {insight.metric.unit}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Confidence */}
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span>Confiança da IA</span>
                                            <span>{Math.round(insight.confidence * 100)}%</span>
                                        </div>
                                        <Progress
                                            value={insight.confidence * 100}
                                            className="h-1"
                                        />
                                    </div>

                                    {/* Action */}
                                    {insight.action && (
                                        <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                                            <div className="flex items-start gap-2">
                                                <Zap className="h-4 w-4 text-primary mt-0.5" />
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-primary">
                                                        {insight.action.label}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {insight.action.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
