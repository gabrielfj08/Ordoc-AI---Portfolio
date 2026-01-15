import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { toast } from 'sonner';
import processService, {
    Process,
    ProcessTask,
    ExternalRequester,
    GroupRequester,
    ProcedureTemplate,
    WorkflowRequest,
    ApprovalWorkflow,
    ApprovalInstance,
    NotificationTemplate,
    NotificationLog,
    Notification,
    ProcedureDocument,
    TaskAttachment,
    WorkflowHistory,
    WorkflowDashboard,
    BatchOperation,
    BatchOperationResult,
    WorkflowSearchResult,
    WorkflowMetrics,
    Task,
} from '@/services/processes';

// Comprehensive Query Keys Factory
export const processKeys = {
    all: ['processes'] as const,

    // Procedures (Processes)
    procedures: () => [...processKeys.all, 'procedures'] as const,
    proceduresList: (filters?: any) => [...processKeys.procedures(), 'list', filters] as const,
    procedure: (id: string) => [...processKeys.procedures(), 'detail', id] as const,
    procedureStats: () => [...processKeys.procedures(), 'stats'] as const,

    // Tasks
    tasks: () => [...processKeys.all, 'tasks'] as const,
    tasksList: (filters?: any) => [...processKeys.tasks(), 'list', filters] as const,
    task: (id: string) => [...processKeys.tasks(), 'detail', id] as const,
    taskStats: (groupId?: string) => [...processKeys.tasks(), 'stats', groupId] as const,
    myTasks: () => [...processKeys.tasks(), 'my-tasks'] as const,
    procedureTasks: (procedureId: string) => [...processKeys.procedure(procedureId), 'tasks'] as const,

    // External Requesters
    externalRequesters: () => [...processKeys.all, 'external-requesters'] as const,
    externalRequestersList: (filters?: any) => [...processKeys.externalRequesters(), 'list', filters] as const,
    externalRequester: (id: string) => [...processKeys.externalRequesters(), 'detail', id] as const,

    // Group Requesters
    groupRequesters: () => [...processKeys.all, 'group-requesters'] as const,
    groupRequestersList: (filters?: any) => [...processKeys.groupRequesters(), 'list', filters] as const,
    groupRequester: (id: string) => [...processKeys.groupRequesters(), 'detail', id] as const,

    // Procedure Templates
    templates: () => [...processKeys.all, 'templates'] as const,
    templatesList: (filters?: any) => [...processKeys.templates(), 'list', filters] as const,
    template: (id: string) => [...processKeys.templates(), 'detail', id] as const,
    rootTemplates: () => [...processKeys.templates(), 'root'] as const,
    templateChildren: (id: string) => [...processKeys.template(id), 'children'] as const,

    // Workflow Requests
    workflowRequests: () => [...processKeys.all, 'workflow-requests'] as const,
    workflowRequestsList: (filters?: any) => [...processKeys.workflowRequests(), 'list', filters] as const,
    workflowRequest: (id: string) => [...processKeys.workflowRequests(), 'detail', id] as const,

    // Approvals
    approvalWorkflows: () => [...processKeys.all, 'approval-workflows'] as const,
    approvalWorkflowsList: (filters?: any) => [...processKeys.approvalWorkflows(), 'list', filters] as const,
    approvalWorkflow: (id: string) => [...processKeys.approvalWorkflows(), 'detail', id] as const,

    approvalInstances: () => [...processKeys.all, 'approval-instances'] as const,
    approvalInstancesList: (filters?: any) => [...processKeys.approvalInstances(), 'list', filters] as const,
    approvalInstance: (id: string) => [...processKeys.approvalInstances(), 'detail', id] as const,
    pendingApprovals: () => [...processKeys.approvalInstances(), 'pending'] as const,

    // Notifications
    notificationTemplates: () => [...processKeys.all, 'notification-templates'] as const,
    notificationTemplatesList: (filters?: any) => [...processKeys.notificationTemplates(), 'list', filters] as const,
    notificationTemplate: (id: string) => [...processKeys.notificationTemplates(), 'detail', id] as const,

    notificationLogs: () => [...processKeys.all, 'notification-logs'] as const,
    notificationLogsList: (filters?: any) => [...processKeys.notificationLogs(), 'list', filters] as const,

    notifications: () => [...processKeys.all, 'notifications'] as const,
    notificationsList: (filters?: any) => [...processKeys.notifications(), 'list', filters] as const,
    notification: (id: string) => [...processKeys.notifications(), 'detail', id] as const,

    // Documents and Attachments
    procedureDocuments: () => [...processKeys.all, 'procedure-documents'] as const,
    procedureDocumentsList: (procedureId: string) => [...processKeys.procedureDocuments(), 'list', procedureId] as const,

    taskAttachments: () => [...processKeys.all, 'task-attachments'] as const,
    taskAttachmentsList: (taskId: string) => [...processKeys.taskAttachments(), 'list', taskId] as const,

    // History
    history: () => [...processKeys.all, 'history'] as const,
    historyList: (filters?: any) => [...processKeys.history(), 'list', filters] as const,
    objectHistory: (objectType: string, objectId: string) => [...processKeys.history(), 'object', objectType, objectId] as const,

    // Dashboard
    dashboard: () => [...processKeys.all, 'dashboard'] as const,

    // Search
    search: (query: string, filters?: any) => [...processKeys.all, 'search', query, filters] as const,
    searchSuggestions: (query: string) => [...processKeys.all, 'search-suggestions', query] as const,

    // Analytics
    analytics: () => [...processKeys.all, 'analytics'] as const,
    workflowMetrics: (filters?: any) => [...processKeys.analytics(), 'workflow-metrics', filters] as const,
};

// ==================== PROCEDURES (PROCESSES) - QUERIES ====================

/**
 * List procedures
 */
export function useProcedures(filters?: {
    status?: string;
    priority?: string;
    requester?: string;
    search?: string;
}, options?: Omit<UseQueryOptions<Process[]>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: processKeys.proceduresList(filters),
        queryFn: () => processService.list(filters),
        ...options,
    });
}

// Backward compatibility alias
export const useProcesses = useProcedures;

/**
 * Get procedure by ID
 */
export function useProcedure(id: string, options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: processKeys.procedure(id),
        queryFn: () => processService.getById(id),
        enabled: !!id,
        ...options,
    });
}

// Backward compatibility alias
export const useProcess = useProcedure;

/**
 * Get procedure statistics
 */
export function useProcedureStats(options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: processKeys.procedureStats(),
        queryFn: () => processService.getProcedureStats(),
        ...options,
    });
}

// ==================== PROCEDURES - MUTATIONS ====================

/**
 * Create procedure
 */
export function useCreateProcedure(options?: UseMutationOptions<Process, Error, Partial<Process>>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => processService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: processKeys.procedures() });
            queryClient.invalidateQueries({ queryKey: processKeys.procedureStats() });
            queryClient.invalidateQueries({ queryKey: processKeys.dashboard() });
            queryClient.invalidateQueries({ queryKey: ['analytics'] });
            toast.success('Procedimento criado com sucesso');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao criar procedimento');
        },
        ...options,
    });
}

// Backward compatibility alias
export const useCreateProcess = useCreateProcedure;

/**
 * Update procedure
 */
export function useUpdateProcedure(options?: UseMutationOptions<Process, Error, { id: string; data: Partial<Process> }>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => processService.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: processKeys.procedure(variables.id) });
            queryClient.invalidateQueries({ queryKey: processKeys.procedures() });
            queryClient.invalidateQueries({ queryKey: processKeys.procedureStats() });
            queryClient.invalidateQueries({ queryKey: processKeys.dashboard() });
            toast.success('Procedimento atualizado com sucesso');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao atualizar procedimento');
        },
        ...options,
    });
}

// Backward compatibility alias
export const useUpdateProcess = useUpdateProcedure;

/**
 * Delete procedure
 */
export function useDeleteProcedure(options?: UseMutationOptions<void, Error, string>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => processService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: processKeys.procedures() });
            queryClient.invalidateQueries({ queryKey: processKeys.procedureStats() });
            queryClient.invalidateQueries({ queryKey: processKeys.dashboard() });
            toast.success('Procedimento deletado com sucesso');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao deletar procedimento');
        },
        ...options,
    });
}

// Backward compatibility alias
export const useDeleteProcess = useDeleteProcedure;

/**
 * Run procedure
 */
export function useRunProcedure(options?: UseMutationOptions<Process, Error, string>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => processService.runProcedure(id),
        onSuccess: (data, id) => {
            queryClient.invalidateQueries({ queryKey: processKeys.procedure(id) });
            queryClient.invalidateQueries({ queryKey: processKeys.procedures() });
            queryClient.invalidateQueries({ queryKey: processKeys.procedureStats() });
            toast.success('Procedimento executado com sucesso');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao executar procedimento');
        },
        ...options,
    });
}

/**
 * Start procedure
 */
export function useStartProcedure(options?: UseMutationOptions<Process, Error, string>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => processService.startProcedure(id),
        onSuccess: (data, id) => {
            queryClient.invalidateQueries({ queryKey: processKeys.procedure(id) });
            queryClient.invalidateQueries({ queryKey: processKeys.procedures() });
            queryClient.invalidateQueries({ queryKey: processKeys.procedureStats() });
            toast.success('Procedimento iniciado com sucesso');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao iniciar procedimento');
        },
        ...options,
    });
}

/**
 * Finish procedure
 */
export function useFinishProcedure(options?: UseMutationOptions<Process, Error, string>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => processService.finishProcedure(id),
        onSuccess: (data, id) => {
            queryClient.invalidateQueries({ queryKey: processKeys.procedure(id) });
            queryClient.invalidateQueries({ queryKey: processKeys.procedures() });
            queryClient.invalidateQueries({ queryKey: processKeys.procedureStats() });
            queryClient.invalidateQueries({ queryKey: processKeys.dashboard() });
            toast.success('Procedimento finalizado com sucesso');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao finalizar procedimento');
        },
        ...options,
    });
}

/**
 * Archive procedure
 */
export function useArchiveProcedure(options?: UseMutationOptions<Process, Error, string>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => processService.archiveProcedure(id),
        onSuccess: (data, id) => {
            queryClient.invalidateQueries({ queryKey: processKeys.procedure(id) });
            queryClient.invalidateQueries({ queryKey: processKeys.procedures() });
            queryClient.invalidateQueries({ queryKey: processKeys.procedureStats() });
            toast.success('Procedimento arquivado com sucesso');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao arquivar procedimento');
        },
        ...options,
    });
}

/**
 * Unarchive procedure
 */
export function useUnarchiveProcedure(options?: UseMutationOptions<Process, Error, string>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => processService.unarchiveProcedure(id),
        onSuccess: (data, id) => {
            queryClient.invalidateQueries({ queryKey: processKeys.procedure(id) });
            queryClient.invalidateQueries({ queryKey: processKeys.procedures() });
            queryClient.invalidateQueries({ queryKey: processKeys.procedureStats() });
            toast.success('Procedimento desarquivado com sucesso');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao desarquivar procedimento');
        },
        ...options,
    });
}

// ==================== TASKS - QUERIES ====================

/**
 * List tasks
 */
export function useTasks(filters?: {
    procedure?: string;
    status?: string;
    assignee?: string;
    search?: string;
}, options?: Omit<UseQueryOptions<Task[]>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: processKeys.tasksList(filters),
        queryFn: () => processService.getTasks(filters),
        ...options,
    });
}

/**
 * Get task by ID
 */
export function useTask(id: string, options?: Omit<UseQueryOptions<Task>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: processKeys.task(id),
        queryFn: () => processService.getTask(id),
        enabled: !!id,
        ...options,
    });
}

/**
 * Get tasks for a specific procedure
 */
export function useProcedureTasks(procedureId: string, options?: Omit<UseQueryOptions<Task[]>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: processKeys.procedureTasks(procedureId),
        queryFn: () => processService.getTasks({ procedure: procedureId }),
        enabled: !!procedureId,
        ...options,
    });
}

// Backward compatibility alias
export const useProcessTasks = useProcedureTasks;

/**
 * Get task statistics
 */
export function useTaskStats(groupId?: string, options?: Omit<UseQueryOptions<any>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: processKeys.taskStats(groupId),
        queryFn: () => processService.getTaskStats(groupId),
        ...options,
    });
}

/**
 * Get my tasks
 */
export function useMyTasks(options?: Omit<UseQueryOptions<Task[]>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: processKeys.myTasks(),
        queryFn: () => processService.getMyTasks(),
        ...options,
    });
}

// ==================== TASKS - MUTATIONS ====================

/**
 * Create task
 */
export function useCreateTask(options?: UseMutationOptions<Task, Error, Partial<Task>>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => processService.createTask(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: processKeys.tasks() });
            queryClient.invalidateQueries({ queryKey: processKeys.taskStats() });
            queryClient.invalidateQueries({ queryKey: processKeys.myTasks() });
            if (data.procedure) {
                queryClient.invalidateQueries({ queryKey: processKeys.procedure(data.procedure) });
                queryClient.invalidateQueries({ queryKey: processKeys.procedureTasks(data.procedure) });
            }
            toast.success('Tarefa criada com sucesso');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao criar tarefa');
        },
        ...options,
    });
}

/**
 * Update task
 */
export function useUpdateTask(options?: UseMutationOptions<Task, Error, { id: string; data: Partial<Task> }>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => processService.updateTask(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: processKeys.task(variables.id) });
            queryClient.invalidateQueries({ queryKey: processKeys.tasks() });
            queryClient.invalidateQueries({ queryKey: processKeys.taskStats() });
            queryClient.invalidateQueries({ queryKey: processKeys.myTasks() });
            if (data.procedure) {
                queryClient.invalidateQueries({ queryKey: processKeys.procedure(data.procedure) });
                queryClient.invalidateQueries({ queryKey: processKeys.procedureTasks(data.procedure) });
            }
            toast.success('Tarefa atualizada com sucesso');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao atualizar tarefa');
        },
        ...options,
    });
}

/**
 * Delete task
 */
export function useDeleteTask(options?: UseMutationOptions<void, Error, string>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => processService.deleteTask(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: processKeys.tasks() });
            queryClient.invalidateQueries({ queryKey: processKeys.taskStats() });
            queryClient.invalidateQueries({ queryKey: processKeys.myTasks() });
            toast.success('Tarefa deletada com sucesso');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao deletar tarefa');
        },
        ...options,
    });
}

/**
 * Accept task
 */
export function useAcceptTask(options?: UseMutationOptions<Task, Error, string>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => processService.acceptTask(id),
        onSuccess: (data, id) => {
            queryClient.invalidateQueries({ queryKey: processKeys.task(id) });
            queryClient.invalidateQueries({ queryKey: processKeys.tasks() });
            queryClient.invalidateQueries({ queryKey: processKeys.myTasks() });
            queryClient.invalidateQueries({ queryKey: processKeys.taskStats() });
            toast.success('Tarefa aceita com sucesso');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao aceitar tarefa');
        },
        ...options,
    });
}

/**
 * Refuse task
 */
export function useRefuseTask(options?: UseMutationOptions<Task, Error, { id: string; reason?: string }>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, reason }) => processService.refuseTask(id, reason),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: processKeys.task(variables.id) });
            queryClient.invalidateQueries({ queryKey: processKeys.tasks() });
            queryClient.invalidateQueries({ queryKey: processKeys.myTasks() });
            queryClient.invalidateQueries({ queryKey: processKeys.taskStats() });
            toast.success('Tarefa recusada');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao recusar tarefa');
        },
        ...options,
    });
}

/**
 * Complete task
 */
export function useCompleteTask(options?: UseMutationOptions<Task, Error, { id: string; data?: any }>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => processService.completeTask(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: processKeys.task(variables.id) });
            queryClient.invalidateQueries({ queryKey: processKeys.tasks() });
            queryClient.invalidateQueries({ queryKey: processKeys.myTasks() });
            queryClient.invalidateQueries({ queryKey: processKeys.taskStats() });
            queryClient.invalidateQueries({ queryKey: processKeys.dashboard() });
            toast.success('Tarefa completada com sucesso');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao completar tarefa');
        },
        ...options,
    });
}

/**
 * Return task
 */
export function useReturnTask(options?: UseMutationOptions<Task, Error, { id: string; reason?: string }>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, reason }) => processService.returnTask(id, reason),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: processKeys.task(variables.id) });
            queryClient.invalidateQueries({ queryKey: processKeys.tasks() });
            queryClient.invalidateQueries({ queryKey: processKeys.myTasks() });
            queryClient.invalidateQueries({ queryKey: processKeys.taskStats() });
            toast.success('Tarefa retornada');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao retornar tarefa');
        },
        ...options,
    });
}

/**
 * Finish task
 */
export function useFinishTask(options?: UseMutationOptions<Task, Error, string>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => processService.finishTask(id),
        onSuccess: (data, id) => {
            queryClient.invalidateQueries({ queryKey: processKeys.task(id) });
            queryClient.invalidateQueries({ queryKey: processKeys.tasks() });
            queryClient.invalidateQueries({ queryKey: processKeys.myTasks() });
            queryClient.invalidateQueries({ queryKey: processKeys.taskStats() });
            queryClient.invalidateQueries({ queryKey: processKeys.dashboard() });
            toast.success('Tarefa finalizada com sucesso');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao finalizar tarefa');
        },
        ...options,
    });
}

// Continue with remaining ViewSets in next edit...
// ==================== DASHBOARD ====================

/**
 * Get workflow dashboard
 */
export function useWorkflowDashboard(options?: Omit<UseQueryOptions<WorkflowDashboard>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: processKeys.dashboard(),
        queryFn: () => processService.getDashboard(),
        refetchInterval: 30000, // Auto-refresh every 30s
        ...options,
    });
}

// ==================== BATCH OPERATIONS ====================

/**
 * Execute batch operation
 */
export function useExecuteBatchOperation(options?: UseMutationOptions<BatchOperationResult, Error, BatchOperation>) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (operation) => processService.executeBatchOperation(operation),
        onSuccess: (result, operation) => {
            queryClient.invalidateQueries({ queryKey: processKeys.procedures() });
            queryClient.invalidateQueries({ queryKey: processKeys.tasks() });
            queryClient.invalidateQueries({ queryKey: processKeys.dashboard() });
            toast.success(`Operação em lote executada: ${result.processed} itens processados`);
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Erro ao executar operação em lote');
        },
        ...options,
    });
}

// ==================== SEARCH ====================

/**
 * Search workflow
 */
export function useWorkflowSearch(query: string, filters?: any, options?: Omit<UseQueryOptions<WorkflowSearchResult[]>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: processKeys.search(query, filters),
        queryFn: () => processService.search(query, filters),
        enabled: !!query && query.length >= 2,
        ...options,
    });
}

/**
 * Get search suggestions
 */
export function useSearchSuggestions(query: string, options?: Omit<UseQueryOptions<string[]>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: processKeys.searchSuggestions(query),
        queryFn: () => processService.getSearchSuggestions(query),
        enabled: !!query && query.length >= 2,
        ...options,
    });
}

// ==================== ANALYTICS ====================

/**
 * Get workflow metrics
 */
export function useWorkflowMetrics(filters?: any, options?: Omit<UseQueryOptions<WorkflowMetrics>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: processKeys.workflowMetrics(filters),
        queryFn: () => processService.getWorkflowMetrics(filters),
        ...options,
    });
}

// ==================== WORKFLOW HISTORY ====================

/**
 * List workflow history
 */
export function useWorkflowHistory(filters?: any, options?: Omit<UseQueryOptions<WorkflowHistory[]>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: processKeys.historyList(filters),
        queryFn: () => processService.listWorkflowHistory(filters),
        ...options,
    });
}

/**
 * Get object history
 */
export function useObjectHistory(objectType: string, objectId: string, options?: Omit<UseQueryOptions<WorkflowHistory[]>, 'queryKey' | 'queryFn'>) {
    return useQuery({
        queryKey: processKeys.objectHistory(objectType, objectId),
        queryFn: () => processService.getObjectHistory(objectType, objectId),
        enabled: !!objectType && !!objectId,
        ...options,
    });
}

// Note: Additional hooks for ExternalRequesters, GroupRequesters, ProcedureTemplates,
// WorkflowRequests, Approvals, Notifications, Documents, and Attachments follow the same
// pattern as demonstrated above. They can be added following the established conventions.
