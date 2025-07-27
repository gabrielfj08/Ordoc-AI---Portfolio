import pysolr
from django.conf import settings
from django.utils import timezone
from django.contrib.contenttypes.models import ContentType
import logging
import json

from .models import Procedure, Task, ProcedureTemplate
from .approval_models import TaskComment

logger = logging.getLogger(__name__)


class WorkflowSolrService:
    """
    Serviço para integração do workflow com Apache Solr.
    Gerencia indexação e busca de procedimentos, tarefas e templates.
    """
    
    def __init__(self):
        self.solr_url = getattr(settings, 'SOLR_URL', 'http://localhost:8983/solr/')
        self.core_name = 'ordoc_workflow'
        self.solr = pysolr.Solr(f'{self.solr_url}{self.core_name}/', always_commit=True)
    
    def index_procedure(self, procedure):
        """
        Indexa um procedimento no Solr.
        """
        try:
            # Prepara os dados para indexação
            doc = {
                'id': f'procedure_{procedure.id}',
                'content_type': 'procedure',
                'object_id': str(procedure.id),
                'organization_id': str(procedure.organization.id),
                'title': procedure.procedure_template_name,
                'process_number': procedure.process_number,
                'description': procedure.procedure_template.description if procedure.procedure_template else '',
                'content': self._extract_procedure_content(procedure),
                'status': procedure.status,
                'priority': procedure.priority,
                'source': procedure.source,
                'private': procedure.private,
                'created_at': procedure.created_at.isoformat(),
                'updated_at': procedure.updated_at.isoformat(),
                'deadline': procedure.deadline.isoformat() if procedure.deadline else None,
                'created_by': procedure.created_by.name if procedure.created_by else '',
                'requester_name': procedure.requester.name if procedure.requester else '',
                'responsible_group': procedure.responsible_group.name if procedure.responsible_group else '',
                'template_name': procedure.procedure_template.name if procedure.procedure_template else '',
                'template_source': procedure.procedure_template.source if procedure.procedure_template else '',
                'prn': procedure.prn,
                'payload_text': self._extract_payload_text(procedure.payload),
                'tags': self._extract_procedure_tags(procedure),
                'searchable_text': self._build_searchable_text_procedure(procedure)
            }
            
            # Adiciona ao Solr
            self.solr.add([doc])
            logger.info(f"Procedimento {procedure.process_number} indexado no Solr")
            
        except Exception as e:
            logger.error(f"Erro ao indexar procedimento {procedure.id}: {str(e)}")
    
    def index_task(self, task):
        """
        Indexa uma tarefa no Solr.
        """
        try:
            # Prepara os dados para indexação
            doc = {
                'id': f'task_{task.id}',
                'content_type': 'task',
                'object_id': str(task.id),
                'organization_id': str(task.procedure.organization.id),
                'title': task.name,
                'description': task.description,
                'content': self._extract_task_content(task),
                'status': task.status,
                'priority': task.priority,
                'created_at': task.created_at.isoformat(),
                'updated_at': task.updated_at.isoformat(),
                'deadline': task.deadline.isoformat() if task.deadline else None,
                'created_by': task.created_by.name if task.created_by else '',
                'assignee_name': task.assignee.name if task.assignee else '',
                'group_assignee': task.group_assignee.name if task.group_assignee else '',
                'procedure_id': str(task.procedure.id),
                'procedure_number': task.procedure.process_number,
                'procedure_template': task.procedure.procedure_template_name,
                'prn': task.prn,
                'comments_text': self._extract_task_comments(task),
                'fields_text': self._extract_task_fields(task),
                'tags': self._extract_task_tags(task),
                'searchable_text': self._build_searchable_text_task(task)
            }
            
            # Adiciona ao Solr
            self.solr.add([doc])
            logger.info(f"Tarefa {task.name} indexada no Solr")
            
        except Exception as e:
            logger.error(f"Erro ao indexar tarefa {task.id}: {str(e)}")
    
    def index_procedure_template(self, template):
        """
        Indexa um template de procedimento no Solr.
        """
        try:
            # Prepara os dados para indexação
            doc = {
                'id': f'template_{template.id}',
                'content_type': 'procedure_template',
                'object_id': str(template.id),
                'organization_id': str(template.organization.id),
                'title': template.name,
                'description': template.description,
                'content': template.description,
                'status': template.status,
                'source': template.source,
                'created_at': template.created_at.isoformat(),
                'updated_at': template.updated_at.isoformat(),
                'group_requester': template.group_requester.name if template.group_requester else '',
                'parent_template': template.parent_procedure_template.name if template.parent_procedure_template else '',
                'prn': template.prn,
                'schema_text': json.dumps(template.schema) if template.schema else '',
                'fields_text': self._extract_template_fields(template),
                'tags': self._extract_template_tags(template),
                'searchable_text': self._build_searchable_text_template(template)
            }
            
            # Adiciona ao Solr
            self.solr.add([doc])
            logger.info(f"Template {template.name} indexado no Solr")
            
        except Exception as e:
            logger.error(f"Erro ao indexar template {template.id}: {str(e)}")
    
    def search(self, query, content_types=None, organization_id=None, filters=None, 
               start=0, rows=20, sort=None):
        """
        Realiza busca no Solr.
        
        Args:
            query: Termo de busca
            content_types: Lista de tipos de conteúdo ('procedure', 'task', 'procedure_template')
            organization_id: ID da organização para filtrar
            filters: Filtros adicionais
            start: Offset para paginação
            rows: Número de resultados por página
            sort: Campo para ordenação
        """
        try:
            # Constrói a query
            if query and query.strip():
                # Busca nos campos de texto
                search_query = f'searchable_text:({query}) OR title:({query})^2 OR description:({query})'
            else:
                search_query = '*:*'
            
            # Filtros
            filter_queries = []
            
            if organization_id:
                filter_queries.append(f'organization_id:{organization_id}')
            
            if content_types:
                content_filter = ' OR '.join([f'content_type:{ct}' for ct in content_types])
                filter_queries.append(f'({content_filter})')
            
            if filters:
                for key, value in filters.items():
                    if value:
                        filter_queries.append(f'{key}:{value}')
            
            # Parâmetros da busca
            search_params = {
                'q': search_query,
                'start': start,
                'rows': rows,
                'fl': '*,score',  # Retorna todos os campos + score
                'defType': 'edismax',
                'qf': 'searchable_text^1 title^2 description^1.5 content^1',
                'pf': 'title^3 description^2',
                'ps': 2,
                'qs': 1
            }
            
            if filter_queries:
                search_params['fq'] = filter_queries
            
            if sort:
                search_params['sort'] = sort
            else:
                search_params['sort'] = 'score desc, updated_at desc'
            
            # Executa a busca
            results = self.solr.search(**search_params)
            
            # Processa os resultados
            processed_results = []
            for doc in results.docs:
                processed_doc = dict(doc)
                # Adiciona informações de destaque se disponível
                if hasattr(results, 'highlighting') and doc['id'] in results.highlighting:
                    processed_doc['highlighting'] = results.highlighting[doc['id']]
                processed_results.append(processed_doc)
            
            return {
                'docs': processed_results,
                'numFound': results.hits,
                'start': start,
                'rows': rows,
                'facets': getattr(results, 'facets', {}),
                'stats': getattr(results, 'stats', {})
            }
            
        except Exception as e:
            logger.error(f"Erro na busca Solr: {str(e)}")
            return {
                'docs': [],
                'numFound': 0,
                'start': start,
                'rows': rows,
                'error': str(e)
            }
    
    def delete_document(self, doc_id):
        """
        Remove um documento do Solr.
        """
        try:
            self.solr.delete(id=doc_id)
            logger.info(f"Documento {doc_id} removido do Solr")
        except Exception as e:
            logger.error(f"Erro ao remover documento {doc_id}: {str(e)}")
    
    def delete_by_object(self, content_type, object_id):
        """
        Remove documento por tipo e ID do objeto.
        """
        doc_id = f'{content_type}_{object_id}'
        self.delete_document(doc_id)
    
    def clear_organization_index(self, organization_id):
        """
        Remove todos os documentos de uma organização.
        """
        try:
            self.solr.delete(q=f'organization_id:{organization_id}')
            logger.info(f"Índice da organização {organization_id} limpo")
        except Exception as e:
            logger.error(f"Erro ao limpar índice da organização {organization_id}: {str(e)}")
    
    def get_suggestions(self, query, organization_id=None, limit=10):
        """
        Obtém sugestões de busca.
        """
        try:
            search_params = {
                'q': query,
                'rows': 0,
                'facet': 'on',
                'facet.field': ['title', 'tags', 'status', 'priority'],
                'facet.limit': limit,
                'facet.mincount': 1
            }
            
            if organization_id:
                search_params['fq'] = f'organization_id:{organization_id}'
            
            results = self.solr.search(**search_params)
            
            suggestions = {}
            if hasattr(results, 'facets') and 'facet_fields' in results.facets:
                for field, values in results.facets['facet_fields'].items():
                    # Processa os valores do facet (vem em pares: valor, count)
                    field_suggestions = []
                    for i in range(0, len(values), 2):
                        if i + 1 < len(values):
                            field_suggestions.append({
                                'value': values[i],
                                'count': values[i + 1]
                            })
                    suggestions[field] = field_suggestions
            
            return suggestions
            
        except Exception as e:
            logger.error(f"Erro ao obter sugestões: {str(e)}")
            return {}
    
    # Métodos auxiliares para extração de conteúdo
    
    def _extract_procedure_content(self, procedure):
        """Extrai conteúdo textual do procedimento"""
        content_parts = []
        
        if procedure.procedure_template and procedure.procedure_template.description:
            content_parts.append(procedure.procedure_template.description)
        
        # Adiciona conteúdo das tarefas
        for task in procedure.tasks.all():
            if task.name:
                content_parts.append(task.name)
            if task.description:
                content_parts.append(task.description)
        
        return ' '.join(content_parts)
    
    def _extract_task_content(self, task):
        """Extrai conteúdo textual da tarefa"""
        content_parts = [task.name, task.description or '']
        
        # Adiciona comentários
        for comment in task.task_comments.all():
            content_parts.append(comment.comment)
        
        return ' '.join(filter(None, content_parts))
    
    def _extract_payload_text(self, payload):
        """Extrai texto do payload JSON"""
        if not payload:
            return ''
        
        try:
            if isinstance(payload, dict):
                # Extrai valores de texto do JSON
                text_values = []
                for key, value in payload.items():
                    if isinstance(value, str):
                        text_values.append(value)
                    elif isinstance(value, (list, tuple)):
                        for item in value:
                            if isinstance(item, str):
                                text_values.append(item)
                return ' '.join(text_values)
            return str(payload)
        except:
            return ''
    
    def _extract_task_comments(self, task):
        """Extrai texto dos comentários da tarefa"""
        comments = task.task_comments.all()
        return ' '.join([comment.comment for comment in comments if comment.comment])
    
    def _extract_task_fields(self, task):
        """Extrai texto dos campos customizados da tarefa"""
        fields = task.task_fields.all()
        text_values = []
        for field in fields:
            if field.value:
                text_values.append(str(field.value))
            if field.array_values:
                text_values.extend([str(v) for v in field.array_values if v])
        return ' '.join(text_values)
    
    def _extract_template_fields(self, template):
        """Extrai texto dos campos do template"""
        fields = template.fields.all()
        text_values = []
        for field in fields:
            text_values.append(field.label)
            if field.help_text:
                text_values.append(field.help_text)
            if field.placeholder:
                text_values.append(field.placeholder)
        return ' '.join(text_values)
    
    def _extract_procedure_tags(self, procedure):
        """Extrai tags do procedimento"""
        tags = [procedure.status, procedure.priority]
        if procedure.source:
            tags.append(procedure.source)
        if procedure.procedure_template:
            tags.append(procedure.procedure_template.source)
        return [tag for tag in tags if tag]
    
    def _extract_task_tags(self, task):
        """Extrai tags da tarefa"""
        tags = [task.status, task.priority]
        if task.procedure.procedure_template:
            tags.append(task.procedure.procedure_template.source)
        return [tag for tag in tags if tag]
    
    def _extract_template_tags(self, template):
        """Extrai tags do template"""
        tags = [template.status]
        if template.source:
            tags.append(template.source)
        return [tag for tag in tags if tag]
    
    def _build_searchable_text_procedure(self, procedure):
        """Constrói texto pesquisável para procedimento"""
        parts = [
            procedure.process_number,
            procedure.procedure_template_name,
            procedure.procedure_template.description if procedure.procedure_template else '',
            procedure.source or '',
            procedure.created_by.name if procedure.created_by else '',
            procedure.requester.name if procedure.requester else '',
            procedure.responsible_group.name if procedure.responsible_group else '',
            self._extract_payload_text(procedure.payload)
        ]
        return ' '.join(filter(None, parts))
    
    def _build_searchable_text_task(self, task):
        """Constrói texto pesquisável para tarefa"""
        parts = [
            task.name,
            task.description or '',
            task.created_by.name if task.created_by else '',
            task.assignee.name if task.assignee else '',
            task.group_assignee.name if task.group_assignee else '',
            task.procedure.process_number,
            task.procedure.procedure_template_name,
            self._extract_task_comments(task),
            self._extract_task_fields(task)
        ]
        return ' '.join(filter(None, parts))
    
    def _build_searchable_text_template(self, template):
        """Constrói texto pesquisável para template"""
        parts = [
            template.name,
            template.description,
            template.source or '',
            template.group_requester.name if template.group_requester else '',
            self._extract_template_fields(template)
        ]
        return ' '.join(filter(None, parts))


# Instância global do serviço
workflow_solr_service = WorkflowSolrService()


# Funções de conveniência para uso nos models e views
def index_procedure(procedure):
    """Indexa um procedimento"""
    workflow_solr_service.index_procedure(procedure)


def index_task(task):
    """Indexa uma tarefa"""
    workflow_solr_service.index_task(task)


def index_procedure_template(template):
    """Indexa um template de procedimento"""
    workflow_solr_service.index_procedure_template(template)


def search_workflow(query, **kwargs):
    """Busca no workflow"""
    return workflow_solr_service.search(query, **kwargs)


def delete_workflow_document(content_type, object_id):
    """Remove documento do índice"""
    workflow_solr_service.delete_by_object(content_type, object_id)
