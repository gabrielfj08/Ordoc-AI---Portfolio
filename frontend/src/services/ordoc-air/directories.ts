import api from '@/services/auth';
import type { DirectoryStats } from '@/types/ordoc-air/directory';

export const directoriesService = {
  async list(params?: Record<string, any>): Promise<any> {
    const response = await api.get('/api/v1/ordoc-air/directories/', { params });
    return response.data;
  },

  async retrieve(id: string | number): Promise<any> {
    const response = await api.get(`/api/v1/ordoc-air/directories/${id}/`);
    return response.data;
  },

  async create(data: Record<string, any>): Promise<any> {
    const response = await api.post('/api/v1/ordoc-air/directories/', data);
    return response.data;
  },

  async update(id: string | number, data: Record<string, any>): Promise<any> {
    const response = await api.put(`/api/v1/ordoc-air/directories/${id}/`, data);
    return response.data;
  },

  async delete(id: string | number): Promise<void> {
    await api.delete(`/api/v1/ordoc-air/directories/${id}/`);
  },

  async getChildren(id: string | number): Promise<any> {
    const response = await api.get(`/api/v1/ordoc-air/directories/${id}/children/`);
    return response.data;
  },

  async getDocuments(id: string | number, params?: Record<string, any>): Promise<any> {
    const response = await api.get(`/api/v1/ordoc-air/directories/${id}/documents/`, { params });
    return response.data;
  },

  async tree(params?: Record<string, any>): Promise<any> {
    const response = await api.get('/api/v1/ordoc-air/directories/tree/', { params });
    return response.data;
  },

  async getStats(id: string | number): Promise<DirectoryStats> {
    const response = await api.get(`/api/v1/ordoc-air/directories/${id}/stats/`);
    return response.data;
  },
};

export default directoriesService;
