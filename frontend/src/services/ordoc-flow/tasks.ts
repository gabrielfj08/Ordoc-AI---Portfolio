import api from '@/services/auth';
import { Task, FilterTasksParams, PaginatedResponse, ApiResponse } from '@/types/ordoc-flow';

export const tasksService = {
  async getTasks(params: FilterTasksParams): Promise<PaginatedResponse<Task>> {
    try {
      const response = await api.get(`/api/v1/ordoc-flow/api/tasks/`, {
        params: {
          page: params.page,
          per_page: params.perPage,
          ordering: params.direction === 'desc' ? `-${params.order}` : params.order,
          search: params.q || undefined,
          status: params.status || undefined,
          procedure_id: params.procedure_id || undefined,
          assignee_id: params.assignee_id || undefined,
          priority: params.priority || undefined,
        },
      });

      return {
        data: response.data.results || [],
        total: response.data.count || 0,
        page: params.page,
        perPage: params.perPage,
        totalPages: Math.ceil((response.data.count || 0) / params.perPage),
      };
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
      throw error;
    }
  },

  async getTask(id: number): Promise<ApiResponse<Task>> {
    try {
      const response = await api.get(`/api/v1/ordoc-flow/api/tasks/${id}/`);
      return {
        success: true,
        data: response.data,
        message: 'Tarefa carregada com sucesso',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao carregar tarefa',
        errors: error.response?.data?.errors || {},
      };
    }
  },

  async createTask(data: Partial<Task>): Promise<ApiResponse<Task>> {
    try {
      const response = await api.post(`/api/v1/ordoc-flow/api/tasks/`, data);
      return {
        success: true,
        data: response.data,
        message: 'Tarefa criada com sucesso',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao criar tarefa',
        errors: error.response?.data?.errors || {},
      };
    }
  },

  async updateTask(id: number, data: Partial<Task>): Promise<ApiResponse<Task>> {
    try {
      const response = await api.put(`/api/v1/ordoc-flow/api/tasks/${id}/`, data);
      return {
        success: true,
        data: response.data,
        message: 'Tarefa atualizada com sucesso',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao atualizar tarefa',
        errors: error.response?.data?.errors || {},
      };
    }
  },

  async deleteTask(id: number): Promise<ApiResponse<void>> {
    try {
      await api.delete(`/api/v1/ordoc-flow/api/tasks/${id}/`);
      return {
        success: true,
        message: 'Tarefa excluída com sucesso',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao excluir tarefa',
        errors: error.response?.data?.errors || {},
      };
    }
  },

  async toggleTaskStatus(id: number): Promise<ApiResponse<Task>> {
    try {
      const response = await api.patch(`/api/v1/ordoc-flow/api/tasks/${id}/toggle_status/`);
      return {
        success: true,
        data: response.data,
        message: 'Status da tarefa alterado com sucesso',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao alterar status da tarefa',
        errors: error.response?.data?.errors || {},
      };
    }
  },
};
