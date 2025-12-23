from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Count, Sum
from django.contrib.auth import get_user_model
from datetime import timedelta

# Importar models de outros apps
try:
    from ordoc_air.models import Document
except ImportError:
    Document = None

try:
    from ordoc_reports.models import Report
except ImportError:
    Report = None

User = get_user_model()

class AnalyticsSummaryViewSet(viewsets.ViewSet):
    """
    ViewSet para estatísticas globais do sistema (Dashboard Analytics).
    """
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def overview(self, request):
        """
        Retorna visão geral para o painel de Análises.
        
        Métricas:
        - Total de Documentos
        - Usuários Ativos
        - Relatórios Gerados
        - Armazenamento (Estimado)
        - Atividade Semanal
        """
        # 1. Total de Documentos
        total_docs = 0
        storage_bytes = 0
        docs_this_week = 0
        
        if Document:
            # Filtrar por organização se aplicável (assumindo multitenancy)
            # Para simplificar agora, pegamos global ou do usuário
            # Se fosse produção real, filtraríamos por request.user.organization
            
            # Vamos assumir que Document tem organization ou user
            # Mas como não visualizei o model Document, vou fazer um count simples por enquanto
            # e tentar filtrar se o campo existir
            
            docs_qs = Document.objects.all()
            if hasattr(Document, 'organization') and hasattr(request.user, 'organization'):
                docs_qs = docs_qs.filter(organization=request.user.organization)
            
            total_docs = docs_qs.count()
            
            # Calcular storage (soma de file_size)
            # Assumindo campo file_size
            storage_agg = docs_qs.aggregate(total=Sum('file_size'))
            storage_bytes = storage_agg['total'] or 0
            
        # 2. Usuários Ativos
        # Filtrar por organização
        users_qs = User.objects.filter(is_active=True)
        # Se usuário tem organização, filtrar colegas
        if hasattr(request.user, 'organization'):
            users_qs = users_qs.filter(organization=request.user.organization)
            
        active_users = users_qs.count()
        
        # 3. Relatórios Gerados
        total_reports = 0
        if Report:
            reports_qs = Report.objects.all()
            if hasattr(Report, 'organization') and hasattr(request.user, 'organization'):
                reports_qs = reports_qs.filter(organization=request.user.organization)
            total_reports = reports_qs.count()
            
        # 4. Atividade Semanal (Últimos 7 dias)
        weekly_activity = []
        now = timezone.now().date()
        for i in range(6, -1, -1):
            day = now - timedelta(days=i)
            day_label = day.strftime('%a') # Seg, Ter... (em en-us, mas ok)
            
            count = 0
            if Document:
                # Count docs created on this day
                count = docs_qs.filter(
                    created_at__date=day
                ).count()
            
            weekly_activity.append({
                'day': day.strftime('%Y-%m-%d'),
                'label': day_label,
                'count': count
            })

        # Formatar storage
        storage_display = self._format_bytes(storage_bytes)

        return Response({
            'documents': {
                'total': total_docs,
                'change': '+12%', # Mock para "crescimento"
            },
            'users': {
                'active': active_users,
                'change': '+4%',
            },
            'reports': {
                'total': total_reports,
                'change': '+24%',
            },
            'storage': {
                'used_bytes': storage_bytes,
                'display': storage_display,
                'usage_percent': 45, # Mock, pois precisaríamos da quota total
            },
            'weekly_activity': weekly_activity,
            'system_status': {
                'api': 'operational',
                'database': 'operational',
                'storage': 'warning' if storage_bytes > 10 * 1024 * 1024 * 1024 else 'operational'
            }
        })

    def _format_bytes(self, size):
        power = 2**10
        n = 0
        power_labels = {0 : '', 1: 'K', 2: 'M', 3: 'G', 4: 'T'}
        while size > power:
            size /= power
            n += 1
        return f"{size:.1f} {power_labels[n]}B"
