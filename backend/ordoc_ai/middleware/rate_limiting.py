"""
Rate Limiting Middleware for Ordoc-AI
Protects against brute force attacks and excessive API usage
"""

import time
import json
from django.core.cache import cache
from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin
from django.conf import settings
import logging

logger = logging.getLogger('ordoc_ai.security')

class RateLimitMiddleware(MiddlewareMixin):
    """
    Rate limiting middleware to prevent brute force attacks
    Uses Redis cache for storing rate limit counters
    """
    
    # Rate limit configurations
    RATE_LIMITS = {
        # Authentication endpoints - stricter limits
        '/api/auth/login/': {
            'requests': 5,      # 5 login attempts
            'window': 60,       # per minute
            'block_duration': 300,  # block for 5 minutes
        },
        '/api/auth/register/': {
            'requests': 3,      # 3 registration attempts
            'window': 3600,     # per hour
            'block_duration': 300,
        },
        '/api/auth/refresh/': {
            'requests': 10,     # 10 refresh attempts
            'window': 60,       # per minute
            'block_duration': 60,
        },
        # Upload endpoints - prevent spam
        '/api/v1/ordoc-air/documents/': {
            'requests': 2000,   # Increased for listing/searching
            'window': 3600,     # per hour
            'block_duration': 60,
        },
        # Write operations - moderate limits
        '/api/v1/ordoc-flow/procedures/': {
            'requests': 100,    # 100 procedures
            'window': 3600,     # per hour
            'block_duration': 60,
        },
        '/api/v1/ordoc-flow/tasks/': {
            'requests': 200,    # 200 tasks
            'window': 3600,     # per hour
            'block_duration': 60,
        },
        # General API endpoints
        '/api/': {
            'requests': 1000,   # 1000 requests
            'window': 3600,     # per hour
            'block_duration': 60,
        },
    }
    
    def get_client_ip(self, request):
        """Extract client IP address from request headers"""
        # Check X-Forwarded-For header (proxy/load balancer)
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
            return ip
        
        # Check X-Real-IP header (nginx)
        x_real_ip = request.META.get('HTTP_X_REAL_IP')
        if x_real_ip:
            return x_real_ip.strip()
        
        # Fallback to REMOTE_ADDR
        return request.META.get('REMOTE_ADDR', 'unknown')
    
    def get_rate_limit_config(self, path):
        """Get rate limit configuration for the given path"""
        # Check for exact match first
        if path in self.RATE_LIMITS:
            return self.RATE_LIMITS[path]
        
        # Check for prefix matches
        for pattern, config in self.RATE_LIMITS.items():
            if path.startswith(pattern):
                return config
        
        return None
    
    def is_rate_limited(self, request):
        """Check if request should be rate limited"""
        path = request.path_info
        method = request.method
        
        # Only apply rate limiting to specific paths
        config = self.get_rate_limit_config(path)
        if not config:
            return False, None
        
        client_ip = self.get_client_ip(request)
        
        # Create cache keys
        rate_key = f"rate_limit:{client_ip}:{path}:{method}"
        block_key = f"rate_limit_block:{client_ip}:{path}"
        
        # Check if IP is currently blocked
        if cache.get(block_key):
            logger.warning(f"Rate limit: Blocked request from {client_ip} to {path}")
            return True, {
                'error': 'Too many requests. Please try again later.',
                'status': 429,
                'retry_after': config['block_duration']
            }
        
        # Get current request count
        current_requests = cache.get(rate_key, 0)
        
        # Check if limit exceeded
        if current_requests >= config['requests']:
            # Block the IP
            cache.set(block_key, True, config['block_duration'])
            logger.warning(
                f"Rate limit exceeded: {client_ip} made {current_requests} requests to {path}. "
                f"Blocking for {config['block_duration']} seconds."
            )
            return True, {
                'error': 'Rate limit exceeded. Access temporarily blocked.',
                'status': 429,
                'retry_after': config['block_duration']
            }
        
        # Increment request count
        cache.set(rate_key, current_requests + 1, config['window'])
        
        # Log for monitoring
        if current_requests > config['requests'] * 0.8:  # 80% of limit
            logger.info(
                f"Rate limit warning: {client_ip} has made {current_requests + 1}/{config['requests']} "
                f"requests to {path} in the current window"
            )
        
        return False, None
    
    def process_request(self, request):
        """Process incoming request for rate limiting"""
        # Skip rate limiting in debug mode if configured
        if getattr(settings, 'DEBUG', False) and getattr(settings, 'DISABLE_RATE_LIMITING_IN_DEBUG', False):
            return None

        is_limited, error_response = self.is_rate_limited(request)

        if is_limited:
            response = JsonResponse(error_response, status=error_response['status'])
            # Add rate limit headers
            response['Retry-After'] = str(error_response.get('retry_after', 60))
            response['X-RateLimit-Limit'] = '0'
            response['X-RateLimit-Remaining'] = '0'
            return response

        return None

    def process_response(self, request, response):
        """Add rate limit headers to response"""
        path = request.path_info
        config = self.get_rate_limit_config(path)

        if config:
            client_ip = self.get_client_ip(request)
            rate_key = f"rate_limit:{client_ip}:{path}:{request.method}"

            current_requests = cache.get(rate_key, 0)
            limit = config['requests']
            remaining = max(0, limit - current_requests)

            # Add informative headers
            response['X-RateLimit-Limit'] = str(limit)
            response['X-RateLimit-Remaining'] = str(remaining)
            response['X-RateLimit-Reset'] = str(int(time.time()) + config['window'])

        return response
