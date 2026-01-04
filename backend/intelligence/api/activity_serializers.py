from rest_framework import serializers
from ..models import KnowledgeFeedback

class ActivityFeedSerializer(serializers.ModelSerializer):
    """
    Serializer para o feed de atividades.
    
    Transforma KnowledgeFeedback em um formato consumível pela Activity Tree.
    Agrega informações de contexto para exibição simplificada.
    """
    user_name = serializers.SerializerMethodField()
    user_avatar = serializers.SerializerMethodField()
    date = serializers.DateTimeField(source='created_at')
    action = serializers.CharField(source='action_type')
    items = serializers.SerializerMethodField()
    
    class Meta:
        model = KnowledgeFeedback
        fields = [
            'id', 
            'action', 
            'date', 
            'user_name', 
            'user_avatar',
            'items',
            'document_type',
            'context'
        ]
        
    def get_user_name(self, obj):
        if not obj.user:
            return "Sistema"
        return obj.user.get_full_name() or obj.user.username
        
    def get_user_avatar(self, obj):
        # TODO: Implementar avatar real quando disponível
        if not obj.user:
            return "S"
        return (obj.user.first_name[0] if obj.user.first_name else obj.user.username[0]).upper()
        
    def get_items(self, obj):
        """
        Reconstrói os itens afetados a partir do contexto.
        """
        items = []
        context = obj.context or {}
        
        # Tentar extrair informações do documento do contexto
        if 'document_name' in context:
            items.append({
                'name': context['document_name'],
                'type': obj.document_type,
                'location': context.get('location', 'Desconhecido')
            })
        elif 'document_id' in context:
             # Fallback: se tivermos apenas o ID, retornamos algo genérico
             # Em uma implementação ideal, faríamos um prefetch ou lookup, mas para performance
             # de feed, ideal é ter os dados desnormalizados no contexto.
            items.append({
                'name': f"Item {obj.document_type}",
                'type': obj.document_type,
                'location': 'Sistema'
            })
            
        return items
