import apiClient from './api';

export interface SignatureDocument {
    id: string;
    name: string;
    status: 'draft' | 'pending' | 'signed' | 'sealed';
    createdAt: string;
    updatedAt: string;
    ownerId: string;
    ownerName: string;
    fileUrl?: string;
}

export interface Signer {
    id: string;
    name: string;
    email: string;
    role: 'signer' | 'approver' | 'witness';
    status: 'pending' | 'signed' | 'rejected';
    signedAt?: string;
}

export interface SignatureField {
    id: string;
    type: 'signature' | 'text' | 'date' | 'name';
    page: number;
    x: number;
    y: number;
    signerId?: string;
    label?: string;
}

export interface SealedDocument {
    id: string;
    documentId: string;
    sealedAt: string;
    hash: string;
    certificate: string;
}

class SignatureService {
    /**
     * Listar documentos para assinatura
     */
    async list(): Promise<SignatureDocument[]> {
        const response = await apiClient.get<SignatureDocument[]>('/signature/documents');
        return response.data;
    }

    /**
     * Obter documento por ID
     */
    async getById(id: string): Promise<SignatureDocument> {
        const response = await apiClient.get<SignatureDocument>(`/signature/documents/${id}`);
        return response.data;
    }

    /**
     * Criar documento para assinatura
     */
    async create(file: File, signers: Signer[]): Promise<SignatureDocument> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('signers', JSON.stringify(signers));

        const response = await apiClient.post<SignatureDocument>('/signature/documents', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    }

    /**
     * Selar documento
     */
    async seal(id: string): Promise<SealedDocument> {
        const response = await apiClient.post<SealedDocument>(`/signature/${id}/seal`);
        return response.data;
    }

    /**
     * Obter signatários de um documento
     */
    async getSigners(id: string): Promise<Signer[]> {
        const response = await apiClient.get<Signer[]>(`/signature/${id}/signers`);
        return response.data;
    }

    /**
     * Adicionar signatário
     */
    async addSigner(id: string, signer: Omit<Signer, 'id' | 'status'>): Promise<Signer> {
        const response = await apiClient.post<Signer>(`/signature/${id}/signers`, signer);
        return response.data;
    }

    /**
     * Assinar documento
     */
    async sign(id: string, signerId: string, signature: string): Promise<void> {
        await apiClient.post(`/signature/${id}/sign`, { signerId, signature });
    }
}

export const signatureService = new SignatureService();
export default signatureService;
