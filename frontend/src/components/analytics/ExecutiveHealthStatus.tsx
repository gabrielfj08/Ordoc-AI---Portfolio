"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BusinessMetric {
    label: string;
    value: string;
    change: number;
    trend: "up" | "down";
    insight: string;
}

// Mock data
const mockBusinessMetrics: BusinessMetric[] = [
    {
        label: "Processos Este Mês",
        value: "1,247",
        change: 12.5,
        trend: "up",
        insight: "156 processos a mais que o mês passado",
    },
    {
        label: "Taxa de Conclusão",
        value: "94.2%",
        change: 3.2,
        trend: "up",
        insight: "6.7% acima da média do setor (87.5%)",
    },
    {
        label: "Tempo Médio",
        value: "4.2h",
        change: -8.1,
        trend: "down",
        insight: "26% mais rápido que há 3 meses",
    },
    {
        label: "Usuários Ativos",
        value: "342",
        change: 18.7,
        trend: "up",
        insight: "Adoção crescendo consistentemente",
    },
];

export const ExecutiveHealthStatus: React.FC = () => {
    return (
        <Card className="border-none shadow-sm bg-white">
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-orange-50 rounded-lg">
                            <TrendingUp className="text-orange-600" size={24} />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-bold text-slate-800">
                                Status Geral do Sistema
                            </CardTitle>
                            <p className="text-sm text-slate-500 mt-1">
                                Visão executiva de performance
                            </p>
                        </div>
                    </div>

                    <Badge className="bg-orange-100 text-orange-700 border-orange-200 px-3 py-1">
                        <TrendingUp size={14} className="mr-1" />
                        Todos os sistemas funcionando perfeitamente
                    </Badge>
                </div>
            </CardHeader>

            <CardContent>
                {/* System Health Summary */}
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-orange-800 mb-1">
                                ✅ 99.98% de disponibilidade este mês
                            </p>
                            <p className="text-xs text-orange-700">
                                Sistema operando com excelência. Nenhum incidente crítico registrado.
                            </p>
                        </div>
                        <button className="text-xs text-orange-700 hover:text-orange-800 font-medium underline">
                            ℹ️ Ver detalhes técnicos
                        </button>
                    </div>
                </div>

                {/* Business Metrics Grid */}
                <div className="mb-4">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">📊 Métricas que Importam</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {mockBusinessMetrics.map((metric, index) => {
                            const isPositive = metric.trend === "up" ? metric.change > 0 : metric.change < 0;

                            return (
                                <div
                                    key={index}
                                    className="p-4 bg-orange-50 rounded-lg border border-orange-200 hover:shadow-md transition-all"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUp size={18} className="text-orange-600" />
                                        <h4 className="text-xs font-medium text-slate-600">{metric.label}</h4>
                                    </div>

                                    <p className="text-2xl font-bold text-slate-800 mb-1">{metric.value}</p>

                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge
                                            className={`text-xs ${isPositive
                                                    ? "bg-orange-100 text-orange-700 border-orange-200"
                                                    : "bg-slate-100 text-slate-600 border-slate-200"
                                                }`}
                                        >
                                            {isPositive ? "↑" : "↓"} {Math.abs(metric.change)}%
                                        </Badge>
                                    </div>

                                    <p className="text-xs text-slate-600">{metric.insight}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Key Insights */}
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <h4 className="text-sm font-semibold text-orange-800 mb-2">💡 Insights Principais</h4>
                    <ul className="space-y-2 text-xs text-orange-700">
                        <li className="flex items-start gap-2">
                            <span className="text-orange-600 font-bold">•</span>
                            <span>
                                Sua taxa de conclusão (94.2%) está <strong>6.7% acima da média do setor</strong>. Continue assim!
                            </span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-orange-600 font-bold">•</span>
                            <span>
                                Tempo médio caiu 26% em 3 meses. <strong>IA está aprendendo</strong> com seus padrões.
                            </span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-orange-600 font-bold">•</span>
                            <span>
                                Adoção cresceu 18.7%. <strong>Equipe está engajada</strong> com a plataforma.
                            </span>
                        </li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
};
