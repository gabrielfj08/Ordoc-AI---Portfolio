"""
Management command para popular serviços de integração iniciais

Usage:
    python manage.py seed_integrations
"""

from django.core.management.base import BaseCommand
from ordoc_integrations.models import IntegrationService


class Command(BaseCommand):
    help = 'Popula banco de dados com serviços de integração iniciais'

    def handle(self, *args, **options):
        self.stdout.write('Iniciando seed de serviços de integração...\n')

        services = [
            {
                'service_type': 'receita_federal',
                'name': 'Receita Federal do Brasil',
                'description': 'Validação de CPF e CNPJ, consulta de situação cadastral',
                'base_url': 'https://www.receitaws.com.br/v1',
                'api_version': '1.0',
                'status': 'active',
                'is_enabled': True,
                'requires_auth': False,
                'rate_limit': 100,
                'timeout_seconds': 30,
                'retry_attempts': 3,
                'cache_ttl_seconds': 86400,  # 24 horas
            },
            {
                'service_type': 'govbr',
                'name': 'Gov.br - Login Único',
                'description': 'Sistema de autenticação única do governo federal',
                'base_url': 'https://sso.acesso.gov.br',
                'api_version': '2.0',
                'status': 'maintenance',
                'is_enabled': False,
                'requires_auth': True,
                'auth_type': 'OAuth2',
                'rate_limit': 200,
                'timeout_seconds': 45,
                'retry_attempts': 3,
                'cache_ttl_seconds': 3600,  # 1 hora
            },
            {
                'service_type': 'serasa',
                'name': 'SERASA Experian',
                'description': 'Consulta de crédito e score',
                'base_url': 'https://api.serasa.com.br',
                'api_version': '1.0',
                'status': 'inactive',
                'is_enabled': False,
                'requires_auth': True,
                'auth_type': 'API Key',
                'rate_limit': 50,
                'timeout_seconds': 60,
                'retry_attempts': 3,
                'cache_ttl_seconds': 43200,  # 12 horas
            },
            {
                'service_type': 'cartorio',
                'name': 'Cartórios (CRI/CNJ)',
                'description': 'Consulta de certidões e registros',
                'base_url': 'https://api.cnj.jus.br',
                'api_version': '1.0',
                'status': 'inactive',
                'is_enabled': False,
                'requires_auth': True,
                'auth_type': 'API Key',
                'rate_limit': 50,
                'timeout_seconds': 60,
                'retry_attempts': 3,
                'cache_ttl_seconds': 86400,
            },
            {
                'service_type': 'detran',
                'name': 'DETRAN',
                'description': 'Consulta de CNH e veículos',
                'base_url': 'https://api.detran.gov.br',
                'api_version': '1.0',
                'status': 'inactive',
                'is_enabled': False,
                'requires_auth': True,
                'auth_type': 'API Key',
                'rate_limit': 100,
                'timeout_seconds': 45,
                'retry_attempts': 3,
                'cache_ttl_seconds': 86400,
            },
            {
                'service_type': 'tse',
                'name': 'TSE - Tribunal Superior Eleitoral',
                'description': 'Consulta de título de eleitor',
                'base_url': 'https://api.tse.jus.br',
                'api_version': '1.0',
                'status': 'inactive',
                'is_enabled': False,
                'requires_auth': True,
                'auth_type': 'API Key',
                'rate_limit': 100,
                'timeout_seconds': 45,
                'retry_attempts': 3,
                'cache_ttl_seconds': 2592000,  # 30 dias
            },
            {
                'service_type': 'inss',
                'name': 'INSS - Previdência Social',
                'description': 'Consulta de benefícios previdenciários',
                'base_url': 'https://api.inss.gov.br',
                'api_version': '1.0',
                'status': 'inactive',
                'is_enabled': False,
                'requires_auth': True,
                'auth_type': 'OAuth2',
                'rate_limit': 50,
                'timeout_seconds': 60,
                'retry_attempts': 3,
                'cache_ttl_seconds': 86400,
            },
            {
                'service_type': 'ans',
                'name': 'ANS - Saúde Suplementar',
                'description': 'Consulta de planos de saúde',
                'base_url': 'https://api.ans.gov.br',
                'api_version': '1.0',
                'status': 'inactive',
                'is_enabled': False,
                'requires_auth': True,
                'auth_type': 'API Key',
                'rate_limit': 100,
                'timeout_seconds': 45,
                'retry_attempts': 3,
                'cache_ttl_seconds': 86400,
            },
            {
                'service_type': 'oab',
                'name': 'OAB - Ordem dos Advogados',
                'description': 'Consulta de advogados registrados',
                'base_url': 'https://api.oab.org.br',
                'api_version': '1.0',
                'status': 'inactive',
                'is_enabled': False,
                'requires_auth': True,
                'auth_type': 'API Key',
                'rate_limit': 100,
                'timeout_seconds': 45,
                'retry_attempts': 3,
                'cache_ttl_seconds': 604800,  # 7 dias
            },
            {
                'service_type': 'crm',
                'name': 'CRM - Conselho Regional de Medicina',
                'description': 'Consulta de médicos registrados',
                'base_url': 'https://api.cfm.org.br',
                'api_version': '1.0',
                'status': 'inactive',
                'is_enabled': False,
                'requires_auth': True,
                'auth_type': 'API Key',
                'rate_limit': 100,
                'timeout_seconds': 45,
                'retry_attempts': 3,
                'cache_ttl_seconds': 604800,
            },
            {
                'service_type': 'pix',
                'name': 'PIX - Banco Central',
                'description': 'Consulta de chaves PIX',
                'base_url': 'https://api.bcb.gov.br/pix',
                'api_version': '1.0',
                'status': 'inactive',
                'is_enabled': False,
                'requires_auth': True,
                'auth_type': 'OAuth2',
                'rate_limit': 200,
                'timeout_seconds': 30,
                'retry_attempts': 3,
                'cache_ttl_seconds': 3600,
            },
            {
                'service_type': 'nfe',
                'name': 'NFe/NFSe - Notas Fiscais',
                'description': 'Consulta de notas fiscais eletrônicas',
                'base_url': 'https://api.nfe.fazenda.gov.br',
                'api_version': '1.0',
                'status': 'inactive',
                'is_enabled': False,
                'requires_auth': True,
                'auth_type': 'Certificado Digital',
                'rate_limit': 100,
                'timeout_seconds': 60,
                'retry_attempts': 3,
                'cache_ttl_seconds': 86400,
            },
            {
                'service_type': 'esocial',
                'name': 'eSocial - Eventos Trabalhistas',
                'description': 'Sistema de escrituração digital',
                'base_url': 'https://api.esocial.gov.br',
                'api_version': '2.5',
                'status': 'inactive',
                'is_enabled': False,
                'requires_auth': True,
                'auth_type': 'Certificado Digital',
                'rate_limit': 50,
                'timeout_seconds': 90,
                'retry_attempts': 3,
                'cache_ttl_seconds': 86400,
            },
        ]

        created_count = 0
        updated_count = 0

        for service_data in services:
            service, created = IntegrationService.objects.update_or_create(
                service_type=service_data['service_type'],
                defaults=service_data
            )

            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'✓ Criado: {service.name}')
                )
            else:
                updated_count += 1
                self.stdout.write(
                    self.style.WARNING(f'⟳ Atualizado: {service.name}')
                )

        self.stdout.write('\n' + '=' * 60)
        self.stdout.write(
            self.style.SUCCESS(
                f'\n✓ Seed concluído!\n'
                f'  - Criados: {created_count}\n'
                f'  - Atualizados: {updated_count}\n'
                f'  - Total: {len(services)}\n'
            )
        )
        self.stdout.write('=' * 60 + '\n')
