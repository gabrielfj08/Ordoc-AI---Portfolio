import api from '@/services/auth';

export interface CategorizationRule {
    id: string;
    name: string;
    description?: string;
    match_type: 'exact' | 'contains' | 'regex' | 'similarity';
    pattern: string;
    is_active: boolean;
    target_tag?: string;
    target_tag_name?: string;
    target_directory?: string;
    target_directory_path?: string;
    created_at: string;
    updated_at: string;
}

export interface CreateRuleDTO {
    name: string;
    description?: string;
    match_type: string;
    pattern: string;
    target_tag?: string;
    target_directory?: string;
}

export interface Tag {
    id: string;
    name: string;
    slug: string;
    color: string;
    organization: string;
}

const categorizationService = {
    // Rules
    async getRules(): Promise<CategorizationRule[]> {
        const response = await api.get('/api/v1/ordoc-air/categorization-rules/');
        return response.data.results || response.data;
    },

    async createRule(data: CreateRuleDTO): Promise<CategorizationRule> {
        const response = await api.post('/api/v1/ordoc-air/categorization-rules/', data);
        return response.data;
    },

    async updateRule(id: string, data: Partial<CreateRuleDTO>): Promise<CategorizationRule> {
        const response = await api.patch(`/api/v1/ordoc-air/categorization-rules/${id}/`, data);
        return response.data;
    },

    async deleteRule(id: string): Promise<void> {
        await api.delete(`/api/v1/ordoc-air/categorization-rules/${id}/`);
    },

    async toggleRule(id: string, isActive: boolean): Promise<CategorizationRule> {
        const response = await api.patch(`/api/v1/ordoc-air/categorization-rules/${id}/`, { is_active: isActive });
        return response.data;
    },

    async testRule(pattern: string, matchType: string, text: string): Promise<{ matched: boolean }> {
        const response = await api.post('/api/v1/ordoc-air/categorization-rules/test_rule/', {
            pattern,
            match_type: matchType,
            text
        });
        return response.data;
    },

    // Tags (Categorias Dinâmicas)
    async getTags(): Promise<Tag[]> {
        const response = await api.get('/api/v1/ordoc-air/tags/');
        return response.data.results || response.data;
    },

    async createTag(data: { name: string, color?: string, description?: string }): Promise<Tag> {
        const response = await api.post('/api/v1/ordoc-air/tags/', data);
        return response.data;
    }
};

export default categorizationService;
