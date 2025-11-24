import api from '@/services/auth';
import {
  IndexExternalTaskDocumentsAPIResponse,
  IndexExternalTaskDocumentsParams,
  CreateExternalTaskDocumentPayload,
  CreateExternalTaskDocumentAPIResponse,
  ShowExternalTaskDocumentAPIResponse,
} from './types';

export class ExternalTaskDocumentService {
  private static baseUrl = '/api/external/task_documents';

  /**
   * Lista documentos de uma tarefa
   */
  static async index(params: IndexExternalTaskDocumentsParams): Promise<IndexExternalTaskDocumentsAPIResponse> {
    const { taskId, ...queryParams } = params;
    const response = await api.get(`/api/external/tasks/${taskId}/documents`, { params: queryParams });
    return response.data;
  }

  /**
   * Exibe detalhes de um documento específico
   */
  static async show(id: number): Promise<ShowExternalTaskDocumentAPIResponse> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Cria um novo documento em uma tarefa
   */
  static async create(taskId: number, payload: CreateExternalTaskDocumentPayload): Promise<CreateExternalTaskDocumentAPIResponse> {
    const formData = new FormData();
    formData.append('name', payload.name);
    formData.append('file', payload.file);

    const response = await api.post(`/api/external/tasks/${taskId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  /**
   * Faz download de um documento
   */
  static async download(id: number): Promise<Blob> {
    const response = await api.get(`${this.baseUrl}/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  }
}
