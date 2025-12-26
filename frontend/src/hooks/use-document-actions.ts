import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Document view types (Gmail-style)
export type DocumentView =
    | 'inbox'
    | 'starred'
    | 'pending'
    | 'shared'
    | 'templates'
    | 'trash';

// Centralized document actions service
export const documentActions = {
    async deleteDocuments(documentIds: string[], permanent = false, confirmed = false): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/api/v1/ordoc-air/documents/delete_batch/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Subdomain': 'demo',
                'Authorization': `Bearer ${localStorage.getItem('ordoc_token')}`,
            },
            body: JSON.stringify({
                document_ids: documentIds,
                permanent,
                confirmed
            }),
        });

        if (!response.ok) {
            throw new Error('Erro ao excluir documentos');
        }

        return response.json();
    },

    async restoreDocuments(documentIds: string[]): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/api/v1/ordoc-air/documents/restore_batch/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Subdomain': 'demo',
                'Authorization': `Bearer ${localStorage.getItem('ordoc_token')}`,
            },
            body: JSON.stringify({
                document_ids: documentIds
            }),
        });

        if (!response.ok) {
            throw new Error('Erro ao restaurar documentos');
        }

        return response.json();
    },

    async toggleStar(documentId: string): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/api/v1/ordoc-air/documents/${documentId}/toggle_star/`, {
            method: 'POST',
            headers: {
                'X-Subdomain': 'demo',
                'Authorization': `Bearer ${localStorage.getItem('ordoc_token')}`,
            },
        });

        if (!response.ok) {
            throw new Error('Erro ao marcar documento');
        }

        return response.json();
    },

    async markRead(documentId: string): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/api/v1/ordoc-air/documents/${documentId}/mark_read/`, {
            method: 'POST',
            headers: {
                'X-Subdomain': 'demo',
                'Authorization': `Bearer ${localStorage.getItem('ordoc_token')}`,
            },
        });

        if (!response.ok) {
            throw new Error('Erro ao marcar como lido');
        }

        return response.json();
    },

    async downloadDocument(documentId: string, filename: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/api/v1/ordoc-air/documents/${documentId}/download/`, {
            headers: {
                'X-Subdomain': 'demo',
                'Authorization': `Bearer ${localStorage.getItem('ordoc_token')}`,
            },
        });

        if (!response.ok) {
            throw new Error('Erro ao baixar documento');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    },

    async shareDocument(documentId: string, shareData: {
        userIds?: string[];
        emails?: string[];
    }): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/api/v1/ordoc-air/documents/${documentId}/share/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Subdomain': 'demo',
                'Authorization': `Bearer ${localStorage.getItem('ordoc_token')}`,
            },
            body: JSON.stringify(shareData),
        });

        if (!response.ok) {
            throw new Error('Erro ao compartilhar documento');
        }
    },
};

// Hook for fetching documents by view (Gmail-style)
export function useDocumentView(view: DocumentView = 'inbox') {
    return useQuery({
        queryKey: ['documents', view],
        queryFn: async () => {
            const response = await fetch(`${API_BASE_URL}/api/v1/ordoc-air/documents/?view=${view}`, {
                headers: {
                    'X-Subdomain': 'demo',
                    'Authorization': `Bearer ${localStorage.getItem('ordoc_token')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Erro ao buscar documentos');
            }

            const data = await response.json();
            return data.results || data;
        },
    });
}

// Hook for deleting documents (with validation support)
export function useDeleteDocuments() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ documentIds, permanent = false, confirmed = false }: {
            documentIds: string[];
            permanent?: boolean;
            confirmed?: boolean;
        }) => {
            return documentActions.deleteDocuments(documentIds, permanent, confirmed);
        },
        onSuccess: (data) => {
            if (data.requires_confirmation) {
                // Return data for confirmation dialog
                return data;
            }

            toast.success(data.message || 'Documentos excluídos com sucesso!');

            // Invalidate ALL document-related queries
            queryClient.invalidateQueries({
                predicate: (query) => {
                    const key = query.queryKey[0];
                    return key === 'documents' || key === 'directories';
                }
            });
        },
        onError: (error: any) => {
            toast.error('Erro ao excluir documentos');
            console.error('Delete error:', error);
        },
    });
}

// Hook for restoring documents from trash
export function useRestoreDocuments() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (documentIds: string[]) => documentActions.restoreDocuments(documentIds),
        onSuccess: (data) => {
            toast.success(data.message || 'Documentos restaurados com sucesso!');
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === 'documents'
            });
        },
        onError: (error: any) => {
            toast.error('Erro ao restaurar documentos');
            console.error('Restore error:', error);
        },
    });
}

// Hook for toggling star
export function useToggleStar() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (documentId: string) => documentActions.toggleStar(documentId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === 'documents'
            });
        },
        onError: (error: any) => {
            toast.error('Erro ao marcar documento');
            console.error('Toggle star error:', error);
        },
    });
}

// Hook for marking as read
export function useMarkRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (documentId: string) => documentActions.markRead(documentId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === 'documents'
            });
        },
        onError: (error: any) => {
            toast.error('Erro ao marcar como lido');
            console.error('Mark read error:', error);
        },
    });
}

// Reusable hook for downloading documents
export function useDownloadDocument() {
    return useMutation({
        mutationFn: ({ documentId, filename }: { documentId: string; filename: string }) =>
            documentActions.downloadDocument(documentId, filename),
        onSuccess: () => {
            toast.success('Download iniciado!');
        },
        onError: (error: any) => {
            toast.error('Erro ao baixar documento');
            console.error('Download error:', error);
        },
    });
}

// Reusable hook for sharing documents
export function useShareDocument() {
    return useMutation({
        mutationFn: ({ documentId, shareData }: {
            documentId: string;
            shareData: { userIds?: string[]; emails?: string[] }
        }) => documentActions.shareDocument(documentId, shareData),
        onSuccess: () => {
            toast.success('Documento compartilhado com sucesso!');
        },
        onError: (error: any) => {
            toast.error('Erro ao compartilhar documento');
            console.error('Share error:', error);
        },
    });
}
