'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * Error Boundary Global
 *
 * Captura erros não tratados no frontend e exibe UI de fallback amigável.
 * Integrado com sistema de logging para rastreamento.
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log do erro
    this.logError(error, errorInfo)

    // Callback customizado se fornecido
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    this.setState({
      error,
      errorInfo,
    })
  }

  private logError(error: Error, errorInfo: ErrorInfo) {
    // Importação dinâmica do logger para evitar problemas SSR
    import('@/utils/logger').then(({ logError }) => {
      logError(error, 'Error Boundary caught error', {
        componentStack: errorInfo.componentStack,
        url: typeof window !== 'undefined' ? window.location.href : 'unknown',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      })
    })

    // Em produção, enviar para serviço de logging (Sentry, etc)
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrar com Sentry
      // Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } })
    }
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  private handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  private handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/my-day'
    }
  }

  render() {
    if (this.state.hasError) {
      // Se fallback customizado foi fornecido
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Fallback padrão
      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                <CardTitle>Algo deu errado</CardTitle>
              </div>
              <CardDescription>
                Ocorreu um erro inesperado na aplicação. Não se preocupe, já registramos o problema.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Erro resumido */}
              <Alert variant="destructive">
                <AlertDescription>
                  <strong>Erro:</strong> {this.state.error?.message || 'Erro desconhecido'}
                </AlertDescription>
              </Alert>

              {/* Detalhes técnicos (apenas em desenvolvimento) */}
              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <details className="rounded-md border p-4">
                  <summary className="cursor-pointer font-medium">
                    Detalhes técnicos (ambiente de desenvolvimento)
                  </summary>
                  <div className="mt-4 space-y-2">
                    <div>
                      <p className="text-sm font-medium">Stack Trace:</p>
                      <pre className="mt-2 overflow-auto rounded bg-muted p-2 text-xs">
                        {this.state.error?.stack}
                      </pre>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Component Stack:</p>
                      <pre className="mt-2 overflow-auto rounded bg-muted p-2 text-xs">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  </div>
                </details>
              )}

              {/* Instruções */}
              <div className="rounded-md bg-muted p-4">
                <p className="text-sm font-medium">O que você pode fazer:</p>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  <li>Tentar novamente clicando no botão abaixo</li>
                  <li>Recarregar a página completamente</li>
                  <li>Voltar para a página inicial</li>
                  <li>Se o problema persistir, entre em contato com o suporte</li>
                </ul>
              </div>
            </CardContent>

            <CardFooter className="flex flex-wrap gap-2">
              <Button onClick={this.handleReset} variant="default" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Tentar Novamente
              </Button>
              <Button onClick={this.handleReload} variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Recarregar Página
              </Button>
              <Button onClick={this.handleGoHome} variant="outline" className="gap-2">
                <Home className="h-4 w-4" />
                Ir para Início
              </Button>
            </CardFooter>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
