// Importar instância centralizada
import api from '@/services/auth';
import { ShowExternalTaskAPIResponse } from './types';

export class ExternalTaskService {
  static async index(
    token: string,
    subdomain: string,
    params: {
      procedureId?: number;
      status?: string;
      order?: string;
      direction?: string;
      page?: number;
      perPage?: number;
    }
  ): Promise<{ tasks: ShowExternalTaskAPIResponse[] }> {
    try {
      const response = await api.get('/api/external/tasks', {
        // Headers automáticos via interceptador
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching external tasks:', error);
      throw error;
    }
  }

  static async show(
    token: string,
    subdomain: string,
    id: number
  ): Promise<ShowExternalTaskAPIResponse> {
    try {
      const response = await api.get(`/api/external/tasks/${id}`, {
        // Headers automáticos via interceptador
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching external task:', error);
      throw error;
    }
  }

  static async complete(
    token: string,
    subdomain: string,
    id: number,
    data: any
  ): Promise<ShowExternalTaskAPIResponse> {
    try {
      const response = await api.post(`/api/external/tasks/${id}/complete`, data, {
        // Headers automáticos via interceptador
      });
      return response.data;
    } catch (error) {
      console.error('Error completing external task:', error);
      throw error;
    }
  }

  static async accept(
    token: string,
    subdomain: string,
    id: number
  ): Promise<ShowExternalTaskAPIResponse> {
    try {
      const response = await api.post(`/api/external/tasks/${id}/accept`, {}, {
        // Headers automáticos via interceptador
      });
      return response.data;
    } catch (error) {
      console.error('Error accepting external task:', error);
      throw error;
    }
  }

  static async refuse(
    token: string,
    subdomain: string,
    id: number
  ): Promise<ShowExternalTaskAPIResponse> {
    try {
      const response = await api.post(`/api/external/tasks/${id}/refuse`, {}, {
        // Headers automáticos via interceptador
      });
      return response.data;
    } catch (error) {
      console.error('Error refusing external task:', error);
      throw error;
    }
  }

  static async finish(
    token: string,
    subdomain: string,
    id: number,
    data: any
  ): Promise<ShowExternalTaskAPIResponse> {
    try {
      const response = await api.post(`/api/external/tasks/${id}/finish`, data, {
        // Headers automáticos via interceptador
      });
      return response.data;
    } catch (error) {
      console.error('Error finishing external task:', error);
      throw error;
    }
  }
}
