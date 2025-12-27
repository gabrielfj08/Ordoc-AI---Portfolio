from rest_framework import serializers
from ordoc_flow.approval_models import NotificationLog


class NotificationLogSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    related_object_url = serializers.SerializerMethodField()
    
    class Meta:
        model = NotificationLog
        fields = [
            'id', 'subject', 'body', 'status', 'notification_type',
            'created_at', 'read_at', 'type', 'related_object_url'
        ]
        read_only_fields = ['created_at', 'read_at']
    
    def get_type(self, obj):
        """Retorna tipo baseado no notification_type ou objeto relacionado"""
        if obj.related_object:
            from ordoc_flow.models import Task, ApprovalInstance
            
            if isinstance(obj.related_object, Task):
                return 'task'
            elif isinstance(obj.related_object, ApprovalInstance):
                return 'approval'
        
        # Mapear notification_type para tipo visual
        type_map = {
            'email': 'system',
            'sms': 'system',
            'system': 'system',
        }
        return type_map.get(obj.notification_type, 'system')
    
    def get_related_object_url(self, obj):
        """Retorna URL do objeto relacionado se existir"""
        if obj.related_object:
            from ordoc_flow.models import Task, ApprovalInstance
            
            if isinstance(obj.related_object, Task):
                return f"/tasks/{obj.object_id}"
            elif isinstance(obj.related_object, ApprovalInstance):
                return f"/approvals/{obj.object_id}"
        return None
