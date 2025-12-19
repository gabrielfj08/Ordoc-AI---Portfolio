import api from '@/services/auth';
import {
  IndexProcedureDocumentsAPIResponse,
  IndexProcedureDocumentsParams,
  CreateProcedureDocumentPayload,
  CreateProcedureDocumentAPIResponse,
  ShowProcedureDocumentAPIResponse,
  DeleteProcedureDocumentAPIResponse,
} from './types';

export class ExternalProcedureDocumentService {
  private static baseUrl = '/api/api/external/procedure_documents';

  /**
   * Lista documentos de um procedimento
   */
  static async index(params: IndexProcedureDocumentsParams): Promise<IndexProcedureDocumentsAPIResponse> {
    const { procedureId, ...queryParams } = params;
    const response = await api.get(`/api/api/external/procedures/${procedureId}/documents`, { params: queryParams });
    return response.data;
  }

  /**
   * Exibe detalhes de um documento específico
   */
  static async show(id: number): Promise<ShowProcedureDocumentAPIResponse> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Cria um novo documento em um procedimento
   */
  static async create(procedureId: number, payload: CreateProcedureDocumentPayload): Promise<CreateProcedureDocumentAPIResponse> {
    const formData = new FormData();
    formData.append('name', payload.name);
    formData.append('file', payload.file);

    const response = await api.post(`/api/api/external/procedures/${procedureId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  /**
   * Remove um documento
   */
  static async destroy(id: number): Promise<DeleteProcedureDocumentAPIResponse> {
    const response = await api.delete(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Faz download de um documento
   */
  static async download(token: string, subdomain: string, id: number): Promise<Blob> {
    const response = await api.get(`${this.baseUrl}/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  }
}
