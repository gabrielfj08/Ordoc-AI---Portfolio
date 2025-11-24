import api from '@/services/auth';
import { DeletedDocument, DeletedDirectory } from '@/types/ordoc-air/recycle-bin';

export const recycleBinService = {
  /**
   * Get deleted documents from recycle bin
   */
  async getDeletedDocuments(): Promise<DeletedDocument[]> {
    try {
      const response = await api.get('/api/v1/air/documents/deleted/');
      return response.data.results || response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erro ao buscar documentos excluídos');
    }
  },

  /**
   * Get deleted directories from recycle bin
   */
  async getDeletedDirectories(): Promise<DeletedDirectory[]> {
    try {
      const response = await api.get('/api/v1/air/directories/deleted/');
      return response.data.results || response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erro ao buscar diretórios excluídos');
    }
  },

  /**
   * Restore documents from recycle bin
   */
  async restoreDocuments(documentIds: number[]): Promise<void> {
    try {
      await api.post('/api/v1/air/documents/restore/', {
        document_ids: documentIds,
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erro ao restaurar documentos');
    }
  },

  /**
   * Restore directories from recycle bin
   */
  async restoreDirectories(directoryIds: number[]): Promise<void> {
    try {
      await api.post('/api/v1/air/directories/restore/', {
        directory_ids: directoryIds,
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erro ao restaurar diretórios');
    }
  },

  /**
   * Permanently delete documents from recycle bin
   */
  async permanentlyDeleteDocuments(documentIds: number[]): Promise<void> {
    try {
      await api.delete('/api/v1/air/documents/permanent-delete/', {
        data: { document_ids: documentIds },
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erro ao excluir documentos permanentemente');
    }
  },

  /**
   * Permanently delete directories from recycle bin
   */
  async permanentlyDeleteDirectories(directoryIds: number[]): Promise<void> {
    try {
      await api.delete('/api/v1/air/directories/permanent-delete/', {
        data: { directory_ids: directoryIds },
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erro ao excluir diretórios permanentemente');
    }
  },

  /**
   * Empty entire recycle bin
   */
  async emptyRecycleBin(): Promise<void> {
    try {
      await api.delete('/api/v1/air/recycle-bin/empty/');
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erro ao esvaziar lixeira');
    }
  },

  /**
   * Get recycle bin statistics
   */
  async getRecycleBinStats(): Promise<{
    total_documents: number;
    total_directories: number;
    total_size: number;
  }> {
    try {
      const response = await api.get('/api/v1/air/recycle-bin/stats/');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erro ao buscar estatísticas da lixeira');
    }
  },
};

export default recycleBinService;
