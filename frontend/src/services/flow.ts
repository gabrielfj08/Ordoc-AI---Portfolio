import api from '@/services/auth';

export interface Procedure {
    id: string;
    process_number: string;
    procedure_template_name: string;
    status: 'draft' | 'running' | 'started' | 'finished' | 'archived';
    priority: 'normal' | 'high';
    source: 'internal' | 'external';
    created_at: string;
    description?: string;
    tasks_total?: number;
    tasks_completed?: number;
    progress?: number;
}

export interface Task {
    id: string;
    name: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'cancelled';
    deadline?: string;
    assignee?: {
        id: string;
        name: string;
        avatar?: string;
    };
    created_at: string;
    procedure_info?: string;
}

export interface CreateProcedureDTO {
    procedure_template: string; // UUID
    payload?: any;
    priority?: 'normal' | 'high';
}

const flowService = {
    // Procedures
    async getProcedures(params?: any): Promise<Procedure[]> {
        const response = await api.get('/api/v1/ordoc-flow/api/procedures/', { params });
        return response.data.results || response.data;
    },

    async getProcedure(id: string): Promise<Procedure> {
        const response = await api.get(`/api/v1/ordoc-flow/api/procedures/${id}/`);
        return response.data;
    },

    async createProcedure(data: CreateProcedureDTO): Promise<Procedure> {
        const response = await api.post('/api/v1/ordoc-flow/api/procedures/', data);
        return response.data;
    },

    async startProcedure(id: string): Promise<void> {
        await api.post(`/api/v1/ordoc-flow/api/procedures/${id}/start/`);
    },

    async pauseProcedure(id: string): Promise<void> {
        // Backend currently doesn't have an explicit pause transition, assuming archive or stop
        // Check models: only draft, running, started, finished, archived.
        // Pausing might mean moving to draft or a custom status.
        // For now, let's implement archive as pause/stop
        await api.post(`/api/v1/ordoc-flow/api/procedures/${id}/archive/`);
    },

    async cancelProcedure(id: string): Promise<void> {
        await api.post(`/api/v1/ordoc-flow/api/procedures/${id}/archive/`);
    },

    // Tasks
    async getTasks(params?: any): Promise<Task[]> {
        const response = await api.get('/api/v1/ordoc-flow/api/tasks/', { params });
        return response.data.results || response.data;
    },

    async getTask(id: string): Promise<Task> {
        const response = await api.get(`/api/v1/ordoc-flow/api/tasks/${id}/`);
        return response.data;
    },

    async updateTaskStatus(id: string, status: string): Promise<Task> {
        const response = await api.patch(`/api/v1/ordoc-flow/api/tasks/${id}/`, { status });
        return response.data;
    },

    async createTask(data: any): Promise<Task> {
        const response = await api.post('/api/v1/ordoc-flow/api/tasks/', data);
        return response.data;
    },

    // Templates
    async getProcedureTemplates(): Promise<any[]> {
        const response = await api.get('/api/v1/ordoc-flow/api/procedure-templates/');
        return response.data.results || response.data;
    }
};

export default flowService;
