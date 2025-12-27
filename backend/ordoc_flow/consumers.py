import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from ordoc_cloud.models import OrdocUser
from ordoc_ai.jwt_service import JWTService, JWTError
import logging

logger = logging.getLogger(__name__)


class NotificationConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer para notificações em tempo real
    """
    
    async def connect(self):
        """
        Aceita conexão WebSocket e autentica usuário
        """
        # Extrair token do query string
        query_string = self.scope['query_string'].decode()
        token = None
        
        for param in query_string.split('&'):
            if param.startswith('token='):
                token = param.split('=')[1]
                break
        
        if not token:
            logger.warning("WebSocket connection rejected: no token provided")
            await self.close()
            return
        
        # Autenticar usuário
        try:
            user = await self.get_user_from_token(token)
            if not user:
                logger.warning("WebSocket connection rejected: invalid token")
                await self.close()
                return
            
            self.user = user
            self.user_id = str(user.id)
            self.room_group_name = f'notifications_{self.user_id}'
            
            # Adicionar ao grupo de notificações do usuário
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            
            await self.accept()
            logger.info(f"WebSocket connected: user {user.user.email}")
            
            # Enviar notificações não lidas ao conectar
            await self.send_unread_notifications()
            
        except Exception as e:
            logger.exception(f"Error during WebSocket connection: {e}")
            await self.close()
    
    async def disconnect(self, close_code):
        """
        Remove do grupo ao desconectar
        """
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
            logger.info(f"WebSocket disconnected: user {self.user.user.email}")
    
    async def receive(self, text_data):
        """
        Recebe mensagens do cliente (ex: marcar como lido)
        """
        try:
            data = json.loads(text_data)
            action = data.get('action')
            
            if action == 'mark_as_read':
                notification_id = data.get('notification_id')
                await self.mark_notification_as_read(notification_id)
                
            elif action == 'mark_all_as_read':
                await self.mark_all_as_read()
                
        except json.JSONDecodeError:
            logger.error("Invalid JSON received from WebSocket")
        except Exception as e:
            logger.exception(f"Error processing WebSocket message: {e}")
    
    async def notification_message(self, event):
        """
        Envia notificação para o WebSocket
        """
        await self.send(text_data=json.dumps({
            'type': 'notification',
            'notification': event['notification']
        }))
    
    @database_sync_to_async
    def get_user_from_token(self, token):
        """
        Autentica usuário a partir do JWT token
        """
        try:
            token_data = JWTService.decode(token)
            user_id = token_data.get('sub')
            
            if not user_id:
                return None
            
            from django.contrib.auth.models import User
            user = User.objects.get(id=user_id)
            return user.ordoc_profile
            
        except (JWTError, Exception):
            return None
    
    async def send_unread_notifications(self):
        """
        Envia notificações não lidas ao conectar
        """
        from ordoc_flow.approval_models import NotificationLog
        
        unread = await self.get_unread_notifications()
        
        for notification in unread:
            await self.send(text_data=json.dumps({
                'type': 'notification',
                'notification': {
                    'id': str(notification.id),
                    'subject': notification.subject,
                    'body': notification.body,
                    'created_at': notification.created_at.isoformat(),
                    'status': notification.status,
                }
            }))
    
    @database_sync_to_async
    def get_unread_notifications(self):
        """
        Busca notificações não lidas do banco
        """
        from ordoc_flow.approval_models import NotificationLog
        
        return list(NotificationLog.objects.filter(
            recipient=self.user,
            notification_type='system',
            status__in=['sent', 'delivered']
        ).order_by('-created_at')[:20])
    
    @database_sync_to_async
    def mark_notification_as_read(self, notification_id):
        """
        Marca notificação como lida
        """
        from ordoc_flow.approval_models import NotificationLog
        from django.utils import timezone
        
        try:
            notification = NotificationLog.objects.get(
                id=notification_id,
                recipient=self.user
            )
            notification.status = 'read'
            notification.read_at = timezone.now()
            notification.save()
            
            logger.info(f"Notification {notification_id} marked as read")
        except NotificationLog.DoesNotExist:
            logger.warning(f"Notification {notification_id} not found")
    
    @database_sync_to_async
    def mark_all_as_read(self):
        """
        Marca todas as notificações como lidas
        """
        from ordoc_flow.approval_models import NotificationLog
        from django.utils import timezone
        
        NotificationLog.objects.filter(
            recipient=self.user,
            status__in=['sent', 'delivered']
        ).update(
            status='read',
            read_at=timezone.now()
        )
        
        logger.info(f"All notifications marked as read for user {self.user.user.email}")
