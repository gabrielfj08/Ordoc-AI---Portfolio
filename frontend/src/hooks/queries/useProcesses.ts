import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import processService, { Process, ProcessTask } from '@/services/processes';

// Query Keys
export const processKeys = {
    all: ['processes'] as const,
    lists: () => [...processKeys.all, 'list'] as const,
    list: (filters?: any) => [...processKeys.lists(), { filters }] as const,
    details: () => [...processKeys.all, 'detail'] as const,
    detail: (id: string) => [...processKeys.details(), id] as const,
    tasks: (id: string) => [...processKeys.detail(id), 'tasks'] as const,
};

/**
 * Hook para listar processos
 */
export function useProcesses(filters?: {
    status?: string;
    priority?: string;
    ownerId?: string;
}) {
    return useQuery({
        queryKey: processKeys.list(filters),
        queryFn: () => processService.list(filters),
    });
}

/**
 * Hook para obter processo por ID
 */
export function useProcess(id: string) {
    return useQuery({
        queryKey: processKeys.detail(id),
        queryFn: () => processService.getById(id),
        enabled: !!id,
    });
}

/**
 * Hook para obter tarefas de um processo
 */
export function useProcessTasks(processId: string) {
    return useQuery({
        queryKey: processKeys.tasks(processId),
        queryFn: () => processService.getTasks(processId),
        enabled: !!processId,
    });
}

/**
 * Hook para criar processo
 */
export function useCreateProcess() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Partial<Process>) => processService.create(data),
        onSuccess: () => {
            // Invalidar listas de processos
            queryClient.invalidateQueries({ queryKey: processKeys.lists() });
            // Invalidar analytics pois novo processo afeta métricas
            queryClient.invalidateQueries({ queryKey: ['analytics'] });
        },
    });
}

/**
 * Hook para atualizar processo
 */
export function useUpdateProcess() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Process> }) =>
            processService.update(id, data),
        onSuccess: (_, variables) => {
            // Invalidar detalhe do processo atualizado
            queryClient.invalidateQueries({ queryKey: processKeys.detail(variables.id) });
            // Invalidar listas de processos
            queryClient.invalidateQueries({ queryKey: processKeys.lists() });
            // Invalidar analytics pois atualização pode afetar métricas
            queryClient.invalidateQueries({ queryKey: ['analytics'] });
        },
    });
}

/**
 * Hook para deletar processo
 */
export function useDeleteProcess() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => processService.delete(id),
        onSuccess: () => {
            // Invalidar listas de processos
            queryClient.invalidateQueries({ queryKey: processKeys.lists() });
            // Invalidar todos os detalhes para limpar cache de processo deletado
            queryClient.invalidateQueries({ queryKey: processKeys.details() });
            // Invalidar analytics pois deleção afeta métricas
            queryClient.invalidateQueries({ queryKey: ['analytics'] });
        },
    });
}

/**
 * Hook para atualizar tarefa
 */
export function useUpdateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            processId,
            taskId,
            data,
        }: {
            processId: string;
            taskId: string;
            data: Partial<ProcessTask>;
        }) => processService.updateTask(processId, taskId, data),
        onSuccess: (_, variables) => {
            // Invalidar tarefas do processo
            queryClient.invalidateQueries({ queryKey: processKeys.tasks(variables.processId) });
            // Invalidar detalhe do processo
            queryClient.invalidateQueries({ queryKey: processKeys.detail(variables.processId) });
            // Invalidar analytics pois atualização de tarefa pode afetar métricas
            queryClient.invalidateQueries({ queryKey: ['analytics'] });
        },
    });
}
