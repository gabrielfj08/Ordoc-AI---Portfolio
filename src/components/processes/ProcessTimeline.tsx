"use client";

import { CheckCircle2, Clock, AlertCircle, ArrowRight, Zap, ShieldCheck, User, MessageCircle, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Milestone {
    label: string;
    status: 'completed' | 'current' | 'pending' | 'error';
}

interface ProcessItem {
    id: string;
    title: string;
    category: string;
    progress: number;
    milestones: Milestone[];
    aiInsight?: string;
    priority: 'Alta' | 'Média' | 'Baixa';
    assignee: { name: string; initials: string; color: string };
}

interface ProcessTimelineProps {
    onDetail?: (processId: string) => void;
}

export const ProcessTimeline = ({ onDetail }: ProcessTimelineProps) => {
    const processes: ProcessItem[] = [
        {
            id: "p1",
            title: "Contrato de Fornecimento Internacional - Adsum",
            category: "Setor Compras",
            progress: 60,
            milestones: [
                { label: "Triagem IA", status: 'completed' },
                { label: "Revisão Compliance", status: 'completed' },
                { label: "Coleta de Assinaturas", status: 'current' },
                { label: "Selagem ECR", status: 'pending' }
            ],
            aiInsight: "Aguardando assinatura do Diretor Financeiro há 2 dias.",
            priority: 'Alta',
            assignee: { name: "Carlos Fin.", initials: "CF", color: "bg-blue-600" }
        },
        {
            id: "p2",
            title: "Licitação Pública #042/2026 - Prefeitura",
            category: "Setor Público / Jurídico",
            progress: 25,
            milestones: [
                { label: "Análise Edital", status: 'completed' },
                { label: "Validação de Certidões", status: 'error' },
                { label: "Protocolo", status: 'pending' }
            ],
            aiInsight: "Certidão Negativa de Débitos expirada. Necessário upload de nova via.",
            priority: 'Média',
            assignee: { name: "Ana Jur.", initials: "AJ", color: "bg-purple-600" }
        }
    ];

    return (
        <div className="space-y-6">
            {processes.map((process) => (
                <div key={process.id} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex flex-col lg:flex-row gap-6">

                        {/* Esquerda: Info e Categoria */}
                        <div className="w-full lg:w-1/4 space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded-full">
                                    {process.category}
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${process.priority === 'Alta' ? 'bg-red-100 text-red-600' :
                                    process.priority === 'Média' ? 'bg-orange-100 text-orange-600' :
                                        'bg-blue-100 text-blue-600'
                                    }`}>
                                    {process.priority}
                                </span>
                            </div>

                            <h3 className="text-sm font-bold text-slate-800 group-hover:text-orange-600 transition-colors">
                                {process.title}
                            </h3>

                            <div className="flex items-center gap-3 pt-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm ring-2 ring-white ${process.assignee.color}`} title={process.assignee.name}>
                                    {process.assignee.initials}
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Responsável</p>
                                    <p className="text-xs font-bold text-slate-700">{process.assignee.name}</p>
                                </div>
                            </div>
                        </div>

                        {/* Centro: A Esteira de Milestones */}
                        <div className="flex-1">
                            <div className="relative flex justify-between items-start pt-4">
                                {/* Linha de fundo conectora */}
                                <div className="absolute top-3 left-0 w-full h-0.5 bg-slate-100 -z-0" />

                                {process.milestones.map((m, idx) => (
                                    <div key={idx} className="relative z-10 flex flex-col items-center gap-2 group/step">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${m.status === 'completed' ? 'bg-green-500 border-green-500 text-white' :
                                            m.status === 'current' ? 'bg-white border-orange-500 text-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.3)] animate-pulse' :
                                                m.status === 'error' ? 'bg-red-500 border-red-500 text-white' :
                                                    'bg-white border-slate-200 text-slate-300'
                                            }`}>
                                            {m.status === 'completed' ? <CheckCircle2 size={12} /> :
                                                m.status === 'error' ? <AlertCircle size={12} /> :
                                                    <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                                        </div>
                                        <span className={`text-[10px] font-bold text-center w-20 leading-tight ${m.status === 'pending' ? 'text-slate-400' : 'text-slate-700'
                                            }`}>
                                            {m.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Direita: Ações e Insight */}
                        <div className="w-full lg:w-1/4 flex flex-col gap-3">
                            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 flex gap-2">
                                <Zap size={14} className="text-orange-500 fill-orange-500 shrink-0 mt-0.5" />
                                <p className="text-[10px] text-slate-600 leading-relaxed italic">
                                    {process.aiInsight}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-auto">
                                <Button className="h-8 bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold gap-1 shadow-sm">
                                    <ThumbsUp size={12} /> Aprovar
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-8 border-slate-200 text-slate-600 hover:text-orange-600 text-[10px] font-bold gap-1"
                                    onClick={() => onDetail?.(process.id)}
                                >
                                    <MessageCircle size={12} /> Detalhes
                                </Button>
                            </div>

                            <Button
                                className="w-full mt-2 bg-white hover:bg-slate-900 hover:text-white border border-slate-200 text-slate-700 text-[11px] font-bold h-8 gap-2"
                                onClick={() => onDetail?.(process.id)}
                            >
                                Intervir no Fluxo <ArrowRight size={14} />
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};