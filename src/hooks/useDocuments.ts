"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentService, Document, PaginatedResponse } from '@/services/documents';

export interface UseDocumentsOptions {
    page?: number;
    pageSize?: number;
    directory?: string;
    search?: string;
    fileType?: string;
    tags?: string[];
    status?: string;
    isFavorited?: boolean;
    isArchived?: boolean;
    inTrash?: boolean;
    enabled?: boolean;
}

export function useDocuments(options: UseDocumentsOptions = {}) {
    const {
        page = 1,
        pageSize = 50,
        directory,
        search,
        fileType,
        tags,
        status,
        isFavorited,
        isArchived,
        enabled = true,
    } = options;

    const queryKey = ['documents', {
        page,
        pageSize,
        directory,
        search,
        fileType,
        tags,
        status,
        isFavorited,
        isArchived,
        inTrash: options.inTrash
    }];

    const query = useQuery<PaginatedResponse<Document>>({
        queryKey,
        queryFn: () => documentService.list({
            page,
            page_size: pageSize,
            directory,
            search,
            file_type: fileType,
            tags: tags?.join(','),
            status,
            is_favorited: isFavorited,
            is_archived: isArchived,
            in_trash: options.inTrash,
        }),
        enabled,
        staleTime: 30000, // 30 segundos
        gcTime: 5 * 60 * 1000, // 5 minutos (anteriormente cacheTime)
    });

    return {
        documents: query.data?.results || [],
        count: query.data?.count || 0,
        next: query.data?.next,
        previous: query.data?.previous,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}

export function useDocument(id: string, enabled = true) {
    return useQuery<Document>({
        queryKey: ['document', id],
        queryFn: () => documentService.getById(id),
        enabled: enabled && !!id,
        staleTime: 60000, // 1 minuto
    });
}
