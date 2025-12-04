import api from '@/services/auth';

const BASE_URL = '/api/v1/ordoc-air/advanced/api';

export interface BatchOperation {
  id: string;
  name: string;
  description?: string;
  operation_type: string;
  status: string;
  parameters: Record<string, any>;
  filters: Record<string, any>;
  total_items: number;
  processed_items: number;
  failed_items: number;
  results?: Record<string, any>;
  error_message?: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

export interface BatchOperationItem {
  id: string;
  batch_operation: string;
  document: string;
  status: string;
  result_data?: Record<string, any>;
  error_message?: string;
  started_at?: string;
  completed_at?: string;
}

export interface OCRResult {
  id: string;
  document: string;
  engine: string;
  status: string;
  extracted_text?: string;
  confidence_score?: number;
  language?: string;
  processing_time?: number;
  error_message?: string;
}

export interface SearchResult {
  document_id: string;
  filename: string;
  content: string;
  mime_type: string;
  file_size: number;
  status: string;
  directory_name?: string;
  created_at: string;
  updated_at: string;
  score: number;
  highlights?: Record<string, string[]>;
}

// Batch Operations Service
export const BatchOperationService = {
  async list(params?: Record<string, any>): Promise<any> {
    const response = await api.get(`${BASE_URL}/batch-operations/`, { params });
    return response.data;
  },

  async retrieve(id: string): Promise<BatchOperation> {
    const response = await api.get(`${BASE_URL}/batch-operations/${id}/`);
    return response.data;
  },

  async create(data: Partial<BatchOperation>): Promise<BatchOperation> {
    const response = await api.post(`${BASE_URL}/batch-operations/`, data);
    return response.data;
  },

  async createAndExecute(data: {
    name: string;
    description?: string;
    operation_type: string;
    parameters: Record<string, any>;
    filters: Record<string, any>;
    execute_immediately?: boolean;
  }): Promise<BatchOperation> {
    const response = await api.post(`${BASE_URL}/batch-operations/create-and-execute/`, data);
    return response.data;
  },

  async execute(id: string): Promise<any> {
    const response = await api.post(`${BASE_URL}/batch-operations/${id}/execute/`);
    return response.data;
  },

  async cancel(id: string): Promise<any> {
    const response = await api.post(`${BASE_URL}/batch-operations/${id}/cancel/`);
    return response.data;
  },

  async getItems(id: string, params?: Record<string, any>): Promise<any> {
    const response = await api.get(`${BASE_URL}/batch-operations/${id}/items/`, { params });
    return response.data;
  },

  async getProgress(id: string): Promise<any> {
    const response = await api.get(`${BASE_URL}/batch-operations/${id}/progress/`);
    return response.data;
  },

  async getStats(): Promise<any> {
    const response = await api.get(`${BASE_URL}/batch-operations/stats/`);
    return response.data;
  },
};

// OCR Service
export const OCRService = {
  async list(params?: Record<string, any>): Promise<any> {
    const response = await api.get(`${BASE_URL}/ocr-results/`, { params });
    return response.data;
  },

  async retrieve(id: string): Promise<OCRResult> {
    const response = await api.get(`${BASE_URL}/ocr-results/${id}/`);
    return response.data;
  },

  async processDocument(documentId: string): Promise<any> {
    const response = await api.post(`${BASE_URL}/ocr/process-document/`, {
      document_id: documentId,
    });
    return response.data;
  },

  async batchProcess(documentIds: string[]): Promise<any> {
    const response = await api.post(`${BASE_URL}/ocr/batch-process/`, {
      document_ids: documentIds,
    });
    return response.data;
  },

  async getStats(): Promise<any> {
    const response = await api.get(`${BASE_URL}/ocr/stats/`);
    return response.data;
  },
};

// Solr/Search Service
export const SearchService = {
  async search(query: string, options?: {
    filters?: Record<string, any>;
    start?: number;
    rows?: number;
  }): Promise<{
    documents: SearchResult[];
    total_hits: number;
    facets?: Record<string, any>;
  }> {
    const response = await api.post(`${BASE_URL}/search/documents/`, {
      query,
      filters: options?.filters || {},
      start: options?.start || 0,
      rows: options?.rows || 10,
    });
    return response.data;
  },

  async getSuggestions(query: string): Promise<string[]> {
    const response = await api.get(`${BASE_URL}/search/suggestions/`, {
      params: { q: query },
    });
    return response.data.suggestions || [];
  },

  async indexDocument(documentId: string): Promise<any> {
    const response = await api.post(`${BASE_URL}/solr/index-document/`, {
      document_id: documentId,
    });
    return response.data;
  },

  async batchIndex(documentIds: string[]): Promise<any> {
    const response = await api.post(`${BASE_URL}/solr/batch-index/`, {
      document_ids: documentIds,
    });
    return response.data;
  },

  async reindexAll(): Promise<any> {
    const response = await api.post(`${BASE_URL}/solr/reindex-all/`);
    return response.data;
  },

  async getStats(): Promise<any> {
    const response = await api.get(`${BASE_URL}/solr/stats/`);
    return response.data;
  },
};

export default {
  BatchOperationService,
  OCRService,
  SearchService,
};
