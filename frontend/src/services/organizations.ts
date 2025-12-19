import api from '@/services/auth';
import { Organization, EditOrganizationFormValues } from '@/components/ordoc-cloud/organizations/edit/types';

export interface OrganizationListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Organization[];
}

export interface OrganizationCreateRequest {
  corporate_name: string;
  cnpj?: string;
  email: string;
  phone: string;
  contact_name: string;
  contact_phone: string;
  site?: string;
  logo_url?: string;
  storage_limit: number;
  app_ids: number[];
  address: {
    street: string;
    number?: string;
    complement?: string;
    postal_code: string;
    city: string;
    state: string;
    neighborhood: string;
  };
}

export interface OrganizationUpdateRequest extends Partial<OrganizationCreateRequest> {}

export const organizationsService = {
  // Get all organizations
  async getOrganizations(params?: {
    page?: number;
    page_size?: number;
    search?: string;
    ordering?: string;
    is_active?: boolean;
  }): Promise<OrganizationListResponse> {
    const response = await api.get('/api/v1/ordoc-air/organizations/', { params });
    return response.data;
  },

  // Get organization by ID
  async getOrganization(id: string): Promise<Organization> {
    const response = await api.get(`/api/v1/ordoc-air/organizations/${id}/`);
    return this.transformOrganizationResponse(response.data);
  },

  // Create new organization
  async createOrganization(data: OrganizationCreateRequest): Promise<Organization> {
    const response = await api.post('/api/v1/ordoc-air/organizations/', data);
    return this.transformOrganizationResponse(response.data);
  },

  // Update organization
  async updateOrganization(id: string, values: EditOrganizationFormValues): Promise<Organization> {
    // Transform camelCase to snake_case for backend
    const data: OrganizationUpdateRequest = {
      corporate_name: values.organization.corporateName,
      cnpj: values.organization.cnpj,
      email: values.organization.email,
      phone: values.organization.phone,
      contact_name: values.organization.contactName,
      contact_phone: values.organization.contactPhone,
      site: values.organization.site,
      // Note: logo_url, storage_limit, app_ids, and address are not supported in current model
    };

    const response = await api.patch(`/api/v1/ordoc-air/organizations/${id}/`, data);
    return this.transformOrganizationResponse(response.data);
  },

  // Delete organization
  async deleteOrganization(id: string): Promise<void> {
    await api.delete(`/api/v1/ordoc-air/organizations/${id}/`);
  },

  // Activate organization
  async activateOrganization(id: string): Promise<void> {
    await api.post(`/api/v1/ordoc-air/organizations/${id}/activate/`);
  },

  // Deactivate organization
  async deactivateOrganization(id: string): Promise<void> {
    await api.post(`/api/v1/ordoc-air/organizations/${id}/deactivate/`);
  },

  // Get available apps
  async getAvailableApps(): Promise<Array<{ id: number; name: string; service: string }>> {
    try {
      const response = await api.get('/api/v1/ordoc-cloud/apps/');
      return response.data.results || [];
    } catch (error) {
      // Fallback to default apps if endpoint doesn't exist
      return [
        { id: 1, name: 'OrdocAir', service: 'ordoc_air' },
        { id: 2, name: 'OrdocFlow', service: 'ordoc_flow' },
        { id: 3, name: 'OrdocSign', service: 'ordoc_sign' },
        { id: 4, name: 'OrdocReports', service: 'ordoc_reports' },
      ];
    }
  },

  // Helper method to transform API response
  transformOrganizationResponse(data: any): Organization {
    return {
      id: data.id,
      corporateName: data.corporate_name || '',
      cnpj: data.cnpj || '',
      email: data.email || '',
      phone: data.phone || '',
      contactName: data.contact_name || '',
      contactPhone: data.contact_phone || '',
      site: data.site || '',
      logoUrl: data.logo_url || '',
      storageLimit: data.storage_limit?.toString() || '100',
      appIds: data.app_ids || [],
      apps: data.apps || [],
      address: {
        street: data.address?.street || '',
        number: data.address?.number || '',
        complement: data.address?.complement || '',
        postalCode: data.address?.postal_code || '',
        city: data.address?.city || '',
        state: data.address?.state || '',
        neighborhood: data.address?.neighborhood || '',
      },
    };
  },
};

export default organizationsService;
