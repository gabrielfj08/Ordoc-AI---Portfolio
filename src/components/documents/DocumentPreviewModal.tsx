"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X, FileText, Download, Share2, Zap, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AIChat } from "./AIChat";

interface DocumentPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    docName: string;
    docType: string;
}

export const DocumentPreviewModal = ({ isOpen, onClose, docName, docType }: DocumentPreviewModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl h-[85vh] p-0 gap-0 overflow-hidden bg-white/95 backdrop-blur-xl border-white/20 shadow-2xl rounded-2xl flex flex-col">

                {/* Header */}
                <div className="h-14 border-b border-slate-100 flex items-center justify-between px-4 bg-white/50 backdrop-blur-md z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-red-50 rounded-lg">
                            <FileText size={18} className="text-red-500" />
                        </div>
                        <div>
                            <DialogTitle className="text-sm font-bold text-slate-800">{docName}</DialogTitle>
                            <p className="text-[10px] text-slate-400 font-medium">Visualização prévia • Apenas leitura</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-8 gap-2 text-xs">
                            <Download size={14} /> Baixar
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full" onClick={onClose}>
                            <X size={18} className="text-slate-500" />
                        </Button>
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Main Content - Preview */}
                    {/* Main Content - Preview */}
                    <div className="flex-1 bg-slate-100/50 relative flex justify-center overflow-auto pt-4 px-4 pb-8 custom-scrollbar">
                        <div className="w-full max-w-[850px] bg-white shadow-lg border border-slate-200 rounded-sm min-h-[1200px] flex flex-col">

                            {/* Page 1 */}
                            <div className="p-12 space-y-8 flex-1">
                                {/* Doc Header */}
                                <div className="flex justify-between items-start border-b border-slate-100 pb-8">
                                    <div className="space-y-2">
                                        <div className="h-6 w-48 bg-slate-800 rounded" />
                                        <div className="h-3 w-32 bg-slate-300 rounded" />
                                    </div>
                                    <div className="h-12 w-12 bg-slate-100 rounded-full" />
                                </div>

                                {/* Clauses */}
                                <div className="space-y-6">
                                    {/* Clause 1 */}
                                    <div className="space-y-3">
                                        <div className="h-4 w-1/4 bg-slate-700 rounded mb-2" />
                                        <div className="h-2 w-full bg-slate-200 rounded" />
                                        <div className="h-2 w-full bg-slate-200 rounded" />
                                        <div className="h-2 w-2/3 bg-slate-200 rounded" />
                                    </div>

                                    {/* Clause 2 */}
                                    <div className="space-y-3">
                                        <div className="h-4 w-1/3 bg-slate-700 rounded mb-2" />
                                        <div className="h-2 w-full bg-slate-200 rounded" />
                                        <div className="h-2 w-full bg-slate-200 rounded" />
                                        <div className="h-2 w-full bg-slate-200 rounded" />
                                        <div className="h-2 w-3/4 bg-slate-200 rounded" />
                                    </div>

                                    {/* Table Mock */}
                                    <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-3">
                                        <div className="flex gap-4 border-b border-slate-200 pb-2 mb-2">
                                            <div className="h-3 w-1/4 bg-slate-400 rounded" />
                                            <div className="h-3 w-1/4 bg-slate-400 rounded" />
                                            <div className="h-3 w-1/4 bg-slate-400 rounded" />
                                        </div>
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="flex gap-4">
                                                <div className="h-2 w-1/4 bg-slate-200 rounded" />
                                                <div className="h-2 w-1/4 bg-slate-200 rounded" />
                                                <div className="h-2 w-1/4 bg-slate-200 rounded" />
                                            </div>
                                        ))}
                                    </div>

                                    {/* AI Highlight Mock */}
                                    <div className="relative border-l-2 border-orange-500 bg-orange-50 p-6 rounded-r-lg my-8">
                                        <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center">
                                            <Zap size={10} className="text-white fill-white" />
                                        </div>
                                        <h4 className="text-xs font-bold text-orange-800 mb-2">Cláusula 4.2 - Renovação Automática</h4>
                                        <div className="bg-white/50 p-3 rounded border border-orange-100 mb-2">
                                            <p className="text-[11px] text-slate-600 font-mono">
                                                "O presente contrato será renovado automaticamente por igual período, salvo manifestação em contrário com antecedência mínima de 30 (trinta) dias."
                                            </p>
                                        </div>
                                        <p className="text-[10px] text-orange-700 font-medium flex gap-2 items-center">
                                            <ArrowRight size={12} /> A IA detectou divergência do padrão de 60 dias da empresa.
                                        </p>
                                    </div>

                                    {/* More Content to force scroll */}
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="space-y-3">
                                            <div className={`h-4 w-1/${i % 2 === 0 ? '3' : '4'} bg-slate-700 rounded mb-2`} />
                                            <div className="h-2 w-full bg-slate-200 rounded" />
                                            <div className="h-2 w-full bg-slate-200 rounded" />
                                            <div className="h-2 w-5/6 bg-slate-200 rounded" />
                                        </div>
                                    ))}

                                    {/* Signatures */}
                                    <div className="pt-12 mt-12 border-t border-slate-100 grid grid-cols-2 gap-12">
                                        <div className="space-y-2">
                                            <div className="h-16 border-b border-slate-300" />
                                            <div className="h-3 w-32 bg-slate-800 rounded mx-auto" />
                                            <div className="h-2 w-24 bg-slate-400 rounded mx-auto" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-16 border-b border-slate-300" />
                                            <div className="h-3 w-32 bg-slate-800 rounded mx-auto" />
                                            <div className="h-2 w-24 bg-slate-400 rounded mx-auto" />
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-300">
                                <span>Página 1 de 1</span>
                                <span>Confidencial</span>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Context & AI */}
                    <div className="w-[400px] bg-white border-l border-slate-100 p-6 flex flex-col gap-6 h-full">

                        {/* Status */}
                        <div className="shrink-0">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Status de Compliance</h4>
                            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                                <div className="p-2 bg-green-100 rounded-full">
                                    <ShieldCheck size={18} className="text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-green-800">Aprovado</p>
                                    <p className="text-[10px] text-green-600">Sem riscos críticos</p>
                                </div>
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="shrink-0">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Resumo Executivo</h4>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Documento padrão de prestação de serviços. Valores atualizados conforme IPCA. Cláusulas de confidencialidade e LGPD presentes e validadas.
                            </p>
                        </div>

                        {/* AI Chat Interaction */}
                        <div className="flex-1 min-h-0 flex flex-col">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Zap size={12} className="text-indigo-500" /> Chat Inteligente
                            </h4>
                            <AIChat />
                        </div>

                        {/* Actions */}
                        <div className="mt-auto pt-4 border-t border-slate-50 space-y-3 shrink-0">
                            <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white gap-2 h-11">
                                Iniciar Assinatura <ArrowRight size={16} />
                            </Button>
                            <Button variant="secondary" className="w-full gap-2 h-11 bg-slate-100 hover:bg-slate-200 border border-slate-200">
                                <Share2 size={16} /> Compartilhar
                            </Button>
                        </div>

                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
