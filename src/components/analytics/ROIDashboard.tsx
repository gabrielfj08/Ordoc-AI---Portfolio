"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign } from "lucide-react";

interface ROIMetric {
    label: string;
    value: string;
    money: string;
    detail: string;
}

// Mock data - será substituído por dados reais da API
const mockROIData: ROIMetric[] = [
    {
        label: "Horas Economizadas",
        value: "347 horas",
        money: "R$ 52.050",
        detail: "IA processou 1.247 documentos automaticamente. Sem Ordoc: 415h. Com Ordoc: 68h. Economia: 347h × R$ 150/h",
    },
    {
        label: "Multas SLA Evitadas",
        value: "8 processos",
        money: "R$ 15.000",
        detail: "IA detectou 8 processos em risco crítico, notificou responsáveis proativamente. 100% concluídos no prazo.",
    },
    {
        label: "Automação de NDAs",
        value: "234 contratos",
        money: "R$ 23.400",
        detail: "NDAs simples processados automaticamente. Tempo médio: 2h → 15min. Economia: 234 × 1.75h × R$ 100/h",
    },
];

const totalROI = {
    value: "R$ 90.450",
    cost: "R$ 3.000",
    roi: "2.915%",
};

export const ROIDashboard: React.FC = () => {
    return (
        <Card className="border-none shadow-sm bg-white">
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-orange-600 rounded-lg">
                            <DollarSign className="text-white" size={24} />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-bold text-slate-800">
                                💰 Quanto Ordoc Economizou para Você
                            </CardTitle>
                            <p className="text-sm text-slate-600 mt-1">
                                Valor real gerado este mês
                            </p>
                        </div>
                    </div>

                    <div className="text-right">
                        <p className="text-xs text-slate-500">ROI Total</p>
                        <p className="text-2xl font-bold text-orange-600">{totalROI.value}</p>
                        <p className="text-xs text-orange-700 font-semibold">{totalROI.roi} de retorno</p>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                {/* ROI Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {mockROIData.map((metric, index) => {
                        return (
                            <div
                                key={index}
                                className="p-4 bg-orange-50 rounded-lg border border-orange-200 hover:shadow-md transition-all"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp size={20} className="text-orange-600" />
                                        <h4 className="font-semibold text-slate-800 text-sm">{metric.label}</h4>
                                    </div>
                                </div>

                                <div className="mb-2">
                                    <p className="text-xl font-bold text-slate-800">{metric.value}</p>
                                    <p className="text-2xl font-bold text-orange-600 mt-1">{metric.money}</p>
                                </div>

                                <p className="text-xs text-slate-600 leading-relaxed">{metric.detail}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Total ROI Summary */}
                <div className="p-6 bg-gradient-to-r from-orange-600 to-orange-500 rounded-lg text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-bold mb-1">💎 ROI Total Este Mês</h3>
                            <p className="text-sm text-orange-100">Valor gerado vs investimento</p>
                        </div>
                        <DollarSign size={32} className="text-orange-200" />
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        <div>
                            <p className="text-xs text-orange-200 mb-1">Valor Gerado</p>
                            <p className="text-2xl font-bold">{totalROI.value}</p>
                        </div>
                        <div>
                            <p className="text-xs text-orange-200 mb-1">Custo Ordoc</p>
                            <p className="text-2xl font-bold">{totalROI.cost}</p>
                        </div>
                        <div>
                            <p className="text-xs text-orange-200 mb-1">Retorno</p>
                            <p className="text-2xl font-bold">{totalROI.roi}</p>
                        </div>
                    </div>
                </div>

                {/* Insights Acionáveis */}
                <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-start gap-3">
                        <TrendingUp size={20} className="text-orange-600 mt-0.5" />
                        <div className="flex-1">
                            <h4 className="text-sm font-semibold text-orange-800 mb-2">
                                💡 Oportunidades de Otimização
                            </h4>
                            <ul className="space-y-2 text-xs text-orange-700">
                                <li className="flex items-start gap-2">
                                    <TrendingUp size={14} className="mt-0.5 shrink-0" />
                                    <span>
                                        <strong>Automatizar mais 120 contratos padrão:</strong> Economia potencial de R$ 18.000/mês
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <TrendingUp size={14} className="mt-0.5 shrink-0" />
                                    <span>
                                        <strong>Treinar IA com seus templates:</strong> Reduzir tempo médio de 4.2h para 2.5h
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <TrendingUp size={14} className="mt-0.5 shrink-0" />
                                    <span>
                                        <strong>Ativar alertas proativos de SLA:</strong> Evitar até R$ 30.000 em multas/mês
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-4 text-center">
                    <button className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors text-sm">
                        📊 Ver Análise Completa de ROI
                    </button>
                </div>
            </CardContent>
        </Card>
    );
};
