"use client";

import { MainContainer } from "@/components/layout/MainContainer";
import { SignEditor } from "@/components/signature/SignEditor";
import { SignatureDashboard } from "@/components/signature/SignatureDashboard";
import { UploadSelector } from "@/components/signature/UploadSelector";
import { useSignatureStore } from "@/store/signatureStore";

export default function SignaturePage() {
    const { step, setStep, selectedFile, setSelectedFile, reset } = useSignatureStore();

    const handleUpload = (file: File) => {
        setSelectedFile(file);
        setStep('prepare');
    };

    const handleBack = () => {
        reset();
    };

    return (
        <MainContainer>
            {step === 'list' && (
                <SignatureDashboard onNew={() => setStep('upload')} />
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
        </MainContainer>
    );
}