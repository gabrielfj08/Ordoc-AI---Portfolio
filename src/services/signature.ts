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
        const response = await apiClient.get<any>('/ordoc-sign/requests/'); // Requests hold the documents
        return response.data.results;
    }

    /**
     * Obter documento por ID
     */
    async getById(id: string): Promise<SignatureDocument> {
        const response = await apiClient.get<SignatureDocument>(`/ordoc-sign/requests/${id}/`);
        return response.data;
    }

    /**
     * Criar documento para assinatura
     */
    async create(file: File, signers: Signer[]): Promise<SignatureDocument> {
        const formData = new FormData();
        formData.append('original_file', file);
        formData.append('signers', JSON.stringify(signers));

        const response = await apiClient.post<SignatureDocument>('/ordoc-sign/requests/', formData, {
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
        // Mapeando para finalizar ou selar (dependendo da implementação backend, assumindo endpoint customizado ou finish)
        const response = await apiClient.post<SealedDocument>(`/ordoc-sign/requests/${id}/finish/`);
        return response.data;
    }

    /**
     * Obter signatários de um documento
     */
    async getSigners(id: string): Promise<Signer[]> {
        const response = await apiClient.get<any>(`/ordoc-sign/signers/`, { params: { request: id } });
        return response.data.results;
    }

    /**
     * Adicionar signatário
     */
    async addSigner(id: string, signer: Omit<Signer, 'id' | 'status'>): Promise<Signer> {
        const response = await apiClient.post<Signer>(`/ordoc-sign/signers/`, { ...signer, request: id });
        return response.data;
    }

    /**
     * Assinar documento
     */
    async sign(id: string, signerId: string, signature: string): Promise<void> {
        await apiClient.post(`/ordoc-sign/signatures/`, {
            request: id,
            signer: signerId,
            signature_data: signature
        });
    }
}

export const signatureService = new SignatureService();
export default signatureService;
