"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentService, Directory, PaginatedResponse } from '@/services/documents';
import { toast } from 'sonner';

export interface UseDirectoriesOptions {
    page?: number;
    pageSize?: number;
    parentDirectory?: string;
    inTrash?: boolean;
    enabled?: boolean;
}

export function useDirectories(options: UseDirectoriesOptions = {}) {
    const {
        page = 1,
        pageSize = 100,
        parentDirectory,
        inTrash = false,
        enabled = true,
    } = options;

    const query = useQuery<PaginatedResponse<Directory>>({
        queryKey: ['directories', { page, pageSize, parentDirectory, inTrash }],
        queryFn: () => documentService.listDirectories({
            page,
            page_size: pageSize,
            parent_directory: parentDirectory,
            in_trash: inTrash,
        }),
        enabled,
        staleTime: 60000, // 1 minuto
    });

    return {
        directories: query.data?.results || [],
        count: query.data?.count || 0,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}

export function useDirectoryTree() {
    return useQuery<Directory[]>({
        queryKey: ['directory-tree'],
        queryFn: () => documentService.getDirectoryTree(),
        staleTime: 2 * 60 * 1000, // 2 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
    });
}

export function useDirectoryActions() {
    const queryClient = useQueryClient();

    // Criar diretório
    const createMutation = useMutation({
        mutationFn: (data: { name: string; description?: string; parent_directory?: string }) =>
            documentService.createDirectory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['directories'] });
            queryClient.invalidateQueries({ queryKey: ['directory-tree'] });
            toast.success('Pasta criada com sucesso!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || 'Erro ao criar pasta');
        },
    });

    // Atualizar diretório
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Directory> }) =>
            documentService.updateDirectory(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['directories'] });
            queryClient.invalidateQueries({ queryKey: ['directory-tree'] });
            toast.success('Pasta atualizada com sucesso!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || 'Erro ao atualizar pasta');
        },
    });

    // Deletar diretório
    const deleteMutation = useMutation({
        mutationFn: (id: string) => documentService.deleteDirectory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['directories'] });
            queryClient.invalidateQueries({ queryKey: ['directory-tree'] });
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            toast.success('Pasta deletada com sucesso!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || 'Erro ao deletar pasta');
        },
    });

    // Restaurar diretório
    const restoreMutation = useMutation({
        mutationFn: (id: string) => documentService.restoreDirectory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['directories'] });
            queryClient.invalidateQueries({ queryKey: ['directory-tree'] });
            toast.success('Pasta restaurada com sucesso!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || 'Erro ao restaurar pasta');
        },
    });

    return {
        create: createMutation.mutateAsync,
        isCreating: createMutation.isPending,

        update: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending,

        delete: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,

        restore: restoreMutation.mutateAsync,
        isRestoring: restoreMutation.isPending,
    };
}
