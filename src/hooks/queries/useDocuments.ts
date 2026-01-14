import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import documentService, {
    Document,
    Directory,
    Tag,
    ActivityLog,
    StorageStats,
    Department,
    ShareableLinkData,
    UploadProgress,
} from '@/services/documents';

// ========== QUERY KEYS ==========

export const documentKeys = {
    all: ['documents'] as const,
    lists: () => [...documentKeys.all, 'list'] as const,
    list: (filters?: Record<string, any>) => [...documentKeys.lists(), filters] as const,
    details: () => [...documentKeys.all, 'detail'] as const,
    detail: (id: string) => [...documentKeys.details(), id] as const,
    versions: (id: string) => [...documentKeys.detail(id), 'versions'] as const,
    activity: (id: string) => [...documentKeys.detail(id), 'activity'] as const,
    recommended: () => [...documentKeys.all, 'recommended'] as const,
    archived: () => [...documentKeys.all, 'archived'] as const,
    search: (query: string) => [...documentKeys.all, 'search', query] as const,
    stats: () => [...documentKeys.all, 'stats'] as const,
};

export const directoryKeys = {
    all: ['directories'] as const,
    lists: () => [...directoryKeys.all, 'list'] as const,
    list: (filters?: Record<string, any>) => [...directoryKeys.lists(), filters] as const,
    tree: () => [...directoryKeys.all, 'tree'] as const,
    details: () => [...directoryKeys.all, 'detail'] as const,
    detail: (id: string) => [...directoryKeys.details(), id] as const,
};

export const tagKeys = {
    all: ['tags'] as const,
    lists: () => [...tagKeys.all, 'list'] as const,
    list: (filters?: Record<string, any>) => [...tagKeys.lists(), filters] as const,
};

export const departmentKeys = {
    all: ['departments'] as const,
    lists: () => [...departmentKeys.all, 'list'] as const,
    list: (filters?: Record<string, any>) => [...departmentKeys.lists(), filters] as const,
    tree: () => [...departmentKeys.all, 'tree'] as const,
};

export const activityKeys = {
    all: ['activity-logs'] as const,
    lists: () => [...activityKeys.all, 'list'] as const,
    list: (filters?: Record<string, any>) => [...activityKeys.lists(), filters] as const,
    byEntity: (entityType: string, entityId: string) =>
        [...activityKeys.all, 'entity', entityType, entityId] as const,
    byUser: (userId: string) => [...activityKeys.all, 'user', userId] as const,
};

export const trashKeys = {
    all: ['trash'] as const,
};

// ========== DOCUMENT HOOKS ==========

/**
 * Hook para listar documentos
 */
export function useDocuments(filters?: {
    directory?: string;
    search?: string;
    file_type?: string;
    tags?: string;
    status?: string;
    is_favorited?: boolean;
    is_archived?: boolean;
    in_trash?: boolean;
    page?: number;
    page_size?: number;
}) {
    return useQuery({
        queryKey: documentKeys.list(filters),
        queryFn: () => documentService.list(filters),
    });
}

/**
 * Hook para obter documento por ID
 */
export function useDocument(id: string) {
    return useQuery({
        queryKey: documentKeys.detail(id),
        queryFn: () => documentService.getById(id),
        enabled: !!id,
    });
}

/**
 * Hook para obter versões de um documento
 */
export function useDocumentVersions(id: string) {
    return useQuery({
        queryKey: documentKeys.versions(id),
        queryFn: () => documentService.getVersions(id),
        enabled: !!id,
    });
}

/**
 * Hook para obter atividades de um documento
 */
export function useDocumentActivity(id: string) {
    return useQuery({
        queryKey: documentKeys.activity(id),
        queryFn: () => documentService.getActivity(id),
        enabled: !!id,
    });
}

/**
 * Hook para documentos recomendados
 */
export function useRecommendedDocuments() {
    return useQuery({
        queryKey: documentKeys.recommended(),
        queryFn: () => documentService.getRecommended(),
    });
}

/**
 * Hook para documentos arquivados
 */
export function useArchivedDocuments(params?: { page?: number; page_size?: number }) {
    return useQuery({
        queryKey: documentKeys.archived(),
        queryFn: () => documentService.listArchived(params),
    });
}

/**
 * Hook para busca de documentos
 */
export function useDocumentSearch(query: string, params?: { page?: number; page_size?: number }) {
    return useQuery({
        queryKey: documentKeys.search(query),
        queryFn: () => documentService.search(query, params),
        enabled: query.length >= 3,
    });
}

/**
 * Hook para estatísticas de armazenamento
 */
export function useStorageStats() {
    return useQuery({
        queryKey: documentKeys.stats(),
        queryFn: () => documentService.getStorageStats(),
    });
}

// ========== DOCUMENT MUTATIONS ==========

/**
 * Hook para upload de documento
 */
export function useUploadDocument() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            file,
            directoryId,
            onProgress,
        }: {
            file: File;
            directoryId?: string;
            onProgress?: (progress: UploadProgress) => void;
        }) => documentService.upload(file, directoryId, onProgress),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
            queryClient.invalidateQueries({ queryKey: documentKeys.stats() });
            queryClient.invalidateQueries({ queryKey: ['analytics'] });
        },
    });
}

/**
 * Hook para atualizar documento
 */
export function useUpdateDocument() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Document> }) =>
            documentService.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: documentKeys.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
        },
    });
}

/**
 * Hook para deletar documento
 */
export function useDeleteDocument() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => documentService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
            queryClient.invalidateQueries({ queryKey: documentKeys.details() });
            queryClient.invalidateQueries({ queryKey: documentKeys.stats() });
        },
    });
}

/**
 * Hook para mover documento para lixeira
 */
export function useTrashDocument() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => documentService.trash(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
            queryClient.invalidateQueries({ queryKey: trashKeys.all });
        },
    });
}

/**
 * Hook para restaurar documento
 */
export function useRestoreDocument() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => documentService.restore(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
            queryClient.invalidateQueries({ queryKey: trashKeys.all });
        },
    });
}

/**
 * Hook para favoritar documento
 */
export function useFavoriteDocument() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => documentService.favorite(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: documentKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
        },
    });
}

/**
 * Hook para desfavoritar documento
 */
export function useUnfavoriteDocument() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => documentService.unfavorite(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: documentKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
        },
    });
}

/**
 * Hook para arquivar documento
 */
export function useArchiveDocument() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => documentService.archive(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: documentKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
            queryClient.invalidateQueries({ queryKey: documentKeys.archived() });
        },
    });
}

/**
 * Hook para desarquivar documento
 */
export function useUnarchiveDocument() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => documentService.unarchive(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: documentKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
            queryClient.invalidateQueries({ queryKey: documentKeys.archived() });
        },
    });
}

/**
 * Hook para toggle star
 */
export function useToggleStar() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => documentService.toggleStar(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: documentKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
        },
    });
}

/**
 * Hook para marcar como lido
 */
export function useMarkRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => documentService.markRead(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: documentKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
        },
    });
}

/**
 * Hook para criar versão
 */
export function useCreateVersion() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, file }: { id: string; file: File }) =>
            documentService.createVersion(id, file),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: documentKeys.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: documentKeys.versions(variables.id) });
            queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
        },
    });
}

/**
 * Hook para atualizar status FSM
 */
export function useUpdateDocumentStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            documentService.updateStatus(id, status),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: documentKeys.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
        },
    });
}

// ========== BULK OPERATIONS ==========

/**
 * Hook para bulk trash
 */
export function useBulkTrash() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (documentIds: string[]) => documentService.bulkTrash(documentIds),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
            queryClient.invalidateQueries({ queryKey: trashKeys.all });
        },
    });
}

/**
 * Hook para bulk restore
 */
export function useBulkRestore() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (documentIds: string[]) => documentService.restoreBatch(documentIds),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
            queryClient.invalidateQueries({ queryKey: trashKeys.all });
        },
    });
}

/**
 * Hook para bulk delete
 */
export function useBulkDelete() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (documentIds: string[]) => documentService.deleteBatch(documentIds),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
            queryClient.invalidateQueries({ queryKey: trashKeys.all });
            queryClient.invalidateQueries({ queryKey: documentKeys.stats() });
        },
    });
}

/**
 * Hook para bulk move
 */
export function useBulkMove() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ documentIds, directoryId }: { documentIds: string[]; directoryId: string }) =>
            documentService.bulkMove(documentIds, directoryId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
            queryClient.invalidateQueries({ queryKey: directoryKeys.lists() });
        },
    });
}

// ========== TAGS HOOKS ==========

/**
 * Hook para listar tags
 */
export function useTags(filters?: { search?: string }) {
    return useQuery({
        queryKey: tagKeys.list(filters),
        queryFn: () => documentService.listTags(filters),
    });
}

/**
 * Hook para criar tag
 */
export function useCreateTag() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { name: string; color?: string; description?: string }) =>
            documentService.createTag(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tagKeys.lists() });
        },
    });
}

/**
 * Hook para atualizar tag
 */
export function useUpdateTag() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Tag> }) =>
            documentService.updateTag(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tagKeys.lists() });
        },
    });
}

/**
 * Hook para deletar tag
 */
export function useDeleteTag() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => documentService.deleteTag(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tagKeys.lists() });
            queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
        },
    });
}

/**
 * Hook para adicionar tags
 */
export function useAddTags() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ documentId, tagIds }: { documentId: string; tagIds: string[] }) =>
            documentService.addTags(documentId, tagIds),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: documentKeys.detail(variables.documentId) });
            queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
        },
    });
}

/**
 * Hook para remover tags
 */
export function useRemoveTags() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ documentId, tagIds }: { documentId: string; tagIds: string[] }) =>
            documentService.removeTags(documentId, tagIds),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: documentKeys.detail(variables.documentId) });
            queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
        },
    });
}

// ========== DIRECTORY HOOKS ==========

/**
 * Hook para listar diretórios
 */
export function useDirectories(filters?: {
    parent?: string;
    parent_directory?: string;
    in_trash?: boolean;
    page?: number;
    page_size?: number;
}) {
    return useQuery({
        queryKey: directoryKeys.list(filters),
        queryFn: () => documentService.listDirectories(filters),
    });
}

/**
 * Hook para árvore de diretórios
 */
export function useDirectoryTree() {
    return useQuery({
        queryKey: directoryKeys.tree(),
        queryFn: () => documentService.getDirectoryTree(),
    });
}

/**
 * Hook para criar diretório
 */
export function useCreateDirectory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { name: string; parent_directory?: string; description?: string }) =>
            documentService.createDirectory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: directoryKeys.lists() });
            queryClient.invalidateQueries({ queryKey: directoryKeys.tree() });
        },
    });
}

/**
 * Hook para atualizar diretório
 */
export function useUpdateDirectory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Directory> }) =>
            documentService.updateDirectory(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: directoryKeys.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: directoryKeys.lists() });
            queryClient.invalidateQueries({ queryKey: directoryKeys.tree() });
        },
    });
}

/**
 * Hook para deletar diretório
 */
export function useDeleteDirectory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => documentService.deleteDirectory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: directoryKeys.lists() });
            queryClient.invalidateQueries({ queryKey: directoryKeys.tree() });
            queryClient.invalidateQueries({ queryKey: trashKeys.all });
        },
    });
}

/**
 * Hook para restaurar diretório
 */
export function useRestoreDirectory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => documentService.restoreDirectory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: directoryKeys.lists() });
            queryClient.invalidateQueries({ queryKey: directoryKeys.tree() });
            queryClient.invalidateQueries({ queryKey: trashKeys.all });
        },
    });
}

// ========== DEPARTMENT HOOKS ==========

/**
 * Hook para listar departamentos
 */
export function useDepartments(filters?: { page?: number; page_size?: number }) {
    return useQuery({
        queryKey: departmentKeys.list(filters),
        queryFn: () => documentService.listDepartments(filters),
    });
}

/**
 * Hook para árvore de departamentos
 */
export function useDepartmentTree() {
    return useQuery({
        queryKey: departmentKeys.tree(),
        queryFn: () => documentService.getDepartmentTree(),
    });
}

/**
 * Hook para criar departamento
 */
export function useCreateDepartment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { name: string; description?: string; parent_department?: string }) =>
            documentService.createDepartment(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
            queryClient.invalidateQueries({ queryKey: departmentKeys.tree() });
        },
    });
}

/**
 * Hook para atualizar departamento
 */
export function useUpdateDepartment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Department> }) =>
            documentService.updateDepartment(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
            queryClient.invalidateQueries({ queryKey: departmentKeys.tree() });
        },
    });
}

/**
 * Hook para deletar departamento
 */
export function useDeleteDepartment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => documentService.deleteDepartment(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
            queryClient.invalidateQueries({ queryKey: departmentKeys.tree() });
        },
    });
}

// ========== ACTIVITY LOGS HOOKS ==========

/**
 * Hook para listar activity logs
 */
export function useActivityLogs(filters?: {
    entity_type?: string;
    entity_id?: string;
    user?: string;
    action?: string;
    page?: number;
    page_size?: number;
}) {
    return useQuery({
        queryKey: activityKeys.list(filters),
        queryFn: () => documentService.listActivityLogs(filters),
    });
}

/**
 * Hook para activity logs por entidade
 */
export function useActivityByEntity(entityType: string, entityId: string) {
    return useQuery({
        queryKey: activityKeys.byEntity(entityType, entityId),
        queryFn: () => documentService.getActivityByEntity(entityType, entityId),
        enabled: !!entityType && !!entityId,
    });
}

/**
 * Hook para activity logs por usuário
 */
export function useActivityByUser(userId: string) {
    return useQuery({
        queryKey: activityKeys.byUser(userId),
        queryFn: () => documentService.getActivityByUser(userId),
        enabled: !!userId,
    });
}

// ========== TRASH HOOKS ==========

/**
 * Hook para listar itens na lixeira
 */
export function useTrash(params?: { page?: number; page_size?: number }) {
    return useQuery({
        queryKey: trashKeys.all,
        queryFn: () => documentService.listTrash(params),
    });
}

/**
 * Hook para esvaziar lixeira
 */
export function useEmptyTrash() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => documentService.emptyTrash(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: trashKeys.all });
            queryClient.invalidateQueries({ queryKey: documentKeys.stats() });
        },
    });
}

// ========== SHAREABLE LINKS HOOKS ==========

/**
 * Hook para criar link compartilhável
 */
export function useCreateShareableLink() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            documentId,
            data,
        }: {
            documentId: string;
            data: { expires_at?: string; max_accesses?: number };
        }) => documentService.createShareableLink(documentId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: documentKeys.detail(variables.documentId) });
        },
    });
}

/**
 * Hook para listar links compartilháveis
 */
export function useShareableLinks(documentId: string) {
    return useQuery({
        queryKey: ['shareable-links', documentId],
        queryFn: () => documentService.listShareableLinks(documentId),
        enabled: !!documentId,
    });
}

/**
 * Hook para desativar link compartilhável
 */
export function useDeactivateShareableLink() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (linkId: string) => documentService.deactivateShareableLink(linkId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shareable-links'] });
        },
    });
}
