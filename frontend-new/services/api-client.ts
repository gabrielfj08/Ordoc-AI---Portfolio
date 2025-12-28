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
    async (config) => {
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
            // Verificar se há token no Zustand store
            if (typeof window !== 'undefined') {
                const { useAppStore } = await import('@/stores/app-store')
                const token = useAppStore.getState().accessToken

                if (token) {
                    config.headers.Authorization = `Bearer ${token}`
                }
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

                if (typeof window !== 'undefined') {
                    const { useAppStore } = await import('@/stores/app-store')
                    const refreshToken = useAppStore.getState().refreshToken

                    if (refreshToken) {
                        try {
                            // Tentar refresh
                            const { authApi } = await import('./auth-api')
                            const response = await authApi.refreshToken(refreshToken)

                            // Salvar novos tokens no Zustand
                            useAppStore.getState().setTokens(
                                response.access_token,
                                response.refresh_token
                            )

                            console.log('[API] Token refreshed successfully after 401')

                            // Retry request original com novo token
                            originalRequest.headers.Authorization = `Bearer ${response.access_token}`
                            return apiClient(originalRequest)
                        } catch (refreshError) {
                            console.error('[API] Token refresh failed, logging out')
                            // Refresh falhou, limpar tokens
                            useAppStore.getState().clearAll()

                            const currentPath = window.location.pathname
                            if (currentPath !== '/login') {
                                window.location.href = '/login'
                            }
                            return Promise.reject(refreshError)
                        }
                    }
                }
            }

            // Se não tem refresh token ou já tentou refresh, limpar e redirecionar
            if (typeof window !== 'undefined' && !isLoginEndpoint) {
                const { useAppStore } = await import('@/stores/app-store')
                useAppStore.getState().clearAll()

                const currentPath = window.location.pathname
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
