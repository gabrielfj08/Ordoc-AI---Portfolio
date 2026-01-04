'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface Props {
  children: ReactNode
  /** Nome do módulo/página para contexto no log */
  moduleName?: string
  /** Fallback customizado (opcional) */
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * Page Error Boundary
 *
 * Error boundary específico para páginas individuais.
 * Mais leve que o ErrorBoundary global, adequado para rotas específicas.
 *
 * @example
 * ```tsx
 * <PageErrorBoundary moduleName="Ordoc-Air">
 *   <DocumentsPage />
 * </PageErrorBoundary>
 * ```
 */
export class PageErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log específico por módulo
    console.error(`🔴 Error in ${this.props.moduleName || 'Page'}:`, {
      module: this.props.moduleName,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
    })

    this.setState({ error })
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    })
  }

  render() {
    if (this.state.hasError) {
      // Fallback customizado
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Fallback padrão (mais leve que o global)
      return (
        <div className="flex min-h-[400px] items-center justify-center p-4">
          <Alert variant="destructive" className="max-w-2xl">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro ao carregar {this.props.moduleName || 'esta página'}</AlertTitle>
            <AlertDescription className="mt-2 space-y-4">
              <p>{this.state.error?.message || 'Ocorreu um erro inesperado.'}</p>

              {process.env.NODE_ENV === 'development' && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm font-medium">
                    Detalhes do erro
                  </summary>
                  <pre className="mt-2 overflow-auto rounded bg-background p-2 text-xs">
                    {this.state.error?.stack}
                  </pre>
                </details>
              )}

              <div className="flex gap-2">
                <Button onClick={this.handleReset} size="sm" variant="outline" className="gap-2">
                  <RefreshCw className="h-3 w-3" />
                  Tentar novamente
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )
    }

    return this.props.children
  }
}
