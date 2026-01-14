"use client";

import React, { useState } from "react";
import { Calendar, Mail, FileText, Clock, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ScheduledReport {
    id: string;
    name: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    format: 'pdf' | 'excel' | 'csv';
    recipients: string[];
    metrics: string[];
    nextRun: string;
}

export function ReportScheduler() {
    const [reports, setReports] = useState<ScheduledReport[]>([
        {
            id: '1',
            name: 'Relatório Diário de Processos',
            frequency: 'daily',
            format: 'pdf',
            recipients: ['admin@ordoc.com'],
            metrics: ['Total de Processos', 'Taxa de Conclusão'],
            nextRun: '12/01/2026 08:00'
        }
    ]);

    const [showNewReport, setShowNewReport] = useState(false);
    const [newReport, setNewReport] = useState({
        name: '',
        frequency: 'weekly' as const,
        format: 'pdf' as const,
        recipients: '',
        metrics: [] as string[]
    });

    const availableMetrics = [
        'Total de Processos',
        'Taxa de Conclusão',
        'Tempo Médio',
        'Usuários Ativos',
        'SLA Compliance',
        'Processos por Categoria'
    ];

    const handleCreateReport = () => {
        const report: ScheduledReport = {
            id: Date.now().toString(),
            name: newReport.name,
            frequency: newReport.frequency,
            format: newReport.format,
            recipients: newReport.recipients.split(',').map(e => e.trim()),
            metrics: newReport.metrics,
            nextRun: new Date(Date.now() + 86400000).toLocaleString('pt-BR')
        };

        setReports([...reports, report]);
        setShowNewReport(false);
        setNewReport({
            name: '',
            frequency: 'weekly',
            format: 'pdf',
            recipients: '',
            metrics: []
        });
    };

    const handleDeleteReport = (id: string) => {
        setReports(reports.filter(r => r.id !== id));
    };

    const toggleMetric = (metric: string) => {
        if (newReport.metrics.includes(metric)) {
            setNewReport({
                ...newReport,
                metrics: newReport.metrics.filter(m => m !== metric)
            });
        } else {
            setNewReport({
                ...newReport,
                metrics: [...newReport.metrics, metric]
            });
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Calendar size={20} className="text-orange-600" />
                    Relatórios Agendados
                </h3>
                <Button
                    onClick={() => setShowNewReport(!showNewReport)}
                    className="bg-orange-600 hover:bg-orange-700 text-white gap-2"
                    size="sm"
                >
                    <Plus size={16} />
                    Novo Relatório
                </Button>
            </div>

            {/* Formulário de Novo Relatório */}
            {showNewReport && (
                <div className="mb-6 p-4 bg-orange-50 rounded-xl border border-orange-200">
                    <h4 className="font-semibold text-slate-800 mb-4">Criar Novo Relatório</h4>

                    <div className="space-y-4">
                        <div>
                            <Label className="text-sm font-semibold text-slate-700 mb-2 block">Nome do Relatório</Label>
                            <Input
                                value={newReport.name}
                                onChange={(e) => setNewReport({ ...newReport, name: e.target.value })}
                                placeholder="Ex: Relatório Semanal de Performance"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-sm font-semibold text-slate-700 mb-2 block">Frequência</Label>
                                <select
                                    value={newReport.frequency}
                                    onChange={(e) => setNewReport({ ...newReport, frequency: e.target.value as any })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                >
                                    <option value="daily">Diário</option>
                                    <option value="weekly">Semanal</option>
                                    <option value="monthly">Mensal</option>
                                </select>
                            </div>

                            <div>
                                <Label className="text-sm font-semibold text-slate-700 mb-2 block">Formato</Label>
                                <select
                                    value={newReport.format}
                                    onChange={(e) => setNewReport({ ...newReport, format: e.target.value as any })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                >
                                    <option value="pdf">PDF</option>
                                    <option value="excel">Excel</option>
                                    <option value="csv">CSV</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <Label className="text-sm font-semibold text-slate-700 mb-2 block">Destinatários (separados por vírgula)</Label>
                            <Input
                                value={newReport.recipients}
                                onChange={(e) => setNewReport({ ...newReport, recipients: e.target.value })}
                                placeholder="email1@example.com, email2@example.com"
                            />
                        </div>

                        <div>
                            <Label className="text-sm font-semibold text-slate-700 mb-2 block">Métricas</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {availableMetrics.map(metric => (
                                    <button
                                        key={metric}
                                        onClick={() => toggleMetric(metric)}
                                        className={`p-2 rounded-lg text-sm font-medium transition-all ${newReport.metrics.includes(metric)
                                            ? 'bg-orange-600 text-white'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                    >
                                        {metric}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button onClick={handleCreateReport} className="bg-orange-600 hover:bg-orange-700 text-white">
                                Criar Relatório
                            </Button>
                            <Button variant="outline" onClick={() => setShowNewReport(false)}>
                                Cancelar
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Lista de Relatórios */}
            <div className="space-y-3">
                {reports.map(report => (
                    <div key={report.id} className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h4 className="font-semibold text-slate-800 mb-2">{report.name}</h4>
                                <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                                    <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-md">
                                        <Clock size={12} />
                                        {report.frequency === 'daily' && 'Diário'}
                                        {report.frequency === 'weekly' && 'Semanal'}
                                        {report.frequency === 'monthly' && 'Mensal'}
                                    </span>
                                    <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-md">
                                        <FileText size={12} />
                                        {report.format.toUpperCase()}
                                    </span>
                                    <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-md">
                                        <Mail size={12} />
                                        {report.recipients.length} destinatário(s)
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 mt-2">
                                    Próxima execução: {report.nextRun}
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteReport(report.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                                <Trash2 size={16} />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
