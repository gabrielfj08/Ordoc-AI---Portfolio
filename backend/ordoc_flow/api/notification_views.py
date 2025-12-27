from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from ordoc_flow.approval_models import NotificationLog
from ordoc_flow.api.notification_serializers import NotificationLogSerializer
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)


class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para gerenciar notificações do usuário
    """
    permission_classes = [IsAuthenticated]
    serializer_class = NotificationLogSerializer
    
    def get_queryset(self):
        """Retorna apenas notificações do usuário autenticado"""
        user = self.request.user.ordoc_profile
        return NotificationLog.objects.filter(
            recipient=user
        ).select_related('recipient', 'content_type').order_by('-created_at')
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Marca uma notificação como lida"""
        notification = self.get_object()
        notification.status = 'read'
        notification.read_at = timezone.now()
        notification.save()
        
        logger.info(f"Notification {pk} marked as read by {request.user.email}")
        
        return Response({
            'status': 'success',
            'message': 'Notification marked as read'
        })
    
    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Marca todas as notificações como lidas"""
        user = request.user.ordoc_profile
        updated = NotificationLog.objects.filter(
            recipient=user,
            status__in=['sent', 'delivered']
        ).update(status='read', read_at=timezone.now())
        
        logger.info(f"{updated} notifications marked as read by {request.user.email}")
        
        return Response({
            'status': 'success',
            'message': f'{updated} notifications marked as read',
            'count': updated
        })
    
    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """Retorna contagem de notificações não lidas"""
        user = request.user.ordoc_profile
        count = NotificationLog.objects.filter(
            recipient=user,
            status__in=['sent', 'delivered']
        ).count()
        
        return Response({'count': count})
    
    @action(detail=False, methods=['get'])
    def unread(self, request):
        """Retorna apenas notificações não lidas"""
        user = request.user.ordoc_profile
        queryset = NotificationLog.objects.filter(
            recipient=user,
            status__in=['sent', 'delivered']
        ).order_by('-created_at')
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
