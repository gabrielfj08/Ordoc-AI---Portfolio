import api from './auth';

export interface Policy {
  id: string;
  name: string;
  description: string;
  effect: 'Allow' | 'Deny';
  resource: string;
  actions: string[];
  status: 'active' | 'inactive';
  created_at: string;
  updated_at?: string;
}

export interface CreatePolicyData {
  name: string;
  description: string;
  effect: 'Allow' | 'Deny';
  resource: string;
  actions: string[];
}

export interface UpdatePolicyData {
  name?: string;
  description?: string;
  effect?: 'Allow' | 'Deny';
  resource?: string;
  actions?: string[];
  status?: 'active' | 'inactive';
}

export interface PoliciesListParams {
  q?: string;
  status?: string;
  effect?: string;
  page?: number;
  per_page?: number;
  order?: string;
  direction?: 'asc' | 'desc';
}

export interface PoliciesListResponse {
  results: Policy[];
  policies?: Policy[]; // Deprecated/Fallback
  count: number;
  next?: string | null;
  previous?: string | null;
  total_pages?: number;
}

export interface PolicyAction {
  id: string;
  name: string;
  description: string;
  resource_type: string;
}

class PoliciesService {
  async getPolicies(params: PoliciesListParams = {}): Promise<PoliciesListResponse> {
    const searchParams = new URLSearchParams();

    if (params.q) searchParams.append('q', params.q);
    if (params.status) searchParams.append('status', params.status);
    if (params.effect) searchParams.append('effect', params.effect);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.per_page) searchParams.append('per_page', params.per_page.toString());
    if (params.order) searchParams.append('order', params.order);
    if (params.direction) searchParams.append('direction', params.direction);

    const response = await api.get(`/api/v1/ordoc-cloud/policies/?${searchParams.toString()}`);
    return response.data;
  }

  async getPolicy(policyId: string): Promise<Policy> {
    const response = await api.get(`/api/v1/ordoc-cloud/policies/${policyId}/`);
    return response.data;
  }

  async createPolicy(policyData: CreatePolicyData): Promise<Policy> {
    const response = await api.post('/api/v1/ordoc-cloud/policies/', policyData);
    return response.data;
  }

  async updatePolicy(policyId: string, policyData: UpdatePolicyData): Promise<Policy> {
    const response = await api.patch(`/api/v1/ordoc-cloud/policies/${policyId}/`, policyData);
    return response.data;
  }

  async deletePolicy(policyId: string): Promise<void> {
    await api.delete(`/api/v1/ordoc-cloud/policies/${policyId}/`);
  }

  async togglePolicyStatus(policyId: string): Promise<Policy> {
    const response = await api.patch(`/api/v1/ordoc-cloud/policies/${policyId}/toggle-status/`);
    return response.data;
  }

  async getPolicyActions(): Promise<PolicyAction[]> {
    const response = await api.get('/api/v1/ordoc-cloud/policy-actions/');
    return response.data;
  }

  async validatePolicy(policyData: CreatePolicyData): Promise<{ valid: boolean; errors?: string[] }> {
    const response = await api.post('/api/v1/ordoc-cloud/policies/validate/', policyData);
    return response.data;
  }
}

export const policiesService = new PoliciesService();
