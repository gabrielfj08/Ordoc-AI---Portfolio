"use client";

import React, { useState } from "react";
import { Download, FileJson, FolderOpen, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface FlowData {
    id: string;
    name: string;
    category: string;
    trigger: string;
    steps: Array<{
        id: number;
        type: 'ai' | 'manual' | 'approval' | 'service';
        name: string;
        sla?: string;
        condition?: string;
    }>;
    createdAt: string;
    version: string;
}

interface FlowExporterProps {
    flowData: FlowData;
    onExportComplete?: (savedPath: string) => void;
}

export function FlowExporter({ flowData, onExportComplete }: FlowExporterProps) {
    const [exporting, setExporting] = useState(false);
    const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [savedPath, setSavedPath] = useState('');

    // Gerar sugestões de IA para categorização
    const generateAISuggestions = (flow: FlowData): string[] => {
        const suggestions = [];

        // Análise baseada no nome e categoria
        if (flow.name.toLowerCase().includes('contrato')) {
            suggestions.push('Importante para templates de Contratos');
        }
        if (flow.name.toLowerCase().includes('licitação') || flow.name.toLowerCase().includes('licitacao')) {
            suggestions.push('Essencial para processos de Licitações Públicas');
        }
        if (flow.category.toLowerCase().includes('compra')) {
            suggestions.push('Útil para fluxos de Compras e Fornecimento');
        }
        if (flow.steps.some(s => s.type === 'approval')) {
            suggestions.push('Contém etapas de aprovação');
        }
        if (flow.steps.some(s => s.type === 'service')) {
            suggestions.push('Integrado com APIs externas');
        }

        return suggestions.length > 0 ? suggestions : ['Template de processo automatizado'];
    };

    // Determinar pasta de destino baseada na categoria
    const determineFolderPath = (flow: FlowData): string => {
        const baseFolder = 'Meu Drive/Templates de Fluxos';

        // Categorização inteligente
        if (flow.name.toLowerCase().includes('contrato')) {
            return `${baseFolder}/Contratos`;
        }
        if (flow.name.toLowerCase().includes('licitação') || flow.name.toLowerCase().includes('licitacao')) {
            return `${baseFolder}/Licitações`;
        }
        if (flow.category.toLowerCase().includes('compra')) {
            return `${baseFolder}/Compras`;
        }
        if (flow.category.toLowerCase().includes('jurídico') || flow.category.toLowerCase().includes('juridico')) {
            return `${baseFolder}/Jurídico`;
        }

        return `${baseFolder}/Geral`;
    };

    const handleExport = async () => {
        setExporting(true);

        // Simular exportação
        setTimeout(() => {
            const folderPath = determineFolderPath(flowData);
            const fileName = `${flowData.name.replace(/\s+/g, '_')}_v${flowData.version}.json`;
            const fullPath = `${folderPath}/${fileName}`;

            // Criar objeto JSON do fluxo
            const exportData = {
                ...flowData,
                exportedAt: new Date().toISOString(),
                aiSuggestions: generateAISuggestions(flowData),
                metadata: {
                    tags: ['Fluxo', 'Template', flowData.category],
                    category: 'Automação',
                    contentPreview: `Template de fluxo: ${flowData.name}. Contém ${flowData.steps.length} etapas automatizadas.`
                }
            };

            // Simular salvamento
            console.log('Exportando fluxo:', exportData);
            console.log('Salvando em:', fullPath);

            setSavedPath(fullPath);
            setExportStatus('success');
            setExporting(false);

            onExportComplete?.(fullPath);
        }, 2000);
    };

    const aiSuggestions = generateAISuggestions(flowData);
    const folderPath = determineFolderPath(flowData);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            {/* Header */}
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                    <Download size={24} className="text-blue-600" />
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-slate-800">Exportar Fluxo</h3>
                    <p className="text-xs text-slate-500 mt-1">
                        Salvar configuração como template reutilizável
                    </p>
                </div>
            </div>

            {/* Informações do Fluxo */}
            <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Nome do Fluxo</label>
                    <p className="text-sm font-semibold text-slate-800 mt-1">{flowData.name}</p>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Categoria</label>
                    <p className="text-sm text-slate-700 mt-1">{flowData.category}</p>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Etapas</label>
                    <p className="text-sm text-slate-700 mt-1">{flowData.steps.length} milestones configurados</p>
                </div>
            </div>

            {/* Destino Inteligente */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
                <div className="flex items-start gap-3">
                    <Sparkles size={20} className="text-purple-600 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm font-bold text-purple-900 mb-2">Organização Inteligente</p>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <FolderOpen size={14} className="text-purple-600" />
                                <span className="text-xs text-purple-700 font-medium">{folderPath}</span>
                            </div>
                            <div className="text-xs text-purple-600 space-y-1">
                                {aiSuggestions.map((suggestion, i) => (
                                    <div key={i} className="flex items-start gap-2">
                                        <span className="text-purple-400 mt-0.5">•</span>
                                        <span>{suggestion}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status de Exportação */}
            {exportStatus !== 'idle' && (
                <div className={`rounded-xl p-4 flex items-start gap-3 ${exportStatus === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                    }`}>
                    {exportStatus === 'success' ? (
                        <CheckCircle2 size={20} className="text-green-600 mt-0.5" />
                    ) : (
                        <AlertCircle size={20} className="text-red-600 mt-0.5" />
                    )}
                    <div className="flex-1">
                        <p className={`text-sm font-bold ${exportStatus === 'success' ? 'text-green-900' : 'text-red-900'}`}>
                            {exportStatus === 'success' ? 'Fluxo Exportado com Sucesso!' : 'Erro na Exportação'}
                        </p>
                        {exportStatus === 'success' && (
                            <p className="text-xs text-green-700 mt-1">
                                Salvo em: <span className="font-mono">{savedPath}</span>
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Ações */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <Button
                    onClick={handleExport}
                    disabled={exporting || exportStatus === 'success'}
                    className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                >
                    {exporting ? (
                        <>
                            <FileJson size={16} className="animate-pulse" />
                            Exportando...
                        </>
                    ) : exportStatus === 'success' ? (
                        <>
                            <CheckCircle2 size={16} />
                            Exportado
                        </>
                    ) : (
                        <>
                            <Download size={16} />
                            Exportar para Meu Drive
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
