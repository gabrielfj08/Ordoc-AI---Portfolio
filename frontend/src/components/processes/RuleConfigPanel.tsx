"use client";

import * as React from "react";
import {
    Settings2, Plus, Trash2, Play,
    ShieldCheck, FileSignature, Zap, Cpu,
    Download, Upload, Copy, BookTemplate, Timer,
    Gavel
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceTaskConfig } from "./ServiceTaskConfig";
import { FlowExporter } from "./FlowExporter";
import { FlowImporter } from "./FlowImporter";
import { TemplateLibrary } from "./TemplateLibrary";
import { StyleGuideConfig } from "./StyleGuideConfig";

export const RuleConfigPanel = () => {
    const [showServiceConfig, setShowServiceConfig] = React.useState(false);
    const [showExporter, setShowExporter] = React.useState(false);
    const [showImporter, setShowImporter] = React.useState(false);
    const [showTemplateLibrary, setShowTemplateLibrary] = React.useState(false);
    const [showStyleGuide, setShowStyleGuide] = React.useState(false);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4 duration-500">

            {/* Esquerda: Lista de Workflows Criados */}
            <div className="lg:col-span-1 space-y-6">

                {/* Ações da Biblioteca */}
                <div className="grid grid-cols-2 gap-2">
                    <Button
                        onClick={() => setShowTemplateLibrary(true)}
                        variant="outline"
                        className="h-20 flex flex-col gap-2 rounded-2xl bg-white border-slate-200 text-slate-600 hover:text-orange-600 hover:border-orange-200 hover:bg-orange-50/20"
                    >
                        <BookTemplate size={20} />
                        <span className="text-[10px] font-bold uppercase tracking-tight">Biblioteca</span>
                    </Button>
                    <Button
                        onClick={() => setShowImporter(true)}
                        variant="outline"
                        className="h-20 flex flex-col gap-2 rounded-2xl bg-white border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/20"
                    >
                        <Download size={20} />
                        <span className="text-[10px] font-bold uppercase tracking-tight">Importar</span>
                    </Button>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Meus Fluxos</h3>
                        <Button size="sm" variant="ghost" className="text-orange-600 h-8 gap-1">
                            <Plus size={14} /> Novo
                        </Button>
                    </div>

                    <div className="space-y-3">
                        <RuleItem active title="Contratos de Compra" steps={4} status="Ativo" />
                        <RuleItem title="Licitações Públicas" steps={3} status="Pausado" />
                        <RuleItem title="NDAs Simples" steps={2} status="Ativo" />
                    </div>
                </div>
            </div>

            {/* Direita: Editor de Regras (O Builder) */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <header className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                            <Settings2 size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">Editor de Fluxo: Contratos de Compra</h3>
                            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">Trigger: Sempre que um PDF contiver "Compra" ou "Fornecimento"</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowExporter(true)}
                            className="text-slate-400 hover:text-blue-500"
                            title="Exportar Fluxo"
                        >
                            <Download size={18} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowImporter(true)}
                            className="text-slate-400 hover:text-green-500"
                            title="Importar Fluxo"
                        >
                            <Upload size={18} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowStyleGuide(true)}
                            className="text-slate-400 hover:text-purple-500"
                            title="Guia de Estilo"
                        >
                            <Settings2 size={18} />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-500" title="Clonar Fluxo"><Copy size={18} /></Button>
                        <div className="w-px h-6 bg-slate-200 mx-1" />
                        <Button variant="ghost" size="icon" className="text-red-400"><Trash2 size={18} /></Button>
                        <Button className="bg-slate-900 text-white rounded-xl text-xs px-6">Salvar Alterações</Button>
                    </div>
                </header>

                <div className="p-8 space-y-8 flex-1">
                    {/* Milestone 1 */}
                    <StepNode
                        index={1}
                        icon={Cpu}
                        title="Triagem Cognitiva"
                        desc="A IA Ordoc extrai metadados, valores e identifica partes envolvidas."
                        isAuto
                        sla="2 horas"
                        condition="Confiança > 90%"
                    />

                    <div className="flex justify-center -my-4 h-8">
                        <div className="w-0.5 bg-slate-100 h-full border-dashed border-l-2" />
                    </div>

                    {/* Milestone 2 */}
                    <StepNode
                        index={2}
                        icon={ShieldCheck}
                        title="Validação de Compliance"
                        desc="Verificar se o valor excede R$ 50.000. Se sim, exigir Certidão Negativa."
                        isAuto
                        sla="30 min"
                        condition="Valor > 50k"
                    />

                    <div className="flex justify-center -my-4 h-8">
                        <div className="w-0.5 bg-slate-100 h-full border-dashed border-l-2" />
                    </div>

                    {/* Milestone 3 */}
                    <StepNode
                        index={3}
                        icon={FileSignature}
                        title="Coleta de Assinaturas"
                        desc="Enviar automaticamente para o Diretor de Compras e Fornecedor."
                        sla="48 horas"
                        condition="Todas assinaturas válidas"
                    />

                    {/* Adicionar Novo Passo */}
                    <button className="w-full py-4 border-2 border-dashed border-slate-100 rounded-2xl text-slate-300 flex items-center justify-center gap-2 hover:border-orange-200 hover:text-orange-500 transition-all hover:bg-orange-50/30 group">
                        <Plus size={18} className="group-hover:scale-125 transition-transform" />
                        <span className="text-xs font-bold uppercase tracking-widest">Adicionar Milestone ao Fluxo</span>
                    </button>
                </div>
            </div>

            {/* Modals */}
            {showServiceConfig && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
                    <ServiceTaskConfig
                        onClose={() => setShowServiceConfig(false)}
                        onSave={(task) => {
                            console.log('Service Task salvo:', task);
                            setShowServiceConfig(false);
                        }}
                    />
                </div>
            )}

            {showExporter && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
                    <FlowExporter
                        flowData={{
                            id: 'flow-1',
                            name: 'Contratos de Compra',
                            category: 'Setor Compras',
                            trigger: 'PDF contendo "Compra" ou "Fornecimento"',
                            steps: [
                                { id: 1, type: 'ai', name: 'Triagem Cognitiva', sla: '2 horas' },
                                { id: 2, type: 'manual', name: 'Revisão Compliance', sla: '24 horas' },
                                { id: 3, type: 'approval', name: 'Assinaturas', sla: '48 horas' },
                                { id: 4, type: 'service', name: 'Selagem ECR', sla: '1 hora' }
                            ],
                            createdAt: new Date().toISOString(),
                            version: '1.0'
                        }}
                        onExportComplete={(path) => {
                            console.log('Fluxo exportado para:', path);
                            setShowExporter(false);
                        }}
                    />
                </div>
            )}

            {showImporter && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
                    <FlowImporter
                        onClose={() => setShowImporter(false)}
                        onImportComplete={(flowData) => {
                            console.log('Fluxo importado:', flowData);
                            setShowImporter(false);
                        }}
                    />
                </div>
            )}

            {/* Template Library */}
            <TemplateLibrary
                isOpen={showTemplateLibrary}
                onClose={() => setShowTemplateLibrary(false)}
                onApplyTemplate={(template) => {
                    console.log('Template aplicado:', template);
                    // Aqui você carregaria o template no editor
                }}
            />

            {/* Style Guide Config */}
            {showStyleGuide && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
                    <StyleGuideConfig
                        onClose={() => setShowStyleGuide(false)}
                        onSave={(style) => {
                            console.log('Estilo salvo:', style);
                            setShowStyleGuide(false);
                        }}
                    />
                </div>
            )}
        </div>
    );
};

// Sub-componentes
const RuleItem = ({ title, steps, status, active }: any) => (
    <div className={`p-4 rounded-2xl border transition-all cursor-pointer ${active ? 'bg-orange-50 border-orange-200 ring-4 ring-orange-500/5' : 'bg-white border-slate-100 hover:border-slate-300'
        }`}>
        <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-slate-700">{title}</span>
            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                }`}>{status}</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
            <Play size={10} /> {steps} Milestones definidos
        </div>
    </div>
);

const StepNode = ({ index, icon: Icon, title, desc, isAuto, sla, condition }: any) => (
    <div className="flex gap-6 items-start">
        <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 shadow-sm">
                {index}
            </div>
        </div>
        <div className="flex-1 bg-slate-50/50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between group hover:border-orange-200 transition-all">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 group-hover:text-orange-600 transition-colors">
                    <Icon size={20} />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-700">{title}</h4>
                        {isAuto && (
                            <span className="bg-purple-100 text-purple-700 text-[8px] px-1.5 py-0.5 rounded font-black flex items-center gap-1 uppercase tracking-tighter">
                                <Zap size={8} className="fill-purple-700" /> Auto-IA
                            </span>
                        )}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight mt-1 mb-2">{desc}</p>

                    {/* SLA & Conditions */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-slate-100">
                            <Timer size={10} className="text-slate-400" />
                            <span className="text-[9px] font-bold text-slate-600">SLA: {sla}</span>
                        </div>
                        {condition && (
                            <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-slate-100">
                                <Gavel size={10} className="text-slate-400" />
                                <span className="text-[9px] font-bold text-slate-600">Cond: {condition}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-slate-600">Editar</Button>
        </div>
    </div>
);