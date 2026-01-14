"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { documentService } from '@/services/documents';
import { toast } from 'sonner';

export function useDocumentActions() {
    const queryClient = useQueryClient();

    // Renomear documento
    const renameMutation = useMutation({
        mutationFn: ({ id, name }: { id: string; name: string }) =>
            documentService.update(id, { name }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            queryClient.invalidateQueries({ queryKey: ['document'] });
            toast.success('Documento renomeado com sucesso!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || 'Erro ao renomear documento');
        },
    });

    // Mover documento
    const moveMutation = useMutation({
        mutationFn: ({ id, directoryId }: { id: string; directoryId?: string }) =>
            documentService.update(id, { directory: directoryId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            queryClient.invalidateQueries({ queryKey: ['directories'] });
            toast.success('Documento movido com sucesso!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || 'Erro ao mover documento');
        },
    });

    // Deletar documento (soft delete)
    const deleteMutation = useMutation({
        mutationFn: (id: string) => documentService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            toast.success('Documento movido para a lixeira');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || 'Erro ao deletar documento');
        },
    });

    // Restaurar documento
    const restoreMutation = useMutation({
        mutationFn: (id: string) => documentService.restore(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            toast.success('Documento restaurado com sucesso!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || 'Erro ao restaurar documento');
        },
    });

    // Favoritar
    const favoriteMutation = useMutation({
        mutationFn: (id: string) => documentService.favorite(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            queryClient.invalidateQueries({ queryKey: ['document'] });
            toast.success('Adicionado aos favoritos!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || 'Erro ao favoritar');
        },
    });

    // Desfavoritar
    const unfavoriteMutation = useMutation({
        mutationFn: (id: string) => documentService.unfavorite(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            queryClient.invalidateQueries({ queryKey: ['document'] });
            toast.success('Removido dos favoritos!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || 'Erro ao desfavoritar');
        },
    });

    // Arquivar
    const archiveMutation = useMutation({
        mutationFn: (id: string) => documentService.archive(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            toast.success('Documento arquivado!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || 'Erro ao arquivar');
        },
    });

    // Desarquivar
    const unarchiveMutation = useMutation({
        mutationFn: (id: string) => documentService.unarchive(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            toast.success('Documento desarquivado!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || 'Erro ao desarquivar');
        },
    });

    return {
        rename: renameMutation.mutateAsync,
        isRenaming: renameMutation.isPending,

        move: moveMutation.mutateAsync,
        isMoving: moveMutation.isPending,

        delete: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,

        restore: restoreMutation.mutateAsync,
        isRestoring: restoreMutation.isPending,

        favorite: favoriteMutation.mutateAsync,
        isFavoriting: favoriteMutation.isPending,

        unfavorite: unfavoriteMutation.mutateAsync,
        isUnfavoriting: unfavoriteMutation.isPending,

        archive: archiveMutation.mutateAsync,
        isArchiving: archiveMutation.isPending,

        unarchive: unarchiveMutation.mutateAsync,
        isUnarchiving: unarchiveMutation.isPending,
    };
}
