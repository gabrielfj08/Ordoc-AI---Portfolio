'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import dashboardService, { DaySummary, ProcessStatus } from '@/services/dashboard';

export const DaySummaryWidget = () => {
    const [dateLabel, setDateLabel] = useState('');
    const [summary, setSummary] = useState<DaySummary | null>(null);
    const [processStatus, setProcessStatus] = useState<ProcessStatus | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Formatar data
        const hoje = new Date();
        const formatador = new Intl.DateTimeFormat('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        });
        setDateLabel(formatador.format(hoje));

        // Carregar dados
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [summaryData, statusData] = await Promise.all([
                dashboardService.getDaySummary(),
                dashboardService.getProcessStatus(),
            ]);
            setSummary(summaryData);
            setProcessStatus(statusData);
        } catch (error) {
            console.error('Failed to load day summary:', error);
        } finally {
            setLoading(false);
        }
    };

    // Mapear carga para label
    const getLoadLabel = (load: string) => {
        const labels: Record<string, string> = {
            leve: 'Carga: leve',
            moderada: 'Carga: moderada',
            alta: 'Carga: alta',
            crítica: 'Carga: crítica',
        };
        return labels[load] || 'Carga: moderada';
    };

    // Mapear carga para cor do gradient
    const getLoadGradient = (load: string) => {
        const gradients: Record<string, string> = {
            leve: 'from-emerald-500 to-emerald-600',
            moderada: 'from-orange-500 to-orange-600',
            alta: 'from-amber-500 to-amber-600',
            crítica: 'from-red-500 to-red-600',
        };
        return gradients[load] || 'from-orange-500 to-orange-600';
    };

    if (loading) {
        return (
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="lg:col-span-2 p-6 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <span className="ml-3 text-muted-foreground">Carregando resumo do dia...</span>
                </div>
                <div className="rounded-2xl border bg-card p-6">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            </section>
        );
    }

    return (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Welcome Card */}
            <div className="lg:col-span-2 p-2 flex flex-col justify-center">

                {/* Header Content */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2 font-semibold">Resumo do dia</p>
                        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 tracking-tight">
                            {summary?.greeting || 'Boa tarde, Usuário'}
                        </h1>
                        <p className="text-base text-muted-foreground leading-relaxed">
                            Você tem <span className="font-semibold text-orange-600">
                                {summary?.documentsAwaitingSignature || 0} documento{summary?.documentsAwaitingSignature !== 1 ? 's' : ''} aguardando assinatura
                            </span> e{' '}
                            <span className="font-semibold text-foreground">
                                {summary?.pendingApprovals || 0} aprovação{summary?.pendingApprovals !== 1 ? 'ões' : ''} pendente{summary?.pendingApprovals !== 1 ? 's' : ''}
                            </span>.
                        </p>
                    </div>

                    <div className="hidden sm:block text-right">
                        <p className="text-base font-medium capitalize text-foreground">{dateLabel}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            {summary?.criticalDeadlines ? (
                                <>Prazos críticos: {summary.criticalDeadlines} documento{summary.criticalDeadlines > 1 ? 's' : ''} vence{summary.criticalDeadlines > 1 ? 'm' : ''} hoje</>
                            ) : (
                                <>Nenhum prazo crítico hoje</>
                            )}
                        </p>
                    </div>
                </div>

                {/* Organization Tag */}
                <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 self-start">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Organização</span>
                    <span className="h-4 w-px bg-border mx-1"></span>
                    <span className="text-sm font-medium text-foreground">
                        Operando em {summary?.organization.name || 'Organização'} • {summary?.organization.department || 'Departamento'}
                    </span>
                </div>

            </div>

            {/* Stats Card - Dynamic Color Based on Load */}
            <div className={`rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col justify-between bg-gradient-to-br ${processStatus ? getLoadGradient(processStatus.load) : 'from-orange-500 to-orange-600'} text-white animate-in fade-in slide-in-from-bottom-5 duration-700 relative overflow-hidden group min-h-[200px]`}>

                {/* Background Pattern */}
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

                <div>
                    <p className="text-xs uppercase tracking-widest text-white/80 font-bold">Estado dos Processos</p>
                    <div className="mt-2 text-2xl font-bold tracking-tight">
                        {processStatus ? getLoadLabel(processStatus.load) : 'Carregando...'}
                    </div>
                </div>

                <div className="mt-6 flex items-start justify-between">
                    <div className="flex flex-col">
                        <span className="text-white/80 text-sm font-medium mb-1">Urgente</span>
                        <span className="font-bold text-3xl">{processStatus?.urgent || 0}</span>
                    </div>
                    <div className="flex flex-col border-l border-white/20 pl-6">
                        <span className="text-white/80 text-sm font-medium mb-1">Normal</span>
                        <span className="font-bold text-3xl">{processStatus?.normal || 0}</span>
                    </div>
                    <div className="flex flex-col border-l border-white/20 pl-6">
                        <span className="text-white/80 text-sm font-medium mb-1">Concluídas</span>
                        <span className="font-bold text-3xl">{processStatus?.completed || 0}</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

