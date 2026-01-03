"""
Script para popular o banco de dados com documentos de teste para a usuária Ana Silva (advogada)

Uso:
    python manage.py populate_ana_silva_documents
"""

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.core.files import File
from django.utils import timezone
from ordoc_air.models import Document, Department, Directory, Organization
import os
import mimetypes
from pathlib import Path
import random


class Command(BaseCommand):
    help = 'Popula o banco de dados com documentos de teste para a usuária Ana Silva'

    def handle(self, *args, **options):
        # Encontrar a usuária Ana Silva
        try:
            user = User.objects.get(email='ana.silva@silvaadvocacia.com.br')
            self.stdout.write(self.style.SUCCESS(f'✓ Usuária encontrada: {user.username} ({user.email})'))
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR('✗ Usuária ana.silva@silvaadvocacia.com.br não encontrada'))
            self.stdout.write(self.style.WARNING('  Criando usuária...'))
            user = User.objects.create_user(
                username='ana.silva',
                email='ana.silva@silvaadvocacia.com.br',
                password='advogada123',
                first_name='Ana',
                last_name='Silva'
            )
            self.stdout.write(self.style.SUCCESS(f'✓ Usuária criada: {user.username}'))

        # Buscar a organização da usuária através do OrdocUser
        try:
            from ordoc_cloud.models import OrdocUser, UserOrganizationRole
            ordoc_user = OrdocUser.objects.get(user=user)
            self.stdout.write(self.style.SUCCESS(f'✓ OrdocUser encontrado: {ordoc_user.id}'))
            
            # Buscar a organização primária do usuário
            primary_role = UserOrganizationRole.objects.filter(
                user=ordoc_user,
                is_active=True,
                is_primary=True
            ).first()
            
            if primary_role:
                organization = primary_role.organization
                self.stdout.write(self.style.SUCCESS(f'✓ Organização primária encontrada: {organization.corporate_name}'))
            else:
                # Se não tem primária, pega a primeira ativa
                any_role = UserOrganizationRole.objects.filter(
                    user=ordoc_user,
                    is_active=True
                ).first()
                if any_role:
                    organization = any_role.organization
                    self.stdout.write(self.style.SUCCESS(f'✓ Organização encontrada: {organization.corporate_name}'))
                else:
                    self.stdout.write(self.style.ERROR('✗ Usuário não pertence a nenhuma organização'))
                    return
                    
        except OrdocUser.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'✗ OrdocUser não encontrado para {user.email}'))
            self.stdout.write(self.style.WARNING('  O usuário Django existe mas não tem perfil OrdocUser'))
            return
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'✗ Erro ao buscar organização: {e}'))
            return

        # Buscar ou criar departamento
        department, created = Department.objects.get_or_create(
            organization=organization,
            name='Jurídico',
            defaults={
                'description': 'Departamento Jurídico',
                'prn': f'prn:ordoc:department:{organization.id}:juridico',
                'is_active': True
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'✓ Departamento criado: {department.name}'))
        else:
            self.stdout.write(self.style.SUCCESS(f'✓ Departamento encontrado: {department.name}'))

        # Buscar ou criar diretório
        directory, created = Directory.objects.get_or_create(
            department=department,
            name='Documentos',
            defaults={
                'description': 'Documentos Gerais',
                'path': '/Documentos',
                'prn': f'prn:ordoc:directory:{department.id}:documentos',
                'is_active': True,
                'created_by': user
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'✓ Diretório criado: {directory.name}'))
        else:
            self.stdout.write(self.style.SUCCESS(f'✓ Diretório encontrado: {directory.name}'))

        # Caminho dos documentos de teste (dentro do container)
        docs_path = Path('/tmp/ana_silva_docs')
        
        if not docs_path.exists():
            self.stdout.write(self.style.ERROR(f'✗ Diretório não encontrado: {docs_path}'))
            return

        # Listar arquivos
        files = list(docs_path.glob('*'))
        self.stdout.write(self.style.SUCCESS(f'✓ Encontrados {len(files)} arquivos em {docs_path}'))

        # Processar cada arquivo
        uploaded_count = 0
        skipped_count = 0

        for file_path in files:
            if file_path.is_file():
                file_name = file_path.name
                
                # Determinar metadados inteligentes baseados no nome     
                name_lower = file_name.lower()
                
                # Verificar se já existe um documento com este nome
                existing = Document.objects.filter(
                    name=file_name,
                    created_by=user,
                    department=department
                ).first()

                doc_type = 'other'
                has_deadline = False
                deadline_date = None
                is_from_external = False
                external_source = None
                is_public = False
                
                # Regras de inferência
                if any(x in name_lower for x in ['contrato', 'acordo', 'nda']):
                    doc_type = 'contract'
                    has_deadline = True
                    deadline_date = timezone.now() + timezone.timedelta(days=365)
                elif any(x in name_lower for x in ['peticao', 'recurso', 'contestacao']):
                    doc_type = 'petition'
                    has_deadline = True
                    deadline_date = timezone.now() + timezone.timedelta(days=15)
                elif any(x in name_lower for x in ['nota', 'fatura', 'boleto', 'invoice']):
                    doc_type = 'invoice'
                    has_deadline = True
                    deadline_date = timezone.now() + timezone.timedelta(days=5)
                elif 'certidao' in name_lower:
                    doc_type = 'certificate'
                    is_public = True
                elif any(x in name_lower for x in ['edital', 'doe', 'dou']):
                    doc_type = 'edict'
                    is_public = True
                    is_from_external = True
                    external_source = 'Diário Oficial'
                elif 'ata' in name_lower:
                    doc_type = 'minutes'
                elif 'procuracao' in name_lower:
                    doc_type = 'power_of_attorney'
                else:
                    # Fallback randomico para gerar dados ricos
                    types = ['contract', 'petition', 'invoice', 'certificate', 'minutes', 'power_of_attorney']
                    doc_type = random.choice(types)
                    
                    if doc_type in ['contract', 'petition', 'invoice']:
                        has_deadline = True
                        deadline_date = timezone.now() + timezone.timedelta(days=random.randint(5, 365))
                    
                    if doc_type in ['certificate']:
                        is_public = True
                    
                    if random.random() > 0.7:
                        is_from_external = True
                        external_source = 'Sistema Externo'
                
                # Se o documento já existe, vamos ATUALIZAR para garantir os dados novos
                if existing:
                    self.stdout.write(self.style.WARNING(f'  ↻ Atualizando metadados de {file_name}'))
                    existing.document_type = doc_type
                    existing.has_deadline = has_deadline
                    existing.deadline_date = deadline_date
                    existing.is_from_external_source = is_from_external
                    existing.external_source_name = external_source
                    existing.is_public = is_public
                    
                    # Re-rodar auto_detect para garantir tags e criticidade
                    existing.auto_detect_properties()
                    existing.save()
                    skipped_count += 1 # Contamos como skipped para upload, mas foi atualizado
                    continue

                try:
                    # Detectar MIME type
                    mime_type, _ = mimetypes.guess_type(file_path)
                    if not mime_type:
                        mime_type = 'application/octet-stream'

                    # Criar documento
                    with open(file_path, 'rb') as f:
                        django_file = File(f, name=file_name)
                        
                        document = Document(
                            name=file_name,
                            description=f'Documento de teste - {file_name}',
                            file_size=file_path.stat().st_size,
                            mime_type=mime_type,
                            prn=f'prn:ordoc:document:{organization.id}:{user.id}:{file_name}',
                            version=1,
                            is_current_version=True,
                            status='created',
                            document_status='active',
                            unread=True,
                            directory=directory,
                            department=department,
                            created_by=user,
                            updated_by=user,
                            # Novos campos
                            document_type=doc_type,
                            has_deadline=has_deadline,
                            deadline_date=deadline_date,
                            is_from_external_source=is_from_external,
                            external_source_name=external_source,
                            is_public=is_public
                        )
                        
                        # CRÍTICO: Detectar automaticamente tipo, LGPD e criticidade
                        document.auto_detect_properties()
                        
                        # Salvar o arquivo
                        document.file.save(file_name, django_file, save=False)
                        document.save()
                        
                        uploaded_count += 1
                        
                        # Mostrar informações detectadas
                        self.stdout.write(self.style.SUCCESS(
                            f'  ✓ {file_name} ({document.file_size} bytes)\n'
                            f'    Tipo: {document.get_document_type_display()}\n'
                            f'    Dados Sensíveis: {"Sim" if document.contains_sensitive_data else "Não"}\n'
                            f'    Requer Assinatura: {"Sim" if document.requires_signature else "Não"}\n'
                            f'    Criticidade: {document.get_criticality_display()}'
                        ))

                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'  ✗ Erro ao processar {file_name}: {e}'))


        # Resumo
        self.stdout.write(self.style.SUCCESS(f'\n{"="*60}'))
        self.stdout.write(self.style.SUCCESS(f'Resumo:'))
        self.stdout.write(self.style.SUCCESS(f'  • Documentos enviados: {uploaded_count}'))
        self.stdout.write(self.style.SUCCESS(f'  • Documentos pulados: {skipped_count}'))
        self.stdout.write(self.style.SUCCESS(f'  • Total de arquivos: {len(files)}'))
        self.stdout.write(self.style.SUCCESS(f'{"="*60}\n'))
