"use client";

import { useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X, FileText, Download, Share2, Zap, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AIChat } from "./AIChat";

interface DocumentPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    docId: string;
    docName: string;
    docType: string;
}

import { useDocumentAnalysis, useAnalyzeDocument } from "@/hooks/queries/useIntelligence";
import { DocumentPreview } from "./DocumentPreview";
import { AnalysisOverlay } from "./AnalysisOverlay";
import { toast } from "sonner";

export const DocumentPreviewModal = ({ isOpen, onClose, docId, docName, docType }: DocumentPreviewModalProps) => {
    const { data: analysis, isLoading, isError, error: analysisError } = useDocumentAnalysis(docId, {
        enabled: isOpen && !!docId,
        refetchInterval: (query) => {
            // Poll every 3 seconds if status is pending or processing
            const data = query.state.data as any;
            if (!data || data.status === 'pending' || data.status === 'processing') {
                return 3000;
            }
            return false;
        },
        retry: false
    });

    const analyzeMutation = useAnalyzeDocument();

    const handleAnalyze = async () => {
        try {
            await analyzeMutation.mutateAsync({
                document_id: docId,
                document_content: 'Contrato padrão de prestação de serviços...', // No mockup, idealmente pegaria o texto real
                analysis_depth: 'full'
            });
        } catch (err) {
            console.error("Erro ao analisar:", err);
        }
    };

    const is404 = (analysisError as any)?.response?.status === 404;
    const isPending = analysis?.status === 'pending' || !analysis;

    // Trigger analysis automatically if it doesn't exist
    useEffect(() => {
        if (isOpen && (is404 || isPending) && !analyzeMutation.isPending && !analyzeMutation.isSuccess) {
            handleAnalyze();
        }
    }, [isOpen, is404, isPending]);

    const isPdf = docType.toLowerCase().includes('pdf') || docName.toLowerCase().endsWith('.pdf');
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-7xl h-[92vh] p-0 gap-0 overflow-hidden bg-white border-0 shadow-2xl rounded-2xl flex flex-col">
                <DialogDescription className="sr-only">
                    Visualização do documento {docName} com análise de inteligência artificial.
                </DialogDescription>

                {/* Header - Mais limpo e integrado */}
                <div className="h-12 border-b border-slate-50 flex items-center justify-between px-4 bg-white z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-red-50 rounded-lg">
                            <FileText size={18} className="text-red-500" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <DialogTitle className="text-sm font-bold text-slate-800">{docName}</DialogTitle>
                                {analyzeMutation.isPending && (
                                    <Badge className="bg-indigo-50 text-indigo-600 border-indigo-100 animate-pulse text-[9px] h-4 px-1.5 py-0">
                                        Processando IA...
                                    </Badge>
                                )}
                            </div>
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
                    <div className="flex-1 bg-white relative overflow-hidden flex flex-col">
                        <AnalysisOverlay
                            analysis={analysis}
                            isLoading={isLoading || analyzeMutation.isPending || isPending}
                        />
                        <DocumentPreview
                            documentId={docId}
                            mimeType={isPdf ? 'application/pdf' : 'image/jpeg'}
                            className="w-full h-full"
                        />
                    </div>

                    {/* Sidebar - Context & AI */}
                    <div className="w-[400px] bg-white border-l border-slate-100 flex flex-col h-full overflow-hidden">

                        {/* Header do Chat - Mais discreto */}
                        <div className="p-4 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-indigo-50 rounded-lg">
                                    <Zap size={14} className="text-indigo-600" />
                                </div>
                                <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">Ordoc AI Chat</span>
                            </div>
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] text-slate-400 font-medium">Online</span>
                            </div>
                        </div>

                        {/* AI Chat Interaction - Agora ocupa quase tudo */}
                        <div className="flex-1 min-h-0 flex flex-col p-4">
                            <AIChat documentId={docId} />
                        </div>

                        {/* Actions */}
                        <div className="mt-auto p-4 border-t border-slate-50 space-y-2 shrink-0 bg-slate-50/50">
                            <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white gap-2 h-10 text-xs">
                                Iniciar Assinatura <ArrowRight size={14} />
                            </Button>
                            <Button variant="secondary" className="w-full gap-2 h-10 bg-white hover:bg-slate-50 border border-slate-200 text-xs">
                                <Share2 size={14} /> Compartilhar
                            </Button>
                        </div>

                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
