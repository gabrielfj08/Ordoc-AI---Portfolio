'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';

export const DaySummaryWidget = () => {
    const [dateLabel, setDateLabel] = useState('');

    useEffect(() => {
        const hoje = new Date();
        const formatador = new Intl.DateTimeFormat('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        });
        // Ex: Sexta-feira, 20 de Dezembro
        setDateLabel(formatador.format(hoje));
    }, []);

    return (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Welcome Card */}
            <div className="col-span-2 p-1 flex flex-col justify-center">

                {/* Header Content */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2 font-semibold">Resumo do dia</p>
                        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 tracking-tight">Boa tarde, Ricardo</h1>
                        <p className="text-base text-muted-foreground">
                            Você tem <span className="font-semibold text-orange-600 dark:text-orange-400">12 documentos aguardando assinatura</span> e{' '}
                            <span className="font-semibold text-foreground">5 aprovações pendentes</span>.
                        </p>
                    </div>

                    <div className="hidden sm:block text-right">
                        <p className="text-sm font-medium capitalize text-foreground">{dateLabel}</p>
                        <p className="text-xs text-muted-foreground mt-1">Prazos críticos: 3 documentos vencem hoje</p>
                    </div>
                </div>

                {/* Organization Tag - Moved Here */}
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/50 self-start">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground font-semibold">Organização</span>
                    <span className="h-3 w-px bg-border mx-1"></span>
                    <span className="text-xs font-medium text-foreground">Operando em Prefeitura de Curitiba • Sec. Jurídica</span>
                </div>

            </div>

            {/* Stats Card - Orange Gradient */}
            <div className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col justify-between bg-gradient-to-br from-orange-500 to-orange-600 text-white animate-in fade-in slide-in-from-bottom-5 duration-700 relative overflow-hidden group">

                {/* Background Pattern */}
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

                <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-orange-100 font-bold mix-blend-plus-lighter">Estado dos Processos</p>
                    <div className="mt-2 text-2xl font-bold tracking-tight">Carga: moderada</div>
                </div>

                <div className="mt-6 flex items-start justify-between">
                    <div className="flex flex-col">
                        <span className="text-orange-100/80 text-xs font-medium mb-0.5">Urgente</span>
                        <span className="font-bold text-2xl">8</span>
                    </div>
                    <div className="flex flex-col border-l border-white/20 pl-4">
                        <span className="text-orange-100/80 text-xs font-medium mb-0.5">Normal</span>
                        <span className="font-bold text-2xl">24</span>
                    </div>
                    <div className="flex flex-col border-l border-white/20 pl-4">
                        <span className="text-orange-100/80 text-xs font-medium mb-0.5">Concluídas</span>
                        <span className="font-bold text-2xl">156</span>
                    </div>
                </div>
            </div>
        </section>
    );
};
