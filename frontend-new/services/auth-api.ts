import apiClient from './api-client'

const AUTH_URL = '/api/auth'

export interface LoginCredentials {
    email: string
    password: string
    organization?: string
}

export interface RegisterData {
    email: string
    password: string
    first_name: string
    last_name: string
    organization_name?: string
}

export interface User {
    id: string
    email: string
    first_name: string
    last_name: string
    is_active: boolean
    is_internal: boolean
    organization?: {
        id: string
        name: string
        slug: string
    }
    department?: {
        id: string
        name: string
    }
    roles: string[]
    permissions: string[]
}

export interface AuthResponse {
    access_token: string
    refresh_token: string
    token_type: string
    expires_in: number  // segundos
    user: {
        id: string
        username: string
        email: string
        first_name: string
        last_name: string
        type: string
        status: string
        must_change_password: boolean
    }
    organization?: {
        id: string
        name: string
        subdomain: string
    }
}

export interface PasswordRequirements {
    min_length: number
    require_uppercase: boolean
    require_lowercase: boolean
    require_numbers: boolean
    require_special_chars: boolean
    special_chars: string
}

export const authApi = {
    /**
     * Login do usuário
     */
    login: async (credentials: LoginCredentials) => {
        const response = await apiClient.post<AuthResponse>(
            `${AUTH_URL}/login/`,
            credentials
        )
        return response.data
    },

    /**
     * Logout do usuário
     */
    logout: async () => {
        const response = await apiClient.post(`${AUTH_URL}/logout/`)
        return response.data
    },

    /**
     * Refresh do token de autenticação
     */
    refreshToken: async (refreshToken: string) => {
        const response = await apiClient.post<{
            access_token: string
            refresh_token: string
            token_type: string
            expires_in: number
        }>(`${AUTH_URL}/refresh/`, {
            refresh_token: refreshToken
        })
        return response.data
    },

    /**
     * Obtém dados do usuário atual
     */
    me: async () => {
        const response = await apiClient.get<{
            user: {
                id: string
                username: string
                name: string
                email: string
                first_name: string
                last_name: string
                user_type: string
                is_active: boolean
                phone?: string
                cpf?: string
                avatar?: string
                language: string
                timezone: string
                profile_complete: boolean
                permissions: string[]
            }
            organization?: {
                id: string
                name: string
                subdomain: string
            }
        }>(`${AUTH_URL}/me/`)
        return response.data
    },

    /**
     * Registro de novo usuário
     */
    register: async (data: RegisterData) => {
        const response = await apiClient.post<AuthResponse>(
            `${AUTH_URL}/register/`,
            data
        )
        return response.data
    },

    /**
     * Registro de solicitante externo (OrdocCidadao)
     */
    registerExternal: async (data: {
        email: string
        password: string
        first_name: string
        last_name: string
        cpf?: string
        phone?: string
    }) => {
        const response = await apiClient.post<AuthResponse>(
            `${AUTH_URL}/register-external/`,
            data
        )
        return response.data
    },

    /**
     * Verifica se email já está em uso
     */
    checkEmail: async (email: string) => {
        const response = await apiClient.post<{ available: boolean }>(
            `${AUTH_URL}/check-email/`,
            { email }
        )
        return response.data
    },

    /**
     * Altera senha do usuário
     */
    changePassword: async (data: {
        old_password: string
        new_password: string
    }) => {
        const response = await apiClient.post(
            `${AUTH_URL}/change-password/`,
            data
        )
        return response.data
    },

    /**
     * Valida força da senha
     */
    validatePassword: async (password: string) => {
        const response = await apiClient.post<{
            valid: boolean
            errors: string[]
            strength: 'weak' | 'medium' | 'strong'
        }>(`${AUTH_URL}/validate-password/`, {
            password,
        })
        return response.data
    },

    /**
     * Obtém requisitos de senha
     */
    passwordRequirements: async () => {
        const response = await apiClient.get<PasswordRequirements>(
            `${AUTH_URL}/password-requirements/`
        )
        return response.data
    },

    /**
     * Cria organização demo para testes
     */
    createDemoOrganization: async () => {
        const response = await apiClient.post<{
            organization: {
                id: string
                name: string
                slug: string
            }
            user: User
            access_token: string
        }>(`${AUTH_URL}/create-demo-org/`)
        return response.data
    },
}
