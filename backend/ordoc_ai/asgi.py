"""
ASGI config for ordoc_ai project.

It exposes the ASGI callable as a module-level variable named ``application``.
Supports both HTTP and WebSocket protocols via Django Channels.
"""

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ordoc_ai.settings")

# Initialize Django ASGI application early
django_asgi_app = get_asgi_application()

# Import routing after Django setup
from ordoc_ai import routing

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter(
                routing.websocket_urlpatterns
            )
        )
    ),
})
