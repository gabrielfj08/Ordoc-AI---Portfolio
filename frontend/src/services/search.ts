import api from '@/services/auth';

export interface SearchFilters {
    directory?: string;
    mime_type?: string;
    status?: string;
    date_from?: string;
    date_to?: string;
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
    highlights?: {
        [key: string]: string[];
    };
}

export interface SearchResponse {
    documents: SearchResult[];
    total_hits: number;
    facets: {
        [key: string]: {
            [value: string]: number;
        };
    };
    query_info: {
        query: string;
        start: number;
        rows: number;
    };
}

const searchService = {
    /**
     * Search documents using Solr semantic search
     */
    async searchDocuments(
        query: string,
        filters?: SearchFilters,
        start: number = 0,
        rows: number = 20
    ): Promise<SearchResponse> {
        try {
            const response = await api.post('/api/v1/ordoc-air/batch/search/documents/', {
                query,
                filters,
                start,
                rows
            });
            return response.data;
        } catch (error) {
            console.error('Failed to search documents:', error);
            throw error;
        }
    },

    /**
     * Get search suggestions
     */
    async getSuggestions(prefix: string): Promise<string[]> {
        try {
            const response = await api.get('/api/v1/ordoc-air/batch/search/suggestions/', {
                params: { q: prefix }
            });
            return response.data.suggestions || [];
        } catch (error) {
            console.error('Failed to get suggestions:', error);
            return [];
        }
    }
};

export default searchService;
