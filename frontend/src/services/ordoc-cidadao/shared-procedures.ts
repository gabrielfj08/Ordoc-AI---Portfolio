import api from '@/services/auth';
import {
  IndexSharedProceduresAPIResponse,
  IndexSharedProceduresParams,
  CreateSharedProcedurePayload,
  CreateSharedProcedureAPIResponse,
  AcceptSharedProcedureAPIResponse,
  RefuseSharedProcedurePayload,
  RefuseSharedProcedureAPIResponse,
  DestroySharedProcedureAPIResponse,
} from './types';

export class ExternalSharedProcedureService {
  private static baseUrl = '/api/external/shared_procedures';

  /**
   * Lista procedimentos compartilhados com o cidadão
   */
  static async index(params?: IndexSharedProceduresParams): Promise<IndexSharedProceduresAPIResponse> {
    const response = await api.get(this.baseUrl, { params });
    return response.data;
  }

  /**
   * Cria um novo compartilhamento de procedimento
   */
  static async create(payload: CreateSharedProcedurePayload): Promise<CreateSharedProcedureAPIResponse> {
    const response = await api.post(this.baseUrl, payload);
    return response.data;
  }

  /**
   * Aceita um procedimento compartilhado
   */
  static async accept(id: number): Promise<AcceptSharedProcedureAPIResponse> {
    const response = await api.post(`${this.baseUrl}/${id}/accept`);
    return response.data;
  }

  /**
   * Recusa um procedimento compartilhado com justificativa
   */
  static async refuse(id: number, payload: RefuseSharedProcedurePayload): Promise<RefuseSharedProcedureAPIResponse> {
    const response = await api.post(`${this.baseUrl}/${id}/refuse`, payload);
    return response.data;
  }

  /**
   * Remove um compartilhamento de procedimento
   */
  static async destroy(id: number): Promise<DestroySharedProcedureAPIResponse> {
    const response = await api.delete(`${this.baseUrl}/${id}`);
    return response.data;
  }
}
