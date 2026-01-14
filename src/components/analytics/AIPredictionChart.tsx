"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, AlertTriangle, Info } from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
    Area,
    ComposedChart,
} from "recharts";

interface PredictionDataPoint {
    date: string;
    historical?: number;
    optimistic?: number;
    realistic: number;
    pessimistic?: number;
    confidence: number;
}

interface AIPredictionChartProps {
    data?: PredictionDataPoint[];
    title?: string;
    description?: string;
}

// Mock data - será substituído por dados reais da API
const defaultMockData: PredictionDataPoint[] = [
    // Dados históricos (últimos 30 dias)
    { date: "15/12", historical: 45, realistic: 45, confidence: 100 },
    { date: "20/12", historical: 52, realistic: 52, confidence: 100 },
    { date: "25/12", historical: 38, realistic: 38, confidence: 100 },
    { date: "30/12", historical: 48, realistic: 48, confidence: 100 },
    { date: "05/01", historical: 61, realistic: 61, confidence: 100 },
    { date: "10/01", historical: 55, realistic: 55, confidence: 100 },
    { date: "12/01", historical: 67, realistic: 67, confidence: 100 },

    // Previsões (próximos 90 dias)
    { date: "20/01", optimistic: 78, realistic: 72, pessimistic: 65, confidence: 95 },
    { date: "01/02", optimistic: 85, realistic: 75, pessimistic: 68, confidence: 90 },
    { date: "15/02", optimistic: 92, realistic: 80, pessimistic: 72, confidence: 85 },
    { date: "01/03", optimistic: 88, realistic: 78, pessimistic: 70, confidence: 80 },
    { date: "15/03", optimistic: 95, realistic: 82, pessimistic: 75, confidence: 75 },
    { date: "01/04", optimistic: 102, realistic: 88, pessimistic: 78, confidence: 70 },
    { date: "12/04", optimistic: 108, realistic: 92, pessimistic: 82, confidence: 65 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white p-4 rounded-lg shadow-lg border border-slate-200">
                <p className="font-semibold text-slate-800 mb-2">{label}</p>
                {data.historical !== undefined && (
                    <p className="text-sm text-slate-600">
                        <span className="font-medium">Histórico:</span> {data.historical} docs
                    </p>
                )}
                {data.optimistic !== undefined && (
                    <>
                        <p className="text-sm text-green-600">
                            <span className="font-medium">Otimista:</span> {data.optimistic} docs
                        </p>
                        <p className="text-sm text-blue-600">
                            <span className="font-medium">Realista:</span> {data.realistic} docs
                        </p>
                        <p className="text-sm text-orange-600">
                            <span className="font-medium">Pessimista:</span> {data.pessimistic} docs
                        </p>
                        <p className="text-sm text-purple-600 mt-1">
                            <span className="font-medium">Confiança:</span> {data.confidence}%
                        </p>
                    </>
                )}
            </div>
        );
    }
    return null;
};

export const AIPredictionChart: React.FC<AIPredictionChartProps> = ({
    data = defaultMockData,
    title = "Previsão de Volume - Próximos 90 Dias",
    description = "Projeção multivariada com cenários otimista, realista e pessimista",
}) => {
    // Separar dados históricos e previsões
    const historicalData = data.filter((d) => d.historical !== undefined);
    const predictionData = data.filter((d) => d.optimistic !== undefined);

    // Calcular média de confiança das previsões
    const avgConfidence = predictionData.length > 0
        ? Math.round(predictionData.reduce((sum, d) => sum + d.confidence, 0) / predictionData.length)
        : 0;

    return (
        <Card className="border-none shadow-sm bg-white">
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <TrendingUp className="text-purple-600" size={24} />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-bold text-slate-800">
                                {title}
                            </CardTitle>
                            <p className="text-sm text-slate-500 mt-1">{description}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-lg">
                        <Info size={14} className="text-purple-600" />
                        <span className="text-xs font-semibold text-purple-600">
                            Confiança Média: {avgConfidence}%
                        </span>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                {/* Legenda */}
                <div className="flex flex-wrap items-center gap-4 mb-4 p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                        <span className="text-xs font-medium text-slate-600">Histórico</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-xs font-medium text-slate-600">Cenário Otimista</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-xs font-medium text-slate-600">Cenário Realista</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span className="text-xs font-medium text-slate-600">Cenário Pessimista</span>
                    </div>
                </div>

                {/* Gráfico */}
                <ResponsiveContainer width="100%" height={400}>
                    <ComposedChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis
                            dataKey="date"
                            stroke="#64748b"
                            style={{ fontSize: "12px" }}
                        />
                        <YAxis
                            stroke="#64748b"
                            style={{ fontSize: "12px" }}
                            label={{ value: "Documentos", angle: -90, position: "insideLeft", style: { fontSize: "12px" } }}
                        />
                        <Tooltip content={<CustomTooltip />} />

                        {/* Linha de separação entre histórico e previsão */}
                        <ReferenceLine
                            x={historicalData[historicalData.length - 1]?.date}
                            stroke="#94a3b8"
                            strokeDasharray="5 5"
                            label={{ value: "Hoje", position: "top", fill: "#64748b", fontSize: 12 }}
                        />

                        {/* Área de confiança (entre otimista e pessimista) */}
                        <Area
                            type="monotone"
                            dataKey="optimistic"
                            stroke="none"
                            fill="#10b981"
                            fillOpacity={0.1}
                        />
                        <Area
                            type="monotone"
                            dataKey="pessimistic"
                            stroke="none"
                            fill="#f97316"
                            fillOpacity={0.1}
                        />

                        {/* Linhas de dados */}
                        <Line
                            type="monotone"
                            dataKey="historical"
                            stroke="#94a3b8"
                            strokeWidth={3}
                            dot={{ fill: "#94a3b8", r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="optimistic"
                            stroke="#10b981"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={{ fill: "#10b981", r: 3 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="realistic"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={{ fill: "#3b82f6", r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="pessimistic"
                            stroke="#f97316"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={{ fill: "#f97316", r: 3 }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>

                {/* Insights da IA */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp size={16} className="text-green-600" />
                            <h4 className="text-sm font-semibold text-green-800">Cenário Otimista</h4>
                        </div>
                        <p className="text-xs text-green-700">
                            Crescimento de <span className="font-bold">+37%</span> baseado em tendência positiva e sazonalidade favorável
                        </p>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-2 mb-2">
                            <Info size={16} className="text-blue-600" />
                            <h4 className="text-sm font-semibold text-blue-800">Cenário Realista</h4>
                        </div>
                        <p className="text-xs text-blue-700">
                            Crescimento de <span className="font-bold">+27%</span> considerando padrões históricos e variações normais
                        </p>
                    </div>

                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle size={16} className="text-orange-600" />
                            <h4 className="text-sm font-semibold text-orange-800">Cenário Pessimista</h4>
                        </div>
                        <p className="text-xs text-orange-700">
                            Crescimento de <span className="font-bold">+18%</span> em caso de redução de demanda ou eventos adversos
                        </p>
                    </div>
                </div>

                {/* Fatores de Influência */}
                <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <h4 className="text-sm font-semibold text-purple-800 mb-2">Fatores de Influência Detectados</h4>
                    <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-white rounded text-xs font-medium text-purple-700 border border-purple-200">
                            📈 Tendência de Crescimento
                        </span>
                        <span className="px-2 py-1 bg-white rounded text-xs font-medium text-purple-700 border border-purple-200">
                            📅 Sazonalidade: Fim de Trimestre
                        </span>
                        <span className="px-2 py-1 bg-white rounded text-xs font-medium text-purple-700 border border-purple-200">
                            🎯 Evento: Período Eleitoral
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
