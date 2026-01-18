import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Base URL da API (configurável via env)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Criar instância do Axios
export const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 120000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor de Request - Adicionar token de autenticação
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Pegar token do sessionStorage ou localStorage
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Interceptor de Response - Tratamento de erros global
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        if (error.response) {
            // Erro de resposta do servidor
            const { status } = error.response;

            switch (status) {
                case 401:
                    // Token inválido ou expirado
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('refresh_token');
                        window.location.href = '/login';
                    }
                    break;
                case 403:
                    console.error('Acesso negado (403)');
                    break;
                case 404:
                    // Silenciado para evitar ruído no console em recursos opcionais (ex: análise de IA)
                    console.debug('Recurso não encontrado (404)');
                    break;
                case 500:
                    console.error('Erro interno do servidor');
                    break;
                default:
                    console.error(`Erro ${status}:`, JSON.stringify(error.response.data, null, 2));
            }
        } else if (error.request) {
            // Requisição foi feita mas não houve resposta
            console.error('Erro de rede - sem resposta do servidor');
        } else {
            // Erro ao configurar a requisição
            console.error('Erro ao configurar requisição:', error.message);
        }

        return Promise.reject(error);
    }
);

// Helper para tratamento de erros
export const handleApiError = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message || error.message || 'Erro desconhecido';
    }
    return 'Erro desconhecido';
};

export default apiClient;
