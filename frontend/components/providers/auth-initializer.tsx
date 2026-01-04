'use client'

import { useEffect } from 'react'
import { useMe } from '@/hooks/queries/use-auth-query'
import { useAppStore } from '@/stores/app-store'

/**
 * Componente que inicializa o estado de autenticação
 * Carrega os dados do usuário se houver token salvo
 */
export function AuthInitializer({ children }: { children: React.ReactNode }) {
    const { accessToken } = useAppStore()

    // Carrega dados do usuário se tiver token
    useMe()

    return <>{children}</>
}
