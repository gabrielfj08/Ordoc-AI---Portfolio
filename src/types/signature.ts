export interface SignatureField {
    id: string;
    type: 'signature' | 'text' | 'date' | 'name';
    page: number;
    x: number; // Porcentagem 0-100
    y: number; // Porcentagem 0-100
    signerId?: string;
    label?: string; // Para exibição na UI
}

export type EditorStep = 'list' | 'upload' | 'prepare' | 'view-request';

export interface SignatureDocument {
    id: string;
    file: File | null;
    fields: SignatureField[];
}

export interface Signer {
    id: string;
    name: string;
    email: string;
    color: string;
}

export interface SealedDocument {
    id: string;
    name: string;
    status: 'completed' | 'pending' | 'in_progress';
    progress: number;
    health: 'healthy' | 'review_needed';
    signers: Signer[];
    date: Date;
}
