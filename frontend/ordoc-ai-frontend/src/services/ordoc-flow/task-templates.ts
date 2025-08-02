import api from '@/services/auth';
import { TaskTemplate, FilterTaskTemplatesParams, PaginatedResponse, ApiResponse } from '@/types/ordoc-flow';

export const taskTemplatesService = {
  async getTaskTemplates(params: FilterTaskTemplatesParams): Promise<PaginatedResponse<TaskTemplate>> {
    try {
      const response = await api.get('/api/v1/ordoc-flow/api/procedure-templates/', {
        params: {
          page: params.page,
          per_page: params.perPage,
          ordering: params.direction === 'desc' ? `-${params.order}` : params.order,
          search: params.q || undefined,
          status: params.status || undefined,
          procedure_template_id: params.procedure_template_id || undefined,
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
      console.error('Erro ao buscar templates de tarefa:', error);
      throw error;
    }
  },

  async getTaskTemplate(id: number): Promise<ApiResponse<TaskTemplate>> {
    try {
      const response = await api.get(`/api/v1/ordoc-flow/api/procedure-templates/${id}/`);
      return {
        success: true,
        data: response.data,
        message: 'Template de tarefa carregado com sucesso',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao carregar template de tarefa',
        errors: error.response?.data?.errors || {},
      };
    }
  },

  async createTaskTemplate(data: Partial<TaskTemplate>): Promise<ApiResponse<TaskTemplate>> {
    try {
      const response = await api.post('/api/v1/ordoc-flow/api/procedure-templates/', data);
      return {
        success: true,
        data: response.data,
        message: 'Template de tarefa criado com sucesso',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao criar template de tarefa',
        errors: error.response?.data?.errors || {},
      };
    }
  },

  async updateTaskTemplate(id: number, data: Partial<TaskTemplate>): Promise<ApiResponse<TaskTemplate>> {
    try {
      const response = await api.put(`/api/v1/ordoc-flow/api/procedure-templates/${id}/`, data);
      return {
        success: true,
        data: response.data,
        message: 'Template de tarefa atualizado com sucesso',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao atualizar template de tarefa',
        errors: error.response?.data?.errors || {},
      };
    }
  },

  async deleteTaskTemplate(id: number): Promise<ApiResponse<void>> {
    try {
      await api.delete(`/api/v1/ordoc-flow/api/procedure-templates/${id}/`);
      return {
        success: true,
        message: 'Template de tarefa excluído com sucesso',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao excluir template de tarefa',
        errors: error.response?.data?.errors || {},
      };
    }
  },

  async toggleTaskTemplateStatus(id: number): Promise<ApiResponse<TaskTemplate>> {
    try {
      const response = await api.patch(`/api/v1/ordoc-flow/api/procedure-templates/${id}/toggle_status/`);
      return {
        success: true,
        data: response.data,
        message: 'Status do template de tarefa alterado com sucesso',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao alterar status do template de tarefa',
        errors: error.response?.data?.errors || {},
      };
    }
  },
};
