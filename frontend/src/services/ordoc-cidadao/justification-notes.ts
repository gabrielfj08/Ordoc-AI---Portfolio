import api from '@/services/auth';
import {
  IndexExternalJustificationNotesAPIResponse,
  IndexExternalJustificationNotesParams,
} from './types';

export class ExternalJustificationNoteService {
  private static baseUrl = '/api/external/justification_notes';

  /**
   * Lista notas de justificativa
   */
  static async index(params?: IndexExternalJustificationNotesParams): Promise<IndexExternalJustificationNotesAPIResponse> {
    const response = await api.get(this.baseUrl, { params });
    return response.data;
  }
}
