import api from '@/services/auth';

export const recentDocumentsService = {
  async list(params?: Record<string, any>): Promise<any> {
    const response = await api.get('/api/v1/ordoc-air/recent-documents/', { params });
    return response.data;
  },
};

export default recentDocumentsService;
