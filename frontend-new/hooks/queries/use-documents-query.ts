import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { documentsApi, type Document } from '@/services/documents-api'
import { toast } from 'sonner'

// Query keys
export const documentsKeys = {
  all: ['documents'] as const,
  lists: () => [...documentsKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...documentsKeys.lists(), filters] as const,
  details: () => [...documentsKeys.all, 'detail'] as const,
  detail: (id: string) => [...documentsKeys.details(), id] as const,
}

// Hook para listar documentos
export function useDocuments(params?: Parameters<typeof documentsApi.list>[0]) {
  return useQuery({
    queryKey: documentsKeys.list(params || {}),
    queryFn: () => documentsApi.list(params),
    staleTime: 1000 * 60 * 2, // 2 minutos
  })
}

// Hook para buscar documento específico
export function useDocument(id: string) {
  return useQuery({
    queryKey: documentsKeys.detail(id),
    queryFn: () => documentsApi.retrieve(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}

// Hook para upload de documento
export function useUploadDocument() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: Parameters<typeof documentsApi.upload>[0]) =>
      documentsApi.upload(data),
    onSuccess: () => {
      // Invalida todas as listas de documentos
      queryClient.invalidateQueries({ queryKey: documentsKeys.lists() })
      toast.success('Documento enviado com sucesso!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao enviar documento')
    },
  })
}

// Hook para atualizar documento
export function useUpdateDocument() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Document> }) =>
      documentsApi.update(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: documentsKeys.detail(id) })
      
      // Snapshot previous value
      const previousDoc = queryClient.getQueryData<Document>(documentsKeys.detail(id))
      
      // Optimistic update
      if (previousDoc) {
        queryClient.setQueryData<Document>(documentsKeys.detail(id), {
          ...previousDoc,
          ...data,
        })
      }
      
      return { previousDoc }
    },
    onError: (error: any, variables, context) => {
      // Rollback on error
      if (context?.previousDoc) {
        queryClient.setQueryData(
          documentsKeys.detail(variables.id),
          context.previousDoc
        )
      }
      toast.error(error.response?.data?.message || 'Erro ao atualizar documento')
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(documentsKeys.detail(variables.id), data)
      queryClient.invalidateQueries({ queryKey: documentsKeys.lists() })
      toast.success('Documento atualizado!')
    },
  })
}

// Hook para mover documento para lixeira (soft delete)
export function useDeleteDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => documentsApi.trash(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: documentsKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: documentsKeys.lists() })
      toast.success('Documento movido para lixeira!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao mover documento para lixeira')
    },
  })
}

// Hook para deletar permanentemente (hard delete - apenas de documentos já na lixeira)
export function usePermanentDeleteDocument() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => documentsApi.delete(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: documentsKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: documentsKeys.lists() })
      toast.success('Documento removido permanentemente!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao remover documento permanentemente')
    },
  })
}

// Hook para favoritar/desfavoritar
export function useToggleFavorite() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, isFavorite }: { id: string; isFavorite: boolean }) =>
      isFavorite ? documentsApi.unfavorite(id) : documentsApi.favorite(id),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(documentsKeys.detail(variables.id), data)
      queryClient.invalidateQueries({ queryKey: documentsKeys.lists() })
    },
  })
}
