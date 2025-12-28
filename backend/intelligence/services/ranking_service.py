"""
Ranking Service - Motor de ranqueamento baseado no comportamento do usuário.
"""
import logging
from django.db.models import Sum, Count, Q
from django.utils import timezone
from datetime import timedelta
from ..models import KnowledgeFeedback, UserBehaviorScore, KnowledgeLayer

logger = logging.getLogger('intelligence.ranking')

class RankingService:
    """
    Serviço responsável por calcular o score de relevância de entidades
    (documentos, tarefas, procedimentos) para cada usuário.
    
    Pesos Hierárquicos:
    - Pessoal: 60% (Suas próprias ações)
    - Departamento: 20% (Ações de colegas do mesmo departamento)
    - Organização: 15% (Ações globais da empresa)
    - Setor/Plataforma: 5% (Padrões gerais)
    """
    
    # Pontuação por tipo de ação
    ACTION_SCORES = {
        'view_doc': 1.0,           # Visualização simples
        'document_access': 1.0,    # Alias para view
        'document_download': 2.0,  # Download indica alta relevância
        'approval': 3.0,           # Aprovação (conclusão positiva)
        'rejection': 0.5,          # Rejeição (interesse mas negativo)
        'correction': 2.5,         # Correção (trabalho ativo)
        'edit': 2.5,              # Edição
        'share': 1.5,             # Compartilhamento
    }

    def calculate_user_scores(self, user):
        """
        Calcula e atualiza todos os scores para um usuário específico.
        """
        logger.info(f"Iniciando recálculo de scores para usuário: {user.username}")
        
        # 1. Obter contexto do usuário
        organization = user.organization if hasattr(user, 'organization') else None
        # Para departamento, vamos assumir que o usuário pode estar em grupos (ordoc_flow)
        # Simplificação: scores de departamento baseados nos grupos do usuário
        user_group_ids = list(user.groups.values_list('id', flat=True)) if hasattr(user, 'groups') else []
        
        # 2. Definir janela de tempo (últimos 30 dias para relevância)
        cutoff_date = timezone.now() - timedelta(days=30)
        
        # 3. Buscar todas as entidades que tiveram interação no período
        # (Focamos em entidades que o usuário OU sua organização interagiram)
        relevant_feedbacks = KnowledgeFeedback.objects.filter(
            created_at__gte=cutoff_date
        ).filter(
            Q(user=user) | 
            Q(organization=organization) |
            Q(layer=KnowledgeLayer.PLATFORM)
        )
        
        # Identificar entidades únicas (tipo + ID)
        entities = relevant_feedbacks.values('document_type', 'context__entity_id', 'context__document_id').distinct()
        
        for entity_data in entities:
            # Normalizar entity_id (pode vir de chaves diferentes no JSON context)
            entity_id = entity_data.get('context__entity_id') or entity_data.get('context__document_id')
            entity_type = entity_data.get('document_type')
            
            if not entity_id or not entity_type:
                continue

            # Calcular componentes
            personal = self._get_layer_score(entity_id, entity_type, Q(user=user))
            department = self._get_layer_score(entity_id, entity_type, Q(organization=organization, sector=user.sector if hasattr(user, 'sector') else ''))
            org_score = self._get_layer_score(entity_id, entity_type, Q(organization=organization))
            platform = self._get_layer_score(entity_id, entity_type, Q(layer=KnowledgeLayer.PLATFORM))
            
            # Aplicar pesos (conforme especificação)
            final_score = (
                (personal * 0.60) +
                (department * 0.20) +
                (org_score * 0.15) +
                (platform * 0.05)
            )
            
            if final_score > 0:
                UserBehaviorScore.objects.update_or_create(
                    user=user,
                    entity_type=entity_type,
                    entity_id=entity_id,
                    defaults={
                        'score': final_score,
                        'personal_score': personal,
                        'department_score': department,
                        'organization_score': org_score,
                        'sector_score': platform
                    }
                )

    def _get_layer_score(self, entity_id, entity_type, filter_q):
        """
        Calcula a soma bruta de scores para uma entidade em uma camada específica.
        """
        # Filtro base: entidade e a query de camada (user, org, etc)
        # Importante: document_id ou entity_id podem estar no context
        feedbacks = KnowledgeFeedback.objects.filter(
            filter_q,
            document_type=entity_type
        ).filter(
            Q(context__document_id=str(entity_id)) | 
            Q(context__entity_id=str(entity_id))
        )
        
        layer_total = 0.0
        for fb in feedbacks:
            # Pontuação baseada na ação
            action = fb.action_type
            if action == 'observation':
                # Em observações, o tipo real está no context: activity_type
                action = fb.context.get('activity_type') or fb.context.get('event_type')
            
            base_score = self.ACTION_SCORES.get(action, 0.5)
            
            # Atenuação temporal: ações mais recentes valem mais
            days_ago = (timezone.now() - fb.created_at).days
            time_factor = max(0.1, 1.0 - (days_ago / 30.0))
            
            layer_total += base_score * time_factor
            
        return layer_total

    def get_ranked_entities(self, user, entity_type=None, limit=10, view_mode='personal'):
        """
        Retorna as entidades ranqueadas para o usuário.
        
        Args:
            user: Usuário para ranquear
            entity_type: Tipo de entidade (document, task, procedure)
            limit: Número máximo de resultados
            view_mode: 'personal' ou 'team'
        """
        queryset = UserBehaviorScore.objects.filter(user=user)
        if entity_type:
            queryset = queryset.filter(entity_type=entity_type)
        
        # Aplicar pesos diferentes baseado no view_mode
        if view_mode == 'team':
            # Visão de equipe: priorizar scores de departamento e organização
            # Foco em bottlenecks coletivos
            queryset = queryset.extra(
                select={
                    'weighted_score': (
                        '(department_score * 0.4) + '  # Maior peso para departamento
                        '(organization_score * 0.3) + '  # Maior peso para organização
                        '(personal_score * 0.2) + '      # Menor peso pessoal
                        '(sector_score * 0.1)'
                    )
                }
            ).order_by('-weighted_score')
        else:
            # Visão pessoal: usar score padrão (já calculado com pesos pessoais)
            queryset = queryset.order_by('-score')
            
        return queryset[:limit]
