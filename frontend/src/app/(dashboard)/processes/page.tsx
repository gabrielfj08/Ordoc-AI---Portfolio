"use client";

import { MainContainer } from "@/components/layout/MainContainer";
import { ProcessTimeline } from "@/components/processes/ProcessTimeline";
import { RuleConfigPanel } from "@/components/processes/RuleConfigPanel";
import { ProcessAuditLog } from "@/components/processes/ProcessAuditLog";
import { SLATimer } from "@/components/processes/SLATimer";
import { ProcessDetail } from "@/components/processes/ProcessDetail";
import { ProcessFilters } from "@/components/processes/ProcessFilters";
import * as React from "react";
import {
    GitMerge,
    ListChecks,
    Settings2,
    Plus,
    Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProcessesPage() {
    const [view, setView] = React.useState<'monitor' | 'config' | 'detail'>('monitor');

    return (
        <MainContainer>
            <div className="space-y-8 animate-in fade-in duration-500">
                {/* Cabeçalho Estratégico (Ocultar no Detalhe para foco) */}
                {view !== 'detail' && (
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                                <GitMerge className="text-orange-600" size={24} />
                                Orquestração de Processos
                            </h1>
                            <p className="text-slate-500 text-sm">Monitore a esteira de conformidade e fluxos automatizados de documentos.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant={view === 'config' ? 'default' : 'outline'}
                                className={`rounded-full gap-2 transition-all ${view === 'config' ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-md' : 'text-slate-600 border-slate-200'}`}
                                onClick={() => setView(view === 'monitor' ? 'config' : 'monitor')}
                            >
                                <Settings2 size={16} />
                                {view === 'monitor' ? 'Configurar Regras' : 'Voltar para Esteira'}
                            </Button>
                            <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-6 gap-2 shadow-lg">
                                <Plus size={18} />
                                Novo Fluxo
                            </Button>
                        </div>
                    </header>
                )}

                {/* Renderização Condicional */}
                {view === 'monitor' ? (
                    <>
                        {/* Resumo de Status da Esteira */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatusMiniCard label="Em Execução" value="14" color="text-blue-600" bg="bg-blue-50" />
                            <StatusMiniCard label="Aguardando Intervenção" value="3" color="text-orange-600" bg="bg-orange-50" />
                            <div className="bg-white rounded-2xl p-4 border border-white/50 flex flex-col justify-center gap-2 shadow-sm">
                                <span className="text-xs font-bold uppercase tracking-tight text-slate-500">SLA Crítico (Exemplo)</span>
                                <SLATimer limitHours={48} currentHours={46} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* A Esteira de Processos (Workflow) */}
                            <section className="lg:col-span-2 space-y-6">
                                <ProcessFilters />

                                <div className="flex items-center justify-between px-2 pt-2">
                                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <ListChecks size={16} />
                                        Procedimentos Ativos
                                    </h2>
                                </div>
                                <ProcessTimeline onDetail={() => setView('detail')} />
                            </section>

                            {/* Log de Auditoria e SLA */}
                            <aside className="space-y-6">
                                <div className="flex items-center justify-between px-2">
                                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Activity size={16} />
                                        Auditoria em Tempo Real
                                    </h2>
                                </div>
                                <ProcessAuditLog />
                            </aside>
                        </div>
                    </>
                ) : view === 'config' ? (
                    <RuleConfigPanel />
                ) : (
                    <ProcessDetail onBack={() => setView('monitor')} />
                )}
            </div>
        </MainContainer>
    );
}

const StatusMiniCard = ({ label, value, color, bg }: any) => (
    <div className={`${bg} rounded-2xl p-4 border border-white/50 flex items-center justify-between`}>
        <span className={`text-xs font-bold uppercase tracking-tight ${color}`}>{label}</span>
        <span className={`text-2xl font-black ${color}`}>{value}</span>
    </div>
);