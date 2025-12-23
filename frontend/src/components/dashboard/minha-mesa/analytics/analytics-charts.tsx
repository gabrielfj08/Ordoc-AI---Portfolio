'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    BarChart3,
    TrendingUp,
    Users,
    FileText,
    AlertCircle,
    CheckCircle2,
    Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dashboardService, AnalyticsOverview } from '@/services/dashboard';

export const AnalyticsCharts = () => {
    const [data, setData] = useState<AnalyticsOverview | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await dashboardService.getAnalyticsOverview();
                setData(result);
            } catch (error) {
                console.error("Erro ao carregar analytics:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading || !data) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse">Carregando métricas...</div>;
    }

    const stats = [
        { title: 'Total de Documentos', value: data.documents.total.toLocaleString(), change: data.documents.change, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
        { title: 'Usuários Ativos', value: data.users.active.toString(), change: data.users.change, icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
        { title: 'Relatórios Gerados', value: data.reports.total.toString(), change: data.reports.change, icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-50' },
        { title: 'Armazenamento', value: data.storage.display, change: `${data.storage.usage_percent}% Uso`, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
    ];

    // Calcular percentuais para gráfico de barras
    const maxCount = Math.max(...data.weekly_activity.map(d => d.count), 1); // Evitar divisão por zero

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <Card key={i} className="border-border/50 shadow-sm">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                                <p className="text-xs text-green-600 font-medium mt-1 flex items-center">
                                    {stat.change.includes('+') ? <TrendingUp className="w-3 h-3 mr-1" /> : null}
                                    {stat.change}
                                </p>
                            </div>
                            <div className={`p-3 rounded-xl ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="col-span-2 border-border/50 shadow-sm">
                    <CardHeader>
                        <CardTitle>Atividade Semanal</CardTitle>
                        <CardDescription>Volume de documentos processados nos últimos 7 dias.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-end justify-between px-10 pb-4 gap-4">
                        {data.weekly_activity.map((day, i) => {
                            const heightPercent = Math.max((day.count / maxCount) * 100, 5); // Mínimo 5% de altura visual
                            return (
                                <div key={i} className="w-full bg-secondary/30 rounded-t-lg relative group transition-all hover:bg-orange-100 cursor-pointer h-full flex flex-col justify-end">
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                                        {day.count} docs - {day.day}
                                    </div>
                                    <div
                                        className="w-full bg-primary/80 rounded-t-lg transition-all duration-700 hover:bg-primary"
                                        style={{ height: `${heightPercent}%` }}
                                    ></div>
                                </div>
                            );
                        })}
                    </CardContent>
                    <div className="flex justify-between px-10 pb-6 text-xs text-muted-foreground uppercase font-medium">
                        {data.weekly_activity.map((d, i) => (
                            <span key={i}>{d.label}</span>
                        ))}
                    </div>
                </Card>

                <Card className="col-span-1 border-border/50 shadow-sm">
                    <CardHeader>
                        <CardTitle>Status do Sistema</CardTitle>
                        <CardDescription>Saúde dos serviços.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className={`w-5 h-5 ${data.system_status.api === 'operational' ? 'text-green-500' : 'text-red-500'}`} />
                                <span className="text-sm font-medium">API Core</span>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${data.system_status.api === 'operational' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {data.system_status.api === 'operational' ? 'Operacional' : 'Falha'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className={`w-5 h-5 ${data.system_status.database === 'operational' ? 'text-green-500' : 'text-red-500'}`} />
                                <span className="text-sm font-medium">Database</span>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${data.system_status.database === 'operational' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {data.system_status.database === 'operational' ? 'Operacional' : 'Falha'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <AlertCircle className={`w-5 h-5 ${data.system_status.storage === 'operational' ? 'text-green-500' : data.system_status.storage === 'warning' ? 'text-yellow-500' : 'text-red-500'}`} />
                                <span className="text-sm font-medium">Storage</span>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${data.system_status.storage === 'operational' ? 'bg-green-100 text-green-700' : data.system_status.storage === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                {data.storage.display}
                            </span>
                        </div>
                        <div className="pt-6 mt-6 border-t border-border">
                            <Button variant="outline" className="w-full">Ver Status Completo</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
