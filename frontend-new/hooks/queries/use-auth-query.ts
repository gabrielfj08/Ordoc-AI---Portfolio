import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi, type LoginCredentials, type RegisterData } from '@/services/auth-api'
import { useAppStore, type User } from '@/stores/app-store'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

// Query keys
export const authKeys = {
  me: ['auth', 'me'] as const,
}

// Hook para login
export function useLogin() {
  const router = useRouter()
  const { setUser, setTokens } = useAppStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (response) => {
      // Salvar tokens no store
      setTokens(response.access_token, response.refresh_token)

      // Converter resposta para User
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
          slug: response.organization.subdomain,
        } : undefined,
        roles: [],
        permissions: [],
      }

      setUser(userData)
      queryClient.setQueryData(authKeys.me, userData)

      toast.success('Login realizado com sucesso!')
      router.push('/my-day')
    },
    onError: (error: any) => {
      // Erro será exibido inline no formulário
      // Não precisa logar no console, já temos feedback visual
    },
  })
}

// Hook para logout
export function useLogout() {
  const router = useRouter()
  const { clearAll } = useAppStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      // Sempre limpa o estado, mesmo se API falhar
      clearAll()
      queryClient.clear()
      router.push('/login')
    },
  })
}

// Hook para registro
export function useRegister() {
  const router = useRouter()
  const { setUser, setTokens } = useAppStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RegisterData) => authApi.register(data),
    onSuccess: (response) => {
      setTokens(response.access_token, response.refresh_token)

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
          slug: response.organization.subdomain,
        } : undefined,
        roles: [],
        permissions: [],
      }

      setUser(userData)
      queryClient.setQueryData(authKeys.me, userData)

      toast.success('Cadastro realizado com sucesso!')
      router.push('/my-day')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao fazer cadastro')
    },
  })
}

// Hook para buscar dados do usuário atual
export function useMe() {
  const { setUser, setLoading, accessToken } = useAppStore()

  return useQuery({
    queryKey: authKeys.me,
    queryFn: async () => {
      const response = await authApi.me()

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
          slug: response.organization.subdomain,
        } : undefined,
        roles: [],
        permissions: response.user.permissions || [],
      }

      setUser(userData)
      setLoading(false)

      return userData
    },
    enabled: !!accessToken,
    staleTime: 1000 * 60 * 15, // 15 minutos
    retry: false,
    refetchOnMount: false,
  })
}
