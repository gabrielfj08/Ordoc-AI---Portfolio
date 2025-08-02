import axios from 'axios';
import { Signature, FilterSignaturesParams, PaginatedResponse, ApiResponse } from '@/types/ordoc-flow';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const signaturesService = {
  async getSignatures(params: FilterSignaturesParams): Promise<PaginatedResponse<Signature>> {
    try {
      const response = await axios.get(`${API_BASE_URL}/ordoc_flow/api/approval-instances/`, {
        params: {
          page: params.page,
          per_page: params.perPage,
          ordering: params.direction === 'desc' ? `-${params.order}` : params.order,
          search: params.q || undefined,
          status: params.status || undefined,
          procedure_id: params.procedure_id || undefined,
          requester_id: params.requester_id || undefined,
          signable_type: params.signable_type || undefined,
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
      console.error('Erro ao buscar assinaturas:', error);
      throw error;
    }
  },

  async getSignature(id: number): Promise<ApiResponse<Signature>> {
    try {
      const response = await axios.get(`${API_BASE_URL}/ordoc_flow/api/approval-instances/${id}/`);
      return {
        success: true,
        data: response.data,
        message: 'Assinatura carregada com sucesso',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao carregar assinatura',
        errors: error.response?.data?.errors || {},
      };
    }
  },

  async createSignature(data: Partial<Signature>): Promise<ApiResponse<Signature>> {
    try {
      const response = await axios.post(`${API_BASE_URL}/ordoc_flow/api/approval-instances/`, data);
      return {
        success: true,
        data: response.data,
        message: 'Assinatura criada com sucesso',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao criar assinatura',
        errors: error.response?.data?.errors || {},
      };
    }
  },

  async updateSignature(id: number, data: Partial<Signature>): Promise<ApiResponse<Signature>> {
    try {
      const response = await axios.put(`${API_BASE_URL}/ordoc_flow/api/approval-instances/${id}/`, data);
      return {
        success: true,
        data: response.data,
        message: 'Assinatura atualizada com sucesso',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao atualizar assinatura',
        errors: error.response?.data?.errors || {},
      };
    }
  },

  async deleteSignature(id: number): Promise<ApiResponse<void>> {
    try {
      await axios.delete(`${API_BASE_URL}/ordoc_flow/api/approval-instances/${id}/`);
      return {
        success: true,
        message: 'Assinatura excluída com sucesso',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao excluir assinatura',
        errors: error.response?.data?.errors || {},
      };
    }
  },

  async approveSignature(id: number): Promise<ApiResponse<Signature>> {
    try {
      const response = await axios.patch(`${API_BASE_URL}/ordoc_flow/api/approval-instances/${id}/approve/`);
      return {
        success: true,
        data: response.data,
        message: 'Assinatura aprovada com sucesso',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao aprovar assinatura',
        errors: error.response?.data?.errors || {},
      };
    }
  },

  async rejectSignature(id: number): Promise<ApiResponse<Signature>> {
    try {
      const response = await axios.patch(`${API_BASE_URL}/ordoc_flow/api/approval-instances/${id}/reject/`);
      return {
        success: true,
        data: response.data,
        message: 'Assinatura rejeitada com sucesso',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao rejeitar assinatura',
        errors: error.response?.data?.errors || {},
      };
    }
  },
};
