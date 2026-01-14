"use client";

import React, { useState } from "react";
import { BookTemplate, Search, X, Play, CheckCircle2, Zap, FileCheck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface FlowTemplate {
    id: string;
    name: string;
    category: string;
    description: string;
    steps: number;
    status: 'ativo' | 'pausado';
    milestones: Array<{
        name: string;
        type: 'ai' | 'manual' | 'approval' | 'service';
        sla: string;
        condition?: string;
    }>;
    flowData: any;
}

interface TemplateLibraryProps {
    isOpen: boolean;
    onClose: () => void;
    onApplyTemplate: (template: FlowTemplate) => void;
}

const TEMPLATES: FlowTemplate[] = [
    {
        id: 'tpl-1',
        name: 'Contratos de Compra',
        category: 'Compras',
        description: 'Fluxo completo para aprovação de contratos de fornecimento',
        steps: 4,
        status: 'ativo',
        milestones: [
            { name: 'Triagem Cognitiva', type: 'ai', sla: '2 horas', condition: 'Confiança > 90%' },
            { name: 'Validação de Compliance', type: 'manual', sla: '24 horas', condition: 'Valor > R$ 10.000' },
            { name: 'Coleta de Assinaturas', type: 'approval', sla: '48 horas' },
            { name: 'Selagem ECR', type: 'service', sla: '1 hora' }
        ],
        flowData: {
            trigger: 'PDF contendo "Compra" ou "Fornecimento"',
            version: '1.0'
        }
    },
    {
        id: 'tpl-2',
        name: 'Licitações Públicas',
        category: 'Setor Público',
        description: 'Processo de análise e validação de documentos para licitações',
        steps: 3,
        status: 'pausado',
        milestones: [
            { name: 'Análise de Edital', type: 'ai', sla: '4 horas' },
            { name: 'Validação de Certidões', type: 'manual', sla: '48 horas' },
            { name: 'Protocolo', type: 'service', sla: '2 horas' }
        ],
        flowData: {
            trigger: 'PDF contendo "Licitação" ou "Edital"',
            version: '1.0'
        }
    },
    {
        id: 'tpl-3',
        name: 'NDAs Simples',
        category: 'Jurídico',
        description: 'Fluxo rápido para acordos de confidencialidade',
        steps: 2,
        status: 'ativo',
        milestones: [
            { name: 'Revisão Jurídica', type: 'manual', sla: '12 horas' },
            { name: 'Assinaturas', type: 'approval', sla: '24 horas' }
        ],
        flowData: {
            trigger: 'PDF contendo "NDA" ou "Confidencialidade"',
            version: '1.0'
        }
    }
];

export function TemplateLibrary({ isOpen, onClose, onApplyTemplate }: TemplateLibraryProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedTemplate, setSelectedTemplate] = useState<FlowTemplate | null>(null);

    if (!isOpen) return null;

    const categories = ['all', ...Array.from(new Set(TEMPLATES.map(t => t.category)))];

    const filteredTemplates = TEMPLATES.filter(template => {
        const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-orange-50 to-blue-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                <BookTemplate size={24} className="text-orange-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Biblioteca de Templates</h2>
                                <p className="text-sm text-slate-500">Escolha um fluxo pré-configurado para começar</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                            <X size={20} />
                        </Button>
                    </div>

                    {/* Search and Filters */}
                    <div className="mt-4 flex gap-3">
                        <div className="flex-1 relative">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <Input
                                placeholder="Buscar templates..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex gap-2">
                            {categories.map(cat => (
                                <Button
                                    key={cat}
                                    size="sm"
                                    variant={selectedCategory === cat ? 'default' : 'outline'}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={selectedCategory === cat ? 'bg-orange-600 hover:bg-orange-700' : ''}
                                >
                                    {cat === 'all' ? 'Todos' : cat}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Templates List */}
                        <div className="lg:col-span-2 space-y-4">
                            {filteredTemplates.map(template => (
                                <div
                                    key={template.id}
                                    onClick={() => setSelectedTemplate(template)}
                                    className={`bg-white border-2 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${selectedTemplate?.id === template.id
                                            ? 'border-orange-500 bg-orange-50'
                                            : 'border-slate-200 hover:border-slate-300'
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="font-bold text-slate-800">{template.name}</h3>
                                                <Badge className={`text-xs ${template.status === 'ativo'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-slate-100 text-slate-600'
                                                    }`}>
                                                    {template.status}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-slate-600 mb-3">{template.description}</p>
                                            <div className="flex items-center gap-4 text-xs text-slate-500">
                                                <span className="flex items-center gap-1">
                                                    <CheckCircle2 size={14} />
                                                    {template.steps} Milestones
                                                </span>
                                                <span className="px-2 py-1 bg-slate-100 rounded-md font-medium">
                                                    {template.category}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Preview Panel */}
                        <div className="lg:col-span-1">
                            {selectedTemplate ? (
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 sticky top-0">
                                    <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                                        <Play size={16} className="text-orange-600" />
                                        Preview do Fluxo
                                    </h4>
                                    <div className="space-y-3">
                                        {selectedTemplate.milestones.map((milestone, i) => (
                                            <div key={i} className="bg-white rounded-lg p-3 border border-slate-100">
                                                <div className="flex items-start gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">
                                                        {i + 1}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-slate-800">{milestone.name}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Badge className="text-[10px] bg-slate-100 text-slate-600">
                                                                {milestone.type === 'ai' && <Zap size={10} className="mr-1" />}
                                                                {milestone.type === 'manual' && <FileCheck size={10} className="mr-1" />}
                                                                {milestone.type === 'approval' && <ShieldCheck size={10} className="mr-1" />}
                                                                {milestone.type}
                                                            </Badge>
                                                            <span className="text-[10px] text-slate-500">SLA: {milestone.sla}</span>
                                                        </div>
                                                        {milestone.condition && (
                                                            <p className="text-[10px] text-slate-500 mt-1">Cond: {milestone.condition}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <Button
                                        onClick={() => {
                                            onApplyTemplate(selectedTemplate);
                                            onClose();
                                        }}
                                        className="w-full mt-4 bg-orange-600 hover:bg-orange-700 text-white"
                                    >
                                        Usar Este Template
                                    </Button>
                                </div>
                            ) : (
                                <div className="bg-slate-50 rounded-xl p-8 border border-slate-200 text-center">
                                    <BookTemplate size={48} className="mx-auto text-slate-300 mb-3" />
                                    <p className="text-sm text-slate-500">
                                        Selecione um template para ver o preview
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
