import apiClient from './api';

export interface Process {
    id: string;
    name: string;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    createdAt: string;
    updatedAt: string;
    ownerId: string;
    ownerName: string;
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
}

export interface ProcessTask {
    id: string;
    processId: string;
    name: string;
    status: 'pending' | 'in_progress' | 'completed';
    assignedTo?: string;
    assignedToName?: string;
    createdAt: string;
    completedAt?: string;
}

export interface ProcessDetail extends Process {
    description?: string;
    tasks: ProcessTask[];
    history: ProcessHistoryItem[];
}

export interface ProcessHistoryItem {
    id: string;
    action: string;
    userId: string;
    userName: string;
    timestamp: string;
    details?: string;
}

class ProcessService {
    /**
     * Listar processos
     */
    async list(filters?: {
        status?: string;
        priority?: string;
        ownerId?: string;
    }): Promise<Process[]> {
        const response = await apiClient.get<Process[]>('/processes', { params: filters });
        return response.data;
    }

    /**
     * Obter processo por ID
     */
    async getById(id: string): Promise<ProcessDetail> {
        const response = await apiClient.get<ProcessDetail>(`/processes/${id}`);
        return response.data;
    }

    /**
     * Criar processo
     */
    async create(data: Partial<Process>): Promise<Process> {
        const response = await apiClient.post<Process>('/processes', data);
        return response.data;
    }

    /**
     * Atualizar processo
     */
    async update(id: string, data: Partial<Process>): Promise<Process> {
        const response = await apiClient.put<Process>(`/processes/${id}`, data);
        return response.data;
    }

    /**
     * Deletar processo
     */
    async delete(id: string): Promise<void> {
        await apiClient.delete(`/processes/${id}`);
    }

    /**
     * Listar tarefas de um processo
     */
    async getTasks(processId: string): Promise<ProcessTask[]> {
        const response = await apiClient.get<ProcessTask[]>(`/processes/${processId}/tasks`);
        return response.data;
    }

    /**
     * Atualizar tarefa
     */
    async updateTask(processId: string, taskId: string, data: Partial<ProcessTask>): Promise<ProcessTask> {
        const response = await apiClient.put<ProcessTask>(
            `/processes/${processId}/tasks/${taskId}`,
            data
        );
        return response.data;
    }
}

export const processService = new ProcessService();
export default processService;
