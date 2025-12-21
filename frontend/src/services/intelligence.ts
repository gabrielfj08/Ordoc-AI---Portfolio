/**
 * Intelligence Service - API client for document intelligence
 */

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: `${API_BASE_URL}/api/v1/intelligence`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token interceptor
api.interceptors.request.use((config) => {
    // Add subdomain header
    config.headers['X-Subdomain'] = 'demo';

    // Add auth token if available
    const token = localStorage.getItem('ordoc_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Types
export interface ExtractedEntity {
    text: string;
    entity_type: string;
    confidence?: number;
    start?: number;
    end?: number;
}

export interface SuggestedAction {
    action_type: string;
    label: string;
    description?: string;
    auto_applicable: boolean;
    payload?: Record<string, unknown>;
}

export interface ProactiveAlert {
    id: string;
    alert_type: 'compliance' | 'pattern' | 'suggestion' | 'error';
    severity: 'info' | 'warning' | 'error' | 'critical';
    title: string;
    message: string;
    details: Record<string, unknown>;
    location?: Record<string, unknown>;
    suggested_actions: SuggestedAction[];
    document_id: string;
    document_type: string;
    user_response: 'pending' | 'accepted' | 'rejected' | 'modified';
    created_at: string;
}

export interface AnalysisResult {
    document_id: string;
    document_type: string;
    extraction: {
        entities: Record<string, ExtractedEntity[]>;
        classifications?: Record<string, string>;
    };
    deliberation?: {
        summary: string;
        opinions: unknown[];
        alerts: unknown[];
    };
    alerts: ProactiveAlert[];
    processing_time_ms: number;
}

export interface AnalysisRequest {
    document_id: string;
    document_content: string;
    document_type?: string;
    analysis_depth?: 'quick' | 'standard' | 'full';
    context?: Record<string, unknown>;
}

export interface AlertResponse {
    alert_id: string;
    response: 'accepted' | 'rejected' | 'modified';
    modifications?: Record<string, unknown>;
}

// API Functions
export const intelligenceService = {
    /**
     * Analyze a document with AI
     */
    async analyzeDocument(request: AnalysisRequest): Promise<AnalysisResult> {
        const response = await api.post<AnalysisResult>('/analyze/', request);
        return response.data;
    },

    /**
     * Quick entity extraction
     */
    async extractEntities(
        text: string,
        entityTypes: string[]
    ): Promise<Record<string, ExtractedEntity[]>> {
        const response = await api.post('/extract/', {
            text,
            entity_types: entityTypes,
        });
        return response.data;
    },

    /**
     * Get alerts for a document
     */
    async getAlerts(documentId?: string, status?: string): Promise<ProactiveAlert[]> {
        const params = new URLSearchParams();
        if (documentId) params.append('document_id', documentId);
        if (status) params.append('status', status);

        const response = await api.get<{ results: ProactiveAlert[] } | ProactiveAlert[]>(`/alerts/?${params.toString()}`);
        // Handle both paginated and non-paginated responses
        if (Array.isArray(response.data)) {
            return response.data;
        }
        return response.data.results || [];
    },

    /**
     * Get a single alert
     */
    async getAlert(alertId: string): Promise<ProactiveAlert> {
        const response = await api.get<ProactiveAlert>(`/alerts/${alertId}/`);
        return response.data;
    },

    /**
     * Respond to an alert
     */
    async respondToAlert(
        alertId: string,
        response: 'accepted' | 'rejected' | 'modified',
        modifications?: Record<string, unknown>
    ): Promise<ProactiveAlert> {
        const result = await api.post<ProactiveAlert>(`/alerts/${alertId}/respond/`, {
            alert_id: alertId,
            response,
            modifications,
        });
        return result.data;
    },

    /**
     * Submit feedback for learning
     */
    async submitFeedback(
        documentId: string,
        alertId: string,
        action: 'accept' | 'reject' | 'modify',
        modifications?: Record<string, unknown>
    ): Promise<void> {
        await api.post('/feedback/', {
            document_id: documentId,
            alert_id: alertId,
            action,
            modifications,
        });
    },

    /**
     * Get learned patterns
     */
    async getPatterns(): Promise<unknown[]> {
        const response = await api.get<{ results: unknown[] } | unknown[]>('/patterns/');
        if (Array.isArray(response.data)) return response.data;
        return response.data.results || [];
    },

    /**
     * Get analysis history
     */
    async getAnalyses(): Promise<unknown[]> {
        const response = await api.get<{ results: unknown[] } | unknown[]>('/analyses/');
        if (Array.isArray(response.data)) return response.data;
        return response.data.results || [];
    },
};

export default intelligenceService;
