'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, FileCheck, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const PriorityList = () => {
    const [activeTab, setActiveTab] = useState<'urgente' | 'assinaturas' | 'aprovacoes'>('urgente');

    return (
        <Card className="overflow-hidden shadow-sm border-border animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                <div>
                    <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        Tarefas que precisam de você hoje
                        <Badge variant="secondary" className="text-[10px] font-semibold px-2 py-0.5">
                            IA priorizou 17 tarefas
                        </Badge>
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                        Ordenadas por prazo e impacto no processo.
                    </p>
                </div>
            </div>
            <div className="border-t border-border/50"></div>

            {/* Tabs */}
            <div className="px-4 pt-3 flex gap-2 text-xs font-medium">
                {[
                    { id: 'urgente', label: 'Urgente' },
                    { id: 'assinaturas', label: 'Assinaturas' },
                    { id: 'aprovacoes', label: 'Aprovações' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-3 py-1.5 rounded-full transition-all duration-200 ${activeTab === tab.id
                                ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Lista de tarefas */}
            <div className="p-2 sm:p-3 space-y-2 max-h-[360px] overflow-y-auto scrollbar-thin">

                {activeTab === 'urgente' && (
                    <div className="space-y-2 animate-in fade-in zoom-in-95 duration-300">
                        {/* Task 1 */}
                        <article className="group bg-card hover:bg-accent/50 cursor-pointer border border-border hover:border-primary/30 rounded-xl p-3 flex gap-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                            <div className="mt-0.5">
                                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-destructive/10 text-destructive text-xs font-semibold">
                                    <AlertTriangle className="h-4 w-4" />
                                </span>
                            </div>
                            <div className="flex-1 flex flex-col gap-1">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Contrato de Prestação de Serviços TI</span>
                                        <span className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">Vence em 2 horas</span>
                                    </div>
                                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-mono">
                                        #1234
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Aguardando <span className="font-medium text-foreground">sua assinatura digital</span> + assinatura do fornecedor.
                                    Valor: <span className="font-medium">R$ 850.000</span>
                                </p>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <Button size="sm" className="h-6 text-[10px] rounded-full px-2.5">Assinar agora</Button>
                                    <Button variant="outline" size="sm" className="h-6 text-[10px] rounded-full px-2.5">Ver documento</Button>
                                </div>
                            </div>
                        </article>

                        {/* Task 2 */}
                        <article className="group bg-card hover:bg-accent/50 cursor-pointer border border-border hover:border-primary/30 rounded-xl p-3 flex gap-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                            <div className="mt-0.5">
                                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 text-xs font-semibold">
                                    <Clock className="h-4 w-4" />
                                </span>
                            </div>
                            <div className="flex-1 flex flex-col gap-1">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Decreto Municipal - Regularização Fiscal</span>
                                        <span className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">Vence em 4 horas</span>
                                    </div>
                                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-mono">
                                        #1156
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Aguardando <span className="font-medium text-foreground">aprovação do Secretário</span> antes de publicação.
                                </p>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <Button size="sm" className="h-6 text-[10px] rounded-full px-2.5">Aprovar</Button>
                                    <Button variant="outline" size="sm" className="h-6 text-[10px] rounded-full px-2.5">Ver histórico</Button>
                                </div>
                            </div>
                        </article>
                    </div>
                )}

                {activeTab === 'assinaturas' && (
                    <div className="space-y-2 animate-in fade-in zoom-in-95 duration-300">
                        <article className="group bg-card hover:bg-blue-50/50 dark:hover:bg-blue-900/20 cursor-pointer border border-blue-100 dark:border-blue-800 hover:border-blue-300 rounded-xl p-3 flex gap-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                            <div className="mt-0.5">
                                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs font-semibold">
                                    <FileCheck className="h-4 w-4" />
                                </span>
                            </div>
                            <div className="flex-1 flex flex-col gap-1">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-foreground">Termo Aditivo - Prorrogação de Contrato</span>
                                        <span className="text-[11px] uppercase tracking-[0.15em] text-blue-500">Aguardando assinatura</span>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    <span className="font-medium text-foreground">Certificado A1 detectado</span> - pronto para assinar.
                                </p>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <Button size="sm" className="h-6 text-[10px] rounded-full px-2.5 bg-blue-600 hover:bg-blue-700 text-white">Assinar com e-CNPJ</Button>
                                </div>
                            </div>
                        </article>
                    </div>
                )}

                {activeTab === 'aprovacoes' && (
                    <div className="space-y-2 animate-in fade-in zoom-in-95 duration-300">
                        <div className="text-center py-8 text-muted-foreground text-sm">
                            Nenhuma aprovação pendente no momento.
                        </div>
                    </div>
                )}

            </div>
        </Card>
    );
};
