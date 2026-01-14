import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { EditorStep, SealedDocument, SignatureField, Signer } from '@/types/signature';

interface SignatureState {
    step: EditorStep;
    selectedFile: File | null;
    fields: SignatureField[];
    signers: Signer[];
    sealedDocuments: SealedDocument[];

    // Actions
    setStep: (step: EditorStep) => void;
    setSelectedFile: (file: File | null) => void;

    // Field Actions
    addField: (field: SignatureField) => void;
    updateFieldPosition: (id: string, x: number, y: number) => void;
    updateFieldSigner: (id: string, signerId: string) => void;
    removeField: (id: string) => void;

    // Signer Actions
    addSigner: (signer: Signer) => void;
    removeSigner: (id: string) => void;

    // Sealed Document Actions
    addSealedDocument: (doc: SealedDocument) => void;

    reset: () => void;
}

export const useSignatureStore = create<SignatureState>()(
    persist(
        (set) => ({
            step: 'list',
            selectedFile: null,
            fields: [],
            signers: [],
            sealedDocuments: [],

            setStep: (step: EditorStep) => set({ step }),
            setSelectedFile: (file: File | null) => set({ selectedFile: file }),

            addField: (field: SignatureField) => set((state) => ({ fields: [...state.fields, field] })),
            updateFieldPosition: (id: string, x: number, y: number) => set((state) => ({
                fields: state.fields.map((f: SignatureField) => f.id === id ? { ...f, x, y } : f)
            })),
            updateFieldSigner: (id: string, signerId: string) => set((state) => ({
                fields: state.fields.map((f: SignatureField) => f.id === id ? { ...f, signerId } : f)
            })),
            removeField: (id: string) => set((state) => ({ fields: state.fields.filter((f: SignatureField) => f.id !== id) })),

            addSigner: (signer: Signer) => set((state) => ({ signers: [...state.signers, signer] })),
            removeSigner: (id: string) => set((state) => ({
                signers: state.signers.filter((s: Signer) => s.id !== id),
                fields: state.fields.map((f: SignatureField) => f.signerId === id ? { ...f, signerId: undefined } : f) // Clean up assigned fields
            })),

            addSealedDocument: (doc: SealedDocument) => set((state) => ({ sealedDocuments: [doc, ...state.sealedDocuments] })),

            reset: () => set({ step: 'list', selectedFile: null, fields: [], signers: [] }),
        }),
        {
            name: 'signature-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                // Persistir apenas documentos selados
                // Dados temporários (step, selectedFile, fields, signers) não persistem
                sealedDocuments: state.sealedDocuments,
            }),
            version: 1, // Para versionamento futuro
        }
    )
);

