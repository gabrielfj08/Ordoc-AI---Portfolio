"""
Health check views for monitoring application status.
"""
from django.http import JsonResponse
from django.db import connection
from django.core.cache import cache


def health_check(request):
    """
    Simple health check endpoint that returns 200 OK if the application is running.
    """
    return JsonResponse({
        'status': 'healthy',
        'service': 'ordoc-ai-backend'
    })


def readiness_check(request):
    """
    Readiness check that verifies database and cache connectivity.
    """
    try:
        # Check database connection
        connection.ensure_connection()
        
        # Check cache connection
        cache.set('health_check', 'ok', 1)
        cache_status = cache.get('health_check')
        
        return JsonResponse({
            'status': 'ready',
            'database': 'connected',
            'cache': 'connected' if cache_status == 'ok' else 'error'
        })
    except Exception as e:
        return JsonResponse({
            'status': 'not_ready',
            'error': str(e)
        }, status=503)
