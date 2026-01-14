"use client";

import React, { useState } from "react";
import { Upload, FileJson, AlertCircle, CheckCircle2, Eye, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

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

interface FlowImporterProps {
    onImportComplete?: (flowData: FlowData) => void;
    onClose?: () => void;
}

export function FlowImporter({ onImportComplete, onClose }: FlowImporterProps) {
    const [file, setFile] = useState<File | null>(null);
    const [flowData, setFlowData] = useState<FlowData | null>(null);
    const [error, setError] = useState<string>('');
    const [importing, setImporting] = useState(false);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        if (!selectedFile.name.endsWith('.json')) {
            setError('Por favor, selecione um arquivo JSON válido');
            return;
        }

        setFile(selectedFile);
        setError('');

        // Ler e validar o arquivo
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target?.result as string);

                // Validar estrutura básica
                if (!data.name || !data.steps || !Array.isArray(data.steps)) {
                    setError('Arquivo JSON inválido. Estrutura de fluxo não reconhecida.');
                    setFlowData(null);
                    return;
                }

                setFlowData(data);
                setError('');
            } catch (err) {
                setError('Erro ao ler arquivo JSON. Verifique se o formato está correto.');
                setFlowData(null);
            }
        };
        reader.readAsText(selectedFile);
    };

    const handleImport = () => {
        if (!flowData) return;

        setImporting(true);

        // Simular importação
        setTimeout(() => {
            onImportComplete?.(flowData);
            setImporting(false);
        }, 1500);
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 bg-slate-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                        <Upload size={20} className="text-green-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">Importar Fluxo</h3>
                        <p className="text-xs text-slate-500">Carregar template de fluxo salvo</p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Upload Area */}
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-blue-300 hover:bg-blue-50/50 transition-all">
                    <input
                        type="file"
                        accept=".json"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="flow-file-input"
                    />
                    <label htmlFor="flow-file-input" className="cursor-pointer">
                        <FileJson size={48} className="mx-auto text-slate-300 mb-4" />
                        <p className="text-sm font-semibold text-slate-700">
                            {file ? file.name : 'Clique para selecionar arquivo JSON'}
                        </p>
                        <p className="text-xs text-slate-500 mt-2">
                            Ou arraste e solte o arquivo aqui
                        </p>
                    </label>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                        <AlertCircle size={20} className="text-red-600 mt-0.5" />
                        <div>
                            <p className="text-sm font-bold text-red-900">Erro na Importação</p>
                            <p className="text-xs text-red-700 mt-1">{error}</p>
                        </div>
                    </div>
                )}

                {/* Preview do Fluxo */}
                {flowData && !error && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-4">
                        <div className="flex items-start gap-3">
                            <CheckCircle2 size={20} className="text-green-600 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-bold text-green-900">Fluxo Válido Detectado</p>
                                <p className="text-xs text-green-700 mt-1">Preview da configuração:</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 space-y-3">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase">Nome</label>
                                <p className="text-sm font-semibold text-slate-800 mt-1">{flowData.name}</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase">Categoria</label>
                                <p className="text-sm text-slate-700 mt-1">{flowData.category}</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase">Trigger</label>
                                <p className="text-sm text-slate-700 mt-1">{flowData.trigger}</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase">Etapas</label>
                                <div className="mt-2 space-y-1">
                                    {flowData.steps.map((step, i) => (
                                        <div key={i} className="text-xs text-slate-600 flex items-center gap-2">
                                            <span className="text-slate-400">{i + 1}.</span>
                                            <span className="font-medium">{step.name}</span>
                                            <span className="text-slate-400">({step.type})</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
                <Button variant="outline" onClick={onClose}>
                    Cancelar
                </Button>
                <Button
                    onClick={handleImport}
                    disabled={!flowData || !!error || importing}
                    className="bg-green-600 hover:bg-green-700 text-white gap-2"
                >
                    {importing ? (
                        <>
                            <Upload size={16} className="animate-pulse" />
                            Importando...
                        </>
                    ) : (
                        <>
                            <CheckCircle2 size={16} />
                            Importar Fluxo
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
