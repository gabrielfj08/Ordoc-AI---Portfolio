import apiClient from './api-client'

const BASE_URL = '/api/v1/cloud'

export interface Organization {
    id: string
    corporate_name: string
    subdomain: string
    trading_name?: string
    cnpj?: string
    address?: string
    phone?: string
    email?: string
    website?: string
    logo?: string
    settings?: Record<string, any>
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface Department {
    id: string
    name: string
    description?: string
    organization: string
    parent?: string
    created_at: string
    updated_at: string
}

export interface OrganizationUser {
    id: string
    user: {
        id: string
        email: string
        first_name: string
        last_name: string
    }
    organization: string
    department?: string
    roles: string[]
    is_active: boolean
    joined_at: string
}

export interface PaginatedResponse<T> {
    count: number
    next: string | null
    previous: string | null
    results: T[]
}

// ===========================
// ORGANIZATIONS API
// ===========================

export const organizationsApi = {
    /**
     * Lista organizações
     */
    list: async (params?: { search?: string; is_active?: boolean }) => {
        const response = await apiClient.get<PaginatedResponse<Organization>>(
            `${BASE_URL}/organizations/`,
            { params }
        )
        return response.data
    },

    /**
     * Obtém organização por ID
     */
    retrieve: async (id: string) => {
        const response = await apiClient.get<Organization>(
            `${BASE_URL}/organizations/${id}/`
        )
        return response.data
    },

    /**
     * Cria organização
     */
    create: async (data: Partial<Organization>) => {
        const response = await apiClient.post<Organization>(
            `${BASE_URL}/organizations/`,
            data
        )
        return response.data
    },

    /**
     * Atualiza organização
     */
    update: async (id: string, data: Partial<Organization>) => {
        const response = await apiClient.patch<Organization>(
            `${BASE_URL}/organizations/${id}/`,
            data
        )
        return response.data
    },

    /**
     * Remove organização
     */
    delete: async (id: string) => {
        await apiClient.delete(`${BASE_URL}/organizations/${id}/`)
    },

    /**
     * Upload de logo
     */
    uploadLogo: async (id: string, logo: File) => {
        const formData = new FormData()
        formData.append('logo', logo)

        const response = await apiClient.patch<Organization>(
            `${BASE_URL}/organizations/${id}/`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        )
        return response.data
    },
}

// ===========================
// DEPARTMENTS API
// ===========================

export const departmentsApi = {
    /**
     * Lista departamentos
     */
    list: async (params?: { organization?: string; parent?: string }) => {
        const response = await apiClient.get<PaginatedResponse<Department>>(
            `${BASE_URL}/departments/`,
            { params }
        )
        return response.data
    },

    /**
     * Cria departamento
     */
    create: async (data: Partial<Department>) => {
        const response = await apiClient.post<Department>(
            `${BASE_URL}/departments/`,
            data
        )
        return response.data
    },

    /**
     * Atualiza departamento
     */
    update: async (id: string, data: Partial<Department>) => {
        const response = await apiClient.patch<Department>(
            `${BASE_URL}/departments/${id}/`,
            data
        )
        return response.data
    },

    /**
     * Remove departamento
     */
    delete: async (id: string) => {
        await apiClient.delete(`${BASE_URL}/departments/${id}/`)
    },
}

// ===========================
// USERS API
// ===========================

export const usersApi = {
    /**
     * Lista usuários
     */
    list: async (params?: {
        organization?: string
        department?: string
        search?: string
        is_active?: boolean
    }) => {
        const response = await apiClient.get<PaginatedResponse<OrganizationUser>>(
            `${BASE_URL}/users/`,
            { params }
        )
        return response.data
    },

    /**
     * Convida usuário
     */
    invite: async (data: {
        email: string
        first_name: string
        last_name: string
        organization: string
        department?: string
        roles?: string[]
    }) => {
        const response = await apiClient.post<OrganizationUser>(
            `${BASE_URL}/users/invite/`,
            data
        )
        return response.data
    },

    /**
     * Atualiza usuário
     */
    update: async (id: string, data: Partial<OrganizationUser>) => {
        const response = await apiClient.patch<OrganizationUser>(
            `${BASE_URL}/users/${id}/`,
            data
        )
        return response.data
    },

    /**
     * Remove usuário da organização
     */
    remove: async (id: string) => {
        await apiClient.delete(`${BASE_URL}/users/${id}/`)
    },
}
