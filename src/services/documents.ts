import apiClient from './api';

// ===== INTERFACES =====

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export interface Document {
    id: string;
    name: string;
    file_type: string;
    file_size: number;
    mime_type: string;
    created_at: string;
    updated_at: string;
    directory?: string;
    uploaded_by: {
        id: string;
        email: string;
        first_name: string;
        last_name: string;
    };
    organization: string;
    status: 'created' | 'enqueued' | 'processed' | 'failed';
    is_favorited?: boolean;
    is_shared?: boolean;
    is_archived?: boolean;
    in_trash?: boolean;
    tags?: string[];
    metadata?: Record<string, any>;
}

export interface Directory {
    id: string;
    name: string;
    description?: string;
    parent_directory?: string;
    parent_name?: string;
    department?: string;
    full_path?: string;
    children_count?: number;
    documents_count?: number;
    prn?: string;
    path: string;
    created_at: string;
    updated_at: string;
    is_active?: boolean;
}

export interface DocumentListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Document[];
}

export interface DirectoryListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Directory[];
}

export interface UploadProgress {
    loaded: number;
    total: number;
    percentage: number;
}

class DocumentService {
    /**
     * Listar documentos com paginação
     */
    async list(params?: {
        page?: number;
        page_size?: number;
        directory?: string;
        search?: string;
        file_type?: string;
        tags?: string;
        status?: string;
        is_favorited?: boolean;
        is_archived?: boolean;
        in_trash?: boolean;
    }): Promise<DocumentListResponse> {
        const response = await apiClient.get<DocumentListResponse>('/ordoc-air/documents/', { params });
        return response.data;
    }

    /**
     * Obter documento por ID
     */
    async getById(id: string): Promise<Document> {
        const response = await apiClient.get<Document>(`/ordoc-air/documents/${id}/`);
        return response.data;
    }

    /**
     * Upload de documento
     */
    async upload(
        file: File,
        directoryId?: string,
        onProgress?: (progress: UploadProgress) => void
    ): Promise<Document> {
        const formData = new FormData();
        formData.append('file', file);
        if (directoryId) {
            formData.append('directory', directoryId);
        }

        const response = await apiClient.post<Document>('/ordoc-air/documents/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress({
                        loaded: progressEvent.loaded,
                        total: progressEvent.total,
                        percentage,
                    });
                }
            },
        });

        return response.data;
    }

    /**
     * Atualizar documento
     */
    async update(id: string, data: Partial<Document>): Promise<Document> {
        const response = await apiClient.patch<Document>(`/ordoc-air/documents/${id}/`, data);
        return response.data;
    }

    /**
     * Deletar documento (soft delete)
     */
    async delete(id: string): Promise<void> {
        await apiClient.delete(`/ordoc-air/documents/${id}/`);
    }

    /**
     * Restaurar documento da lixeira
     */
    async restore(id: string): Promise<Document> {
        const response = await apiClient.post<Document>(`/ordoc-air/documents/${id}/restore/`);
        return response.data;
    }

    /**
     * Download de documento
     */
    async download(id: string): Promise<Blob> {
        const response = await apiClient.get(`/ordoc-air/documents/${id}/download/`, {
            responseType: 'blob',
        });
        return response.data;
    }

    /**
     * Favoritar documento
     */
    async favorite(id: string): Promise<void> {
        await apiClient.post(`/ordoc-air/documents/${id}/favorite/`);
    }

    /**
     * Desfavoritar documento
     */
    async unfavorite(id: string): Promise<void> {
        await apiClient.post(`/ordoc-air/documents/${id}/unfavorite/`);
    }

    /**
     * Arquivar documento
     */
    async archive(id: string): Promise<void> {
        await apiClient.post(`/ordoc-air/documents/${id}/archive/`);
    }

    /**
     * Desarquivar documento
     */
    async unarchive(id: string): Promise<void> {
        await apiClient.post(`/ordoc-air/documents/${id}/unarchive/`);
    }

    /**
     * Listar diretórios
     */
    async listDirectories(params?: {
        page?: number;
        page_size?: number;
        parent?: string;
        parent_directory?: string;
        in_trash?: boolean;
    }): Promise<DirectoryListResponse> {
        const response = await apiClient.get<DirectoryListResponse>('/ordoc-air/directories/', { params });
        return response.data;
    }

    /**
     * Obter árvore de diretórios
     */
    async getDirectoryTree(): Promise<Directory[]> {
        const response = await apiClient.get<Directory[]>('/ordoc-air/directories/tree/');
        return response.data;
    }

    /**
     * Criar diretório
     */
    async createDirectory(data: {
        name: string;
        parent_directory?: string;
        description?: string;
    }): Promise<Directory> {
        const response = await apiClient.post<Directory>('/ordoc-air/directories/', data);
        return response.data;
    }

    /**
     * Atualizar diretório
     */
    async updateDirectory(id: string, data: Partial<Directory>): Promise<Directory> {
        const response = await apiClient.patch<Directory>(`/ordoc-air/directories/${id}/`, data);
        return response.data;
    }

    /**
     * Deletar diretório
     */
    async deleteDirectory(id: string): Promise<void> {
        await apiClient.delete(`/ordoc-air/directories/${id}/`);
    }

    /**
     * Restaurar diretório
     */
    async restoreDirectory(id: string): Promise<Directory> {
        const response = await apiClient.post<Directory>(`/ordoc-air/directories/${id}/restore/`);
        return response.data;
    }
}

export const documentService = new DocumentService();
export default documentService;
