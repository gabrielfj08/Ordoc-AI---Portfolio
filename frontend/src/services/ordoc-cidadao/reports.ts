import api from '@/services/auth';
import {
  ShowExternalReportAPIResponse,
  CreateExternalReportAPIResponse,
} from './types';

export class ExternalReportService {
  private static baseUrl = '/api/external/reports';

  /**
   * Exibe detalhes de um relatório específico
   */
  static async show(id: number): Promise<ShowExternalReportAPIResponse> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Cria um novo relatório
   */
  static async create(): Promise<CreateExternalReportAPIResponse> {
    const response = await api.post(this.baseUrl);
    return response.data;
  }

  /**
   * Faz download do relatório em PDF
   */
  static async download(id: number): Promise<Blob> {
    const response = await api.get(`${this.baseUrl}/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  }
}
