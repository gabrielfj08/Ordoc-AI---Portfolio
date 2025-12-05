#!/usr/bin/env python
"""
Script para criar usuário de teste
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ordoc_ai.settings')
django.setup()

from django.contrib.auth.models import User
from ordoc_cloud.models import OrdocUser
from ordoc_air.models import Organization

def create_test_user():
    """Cria usuário de teste se não existir"""
    
    # Credenciais
    email = 'admin@example.com'
    username = 'admin'
    password = 'changeme'
    
    print("🔍 Verificando usuários existentes...")
    
    # Verificar se usuário já existe
    if User.objects.filter(username=username).exists():
        user = User.objects.get(username=username)
        print(f"✅ Usuário '{username}' já existe!")
        print(f"   Email: {user.email}")
        
        # Verificar OrdocUser
        if hasattr(user, 'ordoc_profile'):
            ordoc_user = user.ordoc_profile
            print(f"   Status: {ordoc_user.status}")
            print(f"   ID: {ordoc_user.id}")
        else:
            print("   ⚠️ OrdocUser profile não existe, criando...")
            ordoc_user = OrdocUser.objects.create(
                user=user,
                status='active',
                must_change_password=False
            )
            print(f"   ✅ OrdocUser profile criado! ID: {ordoc_user.id}")
    else:
        print(f"📝 Criando novo usuário '{username}'...")
        
        # Criar User do Django
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        user.first_name = 'Admin'
        user.last_name = 'User'
        user.is_staff = True
        user.is_superuser = True
        user.save()
        
        print(f"   ✅ Django User criado!")
        
        # Criar OrdocUser profile
        ordoc_user = OrdocUser.objects.create(
            user=user,
            status='active',
            must_change_password=False,
            profile_complete=True
        )
        
        print(f"   ✅ OrdocUser profile criado! ID: {ordoc_user.id}")
    
    # Listar todos os usuários
    print("\n" + "="*60)
    print("📋 USUÁRIOS CADASTRADOS NO SISTEMA")
    print("="*60)
    
    all_users = User.objects.all()
    for u in all_users:
        print(f"\n👤 Username: {u.username}")
        print(f"   Email: {u.email}")
        print(f"   Nome: {u.get_full_name()}")
        print(f"   Superuser: {u.is_superuser}")
        print(f"   Staff: {u.is_staff}")
        
        if hasattr(u, 'ordoc_profile'):
            ou = u.ordoc_profile
            print(f"   OrdocUser ID: {ou.id}")
            print(f"   Status: {ou.status}")
        else:
            print(f"   ⚠️ Sem perfil OrdocUser")
    
    print("\n" + "="*60)
    print("✅ CREDENCIAIS PARA LOGIN")
    print("="*60)
    print(f"Email: {email}")
    print(f"Senha: {password}")
    print("="*60)

if __name__ == '__main__':
    create_test_user()
