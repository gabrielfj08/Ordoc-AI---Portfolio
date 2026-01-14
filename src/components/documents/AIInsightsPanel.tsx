"use client";

import { useState, useEffect } from "react";
import {
    X, Zap, ArrowLeft, Copy, Check,
    ListTodo, Mail, Sparkles, Wand2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentItem } from "./DocumentList";

interface AIInsightsPanelProps {
    item: DocumentItem;
    onClose: () => void;
    onBack: () => void;
}

export const AIInsightsPanel = ({ item, onClose, onBack }: AIInsightsPanelProps) => {
    const [content, setContent] = useState("");
    const [isGenerating, setIsGenerating] = useState(true);
    const [copied, setCopied] = useState(false);

    // Simulação de conteúdo gerado
    const fullContent = `
## Resumo Executivo: ${item.name}

Este documento parece ser um registro técnico importante. Aqui estão os pontos principais identificados pela nossa IA:

1. **Contexto Principal**: O arquivo trata de especificações detalhadas de engenharia de dados, focando em escalabilidade.
2. **Datas Críticas**: Foram encontradas referências a prazos em Q4 2024 e entregas para Janeiro de 2026.
3. **Pessoas Envolvidas**: O texto cita Pedro Henrique e a equipe de Backend.

### ✨ Sugestões de Ação:
*   **Revisão**: Agendar uma reunião de revisão com os stakeholders citados.
*   **Compliance**: Verificar se os anexos técnicos estão em conformidade com a ISO 27001.

*Gerado automaticamente pelo Ordoc AI em ${new Date().toLocaleDateString()}.*
  `.trim();

    // Efeito de Digitação (Streaming)
    useEffect(() => {
        let index = 0;
        const speed = 15; // ms por caractere

        const interval = setInterval(() => {
            setContent(fullContent.slice(0, index));
            index++;

            if (index > fullContent.length) {
                setIsGenerating(false);
                clearInterval(interval);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [fullContent]);

    const handleCopy = () => {
        navigator.clipboard.writeText(fullContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

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

                {/* Card de Streaming */}
                <div className="prose prose-sm prose-orange max-w-none">
                    <div className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed font-mono sm:font-sans">
                        {content}
                        {isGenerating && (
                            <span className="inline-block w-2 H-4 bg-[#f97316] ml-1 animate-pulse align-middle">|</span>
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
