import apiClient from './api';

// Mapeamento de tipos para coincidir com o Backend ProcedureSerializer
export interface Procedure {
    id: string;
    process_number: string; // Backend usa process_number
    procedure_template_name?: string;
    status: 'draft' | 'running' | 'finished' | 'archived'; // Backend choices mapping
    priority: 'low' | 'normal' | 'high' | 'urgent';
    created_at: string;
    updated_at: string;
    deadline?: string;

    // Relations
    requester?: string;
    requester_name?: string;
    responsible_group?: string;
    responsible_group_name?: string;
    organization?: string;
    organization_name?: string;

    // View specific
    is_closed?: boolean;
    name?: string; // Frontend compatibility helper (mapped to process_number or template name)
}

// Alias para manter compatibilidade com componentes que chamam de 'Process'
export type Process = Procedure;

export interface Task {
    id: string;
    name: string;
    description?: string;
    status: 'pending' | 'in_progress' | 'completed' | 'refused' | 'returned';
    priority: 'low' | 'normal' | 'high' | 'urgent';
    deadline?: string;

    // Relations
    procedure?: string;
    procedure_number?: string;
    assignee?: string;
    assignee_name?: string;
    group_assignee?: string;
    group_assignee_name?: string;

    created_at: string;
    updated_at: string;
}

// Alias
export type ProcessTask = Task;

export interface ProcedureDetail extends Procedure {
    tasks: Task[];
    description?: string; // Payload or other field
}

export type ProcessDetail = ProcedureDetail;

// External Requester
export interface ExternalRequester {
    id: string;
    name: string;
    email: string;
    cpf?: string;
    phone?: string;
    status: 'active' | 'inactive';
    organization: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
}

// Group Requester
export interface GroupRequester {
    id: string;
    name: string;
    description?: string;
    organization: string;
    is_active: boolean;
    members?: GroupRequesterMember[];
    created_at: string;
    updated_at: string;
}

export interface GroupRequesterMember {
    id: string;
    group: string;
    user: string;
    user_name?: string;
    role: 'member' | 'manager' | 'admin';
    is_active: boolean;
    joined_at: string;
}

// Procedure Template
export interface ProcedureTemplate {
    id: string;
    name: string;
    description?: string;
    status: 'draft' | 'active' | 'inactive';
    organization: string;
    group_requester?: string;
    parent_procedure_template?: string;
    children_procedure_templates?: ProcedureTemplate[];
    fields?: TemplateField[];
    created_at: string;
    updated_at: string;
}

export interface TemplateField {
    id: string;
    name: string;
    field_type: string;
    required: boolean;
    order: number;
    options?: any;
}

// Workflow Request
export interface WorkflowRequest {
    id: string;
    external_requester: string;
    procedure_template: string;
    status: 'pending' | 'approved' | 'rejected' | 'cancelled';
    payload?: any;
    created_at: string;
    updated_at: string;
}

// Approval
export interface ApprovalWorkflow {
    id: string;
    name: string;
    description?: string;
    procedure_template: string;
    organization: string;
    is_active: boolean;
    steps?: ApprovalStep[];
    created_at: string;
    updated_at: string;
}

export interface ApprovalStep {
    id: string;
    workflow: string;
    name: string;
    order: number;
    approvers?: string[];
    required_approvals: number;
}

export interface ApprovalInstance {
    id: string;
    workflow: string;
    procedure: string;
    status: 'pending' | 'approved' | 'rejected';
    current_step?: string;
    created_at: string;
    updated_at: string;
}

// Notifications
export interface NotificationTemplate {
    id: string;
    name: string;
    description?: string;
    event_type: string;
    subject: string;
    body_template: string;
    organization: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface NotificationLog {
    id: string;
    notification_template?: string;
    recipient_email: string;
    subject: string;
    body: string;
    status: 'sent' | 'failed' | 'pending';
    sent_at?: string;
    error_message?: string;
    created_at: string;
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    notification_type: 'info' | 'warning' | 'error' | 'success';
    user: string;
    read: boolean;
    created_at: string;
    updated_at: string;
}

// Documents and Attachments
export interface ProcedureDocument {
    id: string;
    procedure: string;
    file: string;
    file_name: string;
    file_size: number;
    file_type: string;
    description?: string;
    uploaded_by: string;
    created_at: string;
}

export interface TaskAttachment {
    id: string;
    task: string;
    file: string;
    file_name: string;
    file_size: number;
    file_type: string;
    description?: string;
    uploaded_by: string;
    created_at: string;
}

// History
export interface WorkflowHistory {
    id: string;
    content_type: string;
    object_id: string;
    action: string;
    description?: string;
    user: string;
    user_name?: string;
    metadata?: any;
    created_at: string;
}

// Dashboard
export interface WorkflowDashboard {
    procedures_stats: {
        total: number;
        draft: number;
        running: number;
        finished: number;
        archived: number;
    };
    tasks_stats: {
        total: number;
        pending: number;
        in_progress: number;
        completed: number;
    };
    recent_activities: WorkflowHistory[];
    pending_approvals: number;
}

// Batch Operations
export interface BatchOperation {
    operation: 'archive' | 'delete' | 'update_status' | 'assign';
    target_ids: string[];
    target_type: 'procedure' | 'task';
    parameters?: any;
}

export interface BatchOperationResult {
    success: boolean;
    processed: number;
    failed: number;
    errors?: any[];
}

// Search
export interface WorkflowSearchResult {
    type: 'procedure' | 'task' | 'template';
    id: string;
    title: string;
    description?: string;
    score: number;
    highlights?: any;
}

// Analytics
export interface WorkflowMetrics {
    avg_completion_time: number;
    total_procedures: number;
    completion_rate: number;
    overdue_tasks: number;
    monthly_trends: any[];
}

class FlowService {
    // ==================== PROCEDURES ====================

    /**
     * Listar procedimentos (Procedures)
     * Backend Endpoint: /api/v1/ordoc-flow/procedures/
     */
    async list(filters?: {
        status?: string;
        priority?: string;
        requester?: string;
        search?: string;
    }): Promise<Procedure[]> {
        const response = await apiClient.get<any>('/ordoc-flow/procedures/', { params: filters });
        return response.data.results.map((item: any) => ({
            ...item,
            name: item.procedure_template_name || `Processo ${item.process_number}`,
            ownerId: item.requester,
            ownerName: item.requester_name
        }));
    }

    /**
     * Obter procedimento por ID
     */
    async getById(id: string): Promise<ProcedureDetail> {
        const response = await apiClient.get<ProcedureDetail>(`/ordoc-flow/procedures/${id}/`);
        return {
            ...response.data,
            name: response.data.procedure_template_name || `Processo ${response.data.process_number}`,
        };
    }

    /**
     * Criar procedimento
     */
    async create(data: Partial<Procedure>): Promise<Procedure> {
        const response = await apiClient.post<Procedure>('/ordoc-flow/procedures/', data);
        return response.data;
    }

    /**
     * Atualizar procedimento
     */
    async update(id: string, data: Partial<Procedure>): Promise<Procedure> {
        const response = await apiClient.patch<Procedure>(`/ordoc-flow/procedures/${id}/`, data);
        return response.data;
    }

    /**
     * Deletar procedimento
     */
    async delete(id: string): Promise<void> {
        await apiClient.delete(`/ordoc-flow/procedures/${id}/`);
    }

    /**
     * Estatísticas de procedimentos
     */
    async getProcedureStats(): Promise<any> {
        const response = await apiClient.get('/ordoc-flow/procedures/stats/');
        return response.data;
    }

    /**
     * Executar procedimento
     */
    async runProcedure(id: string): Promise<Procedure> {
        const response = await apiClient.post<Procedure>(`/ordoc-flow/procedures/${id}/run/`);
        return response.data;
    }

    /**
     * Iniciar procedimento
     */
    async startProcedure(id: string): Promise<Procedure> {
        const response = await apiClient.post<Procedure>(`/ordoc-flow/procedures/${id}/start/`);
        return response.data;
    }

    /**
     * Finalizar procedimento
     */
    async finishProcedure(id: string): Promise<Procedure> {
        const response = await apiClient.post<Procedure>(`/ordoc-flow/procedures/${id}/finish/`);
        return response.data;
    }

    /**
     * Arquivar procedimento
     */
    async archiveProcedure(id: string): Promise<Procedure> {
        const response = await apiClient.post<Procedure>(`/ordoc-flow/procedures/${id}/archive/`);
        return response.data;
    }

    /**
     * Desarquivar procedimento
     */
    async unarchiveProcedure(id: string): Promise<Procedure> {
        const response = await apiClient.post<Procedure>(`/ordoc-flow/procedures/${id}/unarchive/`);
        return response.data;
    }

    // ==================== TASKS ====================

    /**
     * Listar tarefas
     */
    async getTasks(filters?: {
        procedure?: string;
        status?: string;
        assignee?: string;
        search?: string;
    }): Promise<Task[]> {
        const response = await apiClient.get<any>('/ordoc-flow/tasks/', { params: filters });
        return response.data.results;
    }

    /**
     * Obter tarefa por ID
     */
    async getTask(id: string): Promise<Task> {
        const response = await apiClient.get<Task>(`/ordoc-flow/tasks/${id}/`);
        return response.data;
    }

    /**
     * Criar tarefa
     */
    async createTask(data: Partial<Task>): Promise<Task> {
        const response = await apiClient.post<Task>('/ordoc-flow/tasks/', data);
        return response.data;
    }

    /**
     * Atualizar tarefa
     */
    async updateTask(id: string, data: Partial<Task>): Promise<Task> {
        const response = await apiClient.patch<Task>(`/ordoc-flow/tasks/${id}/`, data);
        return response.data;
    }

    /**
     * Deletar tarefa
     */
    async deleteTask(id: string): Promise<void> {
        await apiClient.delete(`/ordoc-flow/tasks/${id}/`);
    }

    /**
     * Estatísticas de tarefas
     */
    async getTaskStats(groupId?: string): Promise<any> {
        const params = groupId ? { group_id: groupId } : {};
        const response = await apiClient.get('/ordoc-flow/tasks/stats/', { params });
        return response.data;
    }

    /**
     * Minhas tarefas
     */
    async getMyTasks(): Promise<Task[]> {
        const response = await apiClient.get<any>('/ordoc-flow/tasks/my_tasks/');
        return response.data.results || response.data;
    }

    /**
     * Aceitar tarefa
     */
    async acceptTask(id: string): Promise<Task> {
        const response = await apiClient.post<Task>(`/ordoc-flow/tasks/${id}/accept/`);
        return response.data;
    }

    /**
     * Recusar tarefa
     */
    async refuseTask(id: string, reason?: string): Promise<Task> {
        const response = await apiClient.post<Task>(`/ordoc-flow/tasks/${id}/refuse/`, { reason });
        return response.data;
    }

    /**
     * Completar tarefa
     */
    async completeTask(id: string, data?: any): Promise<Task> {
        const response = await apiClient.post<Task>(`/ordoc-flow/tasks/${id}/complete/`, data);
        return response.data;
    }

    /**
     * Retornar tarefa
     */
    async returnTask(id: string, reason?: string): Promise<Task> {
        const response = await apiClient.post<Task>(`/ordoc-flow/tasks/${id}/return/`, { reason });
        return response.data;
    }

    /**
     * Finalizar tarefa
     */
    async finishTask(id: string): Promise<Task> {
        const response = await apiClient.post<Task>(`/ordoc-flow/tasks/${id}/finish/`);
        return response.data;
    }

    // ==================== EXTERNAL REQUESTERS ====================

    /**
     * Listar solicitantes externos
     */
    async listExternalRequesters(filters?: any): Promise<ExternalRequester[]> {
        const response = await apiClient.get<any>('/ordoc-flow/external-requesters/', { params: filters });
        return response.data.results;
    }

    /**
     * Obter solicitante externo
     */
    async getExternalRequester(id: string): Promise<ExternalRequester> {
        const response = await apiClient.get<ExternalRequester>(`/ordoc-flow/external-requesters/${id}/`);
        return response.data;
    }

    /**
     * Criar solicitante externo
     */
    async createExternalRequester(data: Partial<ExternalRequester>): Promise<ExternalRequester> {
        const response = await apiClient.post<ExternalRequester>('/ordoc-flow/external-requesters/', data);
        return response.data;
    }

    /**
     * Atualizar solicitante externo
     */
    async updateExternalRequester(id: string, data: Partial<ExternalRequester>): Promise<ExternalRequester> {
        const response = await apiClient.patch<ExternalRequester>(`/ordoc-flow/external-requesters/${id}/`, data);
        return response.data;
    }

    /**
     * Deletar solicitante externo
     */
    async deleteExternalRequester(id: string): Promise<void> {
        await apiClient.delete(`/ordoc-flow/external-requesters/${id}/`);
    }

    /**
     * Ativar solicitante externo
     */
    async activateExternalRequester(id: string): Promise<ExternalRequester> {
        const response = await apiClient.post<ExternalRequester>(`/ordoc-flow/external-requesters/${id}/activate/`);
        return response.data;
    }

    /**
     * Desativar solicitante externo
     */
    async deactivateExternalRequester(id: string): Promise<ExternalRequester> {
        const response = await apiClient.post<ExternalRequester>(`/ordoc-flow/external-requesters/${id}/deactivate/`);
        return response.data;
    }

    /**
     * Soft delete solicitante externo
     */
    async softDeleteExternalRequester(id: string): Promise<void> {
        await apiClient.delete(`/ordoc-flow/external-requesters/${id}/soft_delete/`);
    }

    // ==================== GROUP REQUESTERS ====================

    /**
     * Listar grupos de solicitantes
     */
    async listGroupRequesters(filters?: any): Promise<GroupRequester[]> {
        const response = await apiClient.get<any>('/ordoc-flow/group-requesters/', { params: filters });
        return response.data.results;
    }

    /**
     * Obter grupo de solicitantes
     */
    async getGroupRequester(id: string): Promise<GroupRequester> {
        const response = await apiClient.get<GroupRequester>(`/ordoc-flow/group-requesters/${id}/`);
        return response.data;
    }

    /**
     * Criar grupo de solicitantes
     */
    async createGroupRequester(data: Partial<GroupRequester>): Promise<GroupRequester> {
        const response = await apiClient.post<GroupRequester>('/ordoc-flow/group-requesters/', data);
        return response.data;
    }

    /**
     * Atualizar grupo de solicitantes
     */
    async updateGroupRequester(id: string, data: Partial<GroupRequester>): Promise<GroupRequester> {
        const response = await apiClient.patch<GroupRequester>(`/ordoc-flow/group-requesters/${id}/`, data);
        return response.data;
    }

    /**
     * Deletar grupo de solicitantes
     */
    async deleteGroupRequester(id: string): Promise<void> {
        await apiClient.delete(`/ordoc-flow/group-requesters/${id}/`);
    }

    /**
     * Adicionar membro ao grupo
     */
    async addGroupMember(groupId: string, userId: string, role?: string): Promise<any> {
        const response = await apiClient.post(`/ordoc-flow/group-requesters/${groupId}/add_member/`, {
            user_id: userId,
            role: role || 'member'
        });
        return response.data;
    }

    /**
     * Remover membro do grupo
     */
    async removeGroupMember(groupId: string, userId: string): Promise<any> {
        const response = await apiClient.post(`/ordoc-flow/group-requesters/${groupId}/remove_member/`, {
            user_id: userId
        });
        return response.data;
    }

    // ==================== PROCEDURE TEMPLATES ====================

    /**
     * Listar templates de procedimentos
     */
    async listProcedureTemplates(filters?: any): Promise<ProcedureTemplate[]> {
        const response = await apiClient.get<any>('/ordoc-flow/procedure-templates/', { params: filters });
        return response.data.results;
    }

    /**
     * Obter template de procedimento
     */
    async getProcedureTemplate(id: string): Promise<ProcedureTemplate> {
        const response = await apiClient.get<ProcedureTemplate>(`/ordoc-flow/procedure-templates/${id}/`);
        return response.data;
    }

    /**
     * Criar template de procedimento
     */
    async createProcedureTemplate(data: Partial<ProcedureTemplate>): Promise<ProcedureTemplate> {
        const response = await apiClient.post<ProcedureTemplate>('/ordoc-flow/procedure-templates/', data);
        return response.data;
    }

    /**
     * Atualizar template de procedimento
     */
    async updateProcedureTemplate(id: string, data: Partial<ProcedureTemplate>): Promise<ProcedureTemplate> {
        const response = await apiClient.patch<ProcedureTemplate>(`/ordoc-flow/procedure-templates/${id}/`, data);
        return response.data;
    }

    /**
     * Deletar template de procedimento
     */
    async deleteProcedureTemplate(id: string): Promise<void> {
        await apiClient.delete(`/ordoc-flow/procedure-templates/${id}/`);
    }

    /**
     * Listar templates raiz
     */
    async listRootTemplates(): Promise<ProcedureTemplate[]> {
        const response = await apiClient.get<any>('/ordoc-flow/procedure-templates/root_templates/');
        return response.data.results || response.data;
    }

    /**
     * Listar templates filhos
     */
    async listTemplateChildren(id: string): Promise<ProcedureTemplate[]> {
        const response = await apiClient.get<any>(`/ordoc-flow/procedure-templates/${id}/children/`);
        return response.data;
    }

    /**
     * Ativar template
     */
    async activateTemplate(id: string): Promise<ProcedureTemplate> {
        const response = await apiClient.post<ProcedureTemplate>(`/ordoc-flow/procedure-templates/${id}/activate/`);
        return response.data;
    }

    /**
     * Desativar template
     */
    async deactivateTemplate(id: string): Promise<ProcedureTemplate> {
        const response = await apiClient.post<ProcedureTemplate>(`/ordoc-flow/procedure-templates/${id}/deactivate/`);
        return response.data;
    }

    // ==================== WORKFLOW REQUESTS ====================

    /**
     * Listar requisições de workflow
     */
    async listWorkflowRequests(filters?: any): Promise<WorkflowRequest[]> {
        const response = await apiClient.get<any>('/ordoc-flow/workflow-requests/', { params: filters });
        return response.data.results;
    }

    /**
     * Obter requisição de workflow
     */
    async getWorkflowRequest(id: string): Promise<WorkflowRequest> {
        const response = await apiClient.get<WorkflowRequest>(`/ordoc-flow/workflow-requests/${id}/`);
        return response.data;
    }

    /**
     * Criar requisição de workflow
     */
    async createWorkflowRequest(data: Partial<WorkflowRequest>): Promise<WorkflowRequest> {
        const response = await apiClient.post<WorkflowRequest>('/ordoc-flow/workflow-requests/', data);
        return response.data;
    }

    // ==================== APPROVALS ====================

    /**
     * Listar workflows de aprovação
     */
    async listApprovalWorkflows(filters?: any): Promise<ApprovalWorkflow[]> {
        const response = await apiClient.get<any>('/ordoc-flow/approval-workflows/', { params: filters });
        return response.data.results;
    }

    /**
     * Obter workflow de aprovação
     */
    async getApprovalWorkflow(id: string): Promise<ApprovalWorkflow> {
        const response = await apiClient.get<ApprovalWorkflow>(`/ordoc-flow/approval-workflows/${id}/`);
        return response.data;
    }

    /**
     * Criar workflow de aprovação
     */
    async createApprovalWorkflow(data: Partial<ApprovalWorkflow>): Promise<ApprovalWorkflow> {
        const response = await apiClient.post<ApprovalWorkflow>('/ordoc-flow/approval-workflows/', data);
        return response.data;
    }

    /**
     * Atualizar workflow de aprovação
     */
    async updateApprovalWorkflow(id: string, data: Partial<ApprovalWorkflow>): Promise<ApprovalWorkflow> {
        const response = await apiClient.patch<ApprovalWorkflow>(`/ordoc-flow/approval-workflows/${id}/`, data);
        return response.data;
    }

    /**
     * Deletar workflow de aprovação
     */
    async deleteApprovalWorkflow(id: string): Promise<void> {
        await apiClient.delete(`/ordoc-flow/approval-workflows/${id}/`);
    }

    /**
     * Listar instâncias de aprovação
     */
    async listApprovalInstances(filters?: any): Promise<ApprovalInstance[]> {
        const response = await apiClient.get<any>('/ordoc-flow/approval-instances/', { params: filters });
        return response.data.results;
    }

    /**
     * Obter instância de aprovação
     */
    async getApprovalInstance(id: string): Promise<ApprovalInstance> {
        const response = await apiClient.get<ApprovalInstance>(`/ordoc-flow/approval-instances/${id}/`);
        return response.data;
    }

    /**
     * Aprovar instância
     */
    async approveInstance(id: string, comment?: string): Promise<ApprovalInstance> {
        const response = await apiClient.post<ApprovalInstance>(
            `/ordoc-flow/approval-instances/${id}/approve/`,
            { comment }
        );
        return response.data;
    }

    /**
     * Rejeitar instância
     */
    async rejectInstance(id: string, comment?: string): Promise<ApprovalInstance> {
        const response = await apiClient.post<ApprovalInstance>(
            `/ordoc-flow/approval-instances/${id}/reject/`,
            { comment }
        );
        return response.data;
    }

    /**
     * Aprovações pendentes
     */
    async getPendingApprovals(): Promise<ApprovalInstance[]> {
        const response = await apiClient.get<any>('/ordoc-flow/approval-instances/pending/');
        return response.data;
    }

    // ==================== NOTIFICATIONS ====================

    /**
     * Listar templates de notificação
     */
    async listNotificationTemplates(filters?: any): Promise<NotificationTemplate[]> {
        const response = await apiClient.get<any>('/ordoc-flow/notification-templates/', { params: filters });
        return response.data.results;
    }

    /**
     * Obter template de notificação
     */
    async getNotificationTemplate(id: string): Promise<NotificationTemplate> {
        const response = await apiClient.get<NotificationTemplate>(`/ordoc-flow/notification-templates/${id}/`);
        return response.data;
    }

    /**
     * Criar template de notificação
     */
    async createNotificationTemplate(data: Partial<NotificationTemplate>): Promise<NotificationTemplate> {
        const response = await apiClient.post<NotificationTemplate>('/ordoc-flow/notification-templates/', data);
        return response.data;
    }

    /**
     * Atualizar template de notificação
     */
    async updateNotificationTemplate(id: string, data: Partial<NotificationTemplate>): Promise<NotificationTemplate> {
        const response = await apiClient.patch<NotificationTemplate>(`/ordoc-flow/notification-templates/${id}/`, data);
        return response.data;
    }

    /**
     * Deletar template de notificação
     */
    async deleteNotificationTemplate(id: string): Promise<void> {
        await apiClient.delete(`/ordoc-flow/notification-templates/${id}/`);
    }

    /**
     * Listar logs de notificação
     */
    async listNotificationLogs(filters?: any): Promise<NotificationLog[]> {
        const response = await apiClient.get<any>('/ordoc-flow/notification-logs/', { params: filters });
        return response.data.results;
    }

    /**
     * Listar notificações do usuário
     */
    async listNotifications(filters?: any): Promise<Notification[]> {
        const response = await apiClient.get<any>('/ordoc-flow/notifications/', { params: filters });
        return response.data.results;
    }

    /**
     * Marcar notificação como lida
     */
    async markNotificationAsRead(id: string): Promise<Notification> {
        const response = await apiClient.patch<Notification>(`/ordoc-flow/notifications/${id}/`, { read: true });
        return response.data;
    }

    /**
     * Marcar todas notificações como lidas
     */
    async markAllNotificationsAsRead(): Promise<any> {
        const response = await apiClient.post('/ordoc-flow/notifications/mark_all_read/');
        return response.data;
    }

    /**
     * Deletar notificação
     */
    async deleteNotification(id: string): Promise<void> {
        await apiClient.delete(`/ordoc-flow/notifications/${id}/`);
    }

    // ==================== DOCUMENTS AND ATTACHMENTS ====================

    /**
     * Listar documentos de procedimento
     */
    async listProcedureDocuments(procedureId: string): Promise<ProcedureDocument[]> {
        const response = await apiClient.get<any>('/ordoc-flow/procedure-documents/', {
            params: { procedure: procedureId }
        });
        return response.data.results;
    }

    /**
     * Upload documento de procedimento
     */
    async uploadProcedureDocument(
        procedureId: string,
        file: File,
        description?: string
    ): Promise<ProcedureDocument> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('procedure', procedureId);
        if (description) formData.append('description', description);

        const response = await apiClient.post<ProcedureDocument>(
            '/ordoc-flow/procedure-documents/',
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' }
            }
        );
        return response.data;
    }

    /**
     * Deletar documento de procedimento
     */
    async deleteProcedureDocument(id: string): Promise<void> {
        await apiClient.delete(`/ordoc-flow/procedure-documents/${id}/`);
    }

    /**
     * Listar anexos de tarefa
     */
    async listTaskAttachments(taskId: string): Promise<TaskAttachment[]> {
        const response = await apiClient.get<any>('/ordoc-flow/task-attachments/', {
            params: { task: taskId }
        });
        return response.data.results;
    }

    /**
     * Upload anexo de tarefa
     */
    async uploadTaskAttachment(
        taskId: string,
        file: File,
        description?: string
    ): Promise<TaskAttachment> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('task', taskId);
        if (description) formData.append('description', description);

        const response = await apiClient.post<TaskAttachment>(
            '/ordoc-flow/task-attachments/',
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' }
            }
        );
        return response.data;
    }

    /**
     * Deletar anexo de tarefa
     */
    async deleteTaskAttachment(id: string): Promise<void> {
        await apiClient.delete(`/ordoc-flow/task-attachments/${id}/`);
    }

    // ==================== HISTORY ====================

    /**
     * Listar histórico de workflow
     */
    async listWorkflowHistory(filters?: {
        content_type?: string;
        object_id?: string;
        action?: string;
        user?: string;
    }): Promise<WorkflowHistory[]> {
        const response = await apiClient.get<any>('/ordoc-flow/history/', { params: filters });
        return response.data.results;
    }

    /**
     * Obter histórico de um objeto específico
     */
    async getObjectHistory(objectType: string, objectId: string): Promise<WorkflowHistory[]> {
        const response = await apiClient.get<any>('/ordoc-flow/history/', {
            params: {
                content_type: objectType,
                object_id: objectId
            }
        });
        return response.data.results;
    }

    // ==================== DASHBOARD ====================

    /**
     * Obter dashboard de workflow
     */
    async getDashboard(): Promise<WorkflowDashboard> {
        const response = await apiClient.get<any>('/ordoc-flow/dashboard/overview/');
        return response.data;
    }

    // ==================== BATCH OPERATIONS ====================

    /**
     * Executar operação em lote
     */
    async executeBatchOperation(operation: BatchOperation): Promise<BatchOperationResult> {
        const response = await apiClient.post<BatchOperationResult>(
            '/ordoc-flow/batch-operations/execute/',
            operation
        );
        return response.data;
    }

    // ==================== SEARCH ====================

    /**
     * Buscar no workflow
     */
    async search(query: string, filters?: {
        type?: 'procedure' | 'task' | 'template';
        status?: string;
    }): Promise<WorkflowSearchResult[]> {
        const response = await apiClient.get<any>('/ordoc-flow/search/search/', {
            params: { q: query, ...filters }
        });
        return response.data;
    }

    /**
     * Obter sugestões de busca
     */
    async getSearchSuggestions(query: string): Promise<string[]> {
        const response = await apiClient.get<any>('/ordoc-flow/search/suggestions/', {
            params: { q: query }
        });
        return response.data.suggestions || [];
    }

    // ==================== ANALYTICS ====================

    /**
     * Obter métricas de workflow
     */
    async getWorkflowMetrics(filters?: {
        start_date?: string;
        end_date?: string;
        template?: string;
        group?: string;
    }): Promise<WorkflowMetrics> {
        const response = await apiClient.get<WorkflowMetrics>(
            '/ordoc-flow/analytics/workflow_metrics/',
            { params: filters }
        );
        return response.data;
    }
}

export const flowService = new FlowService();
// Exportando como processService para manter compatibilidade com imports existentes
export const processService = flowService;
export default flowService;
