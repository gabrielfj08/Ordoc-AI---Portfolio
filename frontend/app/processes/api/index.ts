import apiClient from '@/services/api-client'
import type {
    Procedure,
    Task,
    ProcedureTemplate,
    TaskComment,
    DashboardStats,
    CreateProcedureDto,
    UpdateProcedureDto,
    CreateTaskDto,
    UpdateTaskDto,
    PaginatedResponse,
    ActionResponse,
    CommentResponse,
} from '../types'

const BASE_URL = '/api/v1/ordoc-flow'

// ===========================
// PROCEDURES API
// ===========================

export const proceduresApi = {
    /**
     * Lista procedimentos com filtros opcionais
     */
    list: async (params?: {
        status?: string
        priority?: string
        source?: string
        procedure_template?: string
        search?: string
        ordering?: string
    }) => {
        const response = await apiClient.get<PaginatedResponse<Procedure>>(
            `${BASE_URL}/procedures/`,
            { params }
        )
        return response.data
    },

    /**
     * Cria novo procedimento
     */
    create: async (data: CreateProcedureDto) => {
        const response = await apiClient.post<Procedure>(
            `${BASE_URL}/procedures/`,
            data
        )
        return response.data
    },

    /**
     * Obtém detalhes de um procedimento
     */
    retrieve: async (id: string) => {
        const response = await apiClient.get<Procedure>(
            `${BASE_URL}/procedures/${id}/`
        )
        return response.data
    },

    /**
     * Atualiza procedimento completo
     */
    update: async (id: string, data: UpdateProcedureDto) => {
        const response = await apiClient.put<Procedure>(
            `${BASE_URL}/procedures/${id}/`,
            data
        )
        return response.data
    },

    /**
     * Atualiza procedimento parcialmente
     */
    partialUpdate: async (id: string, data: Partial<Procedure>) => {
        const response = await apiClient.patch<Procedure>(
            `${BASE_URL}/procedures/${id}/`,
            data
        )
        return response.data
    },

    /**
     * Remove procedimento
     */
    delete: async (id: string) => {
        await apiClient.delete(`${BASE_URL}/procedures/${id}/`)
    },

    /**
     * Estatísticas de procedimentos por status
     */
    stats: async () => {
        const response = await apiClient.get<{
            draft: number
            running: number
            started: number
            finished: number
            archived: number
        }>(`${BASE_URL}/procedures/stats/`)
        return response.data
    },

    /**
     * Executa procedimento (draft → running)
     */
    run: async (id: string) => {
        const response = await apiClient.post<ActionResponse>(
            `${BASE_URL}/procedures/${id}/run/`
        )
        return response.data
    },

    /**
     * Inicia procedimento (running → started)
     */
    start: async (id: string) => {
        const response = await apiClient.post<ActionResponse>(
            `${BASE_URL}/procedures/${id}/start/`
        )
        return response.data
    },

    /**
     * Finaliza procedimento (started → finished)
     */
    finish: async (id: string) => {
        const response = await apiClient.post<ActionResponse>(
            `${BASE_URL}/procedures/${id}/finish/`
        )
        return response.data
    },

    /**
     * Arquiva procedimento
     */
    archive: async (id: string) => {
        const response = await apiClient.post<ActionResponse>(
            `${BASE_URL}/procedures/${id}/archive/`
        )
        return response.data
    },

    /**
     * Desarquiva procedimento
     */
    unarchive: async (id: string) => {
        const response = await apiClient.post<ActionResponse>(
            `${BASE_URL}/procedures/${id}/unarchive/`
        )
        return response.data
    },
}

// ===========================
// TASKS API
// ===========================

export const tasksApi = {
    /**
     * Lista tarefas com filtros opcionais
     */
    list: async (params?: {
        status?: string
        priority?: string
        procedure?: string
        assignee?: string
        group_assignee?: string
        search?: string
        ordering?: string
    }) => {
        const response = await apiClient.get<PaginatedResponse<Task>>(
            `${BASE_URL}/tasks/`,
            { params }
        )
        return response.data
    },

    /**
     * Cria nova tarefa
     */
    create: async (data: CreateTaskDto) => {
        const response = await apiClient.post<Task>(
            `${BASE_URL}/tasks/`,
            data
        )
        return response.data
    },

    /**
     * Obtém detalhes de uma tarefa
     */
    retrieve: async (id: string) => {
        const response = await apiClient.get<Task>(
            `${BASE_URL}/tasks/${id}/`
        )
        return response.data
    },

    /**
     * Atualiza tarefa completa
     */
    update: async (id: string, data: UpdateTaskDto) => {
        const response = await apiClient.put<Task>(
            `${BASE_URL}/tasks/${id}/`,
            data
        )
        return response.data
    },

    /**
     * Atualiza tarefa parcialmente
     */
    partialUpdate: async (id: string, data: Partial<Task>) => {
        const response = await apiClient.patch<Task>(
            `${BASE_URL}/tasks/${id}/`,
            data
        )
        return response.data
    },

    /**
     * Remove tarefa
     */
    delete: async (id: string) => {
        await apiClient.delete(`${BASE_URL}/tasks/${id}/`)
    },

    /**
     * Estatísticas de tarefas por status
     */
    stats: async (groupId?: string) => {
        const params = groupId ? { group_id: groupId } : {}
        const response = await apiClient.get<{
            draft: number
            running: number
            started: number
            finished: number
            refused: number
        }>(`${BASE_URL}/tasks/stats/`, { params })
        return response.data
    },

    /**
     * Tarefas atribuídas ao usuário atual
     */
    myTasks: async (params?: {
        status?: string
        priority?: string
        search?: string
        ordering?: string
        page_size?: number
    }) => {
        const response = await apiClient.get<PaginatedResponse<Task>>(
            `${BASE_URL}/tasks/my_tasks/`,
            { params }
        )
        return response.data
    },

    /**
     * Executa tarefa (draft → running)
     */
    run: async (id: string) => {
        const response = await apiClient.post<ActionResponse>(
            `${BASE_URL}/tasks/${id}/run/`
        )
        return response.data
    },

    /**
     * Inicia tarefa (running → started)
     */
    start: async (id: string) => {
        const response = await apiClient.post<ActionResponse>(
            `${BASE_URL}/tasks/${id}/start/`
        )
        return response.data
    },

    /**
     * Finaliza tarefa (started → finished)
     */
    finish: async (id: string) => {
        const response = await apiClient.post<ActionResponse>(
            `${BASE_URL}/tasks/${id}/finish/`
        )
        return response.data
    },

    /**
     * Recusa tarefa (running → refused)
     */
    refuse: async (id: string) => {
        const response = await apiClient.post<ActionResponse>(
            `${BASE_URL}/tasks/${id}/refuse/`
        )
        return response.data
    },

    /**
     * Adiciona comentário à tarefa
     */
    addComment: async (id: string, comment: string) => {
        const response = await apiClient.post<CommentResponse>(
            `${BASE_URL}/tasks/${id}/add_comment/`,
            { comment }
        )
        return response.data
    },
}

// ===========================
// DASHBOARD API
// ===========================

export const dashboardApi = {
    /**
     * Visão geral do workflow
     */
    overview: async () => {
        const response = await apiClient.get<DashboardStats>(
            `${BASE_URL}/dashboard/overview/`
        )
        return response.data
    },
}

// ===========================
// PROCEDURE TEMPLATES API
// ===========================

export const procedureTemplatesApi = {
    /**
     * Lista templates de procedimentos
     */
    list: async (params?: {
        status?: string
        search?: string
    }) => {
        const response = await apiClient.get<PaginatedResponse<ProcedureTemplate>>(
            `${BASE_URL}/procedure-templates/`,
            { params }
        )
        return response.data
    },

    /**
     * Obtém detalhes de um template
     */
    retrieve: async (id: string) => {
        const response = await apiClient.get<ProcedureTemplate>(
            `${BASE_URL}/procedure-templates/${id}/`
        )
        return response.data
    },

    /**
     * Lista apenas templates raiz (sem pai)
     */
    rootTemplates: async () => {
        const response = await apiClient.get<PaginatedResponse<ProcedureTemplate>>(
            `${BASE_URL}/procedure-templates/root_templates/`
        )
        return response.data
    },

    /**
     * Lista templates filhos de um template específico
     */
    children: async (id: string) => {
        const response = await apiClient.get<ProcedureTemplate[]>(
            `${BASE_URL}/procedure-templates/${id}/children/`
        )
        return response.data
    },

    /**
     * Ativa template
     */
    activate: async (id: string) => {
        const response = await apiClient.post<ActionResponse>(
            `${BASE_URL}/procedure-templates/${id}/activate/`
        )
        return response.data
    },

    /**
     * Desativa template
     */
    deactivate: async (id: string) => {
        const response = await apiClient.post<ActionResponse>(
            `${BASE_URL}/procedure-templates/${id}/deactivate/`
        )
        return response.data
    },
}

// ===========================
// PROCEDURE DOCUMENTS API
// ===========================

export const procedureDocumentsApi = {
    /**
     * Lista documentos de um procedimento
     */
    list: async (params?: {
        procedure?: string
        document_type?: string
        current_only?: boolean
    }) => {
        const response = await apiClient.get<PaginatedResponse<any>>(
            `${BASE_URL}/procedure-documents/`,
            { params }
        )
        return response.data
    },

    /**
     * Obtém detalhes de um documento
     */
    retrieve: async (id: string) => {
        const response = await apiClient.get<any>(
            `${BASE_URL}/procedure-documents/${id}/`
        )
        return response.data
    },

    /**
     * Upload de novo documento
     */
    upload: async (data: {
        procedure: string
        file: File
        name?: string
        description?: string
        document_type?: string
    }) => {
        const formData = new FormData()
        formData.append('procedure', data.procedure)
        formData.append('file', data.file)
        if (data.name) formData.append('name', data.name)
        if (data.description) formData.append('description', data.description)
        if (data.document_type) formData.append('document_type', data.document_type)

        const response = await apiClient.post<any>(
            `${BASE_URL}/procedure-documents/upload/`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        )
        return response.data
    },

    /**
     * Cria nova versão de um documento
     */
    newVersion: async (id: string, file: File) => {
        const formData = new FormData()
        formData.append('file', file)

        const response = await apiClient.post<any>(
            `${BASE_URL}/procedure-documents/${id}/new_version/`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        )
        return response.data
    },

    /**
     * Lista todas as versões de um documento
     */
    versions: async (id: string) => {
        const response = await apiClient.get<any[]>(
            `${BASE_URL}/procedure-documents/${id}/versions/`
        )
        return response.data
    },

    /**
     * Remove documento
     */
    delete: async (id: string) => {
        await apiClient.delete(`${BASE_URL}/procedure-documents/${id}/`)
    },

    /**
     * Download de documento
     */
    download: async (id: string) => {
        const response = await apiClient.get(
            `${BASE_URL}/procedure-documents/${id}/download/`,
            { responseType: 'blob' }
        )
        return response.data
    },
}

// ===========================
// TASK ATTACHMENTS API
// ===========================

export const taskAttachmentsApi = {
    /**
     * Lista anexos de uma tarefa
     */
    list: async (params?: {
        task?: string
        attachment_type?: string
    }) => {
        const response = await apiClient.get<PaginatedResponse<any>>(
            `${BASE_URL}/task-attachments/`,
            { params }
        )
        return response.data
    },

    /**
     * Obtém detalhes de um anexo
     */
    retrieve: async (id: string) => {
        const response = await apiClient.get<any>(
            `${BASE_URL}/task-attachments/${id}/`
        )
        return response.data
    },

    /**
     * Upload de novo anexo
     */
    upload: async (data: {
        task: string
        file: File
        name?: string
        description?: string
    }) => {
        const formData = new FormData()
        formData.append('task', data.task)
        formData.append('file', data.file)
        if (data.name) formData.append('name', data.name)
        if (data.description) formData.append('description', data.description)

        const response = await apiClient.post<any>(
            `${BASE_URL}/task-attachments/upload/`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        )
        return response.data
    },

    /**
     * Soft delete de anexo
     */
    softDelete: async (id: string) => {
        const response = await apiClient.delete<ActionResponse>(
            `${BASE_URL}/task-attachments/${id}/soft_delete/`
        )
        return response.data
    },

    /**
     * Remove anexo permanentemente
     */
    delete: async (id: string) => {
        await apiClient.delete(`${BASE_URL}/task-attachments/${id}/`)
    },

    /**
     * Download de anexo
     */
    download: async (id: string) => {
        const response = await apiClient.get(
            `${BASE_URL}/task-attachments/${id}/download/`,
            { responseType: 'blob' }
        )
        return response.data
    },
}

// ===========================
// APPROVALS API
// ===========================

export const approvalsApi = {
    /**
     * Lista workflows de aprovação
     */
    listWorkflows: async (params?: { status?: string }) => {
        const response = await apiClient.get<PaginatedResponse<any>>(
            `${BASE_URL}/approval-workflows/`,
            { params }
        )
        return response.data
    },

    /**
     * Lista instâncias de aprovação
     */
    listInstances: async (params?: {
        status?: string
        workflow?: string
    }) => {
        const response = await apiClient.get<PaginatedResponse<any>>(
            `${BASE_URL}/approval-instances/`,
            { params }
        )
        return response.data
    },

    /**
     * Aprovações pendentes do usuário atual
     */
    pending: async () => {
        const response = await apiClient.get<any[]>(
            `${BASE_URL}/approval-instances/pending/`
        )
        return response.data
    },

    /**
     * Aprovar uma etapa
     */
    approve: async (stepInstanceId: string, comments?: string) => {
        const response = await apiClient.post<ActionResponse>(
            `${BASE_URL}/approval-instances/${stepInstanceId}/approve/`,
            { comments }
        )
        return response.data
    },

    /**
     * Rejeitar uma etapa
     */
    reject: async (stepInstanceId: string, comments: string) => {
        const response = await apiClient.post<ActionResponse>(
            `${BASE_URL}/approval-instances/${stepInstanceId}/reject/`,
            { comments }
        )
        return response.data
    },

    /**
     * Cancelar aprovação
     */
    cancel: async (instanceId: string) => {
        const response = await apiClient.post<ActionResponse>(
            `${BASE_URL}/approval-instances/${instanceId}/cancel/`
        )
        return response.data
    },
}
