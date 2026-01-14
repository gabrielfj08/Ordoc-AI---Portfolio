import axios from 'axios';

// Auth usa /api/ (sem v1), outros endpoints usam /api/v1/
const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:8000/api';

const authClient = axios.create({
    baseURL: AUTH_BASE_URL,
});

// Interceptor para adicionar token
authClient.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    user: User;
}

export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    organization?: {
        id: string;
        corporate_name: string;
        subdomain: string;
    };
}

class AuthService {
    /**
     * Login do usuário
     */
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await authClient.post<AuthResponse>('/auth/login/', credentials);

        // Salvar tokens no localStorage
        if (response.data.access_token) {
            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('refresh_token', response.data.refresh_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return response.data;
    }

    /**
     * Logout do usuário
     */
    async logout(): Promise<void> {
        try {
            await authClient.post('/auth/logout/');
        } finally {
            // Limpar tokens mesmo se a requisição falhar
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
        }
    }

    /**
     * Refresh do access token
     */
    async refreshToken(): Promise<string> {
        const refreshToken = localStorage.getItem('refresh_token');

        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await authClient.post<{ access_token: string }>('/auth/refresh/', {
            refresh: refreshToken,
        });

        // Atualizar access token
        localStorage.setItem('access_token', response.data.access_token);

        return response.data.access_token;
    }

    /**
     * Obter usuário atual
     */
    async getCurrentUser(): Promise<User> {
        const response = await authClient.get<User>('/auth/me/');

        // Atualizar cache do usuário
        localStorage.setItem('user', JSON.stringify(response.data));

        return response.data;
    }

    /**
     * Verificar se está autenticado
     */
    isAuthenticated(): boolean {
        return !!localStorage.getItem('access_token');
    }

    /**
     * Obter usuário do cache
     */
    getCachedUser(): User | null {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;

        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    }

    /**
     * Obter access token
     */
    getAccessToken(): string | null {
        return localStorage.getItem('access_token');
    }
}

export const authService = new AuthService();
export default authService;
