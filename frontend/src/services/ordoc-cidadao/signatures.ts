import api from '@/services/auth';
import {
  IndexExternalSignaturesAPIResponse,
  IndexExternalSignatureParams,
  ShowExternalSignatureAPIResponse,
  SignExternalSignatureAPIResponse,
  RefuseExternalSignaturePayload,
  RefuseExternalSignatureAPIResponse,
} from './types';

export class ExternalSignatureService {
  private static baseUrl = '/api/external/signatures';

  /**
   * Lista assinaturas do cidadão logado
   */
  static async index(params?: IndexExternalSignatureParams): Promise<IndexExternalSignaturesAPIResponse> {
    const response = await api.get(this.baseUrl, { params });
    return response.data;
  }

  /**
   * Exibe detalhes de uma assinatura específica
   */
  static async show(id: number): Promise<ShowExternalSignatureAPIResponse> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Assina um documento
   */
  static async sign(id: number): Promise<SignExternalSignatureAPIResponse> {
    const response = await api.post(`${this.baseUrl}/${id}/sign`);
    return response.data;
  }

  /**
   * Recusa uma assinatura com justificativa
   */
  static async refuse(id: number, payload: RefuseExternalSignaturePayload): Promise<RefuseExternalSignatureAPIResponse> {
    const response = await api.post(`${this.baseUrl}/${id}/refuse`, payload);
    return response.data;
  }

  /**
   * Faz download do documento para assinatura
   */
  static async download(id: number): Promise<Blob> {
    const response = await api.get(`${this.baseUrl}/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  }
}
