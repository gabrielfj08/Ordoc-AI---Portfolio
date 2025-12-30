#!/usr/bin/env python
"""
Script de Auditoria de Dados Existentes - Ana Silva
Verifica quais tabelas já possuem dados para evitar duplicação
"""
import os
import sys
import django

sys.path.append('/home/ricardo/Documentos/projects/adsumtec/ordoc-ai/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ordoc_core.settings')
django.setup()

from django.contrib.auth import get_user_model
from ordoc_cloud.models import OrdocUser, UserOrganizationRole, Notification, Comment, Policy, UserGroup
from ordoc_air.models import Document, Directory, Department, Tag, ActivityLog, ShareableLink, RecentDocument
from ordoc_flow.models import (
    Procedure, Task, ProcedureTemplate, TaskTemplate, 
    ExternalRequester, GroupRequester, GroupRequesterMember
)
from ordoc_flow.approval_models import ApprovalWorkflow, ApprovalStep, ApprovalInstance, ApprovalStepInstance

User = get_user_model()

def audit_ana_silva():
    try:
        user = User.objects.get(email='ana.silva@silvaadvocacia.com.br')
        ordoc_user = user.ordoc_profile
        role = UserOrganizationRole.objects.filter(user=ordoc_user).first()
        
        if not role:
            print("❌ Ana Silva não tem role de organização!")
            return
            
        org = role.organization
        
        print("=" * 80)
        print(f"📊 AUDITORIA DE DADOS - {ordoc_user}")
        print("=" * 80)
        
        # ORDOC CLOUD
        print("\n🔐 ORDOC CLOUD (Identidade & Acesso)")
        print(f"  ├─ Notificações: {Notification.objects.filter(user=ordoc_user).count()}")
        print(f"  ├─ Comentários: {Comment.objects.filter(user=ordoc_user).count()}")
        print(f"  ├─ Políticas atribuídas: {ordoc_user.policies.count()}")
        print(f"  └─ Grupos: {ordoc_user.user_groups.count()}")
        
        # ORDOC AIR
        print("\n📁 ORDOC AIR (Documentos)")
        print(f"  ├─ Documentos (created_by): {Document.objects.filter(created_by=user).count()}")
        print(f"  ├─ Documentos (department): {Document.objects.filter(department__organization=org).count()}")
        print(f"  ├─ Diretórios: {Directory.objects.filter(department__organization=org).count()}")
        print(f"  ├─ Departamentos: {Department.objects.filter(organization=org).count()}")
        print(f"  ├─ Tags: {Tag.objects.filter(organization=org).count()}")
        print(f"  ├─ Activity Logs: {ActivityLog.objects.filter(user=user).count()}")
        print(f"  ├─ Shareable Links: {ShareableLink.objects.filter(created_by=user).count()}")
        print(f"  └─ Recent Documents: {RecentDocument.objects.filter(user=user).count()}")
        
        # ORDOC FLOW
        print("\n⚙️  ORDOC FLOW (Workflows)")
        print(f"  ├─ Procedures (created_by): {Procedure.objects.filter(created_by=ordoc_user).count()}")
        print(f"  ├─ Procedures (org): {Procedure.objects.filter(organization=org).count()}")
        print(f"  ├─ Tasks (created_by): {Task.objects.filter(created_by=ordoc_user).count()}")
        print(f"  ├─ Tasks (assignee): {Task.objects.filter(assignee__user=ordoc_user).count()}")
        print(f"  ├─ Procedure Templates: {ProcedureTemplate.objects.filter(organization=org).count()}")
        print(f"  ├─ Task Templates: {TaskTemplate.objects.filter(organization=org).count()}")
        print(f"  ├─ External Requesters: {ExternalRequester.objects.filter(organization=org).count()}")
        print(f"  ├─ Group Requesters: {GroupRequester.objects.filter(organization=org).count()}")
        print(f"  └─ Group Members: {GroupRequesterMember.objects.filter(user=ordoc_user).count()}")
        
        # APPROVALS
        print("\n✅ APPROVALS")
        print(f"  ├─ Approval Workflows: {ApprovalWorkflow.objects.filter(organization=org).count()}")
        print(f"  ├─ Approval Instances: {ApprovalInstance.objects.filter(requested_by=ordoc_user).count()}")
        print(f"  └─ Pending Approvals (assigned): {ApprovalStepInstance.objects.filter(assigned_to=ordoc_user, status='pending').count()}")
        
        # INTELLIGENCE
        try:
            from intelligence.models import ProactiveAlert, DocumentAnalysis
            print("\n🤖 INTELLIGENCE (IA)")
            print(f"  ├─ Proactive Alerts: {ProactiveAlert.objects.filter(user=ordoc_user).count()}")
            print(f"  └─ Document Analysis: {DocumentAnalysis.objects.filter(organization=org).count()}")
        except ImportError:
            print("\n🤖 INTELLIGENCE (IA) - Módulo não disponível")
        
        # ORDOC SIGN
        try:
            from ordoc_sign.models import SignatureRequest, SignatureRequestSigner
            print("\n✍️  ORDOC SIGN (Assinaturas)")
            print(f"  ├─ Signature Requests (created): {SignatureRequest.objects.filter(created_by=ordoc_user).count()}")
            print(f"  └─ Signature Requests (signer): {SignatureRequestSigner.objects.filter(user=ordoc_user).count()}")
        except ImportError:
            print("\n✍️  ORDOC SIGN - Módulo não disponível")
        
        print("\n" + "=" * 80)
        print("✅ Auditoria concluída!")
        print("=" * 80)
        
    except User.DoesNotExist:
        print("❌ Usuário ana.silva@silvaadvocacia.com.br não encontrado!")
    except Exception as e:
        print(f"❌ Erro na auditoria: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    audit_ana_silva()
