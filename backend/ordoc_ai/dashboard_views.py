from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ordoc_ai.authentication import get_current_organization
from ordoc_ai.authentication import get_current_ordoc_user
from ordoc_cloud.models import UserOrganizationRole

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_config(request):
    """
    Retorna a configuração do dashboard para o usuário atual na organização atual.
    Baseado em features da organização e permissões do usuário.
    """
    organization = get_current_organization(request)
    ordoc_user = get_current_ordoc_user(request)

    roles = []
    if organization and ordoc_user:
        roles = list(
            UserOrganizationRole.objects.filter(
                user=ordoc_user,
                organization=organization,
                is_active=True,
            ).values_list('role', flat=True)
        )

    # Manager roles check
    can_access_team_view = any(r in roles for r in ['admin', 'manager', 'department_manager', 'organization_manager'])

    subtype = (organization.subtype if organization else '') or ''
    features = (organization.features if organization else {}) or {}

    # 1. Base default cards (always present unless disabled)
    default_cards = [
        'continue-working',
        'documents',
        'workflows',
        'pending-actions',
        'process-status',
        'ai-alerts',
        'smart-agenda',
        'storage',
        'compliance-overview',
    ]

    # 2. Add Feature-dependent cards
    # These cards are added ONLY if the feature is explicitly enabled in Organization.features
    
    
    # External Integrations (Tribunais, DOE)
    if features.get('integrations_tribunais', False):
        default_cards.append('court-key-movements') # Identificador hipotético para Tribunais
        
    if features.get('integrations_doe', False):
        default_cards.append('official-diaries')

    # Team View (requires Role AND Feature)
    if can_access_team_view:
        default_cards.insert(6, 'team-view') # Insert at specific position or append

    # 3. Apply Overrides (Allow explicit enable/disable list in JSON to override code logic)
    enabled_cards_override = features.get('dashboard_enabled_cards')
    disabled_cards_override = set(features.get('dashboard_disabled_cards') or [])

    if isinstance(enabled_cards_override, list) and enabled_cards_override:
        # If enabled list is provided, it takes precedence (whitelist mode)
        final_cards = [c for c in enabled_cards_override if c not in disabled_cards_override]
    else:
        # Default mode (blacklist mode)
        final_cards = [c for c in default_cards if c not in disabled_cards_override]

    # Ensure Team View security fallback
    if not can_access_team_view and 'team-view' in final_cards:
        final_cards.remove('team-view')

    payload = {
        'organization': {
            'id': str(organization.id) if organization else None,
            'type': getattr(organization, 'type', '') if organization else '',
            'subtype': subtype,
            'features': features,
        },
        'user': {
            'roles': roles,
            'can_access_team_view': can_access_team_view,
        },
        'dashboard': {
            'cards': final_cards,
        },
    }

    return Response(payload)
