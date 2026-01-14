"use client";

import React, { useState } from "react";
import { Brain, Filter, TrendingUp, AlertCircle, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DataFilter {
    field: string;
    operator: string;
    value: string;
}

interface Insight {
    id: string;
    type: 'trend' | 'correlation' | 'anomaly' | 'prediction';
    title: string;
    description: string;
    confidence: number;
}

export function DataMiningPanel() {
    const [filters, setFilters] = useState<DataFilter[]>([]);
    const [insights, setInsights] = useState<Insight[]>([
        {
            id: '1',
            type: 'trend',
            title: 'Tendência de Crescimento',
            description: 'Processos de "Contratos" cresceram 45% nos últimos 30 dias',
            confidence: 92
        },
        {
            id: '2',
            type: 'correlation',
            title: 'Correlação Identificada',
            description: 'Processos iniciados às segundas-feiras têm 23% mais chance de conclusão no prazo',
            confidence: 78
        },
        {
            id: '3',
            type: 'anomaly',
            title: 'Anomalia Detectada',
            description: 'Tempo médio de aprovação aumentou 150% na última semana',
            confidence: 85
        },
        {
            id: '4',
            type: 'prediction',
            title: 'Previsão',
            description: 'Estimativa de 1.450 processos para o próximo mês (+16%)',
            confidence: 88
        }
    ]);

    const [showFilters, setShowFilters] = useState(false);

    const addFilter = () => {
        setFilters([...filters, { field: 'categoria', operator: 'equals', value: '' }]);
    };

    const removeFilter = (index: number) => {
        setFilters(filters.filter((_, i) => i !== index));
    };

    const getInsightIcon = (type: string) => {
        switch (type) {
            case 'trend': return <TrendingUp size={16} className="text-blue-600" />;
            case 'correlation': return <Brain size={16} className="text-purple-600" />;
            case 'anomaly': return <AlertCircle size={16} className="text-orange-600" />;
            case 'prediction': return <Lightbulb size={16} className="text-green-600" />;
            default: return <Brain size={16} className="text-slate-600" />;
        }
    };

    const getInsightColor = (type: string) => {
        switch (type) {
            case 'trend': return 'bg-orange-50 border-orange-200';
            case 'correlation': return 'bg-orange-50 border-orange-200';
            case 'anomaly': return 'bg-orange-50 border-orange-200';
            case 'prediction': return 'bg-orange-50 border-orange-200';
            default: return 'bg-slate-50 border-slate-200';
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Brain size={20} className="text-purple-600" />
                    Data Mining & Insights
                </h3>
                <Button
                    onClick={() => setShowFilters(!showFilters)}
                    variant="outline"
                    className="gap-2"
                    size="sm"
                >
                    <Filter size={16} />
                    Filtros Avançados
                </Button>
            </div>

            {/* Filtros Avançados */}
            {showFilters && (
                <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <h4 className="font-semibold text-slate-800 mb-4">Filtros de Análise</h4>

                    <div className="space-y-3">
                        {filters.map((filter, index) => (
                            <div key={index} className="flex gap-2">
                                <select
                                    value={filter.field}
                                    onChange={(e) => {
                                        const newFilters = [...filters];
                                        newFilters[index].field = e.target.value;
                                        setFilters(newFilters);
                                    }}
                                    className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                >
                                    <option value="categoria">Categoria</option>
                                    <option value="status">Status</option>
                                    <option value="usuario">Usuário</option>
                                    <option value="data">Data</option>
                                </select>

                                <select
                                    value={filter.operator}
                                    onChange={(e) => {
                                        const newFilters = [...filters];
                                        newFilters[index].operator = e.target.value;
                                        setFilters(newFilters);
                                    }}
                                    className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                >
                                    <option value="equals">Igual a</option>
                                    <option value="contains">Contém</option>
                                    <option value="greater">Maior que</option>
                                    <option value="less">Menor que</option>
                                </select>

                                <Input
                                    value={filter.value}
                                    onChange={(e) => {
                                        const newFilters = [...filters];
                                        newFilters[index].value = e.target.value;
                                        setFilters(newFilters);
                                    }}
                                    placeholder="Valor"
                                    className="flex-1"
                                />

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeFilter(index)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    ×
                                </Button>
                            </div>
                        ))}

                        <Button onClick={addFilter} variant="outline" size="sm" className="w-full">
                            + Adicionar Filtro
                        </Button>
                    </div>
                </div>
            )}

            {/* Insights de IA */}
            <div className="space-y-4">
                <h4 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">
                    Insights Gerados por IA
                </h4>

                {insights.map(insight => (
                    <div key={insight.id} className={`p-4 rounded-xl border ${getInsightColor(insight.type)}`}>
                        <div className="flex items-start gap-3">
                            <div className="mt-1">
                                {getInsightIcon(insight.type)}
                            </div>
                            <div className="flex-1">
                                <h5 className="font-semibold text-slate-800 mb-1">{insight.title}</h5>
                                <p className="text-sm text-slate-600 mb-2">{insight.description}</p>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-white rounded-full h-2 overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-orange-500 to-orange-400"
                                            style={{ width: `${insight.confidence}%` }}
                                        />
                                    </div>
                                    <span className="text-xs font-semibold text-slate-600">
                                        {insight.confidence}% confiança
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Ações */}
            <div className="mt-6 pt-6 border-t border-slate-200">
                <div className="flex gap-3">
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white flex-1">
                        Gerar Novos Insights
                    </Button>
                    <Button variant="outline" className="flex-1">
                        Exportar Análise
                    </Button>
                </div>
            </div>
        </div>
    );
}
