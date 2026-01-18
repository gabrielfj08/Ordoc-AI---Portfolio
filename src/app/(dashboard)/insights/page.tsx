'use client';

import { useState } from 'react';
import {
    Brain,
    TrendingUp,
    AlertTriangle,
    FileText,
    Users,
    Clock,
    BarChart3,
    Shield,
    Sparkles,
    Activity,
    CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertsList } from '@/components/intelligence/AlertsList';
import {
    useAlertSeverityCounts,
    useRanking,
    useActivityFeed,
    useIntelligenceStatus,
    usePatternsList,
    useAnalysesList
} from '@/hooks/queries/useIntelligence';
import { cn } from '@/lib/utils';

function StatCard({
    title,
    value,
    icon: Icon,
    trend,
    description,
    color = 'blue'
}: {
    title: string;
    value: string | number;
    icon: any;
    trend?: string;
    description?: string;
    color?: 'blue' | 'green' | 'red' | 'amber' | 'purple';
}) {
    const colorClasses = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        red: 'bg-red-100 text-red-600',
        amber: 'bg-amber-100 text-amber-600',
        purple: 'bg-purple-100 text-purple-600',
    };

    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                    <div className={cn('p-2 rounded-lg', colorClasses[color])}>
                        <Icon className="h-4 w-4" />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {(trend || description) && (
                    <p className="text-xs text-muted-foreground mt-1">
                        {trend && <span className="text-green-600 font-medium">{trend}</span>}
                        {description}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

function RankingCard({ title, data, icon: Icon }: {
    title: string;
    data: Array<{ name: string; count: number }>;
    icon: any;
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {data.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        Nenhum dado disponível
                    </p>
                ) : (
                    <div className="space-y-3">
                        {data.slice(0, 5).map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        #{idx + 1}
                                    </span>
                                    <span className="text-sm truncate">{item.name}</span>
                                </div>
                                <Badge variant="secondary">{item.count}</Badge>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function ActivityFeedCard() {
    const { data: activities, isLoading } = useActivityFeed({ limit: 10, hours: 24 });

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Atividade Recente (24h)
                </CardTitle>
                <CardDescription>Ações monitoradas pela IA</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        Carregando...
                    </p>
                ) : !activities || activities.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        Nenhuma atividade recente
                    </p>
                ) : (
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                        {activities.map((activity) => (
                            <div
                                key={activity.id}
                                className="flex items-start gap-3 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                            >
                                <div className="p-2 bg-purple-100 rounded-lg shrink-0">
                                    <Sparkles className="h-4 w-4 text-purple-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium">{activity.description}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {activity.user_name} • {activity.entity_name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(activity.timestamp).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default function InsightsPage() {
    const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('week');

    // Queries
    const { data: alertCounts } = useAlertSeverityCounts();
    const { data: documentRankingRaw } = useRanking('document', { limit: 5 });
    const { data: taskRankingRaw } = useRanking('task', { limit: 5 });
    const { data: procedureRankingRaw } = useRanking('procedure', { limit: 5 });
    const { data: status } = useIntelligenceStatus();
    const { data: patternsData } = usePatternsList({ is_active: true, page_size: 10 });
    const { data: analysesData } = useAnalysesList({ status: 'completed', page_size: 10 });

    // Mapping for UI
    const documentRanking = documentRankingRaw?.map(item => ({ name: `Doc: ${item.entity_id.slice(0, 8)}`, count: Math.round(item.score * 10) / 10 })) || [];
    const taskRanking = taskRankingRaw?.map(item => ({ name: `Tarefa: ${item.entity_id.slice(0, 8)}`, count: Math.round(item.score * 10) / 10 })) || [];
    const procedureRanking = procedureRankingRaw?.map(item => ({ name: `Proc: ${item.entity_id.slice(0, 8)}`, count: Math.round(item.score * 10) / 10 })) || [];

    const totalAlerts = alertCounts ? Object.values(alertCounts).reduce((a, b) => a + b, 0) : 0;
    const criticalAlerts = alertCounts?.critical || 0;
    const patterns = patternsData?.results || [];
    const analyses = analysesData?.results || [];

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Brain className="h-8 w-8 text-purple-600" />
                        Insights de IA
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Análises inteligentes e alertas proativos da plataforma
                    </p>
                </div>

                {/* Status Badge */}
                {status && (
                    <Badge
                        variant={status.is_available ? 'default' : 'destructive'}
                        className="gap-2"
                    >
                        {status.is_available ? (
                            <>
                                <CheckCircle2 className="h-3 w-3" />
                                IA Ativa
                            </>
                        ) : (
                            <>
                                <AlertTriangle className="h-3 w-3" />
                                IA Indisponível
                            </>
                        )}
                    </Badge>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total de Alertas"
                    value={totalAlerts}
                    icon={AlertTriangle}
                    color="amber"
                    description="Alertas ativos"
                />
                <StatCard
                    title="Críticos"
                    value={criticalAlerts}
                    icon={Shield}
                    color="red"
                    description="Requer atenção imediata"
                />
                <StatCard
                    title="Análises Realizadas"
                    value={analysesData?.count || 0}
                    icon={Brain}
                    color="purple"
                    description="Documentos analisados"
                />
                <StatCard
                    title="Padrões Identificados"
                    value={patternsData?.count || 0}
                    icon={Sparkles}
                    color="green"
                    description="Padrões ativos"
                />
            </div>

            {/* Main Content */}
            <Tabs defaultValue="alerts" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="alerts" className="gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Alertas
                        {totalAlerts > 0 && (
                            <Badge variant="secondary" className="ml-1">
                                {totalAlerts}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Analytics
                    </TabsTrigger>
                    <TabsTrigger value="patterns" className="gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Padrões
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="gap-2">
                        <Activity className="h-4 w-4" />
                        Atividade
                    </TabsTrigger>
                </TabsList>

                {/* Alerts Tab */}
                <TabsContent value="alerts" className="space-y-4">
                    <AlertsList />
                </TabsContent>

                {/* Analytics Tab */}
                <TabsContent value="analytics" className="space-y-4">
                    {/* Period Selector */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Período de Análise</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2">
                                <Button
                                    variant={selectedPeriod === 'day' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setSelectedPeriod('day')}
                                >
                                    Hoje
                                </Button>
                                <Button
                                    variant={selectedPeriod === 'week' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setSelectedPeriod('week')}
                                >
                                    Semana
                                </Button>
                                <Button
                                    variant={selectedPeriod === 'month' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setSelectedPeriod('month')}
                                >
                                    Mês
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <RankingCard
                            title="Documentos Relevantes"
                            data={documentRanking}
                            icon={FileText}
                        />
                        <RankingCard
                            title="Tarefas Prioritárias"
                            data={taskRanking}
                            icon={CheckCircle2}
                        />
                        <RankingCard
                            title="Procedimentos Comuns"
                            data={procedureRanking}
                            icon={Users}
                        />
                    </div>
                </TabsContent>

                {/* Patterns Tab */}
                <TabsContent value="patterns" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Padrões Aprendidos pela IA
                            </CardTitle>
                            <CardDescription>
                                A IA identifica padrões recorrentes em nível de usuário, organização e plataforma
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {patterns.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-8">
                                    Nenhum padrão identificado ainda. A IA está aprendendo com seu uso!
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {patterns.map((pattern) => (
                                        <div
                                            key={pattern.id}
                                            className="p-4 bg-muted rounded-lg space-y-2"
                                        >
                                            <div className="flex items-center justify-between">
                                                <p className="font-medium">{pattern.pattern_type}</p>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline">{pattern.scope}</Badge>
                                                    <Badge variant="secondary">
                                                        {(pattern.confidence * 100).toFixed(0)}% confiança
                                                    </Badge>
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {pattern.occurrences} ocorrências
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Primeira ocorrência: {new Date(pattern.first_seen).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Activity Tab */}
                <TabsContent value="activity" className="space-y-4">
                    <ActivityFeedCard />
                </TabsContent>
            </Tabs>
        </div>
    );
}
