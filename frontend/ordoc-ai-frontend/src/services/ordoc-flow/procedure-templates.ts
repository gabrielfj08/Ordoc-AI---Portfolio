import api from '@/services/auth';
import { 
  ProcedureTemplate, 
  FilterProcedureTemplatesParams, 
  PaginatedResponse, 
  ApiResponse 
} from '@/types/ordoc-flow';

export const procedureTemplatesService = {
  // Get all procedure templates with pagination and filters
  async getProcedureTemplates(params: FilterProcedureTemplatesParams): Promise<PaginatedResponse<ProcedureTemplate>> {
    const response = await api.get(`/api/v1/ordoc-flow/api/procedure-templates/`, {
      params: {
        page: params.page,
        per_page: params.perPage,
        ordering: params.direction === 'desc' ? `-${params.order}` : params.order,
        search: params.q,
        status: params.status || undefined,
        group_id: params.group_id || undefined,
      },
    });
    
    return {
      data: response.data.results,
      total: response.data.count,
      page: params.page,
      perPage: params.perPage,
      totalPages: Math.ceil(response.data.count / params.perPage),
    };
  },

  // Get single procedure template by ID
  async getProcedureTemplate(id: number): Promise<ProcedureTemplate> {
    const response = await api.get(`/api/v1/ordoc-flow/api/procedure-templates/${id}/`);
    return response.data;
  },

  // Create new procedure template
  async createProcedureTemplate(data: Partial<ProcedureTemplate>): Promise<ApiResponse<ProcedureTemplate>> {
    try {
      const response = await api.post(`/api/v1/ordoc-flow/api/procedure-templates/`, data);
      return {
        success: true,
        data: response.data,
        message: 'Template de procedimento criado com sucesso',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Erro ao criar template de procedimento',
        errors: error.response?.data || {},
      };
    }
  },

  // Update procedure template
  async updateProcedureTemplate(id: number, data: Partial<ProcedureTemplate>): Promise<ApiResponse<ProcedureTemplate>> {
    try {
      const response = await api.put(`/api/v1/ordoc-flow/api/procedure-templates/${id}/`, data);
      return {
        success: true,
        data: response.data,
        message: 'Template de procedimento atualizado com sucesso',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Erro ao atualizar template de procedimento',
        errors: error.response?.data || {},
      };
    }
  },

  // Delete procedure template
  async deleteProcedureTemplate(id: number): Promise<ApiResponse> {
    try {
      await api.delete(`/api/v1/ordoc-flow/api/procedure-templates/${id}/`);
      return {
        success: true,
        message: 'Template de procedimento excluído com sucesso',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Erro ao excluir template de procedimento',
        errors: error.response?.data || {},
      };
    }
  },

  // Activate/Deactivate procedure template
  async toggleProcedureTemplateStatus(id: number, status: 'active' | 'inactive'): Promise<ApiResponse<ProcedureTemplate>> {
    try {
      const response = await api.patch(`/api/v1/ordoc-flow/api/procedure-templates/${id}/`, {
        status,
      });
      return {
        success: true,
        data: response.data,
        message: `Template de procedimento ${status === 'active' ? 'ativado' : 'desativado'} com sucesso`,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Erro ao ${status === 'active' ? 'ativar' : 'desativar'} template de procedimento`,
        errors: error.response?.data || {},
      };
    }
  },

  // Clone procedure template
  async cloneProcedureTemplate(id: number, name: string): Promise<ApiResponse<ProcedureTemplate>> {
    try {
      const response = await api.post(`/api/v1/ordoc-flow/api/procedure-templates/${id}/clone/`, {
        name,
      });
      return {
        success: true,
        data: response.data,
        message: 'Template de procedimento clonado com sucesso',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Erro ao clonar template de procedimento',
        errors: error.response?.data || {},
      };
    }
  },
};