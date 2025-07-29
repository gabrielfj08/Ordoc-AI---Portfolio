import base64
import hashlib
from cryptography.fernet import Fernet
from django.conf import settings
from django.db import models

ENC_PREFIX = "enc:"

_fernet = None

def _get_fernet():
    global _fernet
    if _fernet is None:
        key_source = getattr(settings, "PRIVATE_KEY_ENCRYPTION_KEY", None) or settings.SECRET_KEY
        key = hashlib.sha256(key_source.encode()).digest()
        fernet_key = base64.urlsafe_b64encode(key)
        _fernet = Fernet(fernet_key)
    return _fernet

def encrypt_value(value: str) -> str:
    if value is None:
        return value
    f = _get_fernet()
    token = f.encrypt(value.encode()).decode()
    return ENC_PREFIX + token

def decrypt_value(value: str) -> str:
    if value is None:
        return value
    if value.startswith(ENC_PREFIX):
        f = _get_fernet()
        token = value[len(ENC_PREFIX):]
        return f.decrypt(token.encode()).decode()
    return value

class EncryptedTextField(models.TextField):
    def get_prep_value(self, value):
        value = super().get_prep_value(value)
        if value is None:
            return value
        if not isinstance(value, str):
            value = str(value)
        if not value.startswith(ENC_PREFIX):
            value = encrypt_value(value)
        return value

    def from_db_value(self, value, expression, connection):
        if value is None:
            return value
        return decrypt_value(value)

    def to_python(self, value):
        value = super().to_python(value)
        if value is None:
            return value
        return decrypt_value(value)
