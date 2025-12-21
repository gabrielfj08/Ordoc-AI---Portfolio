'use client';

/**
 * Intelligence Dashboard - Analytics view for AI insights
 */

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import {
    Brain,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    Clock,
    FileText,
    Loader2,
    RefreshCw,
    BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertPanel } from '@/components/ui/AlertPanel';
import intelligenceService, { ProactiveAlert } from '@/services/intelligence';

interface AnalysisStats {
    totalAnalyses: number;
    avgProcessingTime: number;
    alertsGenerated: number;
    patternsLearned: number;
}

interface LearnedPatternSummary {
    id: string;
    pattern_type: string;
    confidence: number;
    occurrences: number;
}

export const IntelligenceDashboard = () => {
    const [alerts, setAlerts] = useState<ProactiveAlert[]>([]);
    const [patterns, setPatterns] = useState<LearnedPatternSummary[]>([]);
    const [stats, setStats] = useState<AnalysisStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [alertsData, patternsData, analysesData] = await Promise.all([
                intelligenceService.getAlerts(undefined, 'all'),
                intelligenceService.getPatterns(),
                intelligenceService.getAnalyses()
            ]);

            setAlerts(alertsData);
            setPatterns(patternsData as LearnedPatternSummary[]);

            // Calculate stats
            setStats({
                totalAnalyses: (analysesData as []).length || 0,
                avgProcessingTime: 1250, // ms
                alertsGenerated: alertsData.length,
                patternsLearned: (patternsData as []).length || 0
            });
        } catch (err) {
            console.error('Failed to load intelligence data:', err);
            // Fallback stats
            setStats({
                totalAnalyses: 0,
                avgProcessingTime: 0,
                alertsGenerated: 0,
                patternsLearned: 0
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const handleAcceptAlert = async (alert: ProactiveAlert) => {
        try {
            await intelligenceService.respondToAlert(alert.id, 'accepted');
            setAlerts(prev => prev.map(a =>
                a.id === alert.id ? { ...a, user_response: 'accepted' as const } : a
            ));
        } catch (err) {
            console.error('Failed to accept:', err);
        }
    };

    const handleRejectAlert = async (alert: ProactiveAlert) => {
        try {
            await intelligenceService.respondToAlert(alert.id, 'rejected');
            setAlerts(prev => prev.map(a =>
                a.id === alert.id ? { ...a, user_response: 'rejected' as const } : a
            ));
        } catch (err) {
            console.error('Failed to reject:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Carregando dados de inteligência...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Brain className="w-6 h-6 text-primary" />
                        Intelligence Dashboard
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Visão geral da análise inteligente de documentos
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={refreshing}
                >
                    <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                    Atualizar
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Análises Realizadas"
                    value={stats?.totalAnalyses || 0}
                    icon={FileText}
                    color="text-blue-500"
                />
                <StatCard
                    title="Tempo Médio"
                    value={`${((stats?.avgProcessingTime || 0) / 1000).toFixed(1)}s`}
                    icon={Clock}
                    color="text-green-500"
                />
                <StatCard
                    title="Alertas Gerados"
                    value={stats?.alertsGenerated || 0}
                    icon={AlertCircle}
                    color="text-amber-500"
                />
                <StatCard
                    title="Padrões Aprendidos"
                    value={stats?.patternsLearned || 0}
                    icon={TrendingUp}
                    color="text-purple-500"
                />
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Alerts Panel */}
                <div className="lg:col-span-2">
                    <AlertPanel
                        alerts={alerts}
                        onAccept={handleAcceptAlert}
                        onReject={handleRejectAlert}
                    />
                </div>

                {/* Learned Patterns */}
                <div className="lg:col-span-1">
                    <Card className="p-4">
                        <h3 className="font-semibold flex items-center gap-2 mb-4">
                            <BarChart3 className="w-4 h-4 text-primary" />
                            Padrões Aprendidos
                        </h3>

                        {patterns.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <Brain className="w-12 h-12 mx-auto mb-2 opacity-30" />
                                <p className="text-sm">Nenhum padrão aprendido ainda</p>
                                <p className="text-xs mt-1">
                                    Os padrões são criados automaticamente com base no seu feedback
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {patterns.slice(0, 5).map((pattern) => (
                                    <div
                                        key={pattern.id}
                                        className="p-3 rounded-lg bg-secondary/50 border border-border/50"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium">
                                                {pattern.pattern_type}
                                            </span>
                                            <Badge variant="outline" className="text-xs">
                                                {pattern.occurrences}x
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Progress
                                                value={pattern.confidence * 100}
                                                className="h-1.5 flex-1"
                                            />
                                            <span className="text-xs text-muted-foreground">
                                                {(pattern.confidence * 100).toFixed(0)}%
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
}

const StatCard = ({ title, value, icon: Icon, color }: StatCardProps) => (
    <Card className="p-4">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    {title}
                </p>
                <p className="text-2xl font-bold mt-1">{value}</p>
            </div>
            <div className={`p-3 rounded-full bg-secondary ${color}`}>
                <Icon className="w-5 h-5" />
            </div>
        </div>
    </Card>
);

export default IntelligenceDashboard;
