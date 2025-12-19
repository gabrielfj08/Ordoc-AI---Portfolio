import api from '@/services/auth';
import { 
  Group, 
  FilterGroupsParams, 
  PaginatedResponse, 
  ApiResponse 
} from '@/types/ordoc-flow';

export const groupsService = {
  // Get all groups with pagination and filters
  async getGroups(params: FilterGroupsParams): Promise<PaginatedResponse<Group>> {
    const response = await api.get('/api/v1/ordoc-flow/api/group-requesters/', {
      params: {
        page: params.page,
        per_page: params.perPage,
        ordering: params.direction === 'desc' ? `-${params.order}` : params.order,
        search: params.q,
        status: params.status || undefined,
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

  // Export groups
  async exportGroups(params: FilterGroupsParams): Promise<Blob> {
    const response = await api.get('/api/v1/ordoc-flow/api/group-requesters/export/', {
      params: {
        page: params.page,
        per_page: params.perPage,
        ordering: params.direction === 'desc' ? `-${params.order}` : params.order,
        search: params.q,
      },
    });
    
    return response.data;
  },

  // Get single group by ID
  async getGroup(id: number): Promise<Group> {
    const response = await api.get(`/api/v1/ordoc-flow/api/group-requesters/${id}/`);
    return response.data;
  },

  // Create new group
  async createGroup(data: Partial<Group>): Promise<ApiResponse<Group>> {
    try {
      const response = await api.post('/api/v1/ordoc-flow/api/group-requesters/', data);
      return {
        success: true,
        data: response.data,
        message: 'Grupo criado com sucesso',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Erro ao criar grupo',
        errors: error.response?.data || {},
      };
    }
  },

  // Update existing group
  async updateGroup(id: number, data: Partial<Group>): Promise<ApiResponse<Group>> {
    try {
      const response = await api.patch(`/api/v1/ordoc-flow/api/group-requesters/${id}/`, data);
      return {
        success: true,
        data: response.data,
        message: 'Grupo atualizado com sucesso',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Erro ao atualizar grupo',
        errors: error.response?.data || {},
      };
    }
  },

  // Delete group
  async deleteGroup(id: number): Promise<ApiResponse> {
    try {
      await api.delete(`/api/v1/ordoc-flow/api/group-requesters/${id}/`);
      return {
        success: true,
        message: 'Grupo excluído com sucesso',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Erro ao excluir grupo',
        errors: error.response?.data || {},
      };
    }
  },

  // Activate/Deactivate group
  async toggleGroupStatus(id: number, status: 'active' | 'inactive'): Promise<ApiResponse<Group>> {
    try {
      const response = await api.patch(`/api/v1/ordoc-flow/api/group-requesters/${id}/`, {
        status,
      });
      return {
        success: true,
        data: response.data,
        message: `Grupo ${status === 'active' ? 'ativado' : 'desativado'} com sucesso`,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Erro ao ${status === 'active' ? 'ativar' : 'desativar'} grupo`,
        errors: error.response?.data || {},
      };
    }
  },

  // Get group requesters
  async getGroupRequesters(groupId: number): Promise<any[]> {
    const response = await api.get('/api/v1/ordoc-flow/api/group-requesters/', {});
    return response.data.results || response.data;
  },

  // Add requester to group
  async addRequesterToGroup(groupId: number, requesterId: number): Promise<ApiResponse> {
    try {
      await api.post('/api/v1/ordoc-flow/api/group-requesters/bulk-delete/', { requester_id: requesterId });
      return {
        success: true,
        message: 'Requerente adicionado ao grupo com sucesso',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Erro ao adicionar requerente ao grupo',
        errors: error.response?.data || {},
      };
    }
  },

  // Remove requester from group
  async removeRequesterFromGroup(groupId: number, requesterId: number): Promise<ApiResponse> {
    try {
      await api.delete(`/api/v1/ordoc-flow/api/group-requesters/${requesterId}/`);
      return {
        success: true,
        message: 'Requerente removido do grupo com sucesso',
      };
    } catch (error: any) {
      return {
        success: false,
        message: 'Erro ao remover requerente do grupo',
        errors: error.response?.data || {},
      };
    }
  },
};