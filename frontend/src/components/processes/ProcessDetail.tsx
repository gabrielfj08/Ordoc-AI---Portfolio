"use client";

import {
    ArrowLeft, FileText, CheckCircle2, AlertTriangle,
    Zap, Upload, RefreshCw, MessageSquare, ChevronRight,
    Search, Paperclip, MoreVertical, Shield, FileCheck
} from "lucide-react";
import { FileSpreadsheet, FileBox, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SLATimer } from "./SLATimer";
import { QuickLookHover } from "@/components/documents/QuickLookHover";
import { DocumentPreviewModal } from "@/components/documents/DocumentPreviewModal";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";


export const ProcessDetail = ({ onBack }: { onBack: () => void }) => {
    const [previewDoc, setPreviewDoc] = useState<{ name: string, type: string } | null>(null);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-right-8 duration-500">

            {/* Esquerda: Timeline Interativa e Ações */}
            <div className="lg:col-span-2 space-y-6">

                {/* Header de Navegação */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-slate-100">
                        <ArrowLeft size={20} className="text-slate-600" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold text-slate-800">Licitação Pública #042/2026</h2>
                            <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-none">Alta Prioridade</Badge>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                            <FileText size={12} /> ID: PROC-2026-042 • Iniciado há 2 dias
                        </p>
                    </div>
                </div>

                {/* Timeline Viva - Vision 2035 */}
                <div className="space-y-8 pl-4 border-l-2 border-slate-100 ml-4 relative">

                    {/* Milestone 1: Concluído */}
                    <MilestoneCard
                        status="completed"
                        title="Triagem Cognitiva"
                        time="Há 2h"
                        icon={Zap}
                        confidence={98}
                    >
                        <p className="text-xs text-slate-500">Metadados extraídos e classificados com sucesso pela IA.</p>
                    </MilestoneCard>

                    {/* Milestone 2: ATIVO (Com Intervenção Inline) */}
                    <MilestoneCard
                        status="current"
                        title="Validação de Compliance"
                        time="Em andamento"
                        icon={AlertTriangle}
                        confidence={90}
                        isWorking
                    >
                        <div className="space-y-4 mt-2">
                            {/* Insight 1: Erro Crítico (Inline Fix) */}
                            <InsightCard type="error" title="Certidão Negativa Expirada">
                                <p className="text-xs text-slate-600 mb-2">A certidão encontrada no processo venceu em 15/12/2025.</p>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" className="h-8 text-xs gap-2 bg-white">
                                        <Upload size={12} /> Upload Nova Via
                                    </Button>
                                    <Button size="sm" variant="ghost" className="h-8 text-xs gap-2 text-blue-600 hover:text-blue-700">
                                        <RefreshCw size={12} /> Solicitar via Gov.br
                                    </Button>
                                </div>
                            </InsightCard>

                            {/* Insight 2: Alerta com Edição (Inline Fix) */}
                            <InsightCard type="warning" title="E-mail do Aprovador Desatualizado">
                                <div className="flex items-center gap-2 mt-1">
                                    <Input defaultValue="diretor@old.com" className="h-8 text-xs w-64 bg-white" />
                                    <Button size="sm" className="h-8 text-xs bg-slate-900 text-white">
                                        Atualizar
                                    </Button>
                                </div>
                            </InsightCard>

                            <div className="flex items-center gap-2 pt-2">
                                <Input placeholder="Adicionar comentário interno..." className="h-9 text-xs bg-white" />
                                <Button size="icon" variant="ghost" className="h-9 w-9"><Paperclip size={16} /></Button>
                            </div>
                        </div>
                    </MilestoneCard>

                    {/* Milestone 3: Futuro */}
                    <MilestoneCard
                        status="pending"
                        title="Coleta de Assinaturas"
                        time="Aguardando validação"
                        icon={FileCheck}
                    />
                </div>
            </div>

            {/* Direita: Contexto Inteligente (Sidebar) */}
            <div className="space-y-6">

                {/* Documentos do Processo */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Documentos Vinculados</h3>
                    <div className="space-y-3">
                        <QuickLookHover
                            docName="Edital_Licitacao.pdf"
                            docType="pdf"
                            docSize="2.4 MB"
                            aiRelevance={99}
                            aiContext="Contém todas as cláusulas obrigatórias e prazos definidos."
                            onPreview={() => setPreviewDoc({ name: "Edital_Licitacao.pdf", type: "pdf" })}
                        >
                            <DocItem name="Edital_Licitacao.pdf" size="2.4 MB" />
                        </QuickLookHover>

                        <QuickLookHover
                            docName="Certidao_Negativa.pdf"
                            docType="pdf"
                            docSize="400 KB"
                            aiRelevance={45} // Baixa relevância pois expirou
                            aiContext="⚠️ Atenção: Documento vencido. A IA sugere substituição imediata."
                        >
                            <DocItem name="Certidao_Negativa.pdf" size="400 KB" error />
                        </QuickLookHover>

                        <QuickLookHover
                            docName="Proposta_Comercial.xlsx"
                            docType="xlsx"
                            docSize="1.1 MB"
                            aiRelevance={88}
                            aiContext="Valores dentro da margem esperada (+2% variação)."
                        >
                            <DocItem name="Proposta_Comercial.xlsx" size="1.1 MB" />
                        </QuickLookHover>
                    </div>
                </div>

                {/* Previsão de SLA */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">SLA Preditivo</h3>
                    <div className="mb-4">
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-600 font-medium">Tempo Decorrido</span>
                            <span className="font-bold text-slate-800">40h / 48h</span>
                        </div>
                        <SLATimer limitHours={48} currentHours={40} />
                    </div>
                    <div className="bg-blue-50 rounded-xl p-3 flex gap-3 items-start">
                        <Zap size={14} className="text-blue-600 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-blue-700">IA Insight</p>
                            <p className="text-[10px] text-blue-600 leading-relaxed">
                                Baseado em processos similares, a aprovação deve ocorrer em aprox. 3 horas após a correção da certidão.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Confiança da IA */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Confiança IA</h3>
                        <p className="text-2xl font-black text-slate-800 mt-1">92%</p>
                    </div>
                    <div className="h-12 w-12 rounded-full border-4 border-slate-100 border-t-green-500 border-r-green-500 rotate-45" />
                </div>

            </div>
        </div>
    );
}

// Sub-componentes Vision 2035

const MilestoneCard = ({ status, title, time, icon: Icon, children, confidence, isWorking }: any) => {
    const isCompleted = status === 'completed';
    const isCurrent = status === 'current';

    return (
        <div className={`relative ${isCurrent ? 'scale-100' : 'opacity-60 scale-95'} transition-all`}>
            {/* Dot na linha */}
            <div className={`absolute -left-[25px] top-0 w-4 h-4 rounded-full border-2 z-10 bg-white ${isCompleted ? 'border-green-500 text-green-500' :
                isCurrent ? 'border-orange-500 text-orange-500 shadow-orange-200 shadow-[0_0_10px]' :
                    'border-slate-300'
                }`}>
                {isCompleted && <div className="w-full h-full bg-green-500 rounded-full scale-50" />}
                {isCurrent && <div className="w-full h-full bg-orange-500 rounded-full scale-50 animate-pulse" />}
            </div>

            <div className={`rounded-2xl border p-5 ${isCurrent ? 'bg-white border-orange-200 shadow-lg ring-1 ring-orange-100' : 'bg-slate-50 border-slate-100'
                }`}>
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isCurrent ? 'bg-orange-100 text-orange-600' : 'bg-slate-200 text-slate-500'}`}>
                            <Icon size={18} />
                        </div>
                        <div>
                            <h3 className={`text-sm font-bold ${isCurrent ? 'text-slate-800' : 'text-slate-600'}`}>{title}</h3>
                            <p className="text-[10px] text-slate-400 font-mono">{time}</p>
                        </div>
                    </div>
                    {confidence && (
                        <Badge variant="outline" className={`gap-1 ${confidence > 90 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700'}`}>
                            <Shield size={10} /> {confidence}% IA
                        </Badge>
                    )}
                </div>

                {children}

                {isWorking && (
                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end gap-2">
                        <Button variant="outline" size="sm" className="text-xs h-8">Cancelar</Button>
                        <Button size="sm" className="text-xs h-8 bg-slate-900 text-white gap-2">
                            <CheckCircle2 size={12} /> Validar Manualmente
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

const InsightCard = ({ type, title, children }: any) => {
    const styles = {
        error: "bg-red-50 border-red-100 text-red-900",
        warning: "bg-amber-50 border-amber-100 text-amber-900",
        info: "bg-blue-50 border-blue-100 text-blue-900"
    };

    return (
        <div className={`p-3 rounded-xl border mb-2 ${styles[type as keyof typeof styles]}`}>
            <h4 className="text-xs font-bold mb-1 flex items-center gap-2">
                {type === 'error' && <AlertTriangle size={12} className="text-red-500" />}
                {title}
            </h4>
            {children}
        </div>
    )
}

const DocItem = ({ name, size, error }: any) => {
    const isPdf = name.endsWith('pdf');
    const isXlsx = name.endsWith('xlsx') || name.endsWith('xls');

    return (
        <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 hover:bg-white hover:border-orange-200 hover:shadow-md rounded-xl group cursor-pointer transition-all duration-200">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm ${error ? 'bg-red-100 text-red-600' :
                    isPdf ? 'bg-red-50 text-red-500' :
                        isXlsx ? 'bg-emerald-50 text-emerald-500' :
                            'bg-blue-50 text-blue-500'
                    }`}>
                    {isPdf ? <FileText size={20} /> :
                        isXlsx ? <FileSpreadsheet size={20} /> :
                            <FileBox size={20} />}
                </div>
                <div>
                    <p className={`text-sm font-bold ${error ? 'text-red-700' : 'text-slate-700 group-hover:text-orange-700 transition-colors'}`}>{name}</p>
                    <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1.5">
                        {size} <span className="w-1 h-1 rounded-full bg-slate-300" /> V.1.0
                    </p>
                </div>
            </div>
            {error ? (
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
                    <AlertTriangle size={16} className="text-red-600" />
                </div>
            ) : (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-orange-100 hover:text-orange-600">
                        <Eye size={16} />
                    </div>
                </div>
            )}
        </div>
    );
}
