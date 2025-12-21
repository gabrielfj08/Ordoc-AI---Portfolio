'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Sparkles, Bot, Zap, Bell, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import intelligenceService, { ProactiveAlert } from '@/services/intelligence';

import { AgendaWidget } from './agenda-widget';

interface AIStats {
    docsProcessed: number;
    approvalRate: number;
    pendingAlerts: number;
}

export const AIAssistant = () => {
    const [alerts, setAlerts] = useState<ProactiveAlert[]>([]);
    const [stats, setStats] = useState<AIStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Carregar alertas pendentes
            const pendingAlerts = await intelligenceService.getAlerts(undefined, 'pending');
            setAlerts(pendingAlerts.slice(0, 5)); // Top 5 alertas

            // TODO: Endpoint de stats quando disponível
            setStats({
                docsProcessed: pendingAlerts.length > 0 ? 124 : 0,
                approvalRate: 89,
                pendingAlerts: pendingAlerts.length
            });
        } catch (err) {
            console.error('Failed to load AI data:', err);
            // Fallback para dados mock se API indisponível
            setStats({ docsProcessed: 124, approvalRate: 89, pendingAlerts: 0 });
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptAlert = async (alert: ProactiveAlert) => {
        try {
            await intelligenceService.respondToAlert(alert.id, 'accepted');
            setAlerts(prev => prev.filter(a => a.id !== alert.id));
        } catch (err) {
            console.error('Failed to accept alert:', err);
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'bg-destructive';
            case 'error': return 'bg-red-500';
            case 'warning': return 'bg-amber-500';
            default: return 'bg-blue-500';
        }
    };

    const getSeverityLabel = (severity: string) => {
        switch (severity) {
            case 'critical': return 'Crítico';
            case 'error': return 'Urgente';
            case 'warning': return 'Atenção';
            default: return 'Info';
        }
    };

    return (
        <aside className="flex flex-col gap-4 h-full">

            {/* Assistente de IA */}
            <Card className="p-4 border-border/60 shadow-sm animate-in fade-in slide-in-from-right-4 duration-700 delay-300">
                <h2 className="text-base font-semibold text-foreground mb-1 flex items-center gap-2">
                    <Bot className="w-5 h-5 text-primary" />
                    OrdocAI Assistant
                    {loading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                </h2>
                <p className="text-sm text-muted-foreground mb-3">
                    IA analisou seus documentos e processos.
                </p>
                <div className="space-y-2 text-sm">
                    {/* Sugestões de automação */}
                    {alerts.length > 0 && (
                        <div className="rounded-xl bg-primary/5 px-3 py-2.5 border border-primary/10">
                            <p className="font-semibold text-primary mb-0.5 flex items-center gap-1.5">
                                <Sparkles className="w-4 h-4" /> Alertas pendentes
                            </p>
                            <p className="text-muted-foreground leading-relaxed text-sm">
                                {alerts.length} alerta{alerts.length > 1 ? 's' : ''} aguardando sua ação.
                            </p>
                            <button
                                onClick={() => window.location.href = '/dashboard/analytics'}
                                className="mt-2 text-xs font-medium text-primary hover:underline flex items-center gap-1"
                            >
                                Ver todos →
                            </button>
                        </div>
                    )}

                    {/* Estatísticas */}
                    <div className="rounded-xl bg-secondary px-3 py-2.5">
                        <p className="font-semibold text-foreground mb-0.5 text-sm">📊 Estatísticas da semana</p>
                        {loading ? (
                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Carregando...</span>
                            </div>
                        ) : stats ? (
                            <p className="text-muted-foreground text-sm leading-snug">
                                {stats.docsProcessed} docs processados • {stats.approvalRate}% aprovados de primeira
                            </p>
                        ) : (
                            <p className="text-muted-foreground text-sm">Sem dados disponíveis</p>
                        )}
                    </div>
                </div>
            </Card>

            {/* Ações rápidas geradas pela IA */}
            <Card className="p-4 border-border/60 shadow-sm animate-in fade-in slide-in-from-right-4 duration-700 delay-500">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500" /> Ações rápidas (IA)
                    </h2>
                    <span className="text-xs text-muted-foreground">
                        {loading ? 'Carregando...' : 'Atualizado agora'}
                    </span>
                </div>
                <ul className="space-y-2.5 text-sm text-muted-foreground">
                    {loading ? (
                        <li className="flex items-center gap-2 p-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Buscando ações...</span>
                        </li>
                    ) : alerts.length === 0 ? (
                        <li className="flex items-center gap-2 p-2 text-green-600">
                            <CheckCircle2 className="w-5 h-5" />
                            <span>Nenhuma ação pendente!</span>
                        </li>
                    ) : (
                        alerts.map((alert) => (
                            <li
                                key={alert.id}
                                className="flex items-start gap-3 group cursor-pointer hover:bg-secondary/50 p-2 rounded-md transition-colors"
                                onClick={() => handleAcceptAlert(alert)}
                            >
                                <span className={`mt-1.5 w-2 h-2 rounded-full ${getSeverityColor(alert.severity)} group-hover:scale-110 transition-transform`}></span>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors truncate text-sm">
                                        {alert.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate leading-snug">{alert.message}</p>
                                    <span className="text-[10px] uppercase tracking-wide text-muted-foreground mt-0.5 block">
                                        {getSeverityLabel(alert.severity)}
                                    </span>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </Card>

            {/* Docs Recentes Minimalista */}
            <Card className="p-4 border-border/60 shadow-sm animate-in fade-in slide-in-from-right-4 duration-700 delay-700">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-semibold text-foreground">Docs Recentes</h2>
                    <Button variant="link" className="h-auto p-0 text-xs font-medium">+ Upload</Button>
                </div>
                <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded bg-red-100 flex items-center justify-center text-[10px] font-bold text-red-600">PDF</div>
                        <span className="text-muted-foreground truncate max-w-[180px]">Contrato_2025.pdf</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">DOC</div>
                        <span className="text-muted-foreground truncate max-w-[180px]">Decreto_123.docx</span>
                    </li>
                </ul>
            </Card>

            {/* Agenda Inteligente com IA Insights */}
            <AgendaWidget />

        </aside>
    );
};
