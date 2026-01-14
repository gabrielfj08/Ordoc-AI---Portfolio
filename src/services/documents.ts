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
    description?: string;
    file_type: string;
    file_size: number;
    mime_type: string;
    prn: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string;

    // Relations
    directory?: string;
    directory_name?: string;
    department?: string;
    department_name?: string;
    created_by?: {
        id: string;
        email: string;
        first_name: string;
        last_name: string;
    };
    updated_by?: {
        id: string;
        email: string;
        first_name: string;
        last_name: string;
    };
    organization: string;

    // Document Classification
    document_type?: string;
    document_type_display?: string;

    // FSM Status
    status: 'created' | 'enqueued' | 'processed' | 'failed';

    // Document Status (Gmail-like)
    document_status: 'active' | 'archived' | 'trashed' | 'draft';

    // Flags LGPD / Business Logic
    contains_sensitive_data?: boolean;
    requires_signature?: boolean;
    has_deadline?: boolean;
    deadline_date?: string;
    is_from_external_source?: boolean;
    external_source_name?: string;
    is_public?: boolean;
    criticality: 'low' | 'medium' | 'high' | 'critical';

    // Versioning
    version: number;
    is_current_version: boolean;
    parent_document?: string;

    // OCR
    extracted_text?: string;
    ocr_confidence?: number;
    ocr_language?: string;

    // Gmail-like flags
    starred?: boolean;
    unread?: boolean;
    needs_signature?: boolean;
    is_shared?: boolean;

    // Archiving
    archived_at?: string;
    archived_by?: string;

    // Trash
    original_directory?: string;

    // Process tracking
    enqueued_at?: string;
    processed_at?: string;
    failed_at?: string;

    // Tags
    tags?: Tag[];
    tag_ids?: string[];

    // Favorites
    is_favorited?: boolean;
    favorited_count?: number;

    // Others
    metadata?: Record<string, any>;
}

export interface Tag {
    id: string;
    name: string;
    slug: string;
    color: string;
    description?: string;
    organization: string;
    created_at: string;
    updated_at: string;
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

export interface ActivityLog {
    id: string;
    action: string;
    action_display: string;
    description: string;
    entity_type: string;
    entity_id: string;
    entity_name?: string;
    user: string;
    user_name?: string;
    user_email?: string;
    metadata?: Record<string, any>;
    ip_address?: string;
    user_agent?: string;
    created_at: string;
}

export interface StorageStats {
    total_documents: number;
    total_size_bytes: number;
    total_size_mb: number;
    total_size_gb: number;
    by_file_type: {
        file_type: string;
        count: number;
        size_bytes: number;
    }[];
    by_status: {
        status: string;
        count: number;
    }[];
    by_month: {
        month: string;
        count: number;
        size_bytes: number;
    }[];
}

export interface BulkOperationResult {
    success: number;
    failed: number;
    details: {
        id: string;
        status: 'success' | 'error';
        message?: string;
    }[];
}

export interface ShareableLinkData {
    id: string;
    token: string;
    document: string;
    document_name?: string;
    expires_at?: string;
    max_accesses?: number;
    access_count: number;
    is_active: boolean;
    created_by: string;
    created_at: string;
}

export interface Department {
    id: string;
    name: string;
    description?: string;
    prn: string;
    is_active: boolean;
    organization: string;
    parent_department?: string;
    children_count?: number;
    created_at: string;
    updated_at: string;
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

    // ========== TAGS ==========

    /**
     * Listar tags da organização
     */
    async listTags(params?: { search?: string }): Promise<PaginatedResponse<Tag>> {
        const response = await apiClient.get<PaginatedResponse<Tag>>('/ordoc-air/tags/', { params });
        return response.data;
    }

    /**
     * Criar tag
     */
    async createTag(data: { name: string; color?: string; description?: string }): Promise<Tag> {
        const response = await apiClient.post<Tag>('/ordoc-air/tags/', data);
        return response.data;
    }

    /**
     * Atualizar tag
     */
    async updateTag(id: string, data: Partial<Tag>): Promise<Tag> {
        const response = await apiClient.patch<Tag>(`/ordoc-air/tags/${id}/`, data);
        return response.data;
    }

    /**
     * Deletar tag
     */
    async deleteTag(id: string): Promise<void> {
        await apiClient.delete(`/ordoc-air/tags/${id}/`);
    }

    /**
     * Adicionar tags a um documento
     */
    async addTags(documentId: string, tagIds: string[]): Promise<Document> {
        const response = await apiClient.post<Document>(
            `/ordoc-air/documents/${documentId}/add_tags/`,
            { tag_ids: tagIds }
        );
        return response.data;
    }

    /**
     * Remover tags de um documento
     */
    async removeTags(documentId: string, tagIds: string[]): Promise<Document> {
        const response = await apiClient.post<Document>(
            `/ordoc-air/documents/${documentId}/remove_tags/`,
            { tag_ids: tagIds }
        );
        return response.data;
    }

    // ========== DOCUMENT ACTIONS ==========

    /**
     * Marcar/desmarcar estrela (Gmail-style)
     */
    async toggleStar(id: string): Promise<{ starred: boolean }> {
        const response = await apiClient.post<{ starred: boolean }>(
            `/ordoc-air/documents/${id}/toggle_star/`
        );
        return response.data;
    }

    /**
     * Marcar como lido
     */
    async markRead(id: string): Promise<void> {
        await apiClient.post(`/ordoc-air/documents/${id}/mark_read/`);
    }

    /**
     * Mover documento para lixeira (soft delete)
     */
    async trash(id: string): Promise<void> {
        await apiClient.post(`/ordoc-air/documents/${id}/trash/`);
    }

    /**
     * Obter atividades do documento
     */
    async getActivity(id: string): Promise<ActivityLog[]> {
        const response = await apiClient.get<ActivityLog[]>(`/ordoc-air/documents/${id}/activity/`);
        return response.data;
    }

    /**
     * Criar nova versão de documento
     */
    async createVersion(id: string, file: File): Promise<Document> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await apiClient.post<Document>(
            `/ordoc-air/documents/${id}/create_version/`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    }

    /**
     * Listar versões de um documento
     */
    async getVersions(id: string): Promise<Document[]> {
        const response = await apiClient.get<Document[]>(`/ordoc-air/documents/${id}/versions/`);
        return response.data;
    }

    /**
     * Atualizar status do documento (FSM)
     */
    async updateStatus(id: string, newStatus: string): Promise<Document> {
        const response = await apiClient.post<Document>(
            `/ordoc-air/documents/${id}/update_status/`,
            { status: newStatus }
        );
        return response.data;
    }

    // ========== BULK OPERATIONS ==========

    /**
     * Mover múltiplos documentos para lixeira
     */
    async bulkTrash(documentIds: string[]): Promise<BulkOperationResult> {
        const response = await apiClient.post<BulkOperationResult>(
            '/ordoc-air/documents/bulk-trash/',
            { document_ids: documentIds }
        );
        return response.data;
    }

    /**
     * Restaurar múltiplos documentos da lixeira
     */
    async restoreBatch(documentIds: string[]): Promise<BulkOperationResult> {
        const response = await apiClient.post<BulkOperationResult>(
            '/ordoc-air/documents/restore_batch/',
            { document_ids: documentIds }
        );
        return response.data;
    }

    /**
     * Deletar múltiplos documentos permanentemente
     */
    async deleteBatch(documentIds: string[]): Promise<BulkOperationResult> {
        const response = await apiClient.post<BulkOperationResult>(
            '/ordoc-air/documents/delete_batch/',
            { document_ids: documentIds }
        );
        return response.data;
    }

    /**
     * Mover múltiplos itens (docs/folders) para uma pasta
     */
    async bulkMove(documentIds: string[], directoryId: string): Promise<BulkOperationResult> {
        const response = await apiClient.post<BulkOperationResult>(
            '/ordoc-air/documents/bulk-move/',
            { document_ids: documentIds, directory_id: directoryId }
        );
        return response.data;
    }

    // ========== SEARCH & FILTERS ==========

    /**
     * Busca full-text em documentos
     */
    async search(query: string, params?: { page?: number; page_size?: number }): Promise<DocumentListResponse> {
        const response = await apiClient.get<DocumentListResponse>('/ordoc-air/documents/search/', {
            params: { q: query, ...params },
        });
        return response.data;
    }

    /**
     * Listar documentos arquivados
     */
    async listArchived(params?: { page?: number; page_size?: number }): Promise<DocumentListResponse> {
        const response = await apiClient.get<DocumentListResponse>('/ordoc-air/documents/archived/', {
            params,
        });
        return response.data;
    }

    /**
     * Documentos recomendados pela IA
     */
    async getRecommended(): Promise<Document[]> {
        const response = await apiClient.get<Document[]>('/ordoc-air/documents/recommended/');
        return response.data;
    }

    // ========== STATISTICS ==========

    /**
     * Estatísticas de armazenamento
     */
    async getStorageStats(): Promise<StorageStats> {
        const response = await apiClient.get<StorageStats>('/ordoc-air/documents/storage_stats/');
        return response.data;
    }

    // ========== SHAREABLE LINKS ==========

    /**
     * Criar link compartilhável
     */
    async createShareableLink(
        documentId: string,
        data: {
            expires_at?: string;
            max_accesses?: number;
        }
    ): Promise<ShareableLinkData> {
        const response = await apiClient.post<ShareableLinkData>('/ordoc-air/shareable-links/', {
            document: documentId,
            ...data,
        });
        return response.data;
    }

    /**
     * Listar links compartilháveis de um documento
     */
    async listShareableLinks(documentId: string): Promise<PaginatedResponse<ShareableLinkData>> {
        const response = await apiClient.get<PaginatedResponse<ShareableLinkData>>(
            '/ordoc-air/shareable-links/',
            {
                params: { document: documentId },
            }
        );
        return response.data;
    }

    /**
     * Desativar link compartilhável
     */
    async deactivateShareableLink(linkId: string): Promise<void> {
        await apiClient.post(`/ordoc-air/shareable-links/${linkId}/deactivate/`);
    }

    // ========== DEPARTMENTS ==========

    /**
     * Listar departamentos
     */
    async listDepartments(params?: { page?: number; page_size?: number }): Promise<PaginatedResponse<Department>> {
        const response = await apiClient.get<PaginatedResponse<Department>>(
            '/ordoc-air/departments/',
            { params }
        );
        return response.data;
    }

    /**
     * Obter árvore de departamentos
     */
    async getDepartmentTree(): Promise<Department[]> {
        const response = await apiClient.get<Department[]>('/ordoc-air/departments/tree/');
        return response.data;
    }

    /**
     * Criar departamento
     */
    async createDepartment(data: {
        name: string;
        description?: string;
        parent_department?: string;
    }): Promise<Department> {
        const response = await apiClient.post<Department>('/ordoc-air/departments/', data);
        return response.data;
    }

    /**
     * Atualizar departamento
     */
    async updateDepartment(id: string, data: Partial<Department>): Promise<Department> {
        const response = await apiClient.patch<Department>(`/ordoc-air/departments/${id}/`, data);
        return response.data;
    }

    /**
     * Deletar departamento
     */
    async deleteDepartment(id: string): Promise<void> {
        await apiClient.delete(`/ordoc-air/departments/${id}/`);
    }

    // ========== ACTIVITY LOGS ==========

    /**
     * Listar logs de atividade
     */
    async listActivityLogs(params?: {
        entity_type?: string;
        entity_id?: string;
        user?: string;
        action?: string;
        page?: number;
        page_size?: number;
    }): Promise<PaginatedResponse<ActivityLog>> {
        const response = await apiClient.get<PaginatedResponse<ActivityLog>>(
            '/ordoc-air/activity-logs/',
            { params }
        );
        return response.data;
    }

    /**
     * Logs de atividade por entidade
     */
    async getActivityByEntity(entityType: string, entityId: string): Promise<ActivityLog[]> {
        const response = await apiClient.get<ActivityLog[]>('/ordoc-air/activity-logs/by_entity/', {
            params: { entity_type: entityType, entity_id: entityId },
        });
        return response.data;
    }

    /**
     * Logs de atividade por usuário
     */
    async getActivityByUser(userId: string): Promise<PaginatedResponse<ActivityLog>> {
        const response = await apiClient.get<PaginatedResponse<ActivityLog>>(
            '/ordoc-air/activity-logs/by_user/',
            {
                params: { user: userId },
            }
        );
        return response.data;
    }

    // ========== TRASH ==========

    /**
     * Listar itens na lixeira
     */
    async listTrash(params?: { page?: number; page_size?: number }): Promise<{
        documents: Document[];
        directories: Directory[];
    }> {
        const response = await apiClient.get<{
            documents: Document[];
            directories: Directory[];
        }>('/ordoc-air/trash/', { params });
        return response.data;
    }

    /**
     * Esvaziar lixeira (deleção permanente)
     */
    async emptyTrash(): Promise<{ deleted_count: number }> {
        const response = await apiClient.post<{ deleted_count: number }>(
            '/ordoc-air/trash/empty/'
        );
        return response.data;
    }
}

export const documentService = new DocumentService();
export default documentService;
