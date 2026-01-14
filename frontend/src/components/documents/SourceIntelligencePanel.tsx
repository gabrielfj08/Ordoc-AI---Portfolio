"use client";

import React, { useState } from "react";
import { X, Sparkles, Brain, FileText, TrendingUp, Zap, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DocumentItem } from "./DocumentList";

interface SourceIntelligencePanelProps {
    selectedDocuments: DocumentItem[];
    isOpen: boolean;
    onClose: () => void;
    onRemoveDocument: (id: string) => void;
    onGenerateAnalysis: (documents: DocumentItem[]) => void;
}

export function SourceIntelligencePanel({
    selectedDocuments,
    isOpen,
    onClose,
    onRemoveDocument,
    onGenerateAnalysis
}: SourceIntelligencePanelProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [analysis, setAnalysis] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleGenerateAnalysis = async () => {
        setIsGenerating(true);

        // Simular geração de análise (substituir por chamada real à IA)
        setTimeout(() => {
            const mockAnalysis = `
## Análise Comparativa de ${selectedDocuments.length} Documentos

### Resumo Executivo
Os documentos selecionados apresentam uma visão abrangente do contexto de ${selectedDocuments[0]?.category || 'negócios'}. 

### Principais Insights:
${selectedDocuments.map((doc, i) => `
**${i + 1}. ${doc.name}**
- Relevância: ${Math.floor(Math.random() * 30) + 70}%
- Tipo: ${doc.type === 'file' ? 'Arquivo' : 'Pasta'}
- Tags: ${doc.tags?.join(', ') || 'Sem tags'}
${doc.contentPreview ? `- Contexto: ${doc.contentPreview.substring(0, 100)}...` : ''}
`).join('\n')}

### Correlações Identificadas:
- Todos os documentos compartilham contexto de ${selectedDocuments[0]?.category || 'documentação'}
- Período temporal: ${selectedDocuments[0]?.date}
- Proprietário comum: ${selectedDocuments[0]?.owner}

### Recomendações:
1. Consolidar informações em um único documento mestre
2. Verificar conformidade de todos os itens
3. Atualizar metadados para melhor rastreabilidade
      `.trim();

            setAnalysis(mockAnalysis);
            setIsGenerating(false);
            onGenerateAnalysis(selectedDocuments);
        }, 2000);
    };

    // Calcular relevância mock
    const getRelevanceScore = (doc: DocumentItem) => {
        return Math.floor(Math.random() * 30) + 70; // 70-100%
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] animate-in fade-in duration-200">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-purple-50 to-blue-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                            <Brain size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Workspace de Inteligência</h2>
                            <p className="text-sm text-slate-500">
                                {selectedDocuments.length} {selectedDocuments.length === 1 ? 'documento selecionado' : 'documentos selecionados'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-hidden flex">
                    {/* Source Rail - Lista de Documentos */}
                    <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50">
                        <div className="p-4 border-b border-slate-200 bg-white">
                            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                                <FileText size={16} className="text-purple-500" />
                                Fontes Carregadas
                            </h3>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {selectedDocuments.length === 0 ? (
                                <div className="text-center py-12 text-slate-400">
                                    <FileText size={48} className="mx-auto mb-4 text-slate-300" />
                                    <p className="text-sm font-medium">Nenhum documento selecionado</p>
                                    <p className="text-xs mt-2">Selecione documentos para análise</p>
                                </div>
                            ) : (
                                selectedDocuments.map((doc) => (
                                    <div
                                        key={doc.id}
                                        className="bg-white rounded-lg border border-slate-200 p-3 hover:border-purple-200 hover:shadow-sm transition-all group"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-semibold text-slate-800 truncate">{doc.name}</p>
                                                <p className="text-[10px] text-slate-500 mt-1">{doc.size}</p>
                                            </div>
                                            <button
                                                onClick={() => onRemoveDocument(doc.id)}
                                                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-600 transition-all"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>

                                        {/* Relevance Score */}
                                        <div className="flex items-center gap-2 mt-2">
                                            <TrendingUp size={12} className="text-purple-500" />
                                            <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                                <div
                                                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-full transition-all"
                                                    style={{ width: `${getRelevanceScore(doc)}%` }}
                                                />
                                            </div>
                                            <span className="text-[10px] font-bold text-purple-600">
                                                {getRelevanceScore(doc)}%
                                            </span>
                                        </div>

                                        {/* Tags */}
                                        {doc.tags && doc.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {doc.tags.slice(0, 2).map((tag) => (
                                                    <Badge
                                                        key={tag}
                                                        variant="secondary"
                                                        className="text-[8px] px-1.5 py-0 bg-purple-50 text-purple-700 border-purple-200"
                                                    >
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Action Button */}
                        {selectedDocuments.length > 0 && (
                            <div className="p-4 border-t border-slate-200 bg-white">
                                <Button
                                    onClick={handleGenerateAnalysis}
                                    disabled={isGenerating}
                                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white gap-2"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Zap size={16} className="animate-pulse" />
                                            Gerando Análise...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={16} />
                                            Gerar Análise Comparativa
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Analysis Panel */}
                    <div className="flex-1 flex flex-col bg-white">
                        <div className="p-6 border-b border-slate-200">
                            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                                <Brain size={16} className="text-blue-500" />
                                Análise Cognitiva
                            </h3>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {!analysis ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center mb-4">
                                        <Sparkles size={32} className="text-purple-500" />
                                    </div>
                                    <h4 className="text-sm font-semibold text-slate-700 mb-2">
                                        Pronto para Análise
                                    </h4>
                                    <p className="text-xs text-center max-w-md">
                                        Selecione os documentos no painel esquerdo e clique em "Gerar Análise Comparativa"
                                        para obter insights automáticos sobre correlações, padrões e recomendações.
                                    </p>
                                </div>
                            ) : (
                                <div className="prose prose-sm max-w-none">
                                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-6 border border-purple-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Sparkles size={16} className="text-purple-600" />
                                            <span className="text-xs font-bold text-purple-900 uppercase tracking-wide">
                                                Análise Gerada pela IA
                                            </span>
                                        </div>
                                        <p className="text-xs text-purple-700">
                                            Resumo comparativo baseado em {selectedDocuments.length} documentos
                                        </p>
                                    </div>

                                    <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                                        {analysis}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
