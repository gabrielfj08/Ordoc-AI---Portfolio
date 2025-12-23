/**
 * Audit Service - API client for Audit Logs
 */

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: `${API_BASE_URL}/api/v1/ordoc-cloud`, // Based on backend structure
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token interceptor
api.interceptors.request.use((config) => {
    config.headers['X-Subdomain'] = 'demo';
    const token = localStorage.getItem('ordoc_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Types
export interface AuditLog {
    id: string;
    action: string;
    user_name: string; // Flattened from relation
    resource: string;
    details: string;
    ip_address: string;
    created_at: string;
}

export interface AuditStats {
    total_last_7_days: number;
    by_action: { action: string; count: number }[];
    top_users: { user__user__username: string; count: number }[];
}

export const auditService = {
    /**
     * Get audit logs
     */
    async getLogs(params?: { search?: string; action?: string; user_id?: string }): Promise<AuditLog[]> {
        const response = await api.get('/audit-logs/', { params });
        const rawLogs = Array.isArray(response.data) ? response.data : response.data.results || [];

        // Transform backend format to frontend format
        return rawLogs.map((log: any) => ({
            id: log.id,
            action: log.action,
            user_name: log.user_name || 'Sistema',
            resource: log.target_type || '-',
            details: log.description || '-',
            ip_address: log.ip_address || '-',
            created_at: log.created_at
        }));
    },

    /**
     * Get audit stats
     */
    async getStats(): Promise<AuditStats> {
        const response = await api.get('/audit-logs/stats/');
        return response.data;
    }
};

export default auditService;
