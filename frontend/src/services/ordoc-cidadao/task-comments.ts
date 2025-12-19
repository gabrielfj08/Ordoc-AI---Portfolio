import api from '@/services/auth';
import {
  IndexExternalTaskCommentsAPIResponse,
  ShowExternalTaskCommentAPIResponse,
  CreateExternalTaskCommentPayload,
  CreateExternalTaskCommentAPIResponse,
  UpdateExternalTaskCommentPayload,
  UpdateExternalTaskCommentAPIResponse,
  DeleteExternalTaskCommentAPIResponse,
} from './types';

export class ExternalTaskCommentService {
  private static baseUrl = '/api/external/task_comments';

  /**
   * Lista comentários de uma tarefa
   */
  static async index(taskId: number): Promise<IndexExternalTaskCommentsAPIResponse> {
    const response = await api.get(`/api/external/tasks/${taskId}/comments`);
    return response.data;
  }

  /**
   * Exibe detalhes de um comentário específico
   */
  static async show(id: number): Promise<ShowExternalTaskCommentAPIResponse> {
    const response = await api.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Cria um novo comentário em uma tarefa
   */
  static async create(taskId: number, payload: CreateExternalTaskCommentPayload): Promise<CreateExternalTaskCommentAPIResponse> {
    const response = await api.post(`/api/external/tasks/${taskId}/comments`, payload);
    return response.data;
  }

  /**
   * Atualiza um comentário existente
   */
  static async update(id: number, payload: UpdateExternalTaskCommentPayload): Promise<UpdateExternalTaskCommentAPIResponse> {
    const response = await api.put(`${this.baseUrl}/${id}`, payload);
    return response.data;
  }

  /**
   * Remove um comentário
   */
  static async destroy(id: number): Promise<DeleteExternalTaskCommentAPIResponse> {
    const response = await api.delete(`${this.baseUrl}/${id}`);
    return response.data;
  }
}
