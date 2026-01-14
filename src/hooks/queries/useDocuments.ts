import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import documentService, { Document, UploadProgress } from '@/services/documents';

// Query Keys
export const documentKeys = {
    all: ['documents'] as const,
    lists: () => [...documentKeys.all, 'list'] as const,
    list: (folderId?: string) => [...documentKeys.lists(), { folderId }] as const,
    details: () => [...documentKeys.all, 'detail'] as const,
    detail: (id: string) => [...documentKeys.details(), id] as const,
    versions: (id: string) => [...documentKeys.detail(id), 'versions'] as const,
};

/**
 * Hook para listar documentos
 */
export function useDocuments(folderId?: string) {
    return useQuery({
        queryKey: documentKeys.list(folderId),
        queryFn: () => documentService.list(folderId),
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
 * Hook para upload de documento
 */
export function useUploadDocument() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            file,
            folderId,
            onProgress,
        }: {
            file: File;
            folderId?: string;
            onProgress?: (progress: UploadProgress) => void;
        }) => documentService.upload(file, folderId, onProgress),
        onSuccess: (data, variables) => {
            // Invalidar listas de documentos
            queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
            // Invalidar analytics pois novo documento afeta métricas
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
        onSuccess: (_, deletedId) => {
            // Invalidar listas de documentos
            queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
            // Invalidar todos os detalhes para limpar cache de documento deletado
            queryClient.invalidateQueries({ queryKey: documentKeys.details() });
            // Invalidar analytics pois deleção afeta métricas
            queryClient.invalidateQueries({ queryKey: ['analytics'] });
        },
    });
}

/**
 * Hook para compartilhar documento
 */
export function useShareDocument() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, userIds }: { id: string; userIds: string[] }) =>
            documentService.share(id, userIds),
        onSuccess: (_, variables) => {
            // Invalidar detalhe do documento compartilhado
            queryClient.invalidateQueries({ queryKey: documentKeys.detail(variables.id) });
            // Invalidar listas pois compartilhamento pode afetar visualização
            queryClient.invalidateQueries({ queryKey: documentKeys.lists() });
        },
    });
}
