"""
Django settings for tests
Optimized for fast test execution
"""

from .settings import *

# Test mode flag
TESTING = True

# Use in-memory SQLite for faster tests
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',
        'ATOMIC_REQUESTS': True,
    }
}

# Disable migrations for faster tests
class DisableMigrations:
    def __contains__(self, item):
        return True

    def __getitem__(self, item):
        return None

MIGRATION_MODULES = DisableMigrations()

# Use in-memory cache
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'test-cache',
    }
}

# Celery: Execute tasks synchronously
CELERY_TASK_ALWAYS_EAGER = True
CELERY_TASK_EAGER_PROPAGATES = True

# Disable password hashers for faster user creation
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.MD5PasswordHasher',
]

# Disable logging during tests (menos ruído)
LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,
    'handlers': {
        'null': {
            'class': 'logging.NullHandler',
        },
    },
    'root': {
        'handlers': ['null'],
    },
}

# Disable email backend
EMAIL_BACKEND = 'django.core.mail.backends.locmem.EmailBackend'

# Disable file storage (use memory)
DEFAULT_FILE_STORAGE = 'django.core.files.storage.InMemoryStorage'

# Solr: Mock in tests (não conectar)
SOLR_URL = None
SOLR_USERNAME = None
SOLR_PASSWORD = None

# Redis: Use FakeRedis for channels
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer',
    }
}

# JWT: Short expiration for tests
from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=5),
    'REFRESH_TOKEN_LIFETIME': timedelta(minutes=10),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': False,
}

# Media files: temp directory
import tempfile
MEDIA_ROOT = tempfile.mkdtemp()

# Debug: False para simular produção
DEBUG = False

# Allowed hosts
ALLOWED_HOSTS = ['*']

# CORS: Allow all origins in tests
CORS_ALLOW_ALL_ORIGINS = True

# Disable rate limiting in tests
DISABLE_RATE_LIMITING_IN_DEBUG = True
