#!/usr/bin/env python
"""
Script para criar 4 PERSONAS COMPLETAMENTE DIFERENTES
Demonstra a versatilidade da plataforma Ordoc-AI para diferentes profissões e contextos
"""
import os
import django
from datetime import datetime, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ordoc_ai.settings')
django.setup()

from django.contrib.auth.models import User
from ordoc_cloud.models import OrdocUser, UserOrganizationRole
from ordoc_air.models import Organization, Department, Document
from ordoc_flow.models import Procedure, Task, ProcedureTemplate, ExternalRequester, GroupRequester
from django.utils import timezone
import random
import uuid
import uuid

def create_persona_1_advogado():
    """
    PERSONA 1: Dra. Ana Silva - Advogada Trabalhista
    - Trabalha em escritório médio (organização)
    - É sócia/admin do escritório
    - Tem equipe subordinada
    - Documentos: petições, contratos, pareceres jurídicos
    """
    print("\n" + "="*60)
    print("👨‍⚖️ PERSONA 1: Dra. Ana Silva - Advogada Trabalhista")
    print("="*60)

    # Criar organização
    org, _ = Organization.objects.get_or_create(
        cnpj='11222333000144',
        defaults={
            'corporate_name': 'Silva & Associados Advocacia',
            'email': 'contato@silvaadvocacia.com.br',
            'phone': '1133334444',
            'contact_name': 'Ana Silva',
            'contact_phone': '11988887777',
            'subdomain': 'silva-adv',
            'prn': 'ORG-SILVA-ADV',
            'is_active': True,
        }
    )
    print(f"✅ Organização criada: {org.corporate_name}")

    # Criar departamentos
    dept_trabalhista, _ = Department.objects.get_or_create(
        organization=org,
        name='Direito Trabalhista',
        defaults={
            'description': 'Processos trabalhistas e CLT',
            'prn': f'DEPT-{org.prn}-TRAB',
            'is_active': True,
        }
    )
    dept_contratos, _ = Department.objects.get_or_create(
        organization=org,
        name='Contratos Empresariais',
        defaults={
            'description': 'Contratos comerciais e empresariais',
            'prn': f'DEPT-{org.prn}-CONT',
            'is_active': True,
        }
    )
    print(f"✅ Departamentos criados: {dept_trabalhista.name}, {dept_contratos.name}")

    # Criar usuária Ana Silva
    user, created = User.objects.get_or_create(
        email='ana.silva@silvaadvocacia.com.br',
        defaults={
            'username': 'ana.silva',
            'first_name': 'Ana',
            'last_name': 'Silva',
            'is_active': True,
        }
    )
    if created:
        user.set_password('advogada123')
        user.save()

    ordoc_user, _ = OrdocUser.objects.get_or_create(
        user=user,
        defaults={'status': 'active', 'must_change_password': False}
    )

    # Role: Admin (sócia)
    UserOrganizationRole.objects.get_or_create(
        user=ordoc_user,
        organization=org,
        role='admin',
        defaults={'is_active': True, 'is_primary': True}
    )
    print(f"✅ Usuária criada: {user.email} (Admin/Sócia)")
    
    # Criar dependencias obrigatórias para Procedure
    group_req, _ = GroupRequester.objects.get_or_create(organization=org, name='Equipe Jurídica', defaults={'description': 'Equipe'})
    client_req, _ = ExternalRequester.objects.get_or_create(organization=org, name='Cliente Padrão', email='cli@ex.com')

    # Criar documentos jurídicos
    doc_types = [
        ('Petição Inicial - Reclamação Trabalhista Cliente A', 'Reclamação trabalhista por demissão sem justa causa'),
        ('Contrato de Prestação de Serviços - Empresa XYZ', 'Contrato de consultoria jurídica mensal'),
        ('Parecer Jurídico - Rescisão Contratual', 'Análise de viabilidade de rescisão'),
        ('Procuração Ad Judicia - Cliente B', 'Procuração para representação judicial'),
        ('Acordo Trabalhista - Caso 2024-001', 'Termo de acordo homologado'),
        ('Petição de Recurso Ordinário', 'Recurso contra sentença desfavorável'),
        ('Contrato de Sociedade - Novo Sócio', 'Alteração contratual para entrada de sócio'),
    ]

    for title, desc in doc_types:
        Document.objects.create(
            created_by=user,
            department=dept_trabalhista if 'Trabalhista' in title or 'Reclamação' in title else dept_contratos,
            name=f"{title.replace(' ', '_')}.pdf",
            description=f"{title} - {desc}",
            file_size=random.randint(500000, 5000000),
            mime_type='application/pdf',
            document_status='active',
            prn=f"DOC-{org.prn}-{uuid.uuid4()}",
        )
    print(f"✅ Criados {len(doc_types)} documentos jurídicos")

    # Criar procedures e tasks
    template, _ = ProcedureTemplate.objects.get_or_create(
        organization=org,
        name='Processo Judicial Trabalhista',
        defaults={'description': 'Template para processos trabalhistas', 'status': 'active'}
    )

    procedures_data = [
        ('Reclamação Trabalhista - Cliente A vs Empresa XYZ', 'high', 6),
        ('Negociação Acordo Coletivo - Sindicato', 'normal', 4),
        ('Assessoria CLT - Empresa ABC', 'normal', 3),
    ]

    for proc_name, priority, num_tasks in procedures_data:
        proc = Procedure.objects.create(
            organization=org,
            procedure_template_name=proc_name,
            status='running',
            priority=priority,
            procedure_template=template,
            requester=client_req,
            responsible_group=group_req,
            created_by=ordoc_user,
        )

        task_names = [
            'Análise de documentação do cliente',
            'Elaboração de petição inicial',
            'Protocolo na Justiça do Trabalho',
            'Preparação para audiência',
            'Negociação de acordo',
            'Acompanhamento de sentença',
        ]

        for i in range(num_tasks):
            Task.objects.create(
                procedure=proc,
                name=task_names[i % len(task_names)],
                description=f'Atividade relacionado ao caso: {proc_name}',
                status=random.choice(['running', 'started']),
                priority=priority,
                created_by=ordoc_user,
                deadline=timezone.now() + timedelta(days=random.randint(3, 30)),
            )

    print(f"✅ Criadas {len(procedures_data)} procedures e {sum(p[2] for p in procedures_data)} tasks")

    return {
        'user': user,
        'ordoc_user': ordoc_user,
        'organization': org,
        'departments': [dept_trabalhista, dept_contratos],
    }


def create_persona_2_medico():
    """
    PERSONA 2: Dr. Carlos Mendes - Médico Cardiologista
    - Clínica própria (organização)
    - É dono/admin da clínica
    - Atende pacientes (sem equipe grande)
    - Documentos: prontuários, laudos, prescrições
    """
    print("\n" + "="*60)
    print("👨‍⚕️ PERSONA 2: Dr. Carlos Mendes - Médico Cardiologista")
    print("="*60)

    # Criar organização
    org, _ = Organization.objects.get_or_create(
        cnpj='22333444000155',
        defaults={
            'corporate_name': 'Clínica CardioVida - Dr. Carlos Mendes',
            'email': 'contato@cardiovida.med.br',
            'phone': '1144445555',
            'contact_name': 'Dr. Carlos Mendes',
            'contact_phone': '11977776666',
            'subdomain': 'cardiovida',
            'prn': 'ORG-CARDIO',
            'is_active': True,
        }
    )
    print(f"✅ Organização criada: {org.corporate_name}")

    # Criar departamento único
    dept_cardio, _ = Department.objects.get_or_create(
        organization=org,
        name='Cardiologia',
        defaults={
            'description': 'Atendimentos e procedimentos cardiológicos',
            'prn': f'DEPT-{org.prn}-CARDIO',
            'is_active': True,
        }
    )
    print(f"✅ Departamento criado: {dept_cardio.name}")

    # Criar usuário Dr. Carlos
    user, created = User.objects.get_or_create(
        email='dr.carlos@cardiovida.med.br',
        defaults={
            'username': 'dr.carlos',
            'first_name': 'Carlos',
            'last_name': 'Mendes',
            'is_active': True,
        }
    )
    if created:
        user.set_password('medico123')
        user.save()

    ordoc_user, _ = OrdocUser.objects.get_or_create(
        user=user,
        defaults={'status': 'active', 'must_change_password': False}
    )

    # Role: Admin (dono da clínica)
    UserOrganizationRole.objects.get_or_create(
        user=ordoc_user,
        organization=org,
        role='admin',
        defaults={'is_active': True, 'is_primary': True}
    )
    print(f"✅ Usuário criado: {user.email} (Admin/Dono)")

    # Criar dependencias obrigatórias para Procedure
    group_req, _ = GroupRequester.objects.get_or_create(organization=org, name='Equipe Médica', defaults={'description': 'Equipe'})
    client_req, _ = ExternalRequester.objects.get_or_create(organization=org, name='Paciente Padrão', email='pac@ex.com')

    # Criar documentos médicos
    doc_types = [
        ('Prontuário Médico - Paciente João Silva', 'Histórico de consultas cardiológicas'),
        ('Laudo de Ecocardiograma - Paciente Maria Santos', 'Exame ecocardiográfico com doppler'),
        ('Prescrição Médica - Tratamento Hipertensão', 'Medicamentos para controle de pressão arterial'),
        ('Resultado Holter 24h - Paciente Pedro Costa', 'Monitoramento cardíaco de 24 horas'),
        ('Relatório de Consulta - Check-up Cardiológico', 'Avaliação cardiológica preventiva'),
        ('Laudo de Teste Ergométrico', 'Teste de esforço físico controlado'),
        ('Solicitação de Exames Complementares', 'Pedido de exames laboratoriais'),
        ('Atestado Médico - Aptidão para Exercícios', 'Liberação para atividades físicas'),
        ('Protocolo de Acompanhamento Pós-Infarto', 'Plano de recuperação cardíaca'),
    ]

    for title, desc in doc_types:
        Document.objects.create(
            created_by=user,
            department=dept_cardio,
            name=f"{title.replace(' ', '_')}.pdf",
            description=f"{title} - {desc}",
            file_size=random.randint(200000, 2000000),
            mime_type='application/pdf',
            document_status='active',
            prn=f"DOC-{org.prn}-{uuid.uuid4()}",
        )
    print(f"✅ Criados {len(doc_types)} documentos médicos")

    # Criar procedures (atendimentos/acompanhamentos)
    template, _ = ProcedureTemplate.objects.get_or_create(
        organization=org,
        name='Acompanhamento Cardiológico',
        defaults={'description': 'Template para acompanhamento de pacientes', 'status': 'active'}
    )

    procedures_data = [
        ('Acompanhamento Pós-Infarto - Paciente João Silva', 'high', 5),
        ('Controle de Hipertensão - Paciente Maria Santos', 'normal', 3),
        ('Check-up Preventivo - Paciente Pedro Costa', 'normal', 2),
        ('Avaliação Pré-Cirúrgica - Paciente Ana Lima', 'high', 4),
    ]

    for proc_name, priority, num_tasks in procedures_data:
        proc = Procedure.objects.create(
            organization=org,
            procedure_template_name=proc_name,
            status='running',
            priority=priority,
            procedure_template=template,
            requester=client_req,
            responsible_group=group_req,
            created_by=ordoc_user,
        )

        task_names = [
            'Consulta inicial e anamnese',
            'Solicitar exames complementares',
            'Análise de resultados',
            'Consulta de retorno',
            'Ajuste de medicação',
        ]

        for i in range(num_tasks):
            Task.objects.create(
                procedure=proc,
                name=task_names[i % len(task_names)],
                description=f'Atividade do acompanhamento: {proc_name}',
                status=random.choice(['running', 'started', 'finished']),
                priority=priority,
                created_by=ordoc_user,
                deadline=timezone.now() + timedelta(days=random.randint(7, 60)),
            )

    print(f"✅ Criadas {len(procedures_data)} procedures e {sum(p[2] for p in procedures_data)} tasks")

    return {
        'user': user,
        'ordoc_user': ordoc_user,
        'organization': org,
        'departments': [dept_cardio],
    }


def create_persona_3_servidor_publico():
    """
    PERSONA 3: Roberto Oliveira - Servidor Público (Analista)
    - Trabalha em órgão público (organização)
    - É gerente de departamento (department_manager)
    - Parte de uma equipe maior
    - Documentos: editais, processos administrativos, pareceres técnicos
    """
    print("\n" + "="*60)
    print("👨‍💼 PERSONA 3: Roberto Oliveira - Servidor Público (Analista)")
    print("="*60)

    # Criar organização pública
    org, _ = Organization.objects.get_or_create(
        cnpj='33444555000166',
        defaults={
            'corporate_name': 'Prefeitura Municipal de São Paulo - Secretaria de Obras',
            'email': 'obras@prefeitura.sp.gov.br',
            'phone': '1155556666',
            'contact_name': 'Secretário de Obras',
            'contact_phone': '11966665555',
            'subdomain': 'pmsp-obras',
            'prn': 'ORG-PMSP-OBRAS',
            'is_active': True,
        }
    )
    print(f"✅ Organização criada: {org.corporate_name}")

    # Criar departamentos
    dept_licitacoes, _ = Department.objects.get_or_create(
        organization=org,
        name='Licitações e Contratos',
        defaults={
            'description': 'Processos licitatórios e contratos administrativos',
            'prn': f'DEPT-{org.prn}-LIC',
            'is_active': True,
        }
    )
    dept_fiscalizacao, _ = Department.objects.get_or_create(
        organization=org,
        name='Fiscalização de Obras',
        defaults={
            'description': 'Fiscalização e acompanhamento de obras públicas',
            'prn': f'DEPT-{org.prn}-FISC',
            'is_active': True,
        }
    )
    print(f"✅ Departamentos criados: {dept_licitacoes.name}, {dept_fiscalizacao.name}")

    # Criar usuário Roberto
    user, created = User.objects.get_or_create(
        email='roberto.oliveira@prefeitura.sp.gov.br',
        defaults={
            'username': 'roberto.oliveira',
            'first_name': 'Roberto',
            'last_name': 'Oliveira',
            'is_active': True,
        }
    )
    if created:
        user.set_password('servidor123')
        user.save()

    ordoc_user, _ = OrdocUser.objects.get_or_create(
        user=user,
        defaults={'status': 'active', 'must_change_password': False}
    )

    # Role: Department Manager (gerente de departamento)
    UserOrganizationRole.objects.get_or_create(
        user=ordoc_user,
        organization=org,
        role='department_manager',
        defaults={'is_active': True, 'is_primary': True}
    )
    print(f"✅ Usuário criado: {user.email} (Gerente de Departamento)")

    # Criar dependencias obrigatórias para Procedure
    group_req, _ = GroupRequester.objects.get_or_create(organization=org, name='Equipe Obras', defaults={'description': 'Equipe'})
    client_req, _ = ExternalRequester.objects.get_or_create(organization=org, name='Contribuinte Padrão', email='cidadao@ex.com')

    # Criar documentos públicos
    doc_types = [
        ('Edital de Licitação - Pavimentação Avenida Principal', 'Pregão eletrônico para obra de pavimentação'),
        ('Processo Administrativo 2024-0123 - Contratação Empresa', 'Processo de contratação de empreiteira'),
        ('Parecer Técnico - Viabilidade Obra Ponte Nova', 'Análise técnica de projeto de engenharia'),
        ('Termo de Referência - Fiscalização de Obras', 'Especificações para contratação de fiscalização'),
        ('Relatório de Vistoria - Obra Centro Cultural', 'Vistoria técnica mensal de andamento'),
        ('Ata de Julgamento - Licitação 001/2024', 'Resultado de processo licitatório'),
        ('Contrato Administrativo 045/2024', 'Contrato de execução de obra pública'),
        ('Notificação à Empresa Contratada', 'Apontamento de irregularidades'),
        ('Medição de Obra - Dezembro 2024', 'Planilha de medição e pagamento'),
    ]

    for title, desc in doc_types:
        Document.objects.create(
            created_by=user,
            department=dept_licitacoes if 'Licitação' in title or 'Edital' in title else dept_fiscalizacao,
            name=f"{title.replace(' ', '_')}.pdf",
            description=f"{title} - {desc}",
            file_size=random.randint(1000000, 8000000),
            mime_type='application/pdf',
            document_status='active',
            prn=f"DOC-{org.prn}-{uuid.uuid4()}",
        )
    print(f"✅ Criados {len(doc_types)} documentos públicos")

    # Criar procedures (processos administrativos)
    template, _ = ProcedureTemplate.objects.get_or_create(
        organization=org,
        name='Processo Licitatório',
        defaults={'description': 'Template para licitações públicas', 'status': 'active'}
    )

    procedures_data = [
        ('Licitação - Pavimentação Avenida Principal', 'high', 8),
        ('Fiscalização - Obra Centro Cultural', 'normal', 4),
        ('Processo Administrativo - Contratação Consultoria', 'normal', 5),
    ]

    for proc_name, priority, num_tasks in procedures_data:
        proc = Procedure.objects.create(
            organization=org,
            procedure_template_name=proc_name,
            status='running',
            priority=priority,
            procedure_template=template,
            requester=client_req,
            responsible_group=group_req,
            created_by=ordoc_user,
        )

        task_names = [
            'Elaboração de Termo de Referência',
            'Abertura de processo administrativo',
            'Publicação de edital',
            'Recebimento de propostas',
            'Julgamento técnico',
            'Homologação do resultado',
            'Assinatura de contrato',
            'Fiscalização de execução',
        ]

        for i in range(num_tasks):
            Task.objects.create(
                procedure=proc,
                name=task_names[i % len(task_names)],
                description=f'Etapa do processo: {proc_name}',
                status=random.choice(['running', 'started', 'finished']),
                priority=priority,
                created_by=ordoc_user,
                deadline=timezone.now() + timedelta(days=random.randint(10, 90)),
            )

    print(f"✅ Criadas {len(procedures_data)} procedures e {sum(p[2] for p in procedures_data)} tasks")

    return {
        'user': user,
        'ordoc_user': ordoc_user,
        'organization': org,
        'departments': [dept_licitacoes, dept_fiscalizacao],
    }


def create_persona_4_freelancer():
    """
    PERSONA 4: Juliana Costa - Consultora Freelancer (Designer Gráfica)
    - Trabalha sozinha (SEM organização formal)
    - É autônoma/freelancer
    - Não tem equipe (organization_member)
    - Documentos: propostas, briefings, artes finais
    """
    print("\n" + "="*60)
    print("👨‍💻 PERSONA 4: Juliana Costa - Designer Gráfica Freelancer")
    print("="*60)

    # NÃO criar organização (freelancer trabalha sozinha)
    # Criar uma "organização pessoal" apenas para compatibilidade do sistema
    org, _ = Organization.objects.get_or_create(
        cnpj='44555666000177',  # CPF fictício no formato CNPJ
        defaults={
            'corporate_name': 'Juliana Costa - Design Gráfico (MEI)',
            'email': 'contato@julianadesign.com.br',
            'phone': '11966667777',
            'contact_name': 'Juliana Costa',
            'contact_phone': '11966667777',
            'subdomain': 'juliana-design',
            'prn': 'ORG-JUCOSTA',
            'is_active': True,
        }
    )
    print(f"✅ MEI criada: {org.corporate_name}")

    # Criar departamento único (projetos)
    dept_projetos, _ = Department.objects.get_or_create(
        organization=org,
        name='Projetos de Design',
        defaults={
            'description': 'Projetos diversos de identidade visual e design',
            'prn': f'DEPT-{org.prn}-PROJ',
            'is_active': True,
        }
    )
    print(f"✅ Departamento criado: {dept_projetos.name}")

    # Criar usuária Juliana
    user, created = User.objects.get_or_create(
        email='juliana.costa@julianadesign.com.br',
        defaults={
            'username': 'juliana.costa',
            'first_name': 'Juliana',
            'last_name': 'Costa',
            'is_active': True,
        }
    )
    if created:
        user.set_password('designer123')
        user.save()

    ordoc_user, _ = OrdocUser.objects.get_or_create(
        user=user,
        defaults={'status': 'active', 'must_change_password': False}
    )

    # Role: Organization Member (nível mais baixo - freelancer)
    # Ou poderia ser admin já que é MEI, mas vou usar member para demonstrar
    UserOrganizationRole.objects.get_or_create(
        user=ordoc_user,
        organization=org,
        role='organization_member',
        defaults={'is_active': True, 'is_primary': True}
    )
    print(f"✅ Usuária criada: {user.email} (Freelancer/MEI)")

    # Criar dependencias obrigatórias para Procedure
    group_req, _ = GroupRequester.objects.get_or_create(organization=org, name='Eu Mesma', defaults={'description': 'Equipe'})
    client_req, _ = ExternalRequester.objects.get_or_create(organization=org, name='Cliente Freelancer', email='cli_free@ex.com')

    # Criar documentos de design
    doc_types = [
        ('Proposta Comercial - Identidade Visual Restaurante XYZ', 'Proposta de criação de logo e materiais'),
        ('Briefing - Projeto Branding Startup Tech', 'Informações do cliente para desenvolvimento'),
        ('Arte Final - Logo Empresa ABC', 'Arquivo vetorizado final da logo'),
        ('Mockup - Material Gráfico Evento 2024', 'Visualização de aplicações da marca'),
        ('Contrato de Prestação de Serviços - Cliente DEF', 'Contrato de trabalho freelancer'),
        ('Orçamento - Criação de Site Institucional', 'Proposta de desenvolvimento web'),
        ('Portfólio - Projetos 2024', 'Showcase de trabalhos realizados'),
        ('NFSe - Serviço Prestado Cliente GHI', 'Nota fiscal de serviços eletrônica'),
        ('Briefing Criativo - Campanha Redes Sociais', 'Direcionamento para posts e stories'),
        ('Apresentação - Proposta Redesign Marca', 'Slides de apresentação ao cliente'),
    ]

    for title, desc in doc_types:
        Document.objects.create(
            created_by=user,
            department=dept_projetos,
            name=f"{title.replace(' ', '_')}.pdf",
            description=f"{title} - {desc}",
            file_size=random.randint(500000, 10000000),
            mime_type='application/pdf',
            document_status='active',
            prn=f"DOC-{org.prn}-{uuid.uuid4()}",
        )
    print(f"✅ Criados {len(doc_types)} documentos de design")

    # Criar procedures (projetos de clientes)
    template, _ = ProcedureTemplate.objects.get_or_create(
        organization=org,
        name='Projeto de Design',
        defaults={'description': 'Template para projetos de design gráfico', 'status': 'active'}
    )

    procedures_data = [
        ('Identidade Visual - Restaurante XYZ', 'high', 6),
        ('Branding Completo - Startup Tech', 'high', 8),
        ('Material Gráfico - Evento 2024', 'normal', 4),
        ('Redesign de Marca - Empresa Tradicional', 'normal', 5),
    ]

    for proc_name, priority, num_tasks in procedures_data:
        proc = Procedure.objects.create(
            organization=org,
            procedure_template_name=proc_name,
            status='running',
            priority=priority,
            procedure_template=template,
            requester=client_req,
            responsible_group=group_req,
            created_by=ordoc_user,
        )

        task_names = [
            'Reunião de briefing com cliente',
            'Pesquisa de referências',
            'Criação de esboços iniciais',
            'Desenvolvimento de conceitos',
            'Apresentação ao cliente',
            'Revisões solicitadas',
            'Finalização de artes',
            'Entrega de arquivos finais',
        ]

        for i in range(num_tasks):
            Task.objects.create(
                procedure=proc,
                name=task_names[i % len(task_names)],
                description=f'Etapa do projeto: {proc_name}',
                status=random.choice(['running', 'started', 'finished']),
                priority=priority,
                created_by=ordoc_user,
                deadline=timezone.now() + timedelta(days=random.randint(3, 45)),
            )

    print(f"✅ Criadas {len(procedures_data)} procedures e {sum(p[2] for p in procedures_data)} tasks")

    return {
        'user': user,
        'ordoc_user': ordoc_user,
        'organization': org,
        'departments': [dept_projetos],
    }


def main():
    print("\n" + "="*60)
    print("🌱 SEED: 4 PERSONAS COMPLETAMENTE DIFERENTES")
    print("Demonstrando a versatilidade da plataforma Ordoc-AI")
    print("="*60)

    personas = []

    # Criar cada persona
    personas.append(create_persona_1_advogado())
    personas.append(create_persona_2_medico())
    personas.append(create_persona_3_servidor_publico())
    personas.append(create_persona_4_freelancer())

    # Resumo final
    print("\n" + "="*60)
    print("✅ SEED CONCLUÍDO COM SUCESSO!")
    print("="*60)

    print("\n📊 RESUMO GERAL:")
    print(f"Organizations: {Organization.objects.count()}")
    print(f"Departments: {Department.objects.count()}")
    print(f"Users: {OrdocUser.objects.count()}")
    print(f"Documents: {Document.objects.count()}")
    print(f"Procedures: {Procedure.objects.count()}")
    print(f"Tasks: {Task.objects.count()}")

    print("\n👥 PERSONAS CRIADAS:")
    print("─" * 60)

    personas_info = [
        {
            'nome': 'Dra. Ana Silva',
            'email': 'ana.silva@silvaadvocacia.com.br',
            'profissao': 'Advogada Trabalhista',
            'role': 'Admin (Sócia)',
            'organizacao': 'Silva & Associados Advocacia',
            'contexto': 'Escritório de advocacia com equipe',
        },
        {
            'nome': 'Dr. Carlos Mendes',
            'email': 'dr.carlos@cardiovida.med.br',
            'profissao': 'Médico Cardiologista',
            'role': 'Admin (Dono)',
            'organizacao': 'Clínica CardioVida',
            'contexto': 'Clínica própria, atendimento médico',
        },
        {
            'nome': 'Roberto Oliveira',
            'email': 'roberto.oliveira@prefeitura.sp.gov.br',
            'profissao': 'Servidor Público (Analista)',
            'role': 'Department Manager (Gerente)',
            'organizacao': 'Prefeitura Municipal - Secretaria de Obras',
            'contexto': 'Órgão público, licitações e fiscalização',
        },
        {
            'nome': 'Juliana Costa',
            'email': 'juliana.costa@julianadesign.com.br',
            'profissao': 'Designer Gráfica Freelancer',
            'role': 'Organization Member (MEI)',
            'organizacao': 'MEI (Microempreendedora Individual)',
            'contexto': 'Freelancer autônoma, projetos diversos',
        },
    ]

    for i, info in enumerate(personas_info, 1):
        print(f"\n{i}. {info['profissao']}")
        print(f"   Nome: {info['nome']}")
        print(f"   Email: {info['email']}")
        print(f"   Senha: advogada123 / medico123 / servidor123 / designer123")
        print(f"   Role: {info['role']}")
        print(f"   Organização: {info['organizacao']}")
        print(f"   Contexto: {info['contexto']}")

    print("\n" + "="*60)
    print("🎉 4 CENÁRIOS DIFERENTES PRONTOS PARA TESTE!")
    print("="*60 + "\n")

if __name__ == '__main__':
    main()
