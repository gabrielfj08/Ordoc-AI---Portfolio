import axios from 'axios';
import { Requester, FilterRequestersParams, PaginatedResponse, ApiResponse } from '@/types/ordoc-flow';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const requestersService = {
  async getRequesters(params: FilterRequestersParams): Promise<PaginatedResponse<Requester>> {
    try {
      const response = await axios.get(`${API_BASE_URL}/ordoc_flow/api/external-requesters/`, {
        params: {
          page: params.page,
          per_page: params.perPage,
          ordering: params.direction === 'desc' ? `-${params.order}` : params.order,
          search: params.q || undefined,
          status: params.status || undefined,
          type: params.type || undefined,
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
      console.error('Erro ao buscar requerentes:', error);
      throw error;
    }
  },

  async getRequester(id: number): Promise<ApiResponse<Requester>> {
    try {
      const response = await axios.get(`${API_BASE_URL}/ordoc_flow/api/external-requesters/${id}/`);
      return {
        success: true,
        data: response.data,
        message: 'Requerente carregado com sucesso',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao carregar requerente',
        errors: error.response?.data?.errors || {},
      };
    }
  },

  async createRequester(data: Partial<Requester>): Promise<ApiResponse<Requester>> {
    try {
      const response = await axios.post(`${API_BASE_URL}/ordoc_flow/api/external-requesters/`, data);
      return {
        success: true,
        data: response.data,
        message: 'Requerente criado com sucesso',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao criar requerente',
        errors: error.response?.data?.errors || {},
      };
    }
  },

  async updateRequester(id: number, data: Partial<Requester>): Promise<ApiResponse<Requester>> {
    try {
      const response = await axios.put(`${API_BASE_URL}/ordoc_flow/api/external-requesters/${id}/`, data);
      return {
        success: true,
        data: response.data,
        message: 'Requerente atualizado com sucesso',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao atualizar requerente',
        errors: error.response?.data?.errors || {},
      };
    }
  },

  async deleteRequester(id: number): Promise<ApiResponse<void>> {
    try {
      await axios.delete(`${API_BASE_URL}/ordoc_flow/api/external-requesters/${id}/`);
      return {
        success: true,
        message: 'Requerente excluído com sucesso',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao excluir requerente',
        errors: error.response?.data?.errors || {},
      };
    }
  },

  async toggleRequesterStatus(id: number): Promise<ApiResponse<Requester>> {
    try {
      const response = await axios.patch(`${API_BASE_URL}/ordoc_flow/api/external-requesters/${id}/toggle_status/`);
      return {
        success: true,
        data: response.data,
        message: 'Status do requerente alterado com sucesso',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao alterar status do requerente',
        errors: error.response?.data?.errors || {},
      };
    }
  },
};
