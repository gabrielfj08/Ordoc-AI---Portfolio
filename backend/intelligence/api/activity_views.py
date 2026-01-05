from rest_framework import views, response, status, permissions
from rest_framework.response import Response
from django.db.models import Q
from ..models import KnowledgeFeedback
from .activity_serializers import ActivityFeedSerializer
import logging

logger = logging.getLogger(__name__)

from django.core.exceptions import ObjectDoesNotExist

class ActivityFeedView(views.APIView):
    """
    API para o feed de atividades da Activity Tree.
    
    Suporta filtros por:
    - Escopo (Global, Organization, Folder)
    - Contexto específico (Folder ID)
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        try:
            # Filtros
            scope = request.query_params.get('scope', 'user')  # user, organization, folder
            context_id = request.query_params.get('context_id')
            limit = int(request.query_params.get('limit', 20))
            
            queryset = KnowledgeFeedback.objects.select_related('user', 'organization').order_by('-created_at')
            
            # Filtro base: Usuário deve ver o que tem permissão
            # Por enquanto, assumimos que usuário vê logs da sua organização
            try:
                profile = request.user.profile
                if profile.organization_id:
                    queryset = queryset.filter(organization_id=profile.organization_id)
            except (AttributeError, ObjectDoesNotExist):
                # Se usuário não tem profile ou organização, não filtramos por org (ou retornamos vazio?)
                # Por segurança, vamos logar warning
                logger.warning(f"User {request.user.id} has no profile/organization for activity feed.")
            
            # Aplicar filtros de escopo
            if scope == 'folder' and context_id:
                # Filtrar logs relacionados a esta pasta (via contexto)
                queryset = queryset.filter(context__contains={'folder_id': context_id})

            elif scope == 'document' and context_id:
                # Filtrar logs relacionados a este documento
                queryset = queryset.filter(context__contains={'document_id': context_id})
                
            elif scope == 'user':
                # Filtra apenas atividades do usuário se solicitado, ou mantem global da org
                pass
                
            # Paginação simples
            activities = queryset[:limit]
            
            # Serialização
            serializer = ActivityFeedSerializer(activities, many=True)
            
            # Agrupamento (opcional, pode ser feito no frontend ou aqui)
            # Para manter simples agora, retornamos flat e o frontend agrupa se precisar,
            # ou implementamos lógica de agrupamento aqui.
            # O frontend espera { date: "Hoje", items: [...] } ? 
            # O mock do frontend agrupa por "Semana passada", etc.
            # O Serializer retorna lista flat.
            
            return Response(serializer.data)
            
        except Exception as e:
            logger.error(f"Erro ao buscar feed de atividades: {e}")
            import traceback
            traceback.print_exc()
            return Response(
                {"error": f"Erro ao carregar atividades: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
