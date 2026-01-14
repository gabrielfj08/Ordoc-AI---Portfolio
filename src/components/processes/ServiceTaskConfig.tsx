"use client";

import React, { useState } from "react";
import {
    Globe, Database, FileCheck, Webhook, FileSignature,
    Settings, Plus, Trash2, Play, AlertCircle, CheckCircle2,
    Code, Key, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ServiceTask {
    id: string;
    name: string;
    type: 'gov_br' | 'receita_federal' | 'cartorio' | 'erp' | 'webhook' | 'signature_internal';
    endpoint?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    params?: Record<string, string>;
    enabled: boolean;
}

interface ServiceTaskConfigProps {
    onSave?: (task: ServiceTask) => void;
    onClose?: () => void;
    existingTask?: ServiceTask;
}

const API_TYPES = [
    {
        id: 'gov_br',
        name: 'Gov.br',
        icon: Globe,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        description: 'Buscar certidões negativas automaticamente'
    },
    {
        id: 'receita_federal',
        name: 'Receita Federal',
        icon: Database,
        color: 'text-green-600',
        bg: 'bg-green-50',
        description: 'Validar CNPJ/CPF e consultar situação fiscal'
    },
    {
        id: 'cartorio',
        name: 'Cartórios Digitais',
        icon: FileCheck,
        color: 'text-purple-600',
        bg: 'bg-purple-50',
        description: 'Verificar autenticidade de documentos'
    },
    {
        id: 'erp',
        name: 'Sistemas ERP',
        icon: Database,
        color: 'text-orange-600',
        bg: 'bg-orange-50',
        description: 'Buscar dados de contratos e fornecedores'
    },
    {
        id: 'webhook',
        name: 'Webhooks',
        icon: Webhook,
        color: 'text-slate-600',
        bg: 'bg-slate-50',
        description: 'Notificar sistemas externos'
    },
    {
        id: 'signature_internal',
        name: 'Módulo Assinatura',
        icon: FileSignature,
        color: 'text-[#f97316]',
        bg: 'bg-orange-50',
        description: 'Integração com módulo interno de assinaturas'
    },
];

export function ServiceTaskConfig({ onSave, onClose, existingTask }: ServiceTaskConfigProps) {
    const [selectedType, setSelectedType] = useState<string>(existingTask?.type || '');
    const [taskName, setTaskName] = useState(existingTask?.name || '');
    const [endpoint, setEndpoint] = useState(existingTask?.endpoint || '');
    const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>(existingTask?.method || 'GET');
    const [headers, setHeaders] = useState<Array<{ key: string, value: string }>>(
        existingTask?.headers ? Object.entries(existingTask.headers).map(([key, value]) => ({ key, value })) : []
    );
    const [params, setParams] = useState<Array<{ key: string, value: string }>>(
        existingTask?.params ? Object.entries(existingTask.params).map(([key, value]) => ({ key, value })) : []
    );
    const [testResult, setTestResult] = useState<'idle' | 'success' | 'error'>('idle');

    const selectedApiType = API_TYPES.find(t => t.id === selectedType);

    const handleAddHeader = () => {
        setHeaders([...headers, { key: '', value: '' }]);
    };

    const handleAddParam = () => {
        setParams([...params, { key: '', value: '' }]);
    };

    const handleTest = () => {
        // Simular teste de API
        setTestResult('success');
        setTimeout(() => setTestResult('idle'), 3000);
    };

    const handleSave = () => {
        const task: ServiceTask = {
            id: existingTask?.id || Math.random().toString(36),
            name: taskName,
            type: selectedType as any,
            endpoint,
            method,
            headers: Object.fromEntries(headers.map(h => [h.key, h.value])),
            params: Object.fromEntries(params.map(p => [p.key, p.value])),
            enabled: true
        };
        onSave?.(task);
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col max-w-4xl mx-auto">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 bg-slate-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Settings size={20} className="text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">Configurar Tarefa de Serviço</h3>
                        <p className="text-xs text-slate-500">Integração com APIs externas e serviços</p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                {/* Step 1: Tipo de API */}
                <div>
                    <label className="text-sm font-bold text-slate-700 mb-3 block">1. Selecione o Tipo de Integração</label>
                    <div className="grid grid-cols-2 gap-3">
                        {API_TYPES.map((type) => (
                            <button
                                key={type.id}
                                onClick={() => setSelectedType(type.id)}
                                className={`p-4 rounded-xl border-2 transition-all text-left ${selectedType === type.id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-slate-200 hover:border-slate-300 bg-white'
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`w-10 h-10 rounded-lg ${type.bg} flex items-center justify-center shrink-0`}>
                                        <type.icon size={20} className={type.color} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-800">{type.name}</p>
                                        <p className="text-xs text-slate-500 mt-1">{type.description}</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {selectedType && (
                    <>
                        <Separator />

                        {/* Step 2: Nome da Tarefa */}
                        <div>
                            <label className="text-sm font-bold text-slate-700 mb-2 block">2. Nome da Tarefa</label>
                            <Input
                                placeholder="Ex: Validar CNPJ do Fornecedor"
                                value={taskName}
                                onChange={(e) => setTaskName(e.target.value)}
                                className="w-full"
                            />
                        </div>

                        {/* Step 3: Configuração de Endpoint (exceto assinatura interna) */}
                        {selectedType !== 'signature_internal' && (
                            <>
                                <div>
                                    <label className="text-sm font-bold text-slate-700 mb-2 block">3. Endpoint da API</label>
                                    <div className="flex gap-2">
                                        <select
                                            value={method}
                                            onChange={(e) => setMethod(e.target.value as any)}
                                            className="px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium"
                                        >
                                            <option value="GET">GET</option>
                                            <option value="POST">POST</option>
                                            <option value="PUT">PUT</option>
                                            <option value="DELETE">DELETE</option>
                                        </select>
                                        <Input
                                            placeholder="https://api.exemplo.com/v1/validar"
                                            value={endpoint}
                                            onChange={(e) => setEndpoint(e.target.value)}
                                            className="flex-1"
                                        />
                                    </div>
                                </div>

                                {/* Headers */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-bold text-slate-700">4. Headers (Opcional)</label>
                                        <Button size="sm" variant="ghost" onClick={handleAddHeader} className="h-8 gap-1 text-blue-600">
                                            <Plus size={14} /> Adicionar
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        {headers.map((header, i) => (
                                            <div key={i} className="flex gap-2">
                                                <Input
                                                    placeholder="Chave (ex: Authorization)"
                                                    value={header.key}
                                                    onChange={(e) => {
                                                        const newHeaders = [...headers];
                                                        newHeaders[i].key = e.target.value;
                                                        setHeaders(newHeaders);
                                                    }}
                                                    className="flex-1"
                                                />
                                                <Input
                                                    placeholder="Valor (ex: Bearer token)"
                                                    value={header.value}
                                                    onChange={(e) => {
                                                        const newHeaders = [...headers];
                                                        newHeaders[i].value = e.target.value;
                                                        setHeaders(newHeaders);
                                                    }}
                                                    className="flex-1"
                                                />
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => setHeaders(headers.filter((_, idx) => idx !== i))}
                                                    className="text-red-500"
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Parâmetros */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-bold text-slate-700">5. Parâmetros (Variáveis do Processo)</label>
                                        <Button size="sm" variant="ghost" onClick={handleAddParam} className="h-8 gap-1 text-blue-600">
                                            <Plus size={14} /> Adicionar
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        {params.map((param, i) => (
                                            <div key={i} className="flex gap-2">
                                                <Input
                                                    placeholder="Variável (ex: {{cnpj}})"
                                                    value={param.key}
                                                    onChange={(e) => {
                                                        const newParams = [...params];
                                                        newParams[i].key = e.target.value;
                                                        setParams(newParams);
                                                    }}
                                                    className="flex-1"
                                                />
                                                <Input
                                                    placeholder="Valor padrão"
                                                    value={param.value}
                                                    onChange={(e) => {
                                                        const newParams = [...params];
                                                        newParams[i].value = e.target.value;
                                                        setParams(newParams);
                                                    }}
                                                    className="flex-1"
                                                />
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => setParams(params.filter((_, idx) => idx !== i))}
                                                    className="text-red-500"
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Teste */}
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-bold text-slate-700">Testar Conexão</p>
                                            <p className="text-xs text-slate-500 mt-1">Simular chamada à API (mock)</p>
                                        </div>
                                        <Button onClick={handleTest} size="sm" className="gap-2">
                                            <Play size={14} />
                                            Testar
                                        </Button>
                                    </div>
                                    {testResult !== 'idle' && (
                                        <div className={`mt-3 p-3 rounded-lg flex items-center gap-2 ${testResult === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                            }`}>
                                            {testResult === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                            <span className="text-xs font-medium">
                                                {testResult === 'success' ? 'Conexão bem-sucedida!' : 'Erro na conexão'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Assinatura Interna */}
                        {selectedType === 'signature_internal' && (
                            <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                                <div className="flex items-start gap-3">
                                    <FileSignature size={20} className="text-[#f97316] mt-0.5" />
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">Integração com Módulo Interno</p>
                                        <p className="text-xs text-slate-600 mt-1">
                                            Esta tarefa enviará o documento para o módulo de assinaturas do Ordoc.
                                            Não é necessário configurar endpoint externo.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
                <Button variant="outline" onClick={onClose}>
                    Cancelar
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={!selectedType || !taskName}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                    Salvar Configuração
                </Button>
            </div>
        </div>
    );
}
