'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authApi, User, LoginCredentials, RegisterData } from '@/services/auth-api'
import { useRouter } from 'next/navigation'

interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (credentials: LoginCredentials) => Promise<void>
    logout: () => Promise<void>
    register: (data: RegisterData) => Promise<void>
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    const isAuthenticated = !!user

    // Carrega usuário ao montar o componente
    useEffect(() => {
        loadUser()
    }, [])

    // Limpa tokens inválidos quando houver erro de autenticação
    useEffect(() => {
        if (!isLoading && !user && localStorage.getItem(TOKEN_KEY)) {
            // Se não tem usuário mas tem token, o token está inválido
            localStorage.removeItem(TOKEN_KEY)
        }
    }, [isLoading, user])

    // Refresh proativo de token antes de expirar
    useEffect(() => {
        if (!user) return

        // Token expira em 15min (900s), fazer refresh a cada 13min (780s)
        // Isso evita 401 e melhora a experiência do usuário
        const refreshInterval = setInterval(async () => {
            const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
            if (refreshToken) {
                try {
                    const response = await authApi.refreshToken(refreshToken)
                    localStorage.setItem(TOKEN_KEY, response.access_token)
                    localStorage.setItem(REFRESH_TOKEN_KEY, response.refresh_token)
                    console.log('[Auth] Token refreshed proactively')
                } catch (error) {
                    console.error('[Auth] Proactive refresh failed:', error)
                    // Se falhar, fazer logout
                    await logout()
                }
            }
        }, 780000) // 13 minutos em ms

        return () => clearInterval(refreshInterval)
    }, [user])

    const loadUser = async () => {
        const token = localStorage.getItem(TOKEN_KEY)

        if (!token) {
            setIsLoading(false)
            return
        }

        try {
            const response = await authApi.me()
            // Converte resposta para formato User
            const userData: User = {
                id: response.user.id,
                email: response.user.email,
                first_name: response.user.first_name,
                last_name: response.user.last_name,
                is_active: response.user.is_active,
                is_internal: response.user.user_type === 'internal',
                organization: response.organization ? {
                    id: response.organization.id,
                    name: response.organization.name,
                    slug: response.organization.subdomain
                } : undefined,
                roles: [],
                permissions: response.user.permissions || [],
            }
            setUser(userData)
        } catch (error) {
            console.error('Erro ao carregar usuário:', error)
            // Token inválido, limpa tudo
            localStorage.removeItem(TOKEN_KEY)
        } finally {
            setIsLoading(false)
        }
    }


    const login = async (credentials: LoginCredentials) => {
        try {
            const response = await authApi.login(credentials)

            // Salva tokens
            localStorage.setItem(TOKEN_KEY, response.access_token)
            localStorage.setItem(REFRESH_TOKEN_KEY, response.refresh_token)

            // Converte resposta para formato User
            const userData: User = {
                id: response.user.id,
                email: response.user.email,
                first_name: response.user.first_name,
                last_name: response.user.last_name,
                is_active: response.user.status === 'active',
                is_internal: response.user.type === 'internal_user',
                organization: response.organization ? {
                    id: response.organization.id,
                    name: response.organization.name,
                    slug: response.organization.subdomain
                } : undefined,
                roles: [],
                permissions: [],
            }
            setUser(userData)

            // Redireciona para dashboard
            router.push('/my-day')
        } catch (error: any) {
            console.error('Erro no login:', error)
            throw error
        }
    }

    const logout = async () => {
        try {
            // Tenta fazer logout no backend, mas ignora erro 401
            await authApi.logout()
        } catch (error: any) {
            // Ignora erro 401 (não autorizado) pois o usuário já vai sair mesmo
            if (error.response?.status !== 401) {
                console.error('Erro no logout:', error)
            }
        } finally {
            // Sempre limpa estado local, independente do resultado do backend
            localStorage.removeItem(TOKEN_KEY)
            localStorage.removeItem(REFRESH_TOKEN_KEY)
            setUser(null)

            // Redireciona para login
            router.push('/login')
        }
    }

    const register = async (data: RegisterData) => {
        try {
            const response = await authApi.register(data)

            // Salva tokens
            localStorage.setItem(TOKEN_KEY, response.access_token)
            localStorage.setItem(REFRESH_TOKEN_KEY, response.refresh_token)

            // Converte resposta para formato User
            const userData: User = {
                id: response.user.id,
                email: response.user.email,
                first_name: response.user.first_name,
                last_name: response.user.last_name,
                is_active: response.user.status === 'active',
                is_internal: response.user.type === 'internal_user',
                organization: response.organization ? {
                    id: response.organization.id,
                    name: response.organization.name,
                    slug: response.organization.subdomain
                } : undefined,
                roles: [],
                permissions: [],
            }
            setUser(userData)

            // Redireciona para dashboard
            router.push('/my-day')
        } catch (error: any) {
            console.error('Erro no registro:', error)
            throw error
        }
    }

    const refreshUser = async () => {
        try {
            const response = await authApi.me()
            // Converte resposta para formato User
            const userData: User = {
                id: response.user.id,
                email: response.user.email,
                first_name: response.user.first_name,
                last_name: response.user.last_name,
                is_active: response.user.is_active,
                is_internal: response.user.user_type === 'internal',
                organization: response.organization ? {
                    id: response.organization.id,
                    name: response.organization.name,
                    slug: response.organization.subdomain
                } : undefined,
                roles: [],
                permissions: response.user.permissions || [],
            }
            setUser(userData)
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error)
            throw error
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isLoading,
                login,
                logout,
                register,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)

    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider')
    }

    return context
}
