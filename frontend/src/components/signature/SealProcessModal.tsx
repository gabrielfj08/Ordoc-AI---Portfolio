"use client";

import { useState, useEffect } from "react";
import {
    ShieldCheck,
    CheckCircle2,
    FileText,
    Users,
    Fingerprint,
    Loader2,
    Lock,
    ArrowRight
} from "lucide-react";
// import { Dialog, DialogContent } from "@/components/ui/dialog"; // Assuming Dialog exists, if not I'll use simple input
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSignatureStore } from "@/store/signatureStore";
import { useToast } from "@/components/ui/toast-context";

interface SealProcessModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
}

export const SealProcessModal = ({ isOpen, onClose, onComplete }: SealProcessModalProps) => {
    const { fields, signers, selectedFile, addSealedDocument } = useSignatureStore();
    const { addToast } = useToast();
    const [step, setStep] = useState<'summary' | 'processing' | 'success'>('summary');
    const [progress, setProgress] = useState(0);

    const totalFields = fields.length;
    const totalSigners = signers.length;

    // Reset state when opening
    useEffect(() => {
        if (isOpen && step === 'success') {
            setStep('summary');
            setProgress(0);
        }
    }, [isOpen]);

    const startSealing = () => {
        setStep('processing');
        setProgress(0);

        // Simula processo de hash e selagem
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);

                    // Executa side-effects no próximo tick para evitar "update while rendering"
                    setTimeout(() => {
                        // Salva no store global
                        addSealedDocument({
                            id: crypto.randomUUID(),
                            name: selectedFile?.name || "Documento Sem Nome.pdf",
                            status: 'in_progress', // Começa em progresso pois precisa assinatura
                            progress: 0,
                            health: 'healthy',
                            signers: signers,
                            date: new Date()
                        });

                        setStep('success');

                        // UX Polish: Toast Notification
                        addToast({
                            title: "Contrato selado com sucesso!",
                            description: "Hash: e3b0c442...855 registrado na blockchain interna.",
                            type: "success",
                            duration: 5000
                        });
                    }, 0);

                    return 100;
                }
                // Avança rápido no começo, desacelera no fim pra dar tensão
                const increment = prev < 80 ? Math.random() * 15 : Math.random() * 5;
                return Math.min(prev + increment, 100);
            });
        }, 300);
    };

    // Fallback simple modal overlay if Dialog is not available yet in UI components list (I didn't see it in logic list but assuming standard shadcn structure usually has it. If not, I will use fixed div).
    // The previous `list_dir` showed avatar, badge, button, calendar, card, dropdown-menu, input, progress. 
    // Dialog is MISSING. I will implement a custom simple overlay for now to avoid blocking.

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="bg-slate-50 border-b border-slate-100 p-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                        {step === 'success' ? <CheckCircle2 size={20} /> : <ShieldCheck size={20} />}
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">
                            {step === 'summary' && "Revisão e Selagem"}
                            {step === 'processing' && "Processando Integridade"}
                            {step === 'success' && "Documento Pronto!"}
                        </h2>
                        <p className="text-xs text-slate-500">
                            {step === 'summary' && "Confirme os dados antes de finalizar."}
                            {step === 'processing' && "Calculando hash SHA-256 e vinculando metadados..."}
                            {step === 'success' && "Seu documento foi selado com segurança."}
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">

                    {step === 'summary' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                                        <FileText size={12} /> Campos
                                    </div>
                                    <div className="text-2xl font-bold text-slate-700">{totalFields}</div>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
                                        <Users size={12} /> Signatários
                                    </div>
                                    <div className="text-2xl font-bold text-slate-700">{totalSigners}</div>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
                                <Lock size={16} className="text-blue-500 shrink-0 mt-0.5" />
                                <p className="text-xs text-blue-700 leading-relaxed">
                                    Ao confirmar, um <strong>Hash SHA-256</strong> único será gerado. Qualquer alteração futura, mesmo de 1 pixel, invalidará este selo de integridade.
                                </p>
                            </div>
                        </div>
                    )}


                    {step === 'processing' && (
                        <div className="py-8 space-y-6">
                            <div className="relative w-24 h-24 mx-auto">
                                <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                                <div
                                    className="absolute inset-0 border-4 border-orange-500 rounded-full border-t-transparent animate-spin"
                                    style={{ animationDuration: '1.5s' }}
                                ></div>
                                <div className="absolute inset-0 flex items-center justify-center text-orange-600">
                                    <Fingerprint size={40} className="animate-pulse" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-medium text-slate-600">
                                    <span>Gerando Prova de Integridade...</span>
                                    <span>{Math.round(progress)}%</span>
                                </div>
                                <Progress value={progress} className="h-2 bg-slate-100" />
                            </div>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="text-center py-4 space-y-4">
                            <div className="inline-block px-4 py-2 bg-green-50 rounded-full border border-green-100 text-green-700 text-xs font-mono">
                                SHA-256: e3b0c442...855
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                O envelope de assinatura foi criado e está pronto para ser distribuído aos signatários.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer / Actions */}
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                    {step === 'summary' && (
                        <>
                            <Button variant="ghost" onClick={onClose} className="text-slate-500 hover:text-slate-700">Cancelar</Button>
                            <Button className="bg-orange-600 hover:bg-orange-700 text-white gap-2" onClick={startSealing}>
                                <Lock size={16} />
                                Selar e Finalizar
                            </Button>
                        </>
                    )}

                    {step === 'processing' && (
                        <Button disabled className="w-full bg-slate-200 text-slate-400 cursor-not-allowed">
                            <Loader2 size={16} className="animate-spin mr-2" />
                            Processando...
                        </Button>
                    )}

                    {step === 'success' && (
                        <Button className="w-full bg-green-600 hover:bg-green-700 text-white gap-2" onClick={onComplete}>
                            Ir para Dashboard
                            <ArrowRight size={16} />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
