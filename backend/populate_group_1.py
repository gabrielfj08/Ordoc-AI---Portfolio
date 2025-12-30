#!/usr/bin/env python
"""
População em Grupos - Grupo 1 de 5 Tabelas
Tabelas: PatternFeedbackLink, UserBehaviorScore, DocumentTemplate, Permission, Batch Operations
"""
import os
import sys
import django
import uuid
import random
from datetime import timedelta

sys.path.append('/home/ricardo/Documentos/projects/adsumtec/ordoc-ai/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ordoc_core.settings')
django.setup()

from django.utils import timezone
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth.models import Group

from ordoc_cloud.models import OrdocUser, UserOrganizationRole
from ordoc_air.models import (
    Organization, Department, Directory, Document, Tag,
    DocumentTemplate, Permission
)
from intelligence.models import (
    LearnedPattern, KnowledgeFeedback, PatternFeedbackLink,
    UserBehaviorScore
)

User = get_user_model()

def populate_group_1():
    """Popula o primeiro grupo de 5 tabelas"""
    print("\n" + "="*100)
    print("GRUPO 1: Populando 5 Tabelas")
    print("="*100 + "\n")
    
    # Buscar Ana Silva
    user = User.objects.get(email='ana.silva@silvaadvocacia.com.br')
    ordoc_user = user.ordoc_profile
    role = UserOrganizationRole.objects.filter(user=ordoc_user).first()
    org = role.organization
    
    print(f"👤 Usuário: {ordoc_user}")
    print(f"🏢 Organização: {org.corporate_name}\n")
    
    # Buscar dados existentes
    patterns = list(LearnedPattern.objects.filter(organization=org))
    feedbacks = list(KnowledgeFeedback.objects.all()[:10])
    docs = list(Document.objects.filter(department__organization=org)[:20])
    dirs = list(Directory.objects.filter(department__organization=org)[:5])
    
    # =========================================================================
    # 1. PatternFeedbackLink
    # =========================================================================
    print("1️⃣  intelligence_patternfeedbacklink (PatternFeedbackLink)")
    count = 0
    
    for pattern in patterns[:3]:
        for feedback in feedbacks[:3]:
            link, created = PatternFeedbackLink.objects.get_or_create(
                pattern=pattern,
                feedback=feedback,
                defaults={'contribution_weight': random.uniform(0.5, 1.0)}
            )
            if created:
                count += 1
    
    print(f"   ✅ {count} pattern feedback links criados\n")
    
    # =========================================================================
    # 2. UserBehaviorScore
    # =========================================================================
    print("2️⃣  intelligence_userbehaviorscore (UserBehaviorScore)")
    count = 0
    
    entity_types = ['document', 'procedure', 'task']
    for entity_type in entity_types:
        for i in range(5):
            score, created = UserBehaviorScore.objects.get_or_create(
                user=user,
                entity_type=entity_type,
                entity_id=uuid.uuid4(),
                defaults={
                    'score': random.uniform(0.5, 1.0),
                    'personal_score': random.uniform(0.4, 0.9),
                    'department_score': random.uniform(0.3, 0.8),
                    'organization_score': random.uniform(0.2, 0.7),
                    'sector_score': random.uniform(0.1, 0.6)
                }
            )
            if created:
                count += 1
    
    print(f"   ✅ {count} user behavior scores criados\n")
    
    # =========================================================================
    # 3. DocumentTemplate
    # =========================================================================
    print("3️⃣  ordoc_air_documenttemplate (DocumentTemplate)")
    count = 0
    
    templates_data = [
        {
            'name': 'Contrato de Prestação de Serviços',
            'category': 'Contratos',
            'description': 'Template padrão para contratos de prestação de serviços'
        },
        {
            'name': 'Procuração',
            'category': 'Jurídico',
            'description': 'Template de procuração com poderes gerais'
        },
        {
            'name': 'Termo de Confidencialidade (NDA)',
            'category': 'Compliance',
            'description': 'Non-Disclosure Agreement padrão'
        },
        {
            'name': 'Contrato de Trabalho',
            'category': 'RH',
            'description': 'Template de contrato de trabalho CLT'
        },
        {
            'name': 'Termo de Rescisão',
            'category': 'RH',
            'description': 'Template de rescisão contratual'
        },
    ]
    
    tags = list(Tag.objects.filter(organization=org))
    
    for template_data in templates_data:
        # Criar arquivo mock
        from django.core.files.base import ContentFile
        mock_file = ContentFile(b'Mock template content', name=f"{template_data['name']}.docx")
        
        template, created = DocumentTemplate.objects.get_or_create(
            organization=org,
            name=template_data['name'],
            category=template_data['category'],
            defaults={
                'description': template_data['description'],
                'version': '1.0',
                'status': 'active',
                'file': mock_file,
                'usage_count': random.randint(0, 50),
                'created_by': user,
                'updated_by': user
            }
        )
        
        if created and tags:
            template.tags.add(random.choice(tags))
            count += 1
    
    print(f"   ✅ {count} document templates criados\n")
    
    # =========================================================================
    # 4. Permission
    # =========================================================================
    print("4️⃣  ordoc_air_permission (Permission)")
    count = 0
    
    # Criar grupo se não existir
    group, _ = Group.objects.get_or_create(name='Equipe Jurídica')
    
    # Permissões em documentos
    for doc in docs[:5]:
        # Permissão de usuário
        perm, created = Permission.objects.get_or_create(
            user=user,
            document=doc,
            defaults={'permission': 'read_write'}
        )
        if created:
            count += 1
        
        # Permissão de grupo
        perm, created = Permission.objects.get_or_create(
            group=group,
            document=doc,
            defaults={'permission': 'read'}
        )
        if created:
            count += 1
    
    # Permissões em diretórios
    for dir in dirs[:3]:
        perm, created = Permission.objects.get_or_create(
            user=user,
            directory=dir,
            defaults={'permission': 'full_access'}
        )
        if created:
            count += 1
    
    print(f"   ✅ {count} permissions criadas\n")
    
    # =========================================================================
    # 5. Batch Operations (ordoc_air)
    # =========================================================================
    print("5️⃣  ordoc_air_batch_operations (BatchOperation)")
    count = 0
    
    try:
        from ordoc_air.batch_models import BatchOperation, BatchOperationItem
        
        operations_data = [
            {
                'operation_type': 'move',
                'description': 'Mover documentos para pasta Contratos',
                'status': 'completed'
            },
            {
                'operation_type': 'tag',
                'description': 'Aplicar tag Urgente em lote',
                'status': 'completed'
            },
            {
                'operation_type': 'delete',
                'description': 'Excluir documentos temporários',
                'status': 'pending'
            },
        ]
        
        for op_data in operations_data:
            op, created = BatchOperation.objects.get_or_create(
                organization=org,
                operation_type=op_data['operation_type'],
                description=op_data['description'],
                defaults={
                    'status': op_data['status'],
                    'created_by': user,
                    'total_items': random.randint(5, 20),
                    'processed_items': random.randint(0, 15) if op_data['status'] == 'completed' else 0,
                    'failed_items': random.randint(0, 2)
                }
            )
            
            if created:
                # Criar items da operação
                for doc in docs[:5]:
                    BatchOperationItem.objects.get_or_create(
                        batch_operation=op,
                        content_type=ContentType.objects.get_for_model(Document),
                        object_id=doc.id,
                        defaults={
                            'status': 'completed' if op_data['status'] == 'completed' else 'pending'
                        }
                    )
                count += 1
        
        print(f"   ✅ {count} batch operations criadas\n")
        
    except ImportError:
        print(f"   ⚠️  BatchOperation model não encontrado - pulando\n")
    
    print("="*100)
    print("✅ GRUPO 1 CONCLUÍDO!")
    print("="*100 + "\n")

if __name__ == '__main__':
    try:
        populate_group_1()
    except Exception as e:
        print(f"\n❌ ERRO: {e}")
        import traceback
        traceback.print_exc()
