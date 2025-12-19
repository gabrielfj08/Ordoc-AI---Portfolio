// Importar instância centralizada
import api from '@/services/auth';

import { 
  IndexExternalProceduresAPIResponse, 
  ShowExternalProcedureAPIResponse,
  CreateExternalProcedureAPIResponse,
  IndexExternalProcedureParams 
} from './types';

export class ExternalProcedureService {
  static async index(
    token: string,
    subdomain: string,
    params: IndexExternalProcedureParams
  ): Promise<IndexExternalProceduresAPIResponse> {
    try {
      const response = await api.get('/api/api/external/procedures', {
        // Headers automáticos via interceptador
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching external procedures:', error);
      throw error;
    }
  }

  static async show(
    token: string,
    subdomain: string,
    id: number
  ): Promise<ShowExternalProcedureAPIResponse> {
    try {
      const response = await api.get(`/api/api/external/procedures/${id}`, {
        // Headers automáticos via interceptador
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching external procedure:', error);
      throw error;
    }
  }

  static async create(
    token: string,
    subdomain: string,
    data: { procedureTemplateId: number }
  ): Promise<CreateExternalProcedureAPIResponse> {
    try {
      const response = await api.post('/api/api/external/procedures', data, {
        // Headers automáticos via interceptador
      });
      return response.data;
    } catch (error) {
      console.error('Error creating external procedure:', error);
      throw error;
    }
  }

  static async update(
    token: string,
    subdomain: string,
    id: number,
    data: any
  ): Promise<ShowExternalProcedureAPIResponse> {
    try {
      const response = await api.put(`/api/api/external/procedures/${id}`, data, {
        // Headers automáticos via interceptador
      });
      return response.data;
    } catch (error) {
      console.error('Error updating external procedure:', error);
      throw error;
    }
  }

  static async generateReport(
    token: string,
    subdomain: string,
    id: number
  ): Promise<Blob> {
    try {
      const response = await api.get(`/api/api/external/procedures/${id}/report`, {
        // Headers automáticos via interceptador
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error('Error generating procedure report:', error);
      throw error;
    }
  }

  static async run(
    token: string,
    subdomain: string,
    id: number
  ): Promise<ShowExternalProcedureAPIResponse> {
    try {
      const response = await api.post(`/api/api/external/procedures/${id}/run`, {}, {
        // Headers automáticos via interceptador
      });
      return response.data;
    } catch (error) {
      console.error('Error running external procedure:', error);
      throw error;
    }
  }

  static async requestFinish(
    token: string,
    subdomain: string,
    id: number,
    data: { note?: string }
  ): Promise<ShowExternalProcedureAPIResponse> {
    try {
      const response = await api.post(`/api/api/external/procedures/${id}/request_finish`, data, {
        // Headers automáticos via interceptador
      });
      return response.data;
    } catch (error) {
      console.error('Error requesting procedure finish:', error);
      throw error;
    }
  }
}
