import api from '@/services/auth';

const BASE_URL = '/api/v1/ordoc-air';

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color: string;
  description?: string;
}

export interface Document {
  id: string;
  name: string;
  description?: string;
  file: string;
  file_size: number;
  mime_type: string;
  status: string;
  version: number;
  is_current_version: boolean;
  directory?: string;
  directory_name?: string;
  department?: string;
  tags?: Tag[];
  extracted_text?: string;
  ocr_content?: string;
  ocr_confidence?: number;
  is_archived?: boolean;
  archived_at?: string;
  created_at: string;
  updated_at: string;
}

export const DocumentService = {
  async list(params?: Record<string, any>): Promise<any> {
    const response = await api.get(`${BASE_URL}/documents/`, { params });
    return response.data;
  },

  async retrieve(id: string | number): Promise<Document> {
    const response = await api.get(`${BASE_URL}/documents/${id}/`);
    return response.data;
  },

  async create(data: FormData): Promise<Document> {
    const response = await api.post(`${BASE_URL}/documents/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async uploadDocument(
    file: File,
    data?: Record<string, any>,
    onProgress?: (percent: number) => void
  ): Promise<Document> {
    const formData = new FormData();
    formData.append('file', file);
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
    }

    const response = await api.post(`${BASE_URL}/documents/`, formData, {
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
  ): Promise<Document> {
    const headers =
      data instanceof FormData
        ? { 'Content-Type': 'multipart/form-data' }
        : undefined;
    const response = await api.put(`${BASE_URL}/documents/${id}/`, data, {
      headers,
    });
    return response.data;
  },

  async delete(id: string | number): Promise<void> {
    await api.delete(`${BASE_URL}/documents/${id}/`);
  },

  async createVersion(id: string | number, data: FormData): Promise<Document> {
    const response = await api.post(
      `${BASE_URL}/documents/${id}/create_version/`,
      data,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  },

  async getVersions(id: string | number): Promise<Document[]> {
    const response = await api.get(`${BASE_URL}/documents/${id}/versions/`);
    return response.data;
  },

  async download(id: string | number): Promise<Blob> {
    const response = await api.get(
      `${BASE_URL}/documents/${id}/download/`,
      {
        responseType: 'blob',
      }
    );
    return response.data;
  },

  // Archive/Unarchive
  async archive(id: string | number): Promise<any> {
    const response = await api.post(`${BASE_URL}/documents/${id}/archive/`);
    return response.data;
  },

  async unarchive(id: string | number): Promise<any> {
    const response = await api.post(`${BASE_URL}/documents/${id}/unarchive/`);
    return response.data;
  },

  async getArchived(params?: Record<string, any>): Promise<any> {
    const response = await api.get(`${BASE_URL}/documents/archived/`, { params });
    return response.data;
  },

  // Tags
  async addTags(id: string | number, tagIds: string[]): Promise<any> {
    const response = await api.post(`${BASE_URL}/documents/${id}/add_tags/`, {
      tag_ids: tagIds,
    });
    return response.data;
  },

  async removeTags(id: string | number, tagIds: string[]): Promise<any> {
    const response = await api.post(`${BASE_URL}/documents/${id}/remove_tags/`, {
      tag_ids: tagIds,
    });
    return response.data;
  },

  // Search
  async search(query: string, params?: Record<string, any>): Promise<any> {
    const response = await api.get(`${BASE_URL}/documents/search/`, {
      params: { q: query, ...params },
    });
    return response.data;
  },

  // Status update
  async updateStatus(id: string | number, status: string): Promise<any> {
    const response = await api.post(`${BASE_URL}/documents/${id}/update_status/`, {
      status,
    });
    return response.data;
  },
};

// Tag Service
export const TagService = {
  async list(params?: Record<string, any>): Promise<any> {
    const response = await api.get(`${BASE_URL}/tags/`, { params });
    return response.data;
  },

  async retrieve(id: string | number): Promise<Tag> {
    const response = await api.get(`${BASE_URL}/tags/${id}/`);
    return response.data;
  },

  async create(data: Partial<Tag>): Promise<Tag> {
    const response = await api.post(`${BASE_URL}/tags/`, data);
    return response.data;
  },

  async update(id: string | number, data: Partial<Tag>): Promise<Tag> {
    const response = await api.put(`${BASE_URL}/tags/${id}/`, data);
    return response.data;
  },

  async delete(id: string | number): Promise<void> {
    await api.delete(`${BASE_URL}/tags/${id}/`);
  },

  async getDocuments(id: string | number): Promise<Document[]> {
    const response = await api.get(`${BASE_URL}/tags/${id}/documents/`);
    return response.data;
  },
};

// Activity Log Service
export const ActivityLogService = {
  async list(params?: Record<string, any>): Promise<any> {
    const response = await api.get(`${BASE_URL}/activity-logs/`, { params });
    return response.data;
  },

  async getByEntity(entityType: string, entityId: string): Promise<any> {
    const response = await api.get(`${BASE_URL}/activity-logs/by_entity/`, {
      params: { entity_type: entityType, entity_id: entityId },
    });
    return response.data;
  },

  async getByUser(userId: string): Promise<any> {
    const response = await api.get(`${BASE_URL}/activity-logs/by_user/`, {
      params: { user_id: userId },
    });
    return response.data;
  },
};

export default DocumentService;
