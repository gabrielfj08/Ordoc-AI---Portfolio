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

class FlowService {
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

        // Mapper para garantir compatibilidade com UI que espera 'name' e 'ownerName'
        return response.data.results.map((item: any) => ({
            ...item,
            name: item.procedure_template_name || `Processo ${item.process_number}`, // Fallback name
            ownerId: item.requester, // Frontend compat
            ownerName: item.requester_name // Frontend compat
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
     * Deletar procedimento (Arquivar ou Deletar físico dependendo da regra, aqui usando delete padrão)
     */
    async delete(id: string): Promise<void> {
        await apiClient.delete(`/ordoc-flow/procedures/${id}/`);
    }

    /**
     * Listar tarefas (Geral ou de um processo específico via filtro)
     */
    async getTasks(procedureId?: string): Promise<Task[]> {
        const params = procedureId ? { procedure: procedureId } : {};
        const response = await apiClient.get<any>('/ordoc-flow/tasks/', { params });
        return response.data.results;
    }

    /**
     * Atualizar tarefa (Status, Atribuição, etc)
     */
    async updateTask(taskId: string, data: Partial<Task>): Promise<Task> {
        const response = await apiClient.patch<Task>(
            `/ordoc-flow/tasks/${taskId}/`,
            data
        );
        return response.data;
    }
}

export const flowService = new FlowService();
// Exportando como processService para manter compatibilidade com imports existentes
export const processService = flowService;
export default flowService;
