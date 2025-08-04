import api from '@/services/auth';

export const DocumentService = {
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

  async uploadDocument(
    file: File,
    data?: Record<string, any>,
    onProgress?: (percent: number) => void
  ): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
    }

    const response = await api.post('/api/v1/ordoc-air/documents/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (evt) => {
        if (onProgress && evt.total) {
          const percent = Math.round((evt.loaded * 100) / evt.total);
          onProgress(percent);
        }
      },
    });
    return response.data;
  },

  async update(
    id: string | number,
    data: FormData | Record<string, any>
  ): Promise<any> {
    const headers =
      data instanceof FormData
        ? { 'Content-Type': 'multipart/form-data' }
        : undefined;
    const response = await api.put(`/api/v1/ordoc-air/documents/${id}/`, data, {
      headers,
    });
    return response.data;
  },

  async delete(id: string | number): Promise<void> {
    await api.delete(`/api/v1/ordoc-air/documents/${id}/`);
  },

  async createVersion(id: string | number, data: FormData): Promise<any> {
    const response = await api.post(
      `/api/v1/ordoc-air/documents/${id}/create_version/`,
      data,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  },

  async getVersions(id: string | number): Promise<any> {
    const response = await api.get(`/api/v1/ordoc-air/documents/${id}/versions/`);
    return response.data;
  },

  async download(id: string | number): Promise<Blob> {
    const response = await api.get(
      `/api/v1/ordoc-air/documents/${id}/download/`,
      {
        responseType: 'blob',
      }
    );
    return response.data;
  },
};

export default DocumentService;
