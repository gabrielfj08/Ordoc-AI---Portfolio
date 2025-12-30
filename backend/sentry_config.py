"""
Sentry Configuration for OrdocAI Backend

Error tracking and performance monitoring.
"""

import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration
from sentry_sdk.integrations.celery import CeleryIntegration
from sentry_sdk.integrations.redis import RedisIntegration
from decouple import config


def init_sentry():
    """
    Initialize Sentry SDK for error tracking and performance monitoring.

    Environment variables required:
    - SENTRY_DSN: Sentry DSN URL
    - SENTRY_ENVIRONMENT: Environment name (production, staging, development)
    - SENTRY_TRACES_SAMPLE_RATE: APM sampling rate (0.0 to 1.0)
    """

    sentry_dsn = config('SENTRY_DSN', default=None)

    if not sentry_dsn:
        print("⚠️ Sentry DSN not configured. Error tracking disabled.")
        return

    environment = config('SENTRY_ENVIRONMENT', default='development')
    traces_sample_rate = config('SENTRY_TRACES_SAMPLE_RATE', default=0.1, cast=float)

    sentry_sdk.init(
        dsn=sentry_dsn,
        environment=environment,

        # Integrations
        integrations=[
            DjangoIntegration(
                transaction_style='url',
                middleware_spans=True,
                signals_spans=True,
                cache_spans=True,
            ),
            CeleryIntegration(
                monitor_beat_tasks=True,
                exclude_beat_tasks=None,
            ),
            RedisIntegration(),
        ],

        # Performance Monitoring (APM)
        traces_sample_rate=traces_sample_rate,
        profiles_sample_rate=traces_sample_rate,

        # Error sampling
        sample_rate=1.0,  # Capture 100% of errors

        # Send personal data
        send_default_pii=False,  # Don't send PII by default

        # Release tracking
        release=config('SENTRY_RELEASE', default=None),

        # Before send callback - filter sensitive data
        before_send=before_send_callback,
    )

    print(f"✅ Sentry initialized for environment: {environment}")


def before_send_callback(event, hint):
    """
    Filter sensitive data before sending to Sentry

    Remove passwords, tokens, and other sensitive information.
    """

    # Remove sensitive headers
    if 'request' in event and 'headers' in event['request']:
        headers = event['request']['headers']
        sensitive_headers = ['Authorization', 'Cookie', 'X-API-Key']

        for header in sensitive_headers:
            if header in headers:
                headers[header] = '[Filtered]'

    # Remove sensitive POST data
    if 'request' in event and 'data' in event['request']:
        data = event['request']['data']
        sensitive_fields = ['password', 'token', 'secret', 'api_key', 'credit_card']

        if isinstance(data, dict):
            for field in sensitive_fields:
                if field in data:
                    data[field] = '[Filtered]'

    return event
