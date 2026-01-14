"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Activity,
    Database,
    HardDrive,
    Server,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    TrendingUp,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface HealthMetric {
    name: string;
    status: "healthy" | "degraded" | "down";
    value: string;
    details: string;
    icon: React.ElementType;
}

interface StorageInfo {
    used: number;
    total: number;
    percentage: number;
    projection30Days: number;
}

// Mock data
const mockHealthData: HealthMetric[] = [
    {
        name: "API Core",
        status: "healthy",
        value: "12ms",
        details: "Latência média | Uptime: 99.98%",
        icon: Server,
    },
    {
        name: "Database",
        status: "healthy",
        value: "8ms",
        details: "Tempo de resposta | 45 conexões ativas",
        icon: Database,
    },
    {
        name: "Storage",
        status: "healthy",
        value: "188.7 GB",
        details: "de 100 GB utilizados | Projeção: 195 GB em 30 dias",
        icon: HardDrive,
    },
];

const mockStorageData: StorageInfo = {
    used: 188.7,
    total: 1000,
    percentage: 18.87,
    projection30Days: 195,
};

const statusConfig = {
    healthy: {
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-200",
        icon: CheckCircle2,
        label: "Saudável",
    },
    degraded: {
        color: "text-yellow-600",
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        icon: AlertTriangle,
        label: "Degradado",
    },
    down: {
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
        icon: XCircle,
        label: "Indisponível",
    },
};

export const HealthMonitor: React.FC = () => {
    const overallStatus: "healthy" | "degraded" | "down" = mockHealthData.some((m) => m.status === "down")
        ? "down"
        : mockHealthData.some((m) => m.status === "degraded")
            ? "degraded"
            : "healthy";

    const StatusIcon = statusConfig[overallStatus].icon;

    return (
        <Card className="border-none shadow-sm bg-white">
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${statusConfig[overallStatus].bg}`}>
                            <Activity className={statusConfig[overallStatus].color} size={24} />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-bold text-slate-800">
                                Monitoramento de Saúde
                            </CardTitle>
                            <p className="text-sm text-slate-500 mt-1">
                                Status da infraestrutura em tempo real
                            </p>
                        </div>
                    </div>

                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${statusConfig[overallStatus].bg} ${statusConfig[overallStatus].border}`}>
                        <StatusIcon size={16} className={statusConfig[overallStatus].color} />
                        <span className={`text-sm font-semibold ${statusConfig[overallStatus].color}`}>
                            {statusConfig[overallStatus].label}
                        </span>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                {/* Health Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {mockHealthData.map((metric, index) => {
                        const MetricIcon = metric.icon;
                        const config = statusConfig[metric.status];
                        const MetricStatusIcon = config.icon;

                        return (
                            <div
                                key={index}
                                className={`p-4 rounded-lg border ${config.bg} ${config.border} transition-all hover:shadow-md`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <MetricIcon size={20} className={config.color} />
                                        <h4 className="font-semibold text-slate-800 text-sm">{metric.name}</h4>
                                    </div>
                                    <MetricStatusIcon size={16} className={config.color} />
                                </div>

                                <div className="mb-2">
                                    <p className="text-2xl font-bold text-slate-800">{metric.value}</p>
                                </div>

                                <p className="text-xs text-slate-600">{metric.details}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Storage Details */}
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <HardDrive size={18} className="text-slate-600" />
                            <h4 className="font-semibold text-slate-800 text-sm">Detalhes de Armazenamento</h4>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-600">
                            <TrendingUp size={12} />
                            <span>+6.3 GB projetado em 30 dias</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-slate-600">Uso Atual</span>
                                <span className="text-sm font-semibold text-slate-800">
                                    {mockStorageData.used} GB / {mockStorageData.total} GB
                                </span>
                            </div>
                            <Progress value={mockStorageData.percentage} className="h-2" />
                            <p className="text-xs text-slate-500 mt-1">{mockStorageData.percentage.toFixed(2)}% utilizado</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200">
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Documentos</p>
                                <p className="text-sm font-semibold text-slate-800">68.6 GB</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                    <span className="text-xs text-slate-500">29 arquivos</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Lixeira</p>
                                <p className="text-sm font-semibold text-slate-800">120.1 GB</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                                    <span className="text-xs text-slate-500">50 arquivos</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Info */}
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-xs text-blue-600 font-medium mb-1">Uptime</p>
                        <p className="text-lg font-bold text-blue-800">99.98%</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                        <p className="text-xs text-green-600 font-medium mb-1">Requisições/min</p>
                        <p className="text-lg font-bold text-green-800">1,247</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                        <p className="text-xs text-purple-600 font-medium mb-1">Taxa de Erro</p>
                        <p className="text-lg font-bold text-purple-800">0.02%</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                        <p className="text-xs text-orange-600 font-medium mb-1">Conexões DB</p>
                        <p className="text-lg font-bold text-orange-800">45/100</p>
                    </div>
                </div>

                {/* Alert */}
                {mockStorageData.percentage > 80 && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                        <AlertTriangle size={16} className="text-yellow-600 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-yellow-800">Atenção: Capacidade de Armazenamento</p>
                            <p className="text-xs text-yellow-700 mt-1">
                                O armazenamento está acima de 80%. Considere expandir a capacidade ou limpar arquivos desnecessários.
                            </p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
