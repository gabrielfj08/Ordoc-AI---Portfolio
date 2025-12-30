/**
 * Sentry Configuration for OrdocAI Frontend
 *
 * Error tracking and performance monitoring for Next.js
 */

import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN
const ENVIRONMENT = process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || 'development'
const TRACES_SAMPLE_RATE = parseFloat(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE || '0.1')
const REPLAY_SESSION_SAMPLE_RATE = parseFloat(process.env.NEXT_PUBLIC_SENTRY_REPLAY_SESSION_SAMPLE_RATE || '0.1')
const REPLAY_ERROR_SAMPLE_RATE = parseFloat(process.env.NEXT_PUBLIC_SENTRY_REPLAY_ERROR_SAMPLE_RATE || '1.0')

export function initSentry() {
  if (!SENTRY_DSN) {
    console.warn('⚠️ Sentry DSN not configured. Error tracking disabled.')
    return
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: ENVIRONMENT,

    // Performance Monitoring (APM)
    tracesSampleRate: TRACES_SAMPLE_RATE,

    // Session Replay
    replaysSessionSampleRate: REPLAY_SESSION_SAMPLE_RATE,
    replaysOnErrorSampleRate: REPLAY_ERROR_SAMPLE_RATE,

    // Integrations
    integrations: [
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
      Sentry.browserTracingIntegration({
        tracePropagationTargets: [
          'localhost',
          /^https:\/\/[^/]*\.ordocai\.com\.br/,
          process.env.NEXT_PUBLIC_API_URL || '',
        ],
      }),
    ],

    // Don't send PII by default
    sendDefaultPii: false,

    // Release tracking
    release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,

    // Before send callback
    beforeSend(event, hint) {
      // Filter sensitive data
      if (event.request?.headers) {
        const headers = event.request.headers as Record<string, string>
        if (headers['Authorization']) {
          headers['Authorization'] = '[Filtered]'
        }
        if (headers['Cookie']) {
          headers['Cookie'] = '[Filtered]'
        }
      }

      // Log to console in development
      if (ENVIRONMENT === 'development') {
        console.error('Sentry Event:', event)
        console.error('Original Error:', hint.originalException)
      }

      return event
    },

    // Ignore specific errors
    ignoreErrors: [
      // Browser extensions
      'top.GLOBALS',
      // Random plugins/extensions
      'originalCreateNotification',
      'canvas.contentDocument',
      'MyApp_RemoveAllHighlights',
      // Network errors (handled by error boundaries)
      'Network request failed',
      'NetworkError',
      // Cancelled requests
      'AbortError',
    ],

    // Denylist for URLs (don't track errors from these)
    denyUrls: [
      // Browser extensions
      /extensions\//i,
      /^chrome:\/\//i,
      /^moz-extension:\/\//i,
    ],
  })

  console.log(`✅ Sentry initialized for environment: ${ENVIRONMENT}`)
}
