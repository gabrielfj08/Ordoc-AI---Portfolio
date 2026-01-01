"""
Serializers para integração de Certificados Digitais e Validação SEFAZ
Expande as capacidades do sistema de documentos
"""

from rest_framework import serializers
from ordoc_air.models import Document
from ordoc_sign.models import DigitalCertificate, DocumentSignature


class DocumentSignRequestSerializer(serializers.Serializer):
    """Serializer para solicitação de assinatura de documento"""
    certificate_id = serializers.UUIDField(
        help_text="ID do certificado digital a ser usado"
    )
    signature_reason = serializers.CharField(
        max_length=255,
        required=False,
        help_text="Motivo da assinatura"
    )
    signature_location = serializers.CharField(
        max_length=255,
        required=False,
        help_text="Local da assinatura"
    )
    contact_info = serializers.CharField(
        max_length=255,
        required=False,
        help_text="Informações de contato"
    )


class DocumentSignatureSerializer(serializers.ModelSerializer):
    """Serializer para assinatura de documento"""
    certificate_subject = serializers.CharField(
        source='certificate.subject_name',
        read_only=True
    )
    signer_name = serializers.CharField(
        source='signer.full_name',
        read_only=True
    )
    
    class Meta:
        model = DocumentSignature
        fields = [
            'id',
            'document',
            'certificate',
            'certificate_subject',
            'signer_name',
            'signature_type',
            'hash_algorithm',
            'document_hash',
            'signing_reason',
            'signing_location',
            'status',
            'signed_at',
            'validated_at'
        ]
        read_only_fields = ['id', 'signed_at', 'validated_at', 'status']


class NFeValidationRequestSerializer(serializers.Serializer):
    """Serializer para validação de NF-e contra SEFAZ"""
    chave_acesso = serializers.CharField(
        max_length=44,
        help_text="Chave de acesso da NF-e (44 dígitos)"
    )


class NFeValidationResponseSerializer(serializers.Serializer):
    """Resposta da validação de NF-e"""
    valid = serializers.BooleanField()
    chave_acesso = serializers.CharField()
    status = serializers.CharField()
    emitente = serializers.DictField(required=False)
    destinatario = serializers.DictField(required=False)
    valor_total = serializers.DecimalField(
        max_digits=15,
        decimal_places=2,
        required=False
    )
    data_emissao = serializers.DateTimeField(required=False)
    protocolo = serializers.CharField(required=False)
    message = serializers.CharField(required=False)


class NFSeValidationRequestSerializer(serializers.Serializer):
    """Serializer para validação de NFS-e"""
    chave_acesso = serializers.CharField(
        max_length=50,
        help_text="Chave de acesso da NFS-e"
    )
    codigo_municipio = serializers.CharField(
        max_length=7,
        help_text="Código IBGE do município"
    )


class DocumentAuthenticationSerializer(serializers.Serializer):
    """Serializer para autenticação de documento"""
    document_id = serializers.UUIDField()
    authentication_type = serializers.ChoiceField(
        choices=[
            ('digital_signature', 'Assinatura Digital'),
            ('nfe_validation', 'Validação NF-e'),
            ('nfse_validation', 'Validação NFS-e'),
            ('certificate_validation', 'Validação de Certificado')
        ]
    )
    is_authentic = serializers.BooleanField()
    validation_details = serializers.JSONField()
    validated_at = serializers.DateTimeField()


class CertificateUploadSerializer(serializers.Serializer):
    """Serializer para upload de certificado A1"""
    certificate_file = serializers.FileField(
        help_text="Arquivo do certificado (.pfx ou .p12)"
    )
    password = serializers.CharField(
        write_only=True,
        help_text="Senha do certificado"
    )
    certificate_type = serializers.ChoiceField(
        choices=[('A1', 'A1'), ('A3', 'A3')],
        default='A1'
    )
    is_default = serializers.BooleanField(
        default=False,
        help_text="Definir como certificado padrão"
    )


class CertificateSerializer(serializers.ModelSerializer):
    """Serializer para certificado digital"""
    is_valid = serializers.SerializerMethodField()
    days_until_expiration = serializers.SerializerMethodField()
    
    class Meta:
        model = DigitalCertificate
        fields = [
            'id',
            'certificate_type',
            'subject_name',
            'issuer_name',
            'serial_number',
            'valid_from',
            'valid_until',
            'status',
            'is_default',
            'is_valid',
            'days_until_expiration',
            'last_used_at',
            'created_at'
        ]
        read_only_fields = [
            'id',
            'subject_name',
            'issuer_name',
            'serial_number',
            'valid_from',
            'valid_until',
            'status',
            'last_used_at',
            'created_at'
        ]
    
    def get_is_valid(self, obj):
        """Verifica se certificado está válido"""
        return obj.is_valid
    
    def get_days_until_expiration(self, obj):
        """Calcula dias até expiração"""
        from django.utils import timezone
        if obj.valid_until:
            delta = obj.valid_until - timezone.now()
            return delta.days
        return None
