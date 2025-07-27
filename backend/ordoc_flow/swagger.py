from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample
from drf_spectacular.types import OpenApiTypes
from rest_framework import status


# Documentação para ProcedureViewSet
procedure_list_schema = extend_schema(
    summary="Lista procedimentos",
    description="Retorna uma lista paginada de procedimentos da organização atual com filtros opcionais.",
    parameters=[
        OpenApiParameter(
            name='status',
            type=OpenApiTypes.STR,
            location=OpenApiParameter.QUERY,
            description='Filtrar por status',
            enum=['draft', 'running', 'started', 'finished', 'archived']
        ),
        OpenApiParameter(
            name='priority',
            type=OpenApiTypes.STR,
            location=OpenApiParameter.QUERY,
            description='Filtrar por prioridade',
            enum=['normal', 'high']
        ),
        OpenApiParameter(
            name='search',
            type=OpenApiTypes.STR,
            location=OpenApiParameter.QUERY,
            description='Buscar por número do processo ou nome do template'
        ),
    ],
    examples=[
        OpenApiExample(
            'Exemplo de resposta',
            value={
                "count": 25,
                "next": "http://api.example.com/api/ordoc-flow/api/procedures/?page=2",
                "previous": None,
                "results": [
                    {
                        "id": "550e8400-e29b-41d4-a716-446655440000",
                        "process_number": "1/2024",
                        "procedure_template_name": "Solicitação de Férias",
                        "status": "running",
                        "priority": "normal",
                        "created_at": "2024-01-15T10:30:00Z",
                        "deadline": "2024-01-30",
                        "created_by_name": "João Silva",
                        "requester_name": "Maria Santos",
                        "responsible_group_name": "RH"
                    }
                ]
            }
        )
    ]
)

procedure_stats_schema = extend_schema(
    summary="Estatísticas de procedimentos",
    description="Retorna estatísticas agregadas dos procedimentos por status.",
    responses={
        200: {
            'description': 'Estatísticas dos procedimentos',
            'examples': {
                'application/json': {
                    'total': 150,
                    'draft': 10,
                    'running': 45,
                    'started': 30,
                    'finished': 55,
                    'archived': 10
                }
            }
        }
    }
)

# Documentação para TaskViewSet
task_my_tasks_schema = extend_schema(
    summary="Minhas tarefas",
    description="Retorna tarefas atribuídas ao usuário atual ou aos grupos dos quais faz parte.",
    parameters=[
        OpenApiParameter(
            name='status',
            type=OpenApiTypes.STR,
            location=OpenApiParameter.QUERY,
            description='Filtrar por status',
            enum=['draft', 'running', 'started', 'finished', 'refused']
        ),
    ],
    examples=[
        OpenApiExample(
            'Exemplo de resposta',
            value={
                "count": 8,
                "results": [
                    {
                        "id": "660e8400-e29b-41d4-a716-446655440000",
                        "name": "Análise de Documentos",
                        "description": "Revisar documentos enviados pelo solicitante",
                        "status": "running",
                        "priority": "high",
                        "deadline": "2024-01-20",
                        "procedure_number": "1/2024",
                        "created_at": "2024-01-15T14:20:00Z"
                    }
                ]
            }
        )
    ]
)

# Documentação para WorkflowSearchViewSet
search_schema = extend_schema(
    summary="Busca avançada no workflow",
    description="Realiza busca full-text em procedimentos, tarefas e templates usando Apache Solr.",
    parameters=[
        OpenApiParameter(
            name='q',
            type=OpenApiTypes.STR,
            location=OpenApiParameter.QUERY,
            description='Termo de busca',
            required=True
        ),
        OpenApiParameter(
            name='content_type',
            type=OpenApiTypes.STR,
            location=OpenApiParameter.QUERY,
            description='Tipos de conteúdo para buscar',
            enum=['procedure', 'task', 'procedure_template'],
            many=True
        ),
        OpenApiParameter(
            name='start',
            type=OpenApiTypes.INT,
            location=OpenApiParameter.QUERY,
            description='Offset para paginação (padrão: 0)'
        ),
        OpenApiParameter(
            name='rows',
            type=OpenApiTypes.INT,
            location=OpenApiParameter.QUERY,
            description='Número de resultados por página (padrão: 20)'
        ),
        OpenApiParameter(
            name='sort',
            type=OpenApiTypes.STR,
            location=OpenApiParameter.QUERY,
            description='Campo para ordenação (ex: created_at desc)'
        ),
    ],
    examples=[
        OpenApiExample(
            'Busca por aprovação',
            value={
                "docs": [
                    {
                        "id": "procedure_550e8400-e29b-41d4-a716-446655440000",
                        "content_type": "procedure",
                        "title": "Processo de Aprovação Orçamentária",
                        "process_number": "15/2024",
                        "status": "running",
                        "score": 2.5,
                        "created_at": "2024-01-10T09:15:00Z"
                    }
                ],
                "numFound": 12,
                "start": 0,
                "rows": 20
            }
        )
    ]
)

suggestions_schema = extend_schema(
    summary="Sugestões de busca",
    description="Retorna sugestões baseadas em termos frequentes e facetas.",
    parameters=[
        OpenApiParameter(
            name='q',
            type=OpenApiTypes.STR,
            location=OpenApiParameter.QUERY,
            description='Termo parcial para sugestões'
        ),
        OpenApiParameter(
            name='limit',
            type=OpenApiTypes.INT,
            location=OpenApiParameter.QUERY,
            description='Número máximo de sugestões (padrão: 10)'
        ),
    ],
    examples=[
        OpenApiExample(
            'Sugestões para "aprov"',
            value={
                "title": [
                    {"value": "aprovação", "count": 15},
                    {"value": "aprovado", "count": 8}
                ],
                "tags": [
                    {"value": "aprovação_financeira", "count": 12},
                    {"value": "aprovação_rh", "count": 6}
                ]
            }
        )
    ]
)

# Documentação para BatchOperationViewSet
batch_execute_schema = extend_schema(
    summary="Executa operação em lote",
    description="Executa uma operação em múltiplos objetos simultaneamente.",
    request={
        'application/json': {
            'type': 'object',
            'properties': {
                'action': {
                    'type': 'string',
                    'enum': ['archive', 'finish', 'assign', 'change_priority', 'add_comment'],
                    'description': 'Tipo de operação a executar'
                },
                'object_ids': {
                    'type': 'array',
                    'items': {'type': 'string', 'format': 'uuid'},
                    'description': 'Lista de IDs dos objetos'
                },
                'assignee_id': {
                    'type': 'string',
                    'format': 'uuid',
                    'description': 'ID do usuário para atribuição (opcional)'
                },
                'priority': {
                    'type': 'string',
                    'enum': ['normal', 'high'],
                    'description': 'Nova prioridade (opcional)'
                },
                'comment': {
                    'type': 'string',
                    'description': 'Comentário a adicionar (opcional)'
                }
            },
            'required': ['action', 'object_ids']
        }
    },
    examples=[
        OpenApiExample(
            'Arquivar procedimentos',
            value={
                "action": "archive",
                "object_ids": [
                    "550e8400-e29b-41d4-a716-446655440000",
                    "660e8400-e29b-41d4-a716-446655440001"
                ]
            }
        ),
        OpenApiExample(
            'Adicionar comentário em lote',
            value={
                "action": "add_comment",
                "object_ids": [
                    "770e8400-e29b-41d4-a716-446655440000"
                ],
                "comment": "Revisão concluída conforme solicitado"
            }
        )
    ],
    responses={
        200: {
            'description': 'Resultado da operação em lote',
            'examples': {
                'application/json': {
                    'success_count': 2,
                    'error_count': 0,
                    'errors': [],
                    'processed_objects': [
                        "550e8400-e29b-41d4-a716-446655440000",
                        "660e8400-e29b-41d4-a716-446655440001"
                    ]
                }
            }
        }
    }
)

# Documentação para WorkflowDashboardViewSet
dashboard_overview_schema = extend_schema(
    summary="Visão geral do workflow",
    description="Retorna estatísticas e métricas consolidadas do workflow da organização.",
    responses={
        200: {
            'description': 'Dashboard do workflow',
            'examples': {
                'application/json': {
                    'procedure_stats': {
                        'total': 150,
                        'draft': 10,
                        'running': 45,
                        'finished': 85,
                        'archived': 10
                    },
                    'task_stats': {
                        'total': 320,
                        'draft': 25,
                        'running': 80,
                        'finished': 200,
                        'refused': 15
                    },
                    'pending_approvals': 12,
                    'overdue_tasks': 8,
                    'recent_activities': [
                        {
                            'id': '550e8400-e29b-41d4-a716-446655440000',
                            'type': 'procedure_created',
                            'title': 'Procedimento 25/2024 criado',
                            'description': 'Solicitação de Férias por João Silva',
                            'created_at': '2024-01-15T16:30:00Z',
                            'status': 'running'
                        }
                    ]
                }
            }
        }
    }
)

# Documentação para ApprovalInstanceViewSet
approval_pending_schema = extend_schema(
    summary="Aprovações pendentes",
    description="Lista aprovações que estão pendentes para o usuário atual.",
    responses={
        200: {
            'description': 'Lista de aprovações pendentes',
            'examples': {
                'application/json': {
                    'count': 5,
                    'results': [
                        {
                            'id': '880e8400-e29b-41d4-a716-446655440000',
                            'workflow_name': 'Aprovação Orçamentária',
                            'status': 'in_progress',
                            'requested_by_name': 'Maria Santos',
                            'created_at': '2024-01-14T11:20:00Z',
                            'step_instances': [
                                {
                                    'id': '990e8400-e29b-41d4-a716-446655440000',
                                    'approval_step_name': 'Aprovação Gerencial',
                                    'status': 'pending',
                                    'due_date': '2024-01-18T23:59:59Z'
                                }
                            ]
                        }
                    ]
                }
            }
        }
    }
)

# Documentação para WorkflowAnalyticsViewSet
analytics_workflow_metrics_schema = extend_schema(
    summary="Métricas detalhadas do workflow",
    description="Retorna métricas detalhadas de performance e uso do workflow.",
    parameters=[
        OpenApiParameter(
            name='days',
            type=OpenApiTypes.INT,
            location=OpenApiParameter.QUERY,
            description='Período de análise em dias (padrão: 30)'
        ),
    ],
    responses={
        200: {
            'description': 'Métricas do workflow',
            'examples': {
                'application/json': {
                    'procedure_metrics': {
                        'total': 150,
                        'created_period': 25,
                        'avg_completion_days': 7.5,
                        'by_status': [
                            {'status': 'finished', 'count': 85},
                            {'status': 'running', 'count': 45}
                        ]
                    },
                    'task_metrics': {
                        'total': 320,
                        'created_period': 68,
                        'overdue': 8,
                        'by_status': [
                            {'status': 'finished', 'count': 200},
                            {'status': 'running', 'count': 80}
                        ]
                    },
                    'template_metrics': {
                        'total': 15,
                        'active': 12,
                        'most_used': [
                            {'name': 'Solicitação de Férias', 'usage_count': 45},
                            {'name': 'Aprovação Orçamentária', 'usage_count': 32}
                        ]
                    },
                    'period_days': 30,
                    'generated_at': '2024-01-15T18:45:00Z'
                }
            }
        }
    }
)

# Schema tags para organização da documentação
WORKFLOW_TAGS = {
    'procedures': 'Procedimentos',
    'tasks': 'Tarefas', 
    'templates': 'Templates',
    'approvals': 'Sistema de Aprovação',
    'notifications': 'Notificações',
    'search': 'Busca Avançada',
    'analytics': 'Analytics e Relatórios',
    'batch': 'Operações em Lote',
    'dashboard': 'Dashboard'
}

# Exemplos de schemas de erro padrão
ERROR_RESPONSES = {
    400: {
        'description': 'Requisição inválida',
        'examples': {
            'application/json': {
                'error': 'Dados inválidos fornecidos',
                'details': {
                    'field_name': ['Este campo é obrigatório.']
                }
            }
        }
    },
    401: {
        'description': 'Não autenticado',
        'examples': {
            'application/json': {
                'error': 'Token de autenticação não fornecido ou inválido'
            }
        }
    },
    403: {
        'description': 'Acesso negado',
        'examples': {
            'application/json': {
                'error': 'Você não tem permissão para acessar este recurso'
            }
        }
    },
    404: {
        'description': 'Não encontrado',
        'examples': {
            'application/json': {
                'error': 'Recurso não encontrado'
            }
        }
    },
    500: {
        'description': 'Erro interno do servidor',
        'examples': {
            'application/json': {
                'error': 'Erro interno do servidor. Tente novamente mais tarde.'
            }
        }
    }
}
