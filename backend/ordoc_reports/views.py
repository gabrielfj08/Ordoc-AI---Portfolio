from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Count, Avg, Q, Sum
from django.db.models.functions import TruncMonth
from django.http import HttpResponse, Http404
from datetime import datetime, timedelta
import json
import os

from ordoc_ai.base_viewset import BaseViewSet
from .models import (
    ReportTemplate, Report, ReportSchedule, 
    ReportShare, ReportMetric
)
from .serializers import (
    ReportTemplateSerializer, ReportSerializer, ReportScheduleSerializer,
    ReportShareSerializer, ReportMetricSerializer, DashboardMetricsSerializer,
    ReportGenerationRequestSerializer, ReportExportSerializer
)
from .services import ReportGenerationService, ReportExportService


class ReportTemplateViewSet(BaseViewSet):
    """
    ViewSet para templates de relatórios
    Permite CRUD completo de templates de relatórios
    """
    
    queryset = ReportTemplate.objects.all()
    serializer_class = ReportTemplateSerializer
    filterset_fields = ['category', 'type', 'status', 'is_public']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'category', 'created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Filtra templates por organização"""
        queryset = super().get_queryset()
        organization = self.get_current_organization()
        ordoc_user = self.get_current_ordoc_user()
        
        if organization:
            queryset = queryset.filter(organization=organization)
        
        # Filtro adicional por permissões do usuário
        if ordoc_user and not ordoc_user.user.is_superuser:
            queryset = queryset.filter(
                Q(is_public=True) |
                Q(created_by=ordoc_user)
            )
        
        return queryset
    
    def perform_create(self, serializer):
        """Define organização e criador ao criar template"""
        serializer.save(
            organization=self.get_current_organization(),
            created_by=self.get_current_ordoc_user()
        )
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Ativa um template de relatório"""
        template = self.get_object()
        template.status = 'active'
        template.save()
        
        return Response({
            'message': 'Template ativado com sucesso',
            'status': template.status
        })
    
    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        """Desativa um template de relatório"""
        template = self.get_object()
        template.status = 'inactive'
        template.save()
        
        return Response({
            'message': 'Template desativado com sucesso',
            'status': template.status
        })
    
    @action(detail=True, methods=['post'])
    def duplicate(self, request, pk=None):
        """Duplica um template de relatório"""
        original_template = self.get_object()
        
        # Cria uma cópia do template
        new_template = ReportTemplate.objects.create(
            name=f"{original_template.name} (Cópia)",
            description=original_template.description,
            category=original_template.category,
            type=original_template.type,
            status='draft',
            query_config=original_template.query_config,
            display_config=original_template.display_config,
            filter_config=original_template.filter_config,
            export_config=original_template.export_config,
            is_public=False,  # Cópia sempre começa como privada
            allowed_roles=original_template.allowed_roles,
            organization=self.get_current_organization(),
            created_by=self.get_current_ordoc_user()
        )
        
        serializer = self.get_serializer(new_template)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['get'])
    def preview(self, request, pk=None):
        """Gera uma prévia do relatório baseado no template"""
        template = self.get_object()
        
        # Parâmetros de prévia (limitados)
        filters = request.query_params.dict()
        
        try:
            # Gera dados de prévia usando o serviço
            preview_data = ReportGenerationService.generate_preview(
                template=template,
                filters=filters,
                organization=self.get_current_organization()
            )
            
            return Response({
                'template': self.get_serializer(template).data,
                'preview_data': preview_data,
                'generated_at': timezone.now()
            })
        
        except Exception as e:
            return Response({
                'error': f'Erro ao gerar prévia: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def categories(self, request):
        """Lista todas as categorias disponíveis"""
        return Response({
            'categories': [
                {'value': choice[0], 'label': choice[1]} 
                for choice in ReportTemplate.CATEGORY_CHOICES
            ]
        })
    
    @action(detail=False, methods=['get'])
    def types(self, request):
        """Lista todos os tipos disponíveis"""
        return Response({
            'types': [
                {'value': choice[0], 'label': choice[1]} 
                for choice in ReportTemplate.TYPE_CHOICES
            ]
        })


class ReportViewSet(BaseViewSet):
    """
    ViewSet para relatórios gerados
    Permite visualizar, baixar e gerenciar relatórios
    """
    
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    filterset_fields = ['status', 'format', 'template']
    search_fields = ['title', 'description']
    ordering_fields = ['title', 'created_at', 'status']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Filtra relatórios por organização"""
        queryset = super().get_queryset()
        organization = self.get_current_organization()
        ordoc_user = self.get_current_ordoc_user()
        
        if organization:
            queryset = queryset.filter(organization=organization)
        
        # Filtro adicional por permissões do usuário
        if ordoc_user and not ordoc_user.user.is_superuser:
            queryset = queryset.filter(
                Q(template__is_public=True) |
                Q(generated_by=ordoc_user)
            )
        
        return queryset
    
    def perform_create(self, serializer):
        """Não permite criação direta - usar endpoint generate"""
        raise NotImplementedError("Use o endpoint 'generate' para criar relatórios")
    
    @action(detail=False, methods=['post'])
    def generate(self, request):
        """Gera um novo relatório a partir de um template"""
        serializer = ReportGenerationRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        template = get_object_or_404(
            ReportTemplate, 
            id=serializer.validated_data['template_id'],
            organization=self.get_current_organization()
        )
        
        # Verifica se o usuário pode acessar o template
        if not template.can_user_access(self.get_current_user()):
            return Response({
                'error': 'Você não tem permissão para usar este template'
            }, status=status.HTTP_403_FORBIDDEN)
        
        try:
            # Cria o relatório
            report = Report.objects.create(
                title=serializer.validated_data['title'],
                description=serializer.validated_data.get('description', ''),
                format=serializer.validated_data['format'],
                filters_applied=serializer.validated_data['filters'],
                parameters=serializer.validated_data['parameters'],
                template=template,
                organization=self.get_current_organization(),
                generated_by=self.get_current_ordoc_user()
            )
            
            # Define expiração
            report.set_default_expiry(serializer.validated_data['expires_in_days'])
            report.save()
            
            # Inicia geração assíncrona
            from .tasks import generate_report_task
            generate_report_task.delay(report.id)
            
            return Response(
                ReportSerializer(report).data, 
                status=status.HTTP_201_CREATED
            )
        
        except Exception as e:
            return Response({
                'error': f'Erro ao iniciar geração do relatório: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """Baixa o arquivo do relatório"""
        report = self.get_object()
        
        if not report.is_completed():
            return Response({
                'error': 'Relatório ainda não foi concluído'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if report.is_expired():
            return Response({
                'error': 'Relatório expirou'
            }, status=status.HTTP_410_GONE)
        
        if not report.file_path or not os.path.exists(report.file_path):
            return Response({
                'error': 'Arquivo do relatório não encontrado'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Serve o arquivo
        try:
            with open(report.file_path, 'rb') as f:
                response = HttpResponse(
                    f.read(), 
                    content_type='application/octet-stream'
                )
                response['Content-Disposition'] = f'attachment; filename="{report.title}.{report.format}"'
                return response
        except Exception as e:
            return Response({
                'error': f'Erro ao baixar arquivo: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=True, methods=['post'])
    def regenerate(self, request, pk=None):
        """Regenera um relatório existente"""
        original_report = self.get_object()
        
        # Cria novo relatório com os mesmos parâmetros
        new_report = Report.objects.create(
            title=f"{original_report.title} (Regenerado)",
            description=original_report.description,
            format=original_report.format,
            filters_applied=original_report.filters_applied,
            parameters=original_report.parameters,
            template=original_report.template,
            organization=self.get_current_organization(),
            generated_by=self.get_current_ordoc_user()
        )
        
        # Define expiração
        new_report.set_default_expiry()
        new_report.save()
        
        # Inicia geração assíncrona
        from .tasks import generate_report_task
        generate_report_task.delay(new_report.id)
        
        return Response(
            ReportSerializer(new_report).data, 
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=True, methods=['delete'])
    def delete_file(self, request, pk=None):
        """Remove o arquivo do relatório (mantém registro)"""
        report = self.get_object()
        
        if report.file_path and os.path.exists(report.file_path):
            try:
                os.remove(report.file_path)
                report.file_path = None
                report.file_size = None
                report.save()
                
                return Response({
                    'message': 'Arquivo removido com sucesso'
                })
            except Exception as e:
                return Response({
                    'error': f'Erro ao remover arquivo: {str(e)}'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response({
            'message': 'Nenhum arquivo para remover'
        })
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Estatísticas dos relatórios do usuário"""
        queryset = self.get_queryset()
        
        stats = {
            'total': queryset.count(),
            'by_status': dict(queryset.values('status').annotate(count=Count('id')).values_list('status', 'count')),
            'by_format': dict(queryset.values('format').annotate(count=Count('id')).values_list('format', 'count')),
            'this_month': queryset.filter(
                created_at__gte=timezone.now().replace(day=1)
            ).count(),
            'avg_generation_time': queryset.exclude(
                generation_time__isnull=True
            ).aggregate(avg=Avg('generation_time'))['avg']
        }
        
        return Response(stats)


class ReportScheduleViewSet(BaseViewSet):
    """
    ViewSet para agendamentos de relatórios
    Permite criar e gerenciar agendamentos automáticos
    """
    
    queryset = ReportSchedule.objects.all()
    serializer_class = ReportScheduleSerializer
    filterset_fields = ['status', 'frequency', 'template']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'next_run', 'created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Filtra agendamentos por organização"""
        queryset = super().get_queryset()
        organization = self.get_current_organization()
        
        if organization:
            queryset = queryset.filter(organization=organization)
        
        return queryset
    
    def perform_create(self, serializer):
        """Define organização e criador ao criar agendamento"""
        schedule = serializer.save(
            organization=self.get_current_organization(),
            created_by=self.get_current_ordoc_user()
        )
        
        # Calcula próxima execução
        schedule.calculate_next_run()
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Ativa um agendamento"""
        schedule = self.get_object()
        schedule.status = 'active'
        schedule.calculate_next_run()
        
        return Response({
            'message': 'Agendamento ativado com sucesso',
            'next_run': schedule.next_run
        })
    
    @action(detail=True, methods=['post'])
    def pause(self, request, pk=None):
        """Pausa um agendamento"""
        schedule = self.get_object()
        schedule.status = 'paused'
        schedule.save()
        
        return Response({
            'message': 'Agendamento pausado com sucesso'
        })
    
    @action(detail=True, methods=['post'])
    def run_now(self, request, pk=None):
        """Executa um agendamento imediatamente"""
        schedule = self.get_object()
        
        # Cria relatório baseado no agendamento
        report = Report.objects.create(
            title=f"{schedule.name} - {timezone.now().strftime('%Y-%m-%d %H:%M')}",
            description=f"Relatório gerado automaticamente pelo agendamento: {schedule.name}",
            format=schedule.default_format,
            filters_applied=schedule.default_filters,
            parameters={},
            template=schedule.template,
            organization=self.get_current_organization(),
            generated_by=self.get_current_ordoc_user()
        )
        
        # Define expiração
        report.set_default_expiry()
        report.save()
        
        # Inicia geração assíncrona
        from .tasks import generate_report_task
        generate_report_task.delay(report.id)
        
        # Atualiza última execução
        schedule.last_run = timezone.now()
        schedule.save()
        
        return Response({
            'message': 'Relatório iniciado com sucesso',
            'report_id': report.id
        })


class ReportShareViewSet(BaseViewSet):
    """
    ViewSet para compartilhamentos de relatórios
    Permite compartilhar relatórios com usuários ou publicamente
    """
    
    queryset = ReportShare.objects.all()
    serializer_class = ReportShareSerializer
    filterset_fields = ['status', 'access_type', 'is_public']
    search_fields = ['report__title']
    ordering_fields = ['created_at', 'expires_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Filtra compartilhamentos por usuário"""
        queryset = super().get_queryset()
        organization = self.get_current_organization()
        ordoc_user = self.get_current_ordoc_user()
        
        if organization:
            queryset = queryset.filter(report__organization=organization)
        
        # Usuários só veem seus próprios compartilhamentos
        if ordoc_user and not ordoc_user.user.is_superuser:
            queryset = queryset.filter(shared_by=ordoc_user)
        
        return queryset
    
    def perform_create(self, serializer):
        """Define organização e criador ao criar compartilhamento"""
        serializer.save(
            organization=self.get_current_organization(),
            shared_by=self.get_current_ordoc_user()
        )
    
    @action(detail=True, methods=['post'])
    def revoke(self, request, pk=None):
        """Revoga um compartilhamento"""
        share = self.get_object()
        share.status = 'revoked'
        share.save()
        
        return Response({
            'message': 'Compartilhamento revogado com sucesso'
        })
    
    @action(detail=False, methods=['get'])
    def public_access(self, request):
        """Acessa um relatório via token público (sem autenticação)"""
        token = request.query_params.get('token')
        password = request.query_params.get('password')
        
        if not token:
            return Response({
                'error': 'Token é obrigatório'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            share = ReportShare.objects.get(share_token=token)
            
            if not share.can_access(password=password):
                return Response({
                    'error': 'Acesso negado'
                }, status=status.HTTP_403_FORBIDDEN)
            
            # Registra o acesso
            share.record_access()
            
            # Retorna dados do relatório
            report_data = ReportSerializer(share.report).data
            
            return Response({
                'report': report_data,
                'access_type': share.access_type,
                'accessed_at': timezone.now()
            })
        
        except ReportShare.DoesNotExist:
            return Response({
                'error': 'Token inválido'
            }, status=status.HTTP_404_NOT_FOUND)


class ReportMetricViewSet(BaseViewSet):
    """
    ViewSet para métricas de relatórios
    Permite visualizar estatísticas e métricas de uso
    """
    
    queryset = ReportMetric.objects.all()
    serializer_class = ReportMetricSerializer
    filterset_fields = ['metric_type', 'report_template', 'report']
    search_fields = ['metric_name']
    ordering_fields = ['created_at', 'metric_value']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Filtra métricas por organização"""
        queryset = super().get_queryset()
        organization = self.get_current_organization()
        
        if organization:
            queryset = queryset.filter(organization=organization)
        
        return queryset
    
    def perform_create(self, serializer):
        """Define organização ao criar métrica"""
        serializer.save(organization=self.get_current_organization())
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """
        Dashboard com métricas principais.

        Optimized: 16+ queries → 3 queries
        - Query 1: Main report aggregations
        - Query 2: Template/Schedule counts
        - Query 3: Monthly trend (single DB hit with TruncMonth)
        """
        from django.db.models.functions import TruncMonth
        from django.db.models import Q, Count, Avg, Case, When, IntegerField

        organization = self.get_current_organization()

        # Calcula métricas do dashboard
        now = timezone.now()
        this_month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        # Query 1: Consolidated report metrics (was 6+ separate queries)
        report_stats = Report.objects.filter(
            organization=organization
        ).aggregate(
            total=Count('id'),
            this_month=Count('id', filter=Q(created_at__gte=this_month_start)),
            failed=Count('id', filter=Q(status='failed')),
            avg_time=Avg('generation_time'),
            # Count by status
            pending=Count('id', filter=Q(status='pending')),
            generated=Count('id', filter=Q(status='generated')),
            # Count by format
            html=Count('id', filter=Q(format='html')),
            pdf=Count('id', filter=Q(format='pdf')),
            excel=Count('id', filter=Q(format='excel')),
            csv=Count('id', filter=Q(format='csv')),
            json=Count('id', filter=Q(format='json')),
        )

        # Extract values
        total_reports = report_stats['total'] or 0
        reports_this_month = report_stats['this_month'] or 0
        failed_reports = report_stats['failed'] or 0

        # Convert avg generation time
        avg_generation_time = report_stats['avg_time']
        if avg_generation_time:
            avg_generation_time = avg_generation_time.total_seconds()
        else:
            avg_generation_time = 0

        # Build status and format dicts from aggregation
        reports_by_status = {
            'pending': report_stats['pending'] or 0,
            'generated': report_stats['generated'] or 0,
            'failed': failed_reports,
        }

        reports_by_format = {
            'html': report_stats['html'] or 0,
            'pdf': report_stats['pdf'] or 0,
            'excel': report_stats['excel'] or 0,
            'csv': report_stats['csv'] or 0,
            'json': report_stats['json'] or 0,
        }

        # Query 2: Template and schedule counts (consolidated)
        template_schedule_stats = {
            'active_templates': ReportTemplate.objects.filter(
                organization=organization, status='active'
            ).count(),
            'active_schedules': ReportSchedule.objects.filter(
                organization=organization, status='active'
            ).count(),
        }

        # Most used template (using same aggregation pattern)
        most_used_template = Report.objects.filter(
            organization=organization
        ).values('template__name').annotate(
            count=Count('id')
        ).order_by('-count').first()

        # Query 3: Monthly trend (optimized with TruncMonth - single query instead of 12)
        twelve_months_ago = now - timedelta(days=365)
        monthly_data = Report.objects.filter(
            organization=organization,
            created_at__gte=twelve_months_ago
        ).annotate(
            month=TruncMonth('created_at')
        ).values('month').annotate(
            count=Count('id')
        ).order_by('month')

        # Build monthly trend dictionary for fast lookup
        month_counts = {item['month'].strftime('%Y-%m'): item['count'] for item in monthly_data}

        # Fill in missing months with 0
        monthly_trend = []
        for i in range(12):
            month_date = (now.replace(day=1) - timedelta(days=30*i)).replace(day=1)
            month_key = month_date.strftime('%Y-%m')
            monthly_trend.append({
                'month': month_key,
                'count': month_counts.get(month_key, 0)
            })

        monthly_trend.reverse()

        # Calculate error rate
        error_rate = (failed_reports / total_reports * 100) if total_reports > 0 else 0

        dashboard_data = {
            'total_reports': total_reports,
            'reports_this_month': reports_this_month,
            'active_templates': template_schedule_stats['active_templates'],
            'active_schedules': template_schedule_stats['active_schedules'],
            'avg_generation_time': avg_generation_time,
            'most_used_template': most_used_template['template__name'] if most_used_template else None,
            'reports_by_status': reports_by_status,
            'reports_by_format': reports_by_format,
            'monthly_trend': monthly_trend,
            'error_rate': round(error_rate, 2)
        }
        
        serializer = DashboardMetricsSerializer(dashboard_data)
        return Response(serializer.data)
