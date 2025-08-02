import axios from 'axios';
import { 
  Group, 
  FilterGroupsParams, 
  PaginatedResponse, 
  ApiResponse 
} from '@/types/ordoc-flow';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const groupsService = {
  // Get all groups with pagination and filters
  async getGroups(params: FilterGroupsParams): Promise<PaginatedResponse<Group>> {
    const response = await axios.get(`${API_BASE_URL}/api/ordoc-flow/groups/`, {
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

  // Get single group by ID
  async getGroup(id: number): Promise<Group> {
    const response = await axios.get(`${API_BASE_URL}/api/ordoc-flow/groups/${id}/`);
    return response.data;
  },

  // Create new group
  async createGroup(data: Partial<Group>): Promise<ApiResponse<Group>> {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/ordoc-flow/groups/`, data);
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

  // Update group
  async updateGroup(id: number, data: Partial<Group>): Promise<ApiResponse<Group>> {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/ordoc-flow/groups/${id}/`, data);
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
      await axios.delete(`${API_BASE_URL}/api/ordoc-flow/groups/${id}/`);
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
      const response = await axios.patch(`${API_BASE_URL}/api/ordoc-flow/groups/${id}/`, {
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
    const response = await axios.get(`${API_BASE_URL}/api/ordoc-flow/groups/${groupId}/requesters/`);
    return response.data.results || response.data;
  },

  // Add requester to group
  async addRequesterToGroup(groupId: number, requesterId: number): Promise<ApiResponse> {
    try {
      await axios.post(`${API_BASE_URL}/api/ordoc-flow/groups/${groupId}/requesters/`, {
        requester_id: requesterId,
      });
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
      await axios.delete(`${API_BASE_URL}/api/ordoc-flow/groups/${groupId}/requesters/${requesterId}/`);
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