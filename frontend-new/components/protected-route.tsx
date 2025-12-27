'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'

interface ProtectedRouteProps {
    children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login')
        }
    }, [isAuthenticated, isLoading, router])

    // Mostra loading enquanto verifica autenticação
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                    <p className="text-muted-foreground">Carregando...</p>
                </div>
            </div>
        )
    }

    // Se não autenticado, não renderiza nada (redirect já aconteceu)
    if (!isAuthenticated) {
        return null
    }

    // Se autenticado, renderiza o conteúdo
    return <>{children}</>
}
