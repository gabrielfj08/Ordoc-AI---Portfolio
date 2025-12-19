// Importar instância centralizada
import api from '@/services/auth';

import { ShowExternalProcedureTemplateAPIResponse } from './types';

export class ExternalProcedureTemplateService {
  static async index(
    token: string,
    subdomain: string,
    params: {
      order?: string;
      direction?: string;
      q?: string;
      perPage?: number;
      root?: boolean;
      parentProcedureTemplateId?: number;
    }
  ): Promise<{ procedureTemplates: ShowExternalProcedureTemplateAPIResponse[] }> {
    try {
      const response = await api.get('/api/api/external/procedure-templates', {
        // Headers automáticos via interceptador
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching external procedure templates:', error);
      throw error;
    }
  }

  static async show(
    token: string,
    subdomain: string,
    id: number
  ): Promise<ShowExternalProcedureTemplateAPIResponse> {
    try {
      const response = await api.get(`/api/api/external/procedure-templates/${id}`, {
        // Headers automáticos via interceptador
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching external procedure template:', error);
      throw error;
    }
  }

  static async getFields(
    token: string,
    subdomain: string,
    id: number
  ): Promise<{ fields: any[] }> {
    try {
      const response = await api.get(`/api/api/external/procedure-templates/${id}/fields`, {
        // Headers automáticos via interceptador
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching procedure template fields:', error);
      throw error;
    }
  }
}
