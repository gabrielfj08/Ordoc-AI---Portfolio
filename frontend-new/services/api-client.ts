import axios, { AxiosInstance } from 'axios'

// Configuração base do cliente HTTP
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Criar instância do axios
const apiClient: AxiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Para enviar cookies de autenticação
})

// Interceptor para adicionar token de autenticação
apiClient.interceptors.request.use(
    (config) => {
        // Verificar se há token no localStorage
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Interceptor para tratamento de erros
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Tratamento de erro 401 (não autenticado)
        if (error.response?.status === 401) {
            // Redirecionar para login ou limpar token
            if (typeof window !== 'undefined') {
                localStorage.removeItem('auth_token')
                // window.location.href = '/login'
            }
        }

        // Tratamento de erro 403 (sem permissão)
        if (error.response?.status === 403) {
            console.error('Acesso negado:', error.response.data)
        }

        return Promise.reject(error)
    }
)

export default apiClient
