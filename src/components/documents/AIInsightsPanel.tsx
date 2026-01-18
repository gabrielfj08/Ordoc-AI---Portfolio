"use client";

import { useState, useEffect } from "react";
import {
    X, Zap, ArrowLeft, Copy, Check,
    ListTodo, Mail, Sparkles, Wand2, Brain
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentItem } from "./DocumentList";

import { useDocumentAnalysis } from "@/hooks/queries/useIntelligence";

interface AIInsightsPanelProps {
    item: DocumentItem;
    onClose: () => void;
    onBack: () => void;
}

export const AIInsightsPanel = ({ item, onClose, onBack }: AIInsightsPanelProps) => {
    const { data: analysis, isLoading, isError } = useDocumentAnalysis(item.id);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (!analysis) return;
        const textToCopy = `Análise de ${item.name}\n\nTipo: ${analysis.document_type}\n\nResumo:\n${JSON.stringify(analysis.extraction_result, null, 2)}`;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const isGenerating = isLoading;

    return (
        <div className="w-80 bg-white border-l border-slate-100 h-full flex flex-col shadow-xl z-10">

            {/* Header com Gradiente AI */}
            <div className="relative overflow-hidden bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100 p-4">
                <div className="absolute top-0 right-0 p-2 opacity-10">
                    <Sparkles size={64} className="text-orange-500" />
                </div>

                <div className="flex items-center justify-between mb-2 relative z-10">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onBack}
                        className="h-8 w-8 -ml-2 hover:bg-white/50 text-slate-600"
                        title="Voltar para detalhes"
                    >
                        <ArrowLeft size={18} />
                    </Button>
                    <div className="flex items-center gap-2">
                        <Zap size={16} className="text-[#f97316] fill-[#f97316] animate-pulse" />
                        <span className="text-sm font-bold text-slate-800">Ordoc AI Insights</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="h-8 w-8 hover:bg-white/50 text-slate-500"
                    >
                        <X size={18} />
                    </Button>
                </div>
                <p className="text-xs text-slate-600 relative z-10">
                    Analisando <span className="font-semibold text-slate-800 truncate inline-block max-w-[150px] align-bottom">{item.name}</span>
                </p>
            </div>

            {/* Área de Conteúdo (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">

                {/* Card com Resultados Reais */}
                <div className="prose prose-sm prose-orange max-w-none">
                    <div className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed font-mono sm:font-sans">
                        {analysis ? (
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <Sparkles size={12} className="text-purple-500" />
                                        Extração de Dados
                                    </h3>
                                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 font-sans">
                                        {Object.entries(analysis.extraction_result).map(([key, value]) => (
                                            value && (
                                                <div key={key} className="mb-1 text-xs">
                                                    <span className="font-semibold text-slate-600">{key}:</span> {String(value)}
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>

                                {analysis.council_deliberation && (
                                    <div>
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <Brain size={12} className="text-orange-500" />
                                            Deliberação IA
                                        </h3>
                                        <div className="text-xs text-slate-700 bg-orange-50/30 p-3 rounded-lg border border-orange-100">
                                            {(analysis.council_deliberation as any).summary || "Análise concluída com sucesso."}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : isError ? (
                            <div className="text-red-500 text-xs p-4 bg-red-50 rounded-lg text-center font-sans">
                                Erro ao carregar análise de inteligência.
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 gap-3">
                                <Zap className="h-8 w-8 text-orange-200 animate-pulse" />
                                <span className="text-xs text-slate-400 font-sans">Consultando Ordoc AI...</span>
                            </div>
                        )}
                    </div>
                </div>

                {!isGenerating && (
                    <div className="pt-4 space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="h-px bg-slate-100 w-full" />
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Wand2 size={12} /> Ações Recomendadas
                        </h4>

                        <div className="grid grid-cols-1 gap-2">
                            <Button variant="outline" className="justify-start gap-2 bg-white hover:bg-slate-50 border-slate-200 text-slate-700 h-10">
                                <ListTodo size={16} className="text-blue-500" />
                                Criar tarefa relacionada
                            </Button>
                            <Button variant="outline" className="justify-start gap-2 bg-white hover:bg-slate-50 border-slate-200 text-slate-700 h-10">
                                <Mail size={16} className="text-green-500" />
                                Enviar resumo por e-mail
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer de Ações */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-medium">
                    {isGenerating ? "Processando..." : "Análise concluída"}
                </span>
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleCopy}
                        disabled={isGenerating}
                        className={copied ? "text-green-600" : "text-slate-500"}
                    >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                    </Button>
                </div>
            </div>
        </div>
    );
};
