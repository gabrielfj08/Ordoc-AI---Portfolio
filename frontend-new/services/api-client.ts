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
        // Debug: log do request
        if (config.url?.includes('/login')) {
            console.log('[API Debug] Login request:', {
                url: config.url,
                method: config.method,
                data: config.data,
                headers: config.headers
            })
        }

        // Não enviar token para endpoints de autenticação
        const isAuthEndpoint = config.url?.includes('/auth/login') ||
            config.url?.includes('/auth/register') ||
            config.url?.includes('/auth/check-email')

        if (!isAuthEndpoint) {
            // Verificar se há token no localStorage
            const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Interceptor para tratamento de erros e auto-refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // Tratamento de erro 401 (não autenticado)
        if (error.response?.status === 401) {
            const isLoginEndpoint = originalRequest?.url?.includes('/auth/login')
            const isRefreshEndpoint = originalRequest?.url?.includes('/auth/refresh')

            // Se não é retry e não é endpoint de login/refresh, tentar refresh
            if (!originalRequest._retry && !isLoginEndpoint && !isRefreshEndpoint) {
                originalRequest._retry = true

                const refreshToken = typeof window !== 'undefined'
                    ? localStorage.getItem('refresh_token')
                    : null

                if (refreshToken) {
                    try {
                        // Tentar refresh (importação dinâmica para evitar circular dependency)
                        const { authApi } = await import('./auth-api')
                        const response = await authApi.refreshToken(refreshToken)

                        // Salvar novos tokens
                        if (typeof window !== 'undefined') {
                            localStorage.setItem('auth_token', response.access_token)
                            localStorage.setItem('refresh_token', response.refresh_token)
                        }

                        console.log('[API] Token refreshed successfully after 401')

                        // Retry request original com novo token
                        originalRequest.headers.Authorization = `Bearer ${response.access_token}`
                        return apiClient(originalRequest)
                    } catch (refreshError) {
                        console.error('[API] Token refresh failed, logging out')
                        // Refresh falhou, limpar tokens e redirecionar
                        if (typeof window !== 'undefined') {
                            localStorage.removeItem('auth_token')
                            localStorage.removeItem('refresh_token')

                            const currentPath = window.location.pathname
                            if (currentPath !== '/login') {
                                window.location.href = '/login'
                            }
                        }
                        return Promise.reject(refreshError)
                    }
                }
            }

            // Se não tem refresh token ou já tentou refresh, limpar e redirecionar
            if (typeof window !== 'undefined' && !isLoginEndpoint) {
                const currentPath = window.location.pathname
                localStorage.removeItem('auth_token')
                localStorage.removeItem('refresh_token')

                if (currentPath !== '/login') {
                    window.location.href = '/login'
                }
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
