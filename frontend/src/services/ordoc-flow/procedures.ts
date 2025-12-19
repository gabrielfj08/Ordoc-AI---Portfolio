import api from '@/services/auth';
import { Procedure, FilterProceduresParams, PaginatedResponse, ApiResponse } from '@/types/ordoc-flow';

export const proceduresService = {
  async getProcedures(params: FilterProceduresParams): Promise<PaginatedResponse<Procedure>> {
    try {
      const response = await api.get('/api/v1/ordoc-flow/api/procedures/', {
        params: {
          page: params.page,
          per_page: params.perPage,
          ordering: params.direction === 'desc' ? `-${params.order}` : params.order,
          search: params.q || undefined,
          status: params.status || undefined,
          procedure_template_id: params.procedure_template_id || undefined,
          requester_id: params.requester_id || undefined,
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
      console.error('Erro ao buscar procedimentos:', error);
      throw error;
    }
  },

  async getProcedure(id: number): Promise<ApiResponse<Procedure>> {
    try {
      const response = await api.get(`/api/v1/ordoc-flow/api/procedures/${id}/`);
      return {
        success: true,
        data: response.data,
        message: 'Procedimento carregado com sucesso',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao carregar procedimento',
        errors: error.response?.data?.errors || {},
      };
    }
  },

  async createProcedure(data: Partial<Procedure>): Promise<ApiResponse<Procedure>> {
    try {
      const response = await api.post('/api/v1/ordoc-flow/api/procedures/', data);
      return {
        success: true,
        data: response.data,
        message: 'Procedimento criado com sucesso',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao criar procedimento',
        errors: error.response?.data?.errors || {},
      };
    }
  },

  async updateProcedure(id: number, data: Partial<Procedure>): Promise<ApiResponse<Procedure>> {
    try {
      const response = await api.put(`/api/v1/ordoc-flow/api/procedures/${id}/`, data);
      return {
        success: true,
        data: response.data,
        message: 'Procedimento atualizado com sucesso',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao atualizar procedimento',
        errors: error.response?.data?.errors || {},
      };
    }
  },

  async deleteProcedure(id: number): Promise<ApiResponse<void>> {
    try {
      await api.delete(`/api/v1/ordoc-flow/api/procedures/${id}/`);
      return {
        success: true,
        message: 'Procedimento excluído com sucesso',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao excluir procedimento',
        errors: error.response?.data?.errors || {},
      };
    }
  },

  async toggleProcedureStatus(id: number): Promise<ApiResponse<Procedure>> {
    try {
      const response = await api.patch(`/api/v1/ordoc-flow/api/procedures/${id}/toggle_status/`);
      return {
        success: true,
        data: response.data,
        message: 'Status do procedimento alterado com sucesso',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao alterar status do procedimento',
        errors: error.response?.data?.errors || {},
      };
    }
  },
};
