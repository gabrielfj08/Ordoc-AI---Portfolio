"""
JWT Service for Ordoc-AI - Equivalent to Rails JsonWebToken class
"""
import jwt
from datetime import datetime, timedelta
from django.conf import settings
from django.contrib.auth.models import User
from typing import Dict, Any, Optional


class JWTService:
    """
    JWT Service equivalent to Rails JsonWebToken class
    Handles encoding and decoding of JWT tokens for authentication
    """
    
    @staticmethod
    def get_secret_key() -> str:
        """Get the secret key for JWT encoding/decoding"""
        return settings.SECRET_KEY
    
    @classmethod
    def encode(cls, payload: Dict[str, Any]) -> str:
        """
        Encode a payload into a JWT token
        Equivalent to Rails JsonWebToken.encode
        """
        # Add expiration time if not present
        if 'exp' not in payload:
            payload['exp'] = cls.expiration_time()
        
        # Add issued at time
        if 'iat' not in payload:
            payload['iat'] = datetime.utcnow()
        
        return jwt.encode(payload, cls.get_secret_key(), algorithm='HS256')
    
    @classmethod
    def decode(cls, token: str) -> Dict[str, Any]:
        """
        Decode a JWT token
        Equivalent to Rails JsonWebToken.decode
        """
        try:
            decoded = jwt.decode(token, cls.get_secret_key(), algorithms=['HS256'])
            return decoded
        except jwt.ExpiredSignatureError:
            raise JWTExpiredError("Token has expired")
        except jwt.InvalidTokenError:
            raise JWTInvalidError("Invalid token")
    
    @staticmethod
    def expiration_time() -> datetime:
        """
        Get expiration time for JWT tokens (12 hours from now)
        Equivalent to Rails JsonWebToken.expiration_time
        """
        return datetime.utcnow() + timedelta(hours=12)
    
    @classmethod
    def create_user_token(cls, user) -> str:
        """
        Create a JWT token for a user
        Equivalent to Rails user.token method
        """
        payload = {
            'sub': str(user.id),  # Subject (user ID)
            'email': user.email,
            'name': user.get_full_name() or user.username,
            'exp': cls.expiration_time(),
            'iat': datetime.utcnow()
        }
        return cls.encode(payload)
    
    @classmethod
    def create_external_token(cls, external_requester) -> str:
        """
        Create a JWT token for external requester
        Equivalent to Rails external requester token
        """
        payload = {
            'subject': str(external_requester.id),  # Different key for external users
            'type': 'external_requester',
            'exp': cls.expiration_time(),
            'iat': datetime.utcnow()
        }
        return cls.encode(payload)


class JWTError(Exception):
    """Base JWT error"""
    pass


class JWTExpiredError(JWTError):
    """JWT token has expired"""
    pass


class JWTInvalidError(JWTError):
    """JWT token is invalid"""
    pass
