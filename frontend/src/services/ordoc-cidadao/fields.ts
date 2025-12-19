import api from '@/services/auth';
import {
  IndexExternalFieldsAPIResponse,
  IndexExternalFieldParams,
} from './types';

export class ExternalFieldService {
  private static baseUrl = '/api/external/fields';

  /**
   * Lista campos de um template de procedimento
   */
  static async index(params: IndexExternalFieldParams): Promise<IndexExternalFieldsAPIResponse> {
    const response = await api.get(this.baseUrl, { params });
    return response.data;
  }
}
