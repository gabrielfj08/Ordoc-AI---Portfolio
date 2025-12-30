import pino from 'pino'

/**
 * Logger Estruturado Frontend
 *
 * Usa Pino para logging estruturado em JSON.
 * Configurado diferente para desenvolvimento vs produção.
 *
 * @example
 * ```typescript
 * import { logger } from '@/utils/logger'
 *
 * logger.info('User logged in', { userId: 123 })
 * logger.error('API call failed', { error, endpoint: '/api/documents' })
 * ```
 */

// Tipo para contexto adicional do log
export interface LogContext {
  userId?: string | number
  sessionId?: string
  organizationId?: string | number
  requestId?: string
  url?: string
  [key: string]: any
}

// Configuração base
const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'
const isBrowser = typeof window !== 'undefined'

// Logger instance
export const logger = pino({
  level: process.env.NEXT_PUBLIC_LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),

  // Browser mode
  browser: isBrowser
    ? {
      asObject: true, // Logs como objetos (não strings)
      write: {
        // Custom write para enviar logs para backend em produção
        error: (o: any) => {
          console.error(o)
          if (isProduction) {
            sendLogToBackend('error', o)
          }
        },
        warn: (o: any) => {
          console.warn(o)
          if (isProduction) {
            sendLogToBackend('warn', o)
          }
        },
        info: (o: any) => {
          if (isDevelopment) {
            console.info(o)
          }
        },
        debug: (o: any) => {
          if (isDevelopment) {
            console.debug(o)
          }
        },
      },
    }
    : undefined,


  // Base fields
  base: {
    env: process.env.NODE_ENV,
    app: 'ordoc-frontend',
  },
})

/**
 * Envia logs críticos para o backend em produção
 */
function sendLogToBackend(level: string, logObject: any) {
  // Apenas em produção e apenas error/warn
  if (!isProduction || (level !== 'error' && level !== 'warn')) {
    return
  }

  // Evitar loop infinito se o próprio logging falhar
  if (logObject.msg?.includes('Failed to send log')) {
    return
  }

  try {
    // Usar navigator.sendBeacon para não bloquear
    if (navigator.sendBeacon) {
      const logData = JSON.stringify({
        level,
        timestamp: new Date().toISOString(),
        ...logObject,
        userAgent: navigator.userAgent,
        url: window.location.href,
      })

      const blob = new Blob([logData], { type: 'application/json' })
      const endpoint = `${process.env.NEXT_PUBLIC_API_URL || ''}/api/v1/logs/frontend/`

      navigator.sendBeacon(endpoint, blob)
    } else {
      // Fallback para fetch (non-blocking)
      fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/v1/logs/frontend/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level,
          timestamp: new Date().toISOString(),
          ...logObject,
          userAgent: navigator.userAgent,
          url: window.location.href,
        }),
        keepalive: true, // Persiste mesmo se página fechar
      }).catch(() => {
        // Silenciar erro de logging (não queremos loop)
      })
    }
  } catch (error) {
    // Silenciar erro de logging
  }
}

/**
 * Child logger com contexto adicional
 *
 * @example
 * ```typescript
 * const userLogger = createLogger({ userId: 123, organizationId: 456 })
 * userLogger.info('Action performed') // Inclui userId e organizationId
 * ```
 */
export function createLogger(context: LogContext) {
  return logger.child(context)
}

/**
 * Log de erro com stack trace completo
 *
 * @example
 * ```typescript
 * try {
 *   // code
 * } catch (error) {
 *   logError(error, 'Failed to upload document', { documentId: 123 })
 * }
 * ```
 */
export function logError(error: unknown, message?: string, context?: LogContext) {
  const errorObj = error instanceof Error ? error : new Error(String(error))

  logger.error(
    {
      ...context,
      error: {
        name: errorObj.name,
        message: errorObj.message,
        stack: errorObj.stack,
      },
    },
    message || errorObj.message
  )
}

/**
 * Log de API call (request/response)
 *
 * @example
 * ```typescript
 * logApiCall({
 *   method: 'POST',
 *   url: '/api/documents',
 *   status: 200,
 *   duration: 145,
 * })
 * ```
 */
export function logApiCall(details: {
  method: string
  url: string
  status?: number
  duration?: number
  error?: Error
  context?: LogContext
}) {
  const { method, url, status, duration, error, context } = details

  if (error) {
    logger.error(
      {
        ...context,
        api: { method, url, status, duration },
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
      },
      `API call failed: ${method} ${url}`
    )
  } else {
    logger.info(
      {
        ...context,
        api: { method, url, status, duration },
      },
      `API call: ${method} ${url} (${status})`
    )
  }
}

/**
 * Log de user action
 *
 * @example
 * ```typescript
 * logUserAction('document.upload', {
 *   userId: 123,
 *   documentId: 456,
 *   size: 1024000,
 * })
 * ```
 */
export function logUserAction(action: string, context?: LogContext) {
  logger.info(
    {
      ...context,
      action,
      timestamp: new Date().toISOString(),
    },
    `User action: ${action}`
  )
}

/**
 * Log de performance (Web Vitals, etc)
 *
 * @example
 * ```typescript
 * logPerformance('LCP', 2.5, { page: '/documents' })
 * ```
 */
export function logPerformance(metric: string, value: number, context?: LogContext) {
  logger.info(
    {
      ...context,
      performance: {
        metric,
        value,
      },
    },
    `Performance: ${metric} = ${value}`
  )
}

// Export default
export default logger
