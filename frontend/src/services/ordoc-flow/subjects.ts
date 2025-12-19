import api from '@/services/auth';
import { Subject, FilterSubjectsParams, PaginatedResponse, ApiResponse } from '@/types/ordoc-flow';

export const subjectsService = {
  async getSubjects(params: FilterSubjectsParams): Promise<PaginatedResponse<Subject>> {
    try {
      const response = await api.get('/api/v1/ordoc-flow/api/subjects/', {
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
      console.error('Erro ao buscar subjects:', error);
      throw error;
    }
  },

  async getSubject(id: number): Promise<ApiResponse<Subject>> {
    try {
      const response = await api.get(`/api/v1/ordoc-flow/api/subjects/${id}/`);
      return {
        success: true,
        data: response.data,
        message: 'Subject carregado com sucesso',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao carregar subject',
        errors: error.response?.data?.errors || {},
      };
    }
  },

  async createSubject(data: Partial<Subject>): Promise<ApiResponse<Subject>> {
    try {
      const response = await api.post('/api/v1/ordoc-flow/api/subjects/', data);
      return {
        success: true,
        data: response.data,
        message: 'Subject criado com sucesso',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao criar subject',
        errors: error.response?.data?.errors || {},
      };
    }
  },

  async updateSubject(id: number, data: Partial<Subject>): Promise<ApiResponse<Subject>> {
    try {
      const response = await api.put(`/api/v1/ordoc-flow/api/subjects/${id}/`, data);
      return {
        success: true,
        data: response.data,
        message: 'Subject atualizado com sucesso',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao atualizar subject',
        errors: error.response?.data?.errors || {},
      };
    }
  },

  async deleteSubject(id: number): Promise<ApiResponse<void>> {
    try {
      await api.delete(`/api/v1/ordoc-flow/api/subjects/${id}/`);
      return {
        success: true,
        message: 'Subject excluído com sucesso',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao excluir subject',
        errors: error.response?.data?.errors || {},
      };
    }
  },

  async toggleSubjectStatus(id: number): Promise<ApiResponse<Subject>> {
    try {
      const response = await api.patch(`/api/v1/ordoc-flow/api/subjects/${id}/toggle_status/`);
      return {
        success: true,
        data: response.data,
        message: 'Status do subject alterado com sucesso',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao alterar status do subject',
        errors: error.response?.data?.errors || {},
      };
    }
  },
};
