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

    // Toggle Star (Gmail-style)
    const toggleStarMutation = useMutation({
        mutationFn: (id: string) => documentService.toggleStar(id),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            queryClient.invalidateQueries({ queryKey: ['document'] });
            toast.success(data.starred ? 'Marcado com estrela' : 'Estrela removida');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || 'Erro ao marcar estrela');
        },
    });

    // Download
    const downloadMutation = useMutation({
        mutationFn: async (doc: { id: string; name: string }) => {
            const blob = await documentService.download(doc.id);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = doc.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            return { id: doc.id, name: doc.name };
        },
        onSuccess: (data) => {
            toast.success(`Download de "${data.name}" iniciado`);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || 'Erro ao fazer download');
        },
    });

    // Add Tags
    const addTagsMutation = useMutation({
        mutationFn: ({ documentId, tagIds }: { documentId: string; tagIds: string[] }) =>
            documentService.addTags(documentId, tagIds),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            queryClient.invalidateQueries({ queryKey: ['document'] });
            toast.success('Tags adicionadas com sucesso!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || 'Erro ao adicionar tags');
        },
    });

    // Remove Tags
    const removeTagsMutation = useMutation({
        mutationFn: ({ documentId, tagIds }: { documentId: string; tagIds: string[] }) =>
            documentService.removeTags(documentId, tagIds),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            queryClient.invalidateQueries({ queryKey: ['document'] });
            toast.success('Tags removidas com sucesso!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || 'Erro ao remover tags');
        },
    });

    // Create Shareable Link
    const createShareableLinkMutation = useMutation({
        mutationFn: ({ documentId, expiresAt, maxAccesses }: {
            documentId: string;
            expiresAt?: string;
            maxAccesses?: number;
        }) => documentService.createShareableLink(documentId, {
            expires_at: expiresAt,
            max_accesses: maxAccesses,
        }),
        onSuccess: (data) => {
            const fullUrl = `${window.location.origin}/shared/${data.token}`;
            navigator.clipboard.writeText(fullUrl);
            toast.success('Link copiado para área de transferência!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || 'Erro ao criar link compartilhável');
        },
    });

    // Bulk Trash
    const bulkTrashMutation = useMutation({
        mutationFn: ({ ids, confirmed }: { ids: string[]; confirmed?: boolean }) =>
            documentService.bulkTrash(ids, confirmed),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            queryClient.invalidateQueries({ queryKey: ['directories'] });
            toast.success('Itens movidos para lixeira');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || 'Erro ao mover para lixeira');
        },
    });

    // Bulk Move
    const bulkMoveMutation = useMutation({
        mutationFn: ({ documentIds, directoryId }: { documentIds: string[]; directoryId: string }) =>
            documentService.bulkMove(documentIds, directoryId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            queryClient.invalidateQueries({ queryKey: ['directories'] });
            toast.success('Itens movidos com sucesso!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || 'Erro ao mover itens');
        },
    });

    return {
        // Basic operations
        rename: renameMutation.mutateAsync,
        isRenaming: renameMutation.isPending,

        move: moveMutation.mutateAsync,
        isMoving: moveMutation.isPending,

        delete: deleteMutation.mutateAsync,
        isDeleting: deleteMutation.isPending,

        restore: restoreMutation.mutateAsync,
        isRestoring: restoreMutation.isPending,

        // Favorites & Stars
        favorite: favoriteMutation.mutateAsync,
        isFavoriting: favoriteMutation.isPending,

        unfavorite: unfavoriteMutation.mutateAsync,
        isUnfavoriting: unfavoriteMutation.isPending,

        toggleStar: toggleStarMutation.mutateAsync,
        isTogglingStar: toggleStarMutation.isPending,

        // Archive
        archive: archiveMutation.mutateAsync,
        isArchiving: archiveMutation.isPending,

        unarchive: unarchiveMutation.mutateAsync,
        isUnarchiving: unarchiveMutation.isPending,

        // Download
        download: downloadMutation.mutateAsync,
        isDownloading: downloadMutation.isPending,

        // Tags
        addTags: addTagsMutation.mutateAsync,
        isAddingTags: addTagsMutation.isPending,

        removeTags: removeTagsMutation.mutateAsync,
        isRemovingTags: removeTagsMutation.isPending,

        // Sharing
        createShareableLink: createShareableLinkMutation.mutateAsync,
        isCreatingShareableLink: createShareableLinkMutation.isPending,

        // Bulk operations
        bulkTrash: bulkTrashMutation.mutateAsync,
        isBulkTrashing: bulkTrashMutation.isPending,

        bulkMove: bulkMoveMutation.mutateAsync,
        isBulkMoving: bulkMoveMutation.isPending,
    };
}
