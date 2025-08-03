import api from '@/services/auth';

export const documentsService = {
  async list(params?: Record<string, any>): Promise<any> {
    const response = await api.get('/api/v1/ordoc-air/documents/', { params });
    return response.data;
  },

  async retrieve(id: string | number): Promise<any> {
    const response = await api.get(`/api/v1/ordoc-air/documents/${id}/`);
    return response.data;
  },

  async create(data: FormData): Promise<any> {
    const response = await api.post('/api/v1/ordoc-air/documents/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async update(id: string | number, data: FormData | Record<string, any>): Promise<any> {
    const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined;
    const response = await api.put(`/api/v1/ordoc-air/documents/${id}/`, data, { headers });
    return response.data;
  },

  async delete(id: string | number): Promise<void> {
    await api.delete(`/api/v1/ordoc-air/documents/${id}/`);
  },

  async createVersion(id: string | number, data: FormData): Promise<any> {
    const response = await api.post(`/api/v1/ordoc-air/documents/${id}/create_version/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async getVersions(id: string | number): Promise<any> {
    const response = await api.get(`/api/v1/ordoc-air/documents/${id}/versions/`);
    return response.data;
  },

  async download(id: string | number): Promise<Blob> {
    const response = await api.get(`/api/v1/ordoc-air/documents/${id}/download/`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default documentsService;
