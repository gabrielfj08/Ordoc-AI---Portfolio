"use client";

import dynamic from 'next/dynamic';
import React, { useState } from "react";
import { MainContainer } from "@/components/layout/MainContainer";
import { KPICard } from "@/components/analytics/KPICard";

// Dynamic imports para componentes Recharts (evita warnings de SSR)
const InteractiveChart = dynamic(
    () => import('@/components/analytics/InteractiveChart').then(mod => ({ default: mod.InteractiveChart })),
    {
        ssr: false,
        loading: () => <div className="bg-white rounded-2xl border border-slate-200 p-6 h-[350px] animate-pulse" />
    }
);

import { ExportMenu } from "@/components/analytics/ExportMenu";
import { RealTimeMonitor } from "@/components/analytics/RealTimeMonitor";
import { ReportScheduler } from "@/components/analytics/ReportScheduler";
import { DataMiningPanel } from "@/components/analytics/DataMiningPanel";

const AIPredictionChart = dynamic(
    () => import('@/components/analytics/AIPredictionChart').then(mod => ({ default: mod.AIPredictionChart })),
    {
        ssr: false,
        loading: () => <div className="bg-white rounded-2xl border border-slate-200 p-6 h-[450px] animate-pulse" />
    }
);
import { GlobalAuditList } from "@/components/analytics/GlobalAuditList";
import { ExecutiveHealthStatus } from "@/components/analytics/ExecutiveHealthStatus";
import { ROIDashboard } from "@/components/analytics/ROIDashboard";
import {
    BarChart3, FileText, Users, Clock, TrendingUp,
    Calendar, Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AnalyticsPage() {
    const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

    // Dados Mock - KPIs
    const kpis = [
        {
            title: "Total de Processos",
            value: "1,247",
            change: 12.5,
            icon: FileText,
            color: "text-blue-600",
            trend: [45, 52, 48, 61, 55, 67, 72]
        },
        {
            title: "Taxa de Conclusão",
            value: "94.2%",
            change: 3.2,
            icon: TrendingUp,
            color: "text-green-600",
            trend: [88, 89, 91, 90, 92, 93, 94]
        },
        {
            title: "Tempo Médio",
            value: "4.2h",
            change: -8.1,
            icon: Clock,
            color: "text-orange-600",
            trend: [5.2, 5.0, 4.8, 4.6, 4.5, 4.3, 4.2]
        },
        {
            title: "Usuários Ativos",
            value: "342",
            change: 18.7,
            icon: Users,
            color: "text-purple-600",
            trend: [280, 290, 305, 310, 320, 335, 342]
        }
    ];

    // Dados Mock - Gráfico de Linha (Processos por Dia)
    const processesOverTime = [
        { name: '01/01', value: 45 },
        { name: '05/01', value: 52 },
        { name: '10/01', value: 48 },
        { name: '15/01', value: 61 },
        { name: '20/01', value: 55 },
        { name: '25/01', value: 67 },
        { name: '30/01', value: 72 }
    ];

    // Dados Mock - Gráfico de Barras (Processos por Categoria)
    const processesByCategory = [
        { name: 'Contratos', value: 385 },
        { name: 'Licitações', value: 298 },
        { name: 'NDAs', value: 234 },
        { name: 'Aprovações', value: 189 },
        { name: 'Outros', value: 141 }
    ];

    // Dados Mock - Gráfico de Pizza (Status)
    const processesByStatus = [
        { name: 'Concluídos', value: 1175 },
        { name: 'Em Andamento', value: 52 },
        { name: 'Pendentes', value: 20 }
    ];

    return (
        <MainContainer>
            <div className="space-y-8 animate-in fade-in duration-500">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                            <BarChart3 className="text-blue-600" size={28} />
                            Analytics
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">
                            Dashboards e métricas de desempenho
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Filtro de Período */}
                        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                            {(['7d', '30d', '90d'] as const).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPeriod(p)}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${period === p
                                        ? 'bg-white shadow-sm text-blue-600'
                                        : 'text-slate-600 hover:text-slate-800'
                                        }`}
                                >
                                    {p === '7d' && '7 dias'}
                                    {p === '30d' && '30 dias'}
                                    {p === '90d' && '90 dias'}
                                </button>
                            ))}
                        </div>

                        <Button variant="outline" className="gap-2">
                            <Filter size={16} />
                            Filtros
                        </Button>

                        <ExportMenu />
                    </div>
                </header>

                {/* Executive Health Status - Visão Executiva */}
                <ExecutiveHealthStatus />

                {/* ROI Dashboard - Valor Gerado */}
                <ROIDashboard />

                {/* Charts Grid - 2x2 Uniforme */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <InteractiveChart
                        type="line"
                        data={processesOverTime}
                        title="Processos ao Longo do Tempo"
                        dataKey="value"
                        xAxisKey="name"
                        colors={['#f97316']}
                    />

                    <InteractiveChart
                        type="bar"
                        data={processesByCategory}
                        title="Processos por Categoria"
                        dataKey="value"
                        xAxisKey="name"
                        colors={['#fb923c', '#fdba74', '#fed7aa', '#ffedd5', '#fff7ed']}
                    />

                    <InteractiveChart
                        type="pie"
                        data={processesByStatus}
                        title="Distribuição por Status"
                        dataKey="value"
                        colors={['#f97316', '#fb923c', '#fdba74']}
                    />

                    <RealTimeMonitor />
                </div>

                {/* Global Audit List - Trilha de Auditoria */}
                <GlobalAuditList />

                {/* Relatórios Agendados e Data Mining */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ReportScheduler />
                    <DataMiningPanel />
                </div>
            </div>
        </MainContainer>
    );
}
