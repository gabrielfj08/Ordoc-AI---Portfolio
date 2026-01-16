"use client";

import { MainContainer } from "@/components/layout/MainContainer";
import { SignEditor } from "@/components/signature/SignEditor";
import { SignatureDashboard } from "@/components/signature/SignatureDashboard";
import { UploadSelector } from "@/components/signature/UploadSelector";
import { SignatureRequestStatusTracker } from "@/components/signatures/SignatureRequestStatusTracker";
import { useSignatureStore } from "@/store/signatureStore";
import { useState } from "react";

export default function SignaturePage() {
    const { step, setStep, selectedFile, setSelectedFile, reset } = useSignatureStore();
    const [viewingRequestId, setViewingRequestId] = useState<string | null>(null);

    const handleUpload = (file: File) => {
        setSelectedFile(file);
        setStep('prepare');
    };

    const handleBack = () => {
        setViewingRequestId(null);
        reset();
    };

    const handleViewRequest = (id: string) => {
        setViewingRequestId(id);
        setStep('view-request');
    };

    return (
        <MainContainer>
            {step === 'list' && (
                <SignatureDashboard
                    onNew={() => setStep('upload')}
                    onViewRequest={handleViewRequest}
                />
            )}

            {step === 'upload' && (
                <UploadSelector
                    onFileReady={handleUpload}
                    onCancel={handleBack}
                />
            )}

            {step === 'prepare' && (
                <SignEditor
                    docName={selectedFile?.name || "Sem título"}
                    onClose={handleBack}
                />
            )}

            {step === 'view-request' && viewingRequestId && (
                <div className="space-y-6">
                    <SignatureRequestStatusTracker requestId={viewingRequestId} />
                    <div className="flex justify-center">
                        <button
                            onClick={handleBack}
                            className="text-sm text-slate-600 hover:text-slate-800 underline"
                        >
                            Voltar para lista
                        </button>
                    </div>
                </div>
            )}
        </MainContainer>
    );
}
