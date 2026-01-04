"""
Management command para popular serviços de integração iniciais

Usage:
    python manage.py seed_integrations
"""

from django.core.management.base import BaseCommand
from ordoc_integrations.models import IntegrationService


class Command(BaseCommand):
    help = 'Popula banco de dados com serviços de integração - Roadmap 2026 Otimizado'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('=' * 80))
        self.stdout.write(self.style.WARNING('ORDOC-AI - SEED DE INTEGRAÇÕES'))
        self.stdout.write(self.style.WARNING('Roadmap 2026 Otimizado - Foco em Validação Profissional'))
        self.stdout.write(self.style.WARNING('=' * 80 + '\n'))

        # ========================================
        # INTEGRAÇÕES IMPLEMENTADAS (5)
        # ========================================

        implemented_services = [
            {
                'service_type': 'receita_federal',
                'name': 'Receita Federal do Brasil',
                'description': 'Validação de CPF e CNPJ, consulta CNPJ com múltiplos providers (BrasilAPI + ReceitaWS)',
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
                'description': 'Sistema de autenticação única do governo federal com OAuth2 e refresh token',
                'base_url': 'https://sso.acesso.gov.br',
                'api_version': '2.0',
                'status': 'active',
                'is_enabled': True,
                'requires_auth': True,
                'auth_type': 'OAuth2',
                'rate_limit': 200,
                'timeout_seconds': 45,
                'retry_attempts': 3,
                'cache_ttl_seconds': 3600,  # 1 hora
            },
            {
                'service_type': 'tse',
                'name': 'TSE - Tribunal Superior Eleitoral',
                'description': 'Consulta de situação eleitoral, histórico de comparecimento e dados cadastrais do eleitor',
                'base_url': 'https://dadosabertos.tse.jus.br',
                'api_version': '1.0',
                'status': 'active',
                'is_enabled': True,
                'requires_auth': False,
                'rate_limit': 100,
                'timeout_seconds': 45,
                'retry_attempts': 3,
                'cache_ttl_seconds': 2592000,  # 30 dias
            },
            {
                'service_type': 'ans',
                'name': 'ANS - Agência Nacional de Saúde Suplementar',
                'description': 'Consulta de beneficiários, planos de saúde e operadoras',
                'base_url': 'https://www.ans.gov.br/anstabnet',
                'api_version': '1.0',
                'status': 'active',
                'is_enabled': True,
                'requires_auth': False,
                'rate_limit': 100,
                'timeout_seconds': 45,
                'retry_attempts': 3,
                'cache_ttl_seconds': 86400,  # 24 horas
            },
        ]

        # ========================================
        # CONSELHOS PROFISSIONAIS (4) - PRIORIDADE ALTA
        # Validação de licenças profissionais
        # ========================================

        councils_services = [
            {
                'service_type': 'oab',
                'name': 'OAB - Ordem dos Advogados do Brasil',
                'description': 'Validação de inscrição OAB, consulta de situação cadastral e dados de advogados',
                'base_url': 'https://api.oab.org.br',  # Placeholder - API real a ser definida
                'api_version': '1.0',
                'status': 'inactive',  # Aguardando integração com APIs estaduais
                'is_enabled': False,
                'requires_auth': True,
                'auth_type': 'API Key',
                'rate_limit': 100,
                'timeout_seconds': 45,
                'retry_attempts': 3,
                'cache_ttl_seconds': 604800,  # 7 dias
                'config': {
                    'priority': 'high',
                    'purpose': 'Validação de autenticidade de licenças profissionais de advogados',
                    'implementation_status': 'structure_ready',
                    'estimated_hours': 4
                }
            },
            {
                'service_type': 'crm',
                'name': 'CRM - Conselho Regional de Medicina',
                'description': 'Validação de inscrição CRM, consulta de médicos e especialidades',
                'base_url': 'https://portal.cfm.org.br',  # Placeholder - API real a ser definida
                'api_version': '1.0',
                'status': 'inactive',  # Aguardando integração com CFM/CRMs estaduais
                'is_enabled': False,
                'requires_auth': True,
                'auth_type': 'API Key',
                'rate_limit': 100,
                'timeout_seconds': 45,
                'retry_attempts': 3,
                'cache_ttl_seconds': 604800,  # 7 dias
                'config': {
                    'priority': 'high',
                    'purpose': 'Validação de autenticidade de licenças profissionais de médicos',
                    'implementation_status': 'structure_ready',
                    'estimated_hours': 4
                }
            },
            {
                'service_type': 'cro',
                'name': 'CRO - Conselho Regional de Odontologia',
                'description': 'Validação de inscrição CRO, consulta de dentistas e especialidades',
                'base_url': 'https://cfo.org.br',  # Placeholder - API real a ser definida
                'api_version': '1.0',
                'status': 'inactive',  # Aguardando integração com CFO/CROs estaduais
                'is_enabled': False,
                'requires_auth': True,
                'auth_type': 'API Key',
                'rate_limit': 100,
                'timeout_seconds': 45,
                'retry_attempts': 3,
                'cache_ttl_seconds': 604800,  # 7 dias
                'config': {
                    'priority': 'high',
                    'purpose': 'Validação de autenticidade de licenças profissionais de dentistas',
                    'implementation_status': 'structure_ready',
                    'estimated_hours': 5
                }
            },
            {
                'service_type': 'crea',
                'name': 'CREA - Conselho Regional de Engenharia e Agronomia',
                'description': 'Validação de inscrição CREA, atribuições técnicas e ARTs',
                'base_url': 'https://confea.org.br',  # Placeholder - API real a ser definida
                'api_version': '1.0',
                'status': 'inactive',  # Aguardando integração com CONFEA/CREAs estaduais
                'is_enabled': False,
                'requires_auth': True,
                'auth_type': 'API Key',
                'rate_limit': 100,
                'timeout_seconds': 45,
                'retry_attempts': 3,
                'cache_ttl_seconds': 604800,  # 7 dias
                'config': {
                    'priority': 'high',
                    'purpose': 'Validação de autenticidade de licenças profissionais de engenheiros',
                    'implementation_status': 'structure_ready',
                    'estimated_hours': 5
                }
            },
        ]

        # ========================================
        # AUTENTICAÇÃO E OPERAÇÕES FISCAIS (2) - PRIORIDADE MÉDIA
        # ========================================

        document_auth_services = [
            {
                'service_type': 'cartorios',
                'name': 'Cartórios (CRI/CNJ)',
                'description': 'Autenticação de documentos, certidões e consulta de matrículas de imóveis',
                'base_url': 'https://www.cnj.jus.br',  # Placeholder - múltiplas APIs necessárias
                'api_version': '1.0',
                'status': 'inactive',  # Aguardando integração com e-Notariado/CNJ
                'is_enabled': False,
                'requires_auth': True,
                'auth_type': 'API Key',
                'rate_limit': 50,
                'timeout_seconds': 60,
                'retry_attempts': 3,
                'cache_ttl_seconds': 86400,  # 24 horas
                'config': {
                    'priority': 'medium',
                    'purpose': 'Envio e recebimento de documentos autenticados',
                    'implementation_status': 'structure_ready',
                    'estimated_hours': 12,
                    'complexity': 'high',
                    'blockers': 'APIs fragmentadas por cartório/estado'
                }
            },
            {
                'service_type': 'sintegra',
                'name': 'SINTEGRA - Sistema Integrado de Informações',
                'description': 'Consulta de inscrição estadual e situação cadastral de empresas (27 estados)',
                'base_url': 'http://www.sintegra.gov.br',  # Base genérica
                'api_version': '1.0',
                'status': 'inactive',  # Aguardando implementação das 27 APIs estaduais
                'is_enabled': False,
                'requires_auth': False,  # Varia por estado
                'rate_limit': 50,
                'timeout_seconds': 60,
                'retry_attempts': 3,
                'cache_ttl_seconds': 86400,  # 24 horas
                'config': {
                    'priority': 'medium',
                    'purpose': 'Validação de empresas em licitações e assinaturas',
                    'implementation_status': 'structure_ready',
                    'estimated_hours': 15,
                    'complexity': 'high',
                    'blockers': '27 APIs estaduais diferentes com formatos variados'
                }
            },
        ]

        # ========================================
        # PROCESSAMENTO
        # ========================================

        all_services = implemented_services + councils_services + document_auth_services

        created_count = 0
        updated_count = 0

        self.stdout.write(self.style.SUCCESS('📥 Processando serviços...\n'))

        for service_data in all_services:
            service, created = IntegrationService.objects.update_or_create(
                service_type=service_data['service_type'],
                defaults=service_data
            )

            if created:
                created_count += 1
                status_icon = '✅' if service_data['status'] == 'active' else '⏳'
                self.stdout.write(
                    self.style.SUCCESS(f'{status_icon} CRIADO:     {service.name}')
                )
            else:
                updated_count += 1
                status_icon = '✅' if service_data['status'] == 'active' else '⏳'
                self.stdout.write(
                    self.style.WARNING(f'{status_icon} ATUALIZADO: {service.name}')
                )

        # ========================================
        # RESUMO
        # ========================================

        self.stdout.write('\n' + '=' * 80)
        self.stdout.write(self.style.SUCCESS('\n✅ SEED CONCLUÍDO!\n'))
        self.stdout.write(f'  📊 Estatísticas:')
        self.stdout.write(f'     - Serviços criados: {created_count}')
        self.stdout.write(f'     - Serviços atualizados: {updated_count}')
        self.stdout.write(f'     - Total de serviços: {len(all_services)}')
        self.stdout.write(f'\n  🎯 Distribuição:')
        self.stdout.write(f'     - Implementados (✅): {len(implemented_services)}')
        self.stdout.write(f'     - Conselhos Profissionais (⏳): {len(councils_services)} [PRIORIDADE ALTA]')
        self.stdout.write(f'     - Doc Auth + Fiscal (⏳): {len(document_auth_services)} [PRIORIDADE MÉDIA]')
        self.stdout.write(f'\n  🚫 Eliminados do roadmap:')
        self.stdout.write(f'     CVM, CAGED, JUCESP, SERASA, PIX, INSS, NFe/NFSe, eSocial, DETRAN')
        self.stdout.write('\n' + '=' * 80 + '\n')
