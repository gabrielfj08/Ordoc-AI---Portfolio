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
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSignatureStore } from "@/store/signatureStore";
import { useCreateSignatureRequest } from "@/hooks/queries/useSignature";
import { useUploadDocument } from "@/hooks/queries/useDocuments";
import { toast } from "sonner";

interface SealProcessModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
}

export const SealProcessModal = ({ isOpen, onClose, onComplete }: SealProcessModalProps) => {
    const { fields, signers, selectedFile, addSealedDocument } = useSignatureStore();
    const [step, setStep] = useState<'summary' | 'uploading' | 'creating' | 'success'>('summary');
    const [progress, setProgress] = useState(0);
    const [uploadedDocumentId, setUploadedDocumentId] = useState<string | null>(null);

    const uploadDocumentMutation = useUploadDocument();
    const createSignatureRequest = useCreateSignatureRequest({
        onSuccess: (data) => {
            toast.success('Solicitação de assinatura criada com sucesso!');
            setStep('success');

            // Salvar no store local para histórico
            addSealedDocument({
                id: data.id,
                name: selectedFile?.name || "Documento",
                status: data.status as any,
                progress: data.progress_percentage || 0,
                health: 'healthy',
                signers: signers,
                date: new Date()
            });
        },
        onError: (error) => {
            toast.error('Erro ao criar solicitação de assinatura');
            console.error(error);
            setStep('summary');
        },
    });

    const totalFields = fields.length;
    const totalSigners = signers.length;

    // Reset state when opening
    useEffect(() => {
        if (isOpen && step === 'success') {
            setStep('summary');
            setProgress(0);
            setUploadedDocumentId(null);
        }
    }, [isOpen]);

    const startSealing = async () => {
        if (!selectedFile) {
            toast.error('Nenhum arquivo selecionado');
            return;
        }

        if (signers.length === 0) {
            toast.error('Adicione pelo menos um signatário');
            return;
        }

        try {
            // Passo 1: Upload do documento
            setStep('uploading');
            setProgress(0);

            const progressInterval = setInterval(() => {
                setProgress((prev) => Math.min(prev + 10, 90));
            }, 200);

            const uploadedDoc = await uploadDocumentMutation.mutateAsync({
                file: selectedFile,
            });

            clearInterval(progressInterval);
            setProgress(95);

            if (!uploadedDoc || !uploadedDoc.id) {
                throw new Error('Falha no upload do documento');
            }

            setUploadedDocumentId(uploadedDoc.id);

            // Passo 2: Criar solicitação de assinatura
            setStep('creating');
            setProgress(100);

            await createSignatureRequest.mutateAsync({
                document_id: uploadedDoc.id,
                signers: signers.map((signer, index) => ({
                    email: signer.email,
                    name: signer.name,
                    order: index + 1,
                })),
                message: `Por favor, assine o documento: ${selectedFile.name}`,
            });

        } catch (error) {
            console.error('Erro no processo de selagem:', error);
            toast.error('Erro ao processar documento');
            setStep('summary');
        }
    };

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
                            {step === 'uploading' && "Enviando Documento"}
                            {step === 'creating' && "Criando Solicitação"}
                            {step === 'success' && "Documento Pronto!"}
                        </h2>
                        <p className="text-xs text-slate-500">
                            {step === 'summary' && "Confirme os dados antes de finalizar."}
                            {step === 'uploading' && "Fazendo upload seguro do documento..."}
                            {step === 'creating' && "Configurando fluxo de assinatura..."}
                            {step === 'success' && "Seu documento foi preparado com sucesso."}
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

                            {signers.length === 0 && (
                                <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                                    <p className="text-xs text-red-700">
                                        ⚠️ Adicione pelo menos um signatário antes de finalizar
                                    </p>
                                </div>
                            )}

                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
                                <Lock size={16} className="text-blue-500 shrink-0 mt-0.5" />
                                <p className="text-xs text-blue-700 leading-relaxed">
                                    Ao confirmar, o documento será enviado ao backend de forma segura e uma solicitação de assinatura será criada.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs font-semibold text-slate-600">Signatários:</p>
                                <div className="space-y-1">
                                    {signers.map((signer, index) => (
                                        <div key={signer.id} className="flex items-center gap-2 text-xs text-slate-600">
                                            <div
                                                className="w-2 h-2 rounded-full"
                                                style={{ backgroundColor: signer.color }}
                                            />
                                            <span>
                                                {index + 1}. {signer.name} ({signer.email})
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}


                    {(step === 'uploading' || step === 'creating') && (
                        <div className="py-8 space-y-6">
                            <div className="relative w-24 h-24 mx-auto">
                                <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                                <div
                                    className="absolute inset-0 border-4 border-orange-500 rounded-full border-t-transparent animate-spin"
                                    style={{ animationDuration: '1.5s' }}
                                ></div>
                                <div className="absolute inset-0 flex items-center justify-center text-orange-600">
                                    {step === 'uploading' ? (
                                        <FileText size={40} className="animate-pulse" />
                                    ) : (
                                        <Fingerprint size={40} className="animate-pulse" />
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-medium text-slate-600">
                                    <span>
                                        {step === 'uploading' ? 'Enviando documento...' : 'Criando solicitação...'}
                                    </span>
                                    <span>{Math.round(progress)}%</span>
                                </div>
                                <Progress value={progress} className="h-2 bg-slate-100" />
                            </div>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="text-center py-4 space-y-4">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-100 text-green-700 text-xs">
                                <CheckCircle2 size={16} />
                                <span className="font-medium">Solicitação criada com sucesso!</span>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                O documento foi enviado e a solicitação de assinatura foi criada. Os signatários serão notificados em breve.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer / Actions */}
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                    {step === 'summary' && (
                        <>
                            <Button
                                variant="ghost"
                                onClick={onClose}
                                className="text-slate-500 hover:text-slate-700"
                            >
                                Cancelar
                            </Button>
                            <Button
                                className="bg-orange-600 hover:bg-orange-700 text-white gap-2"
                                onClick={startSealing}
                                disabled={signers.length === 0 || !selectedFile}
                            >
                                <Lock size={16} />
                                Finalizar e Enviar
                            </Button>
                        </>
                    )}

                    {(step === 'uploading' || step === 'creating') && (
                        <Button disabled className="w-full bg-slate-200 text-slate-400 cursor-not-allowed">
                            <Loader2 size={16} className="animate-spin mr-2" />
                            {step === 'uploading' ? 'Enviando...' : 'Criando...'}
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
