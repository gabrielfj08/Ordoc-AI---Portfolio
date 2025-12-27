import api from './api-client'

export interface AnalyticsOverview {
  total_documents: number
  documents_change: string
  active_users: number
  users_change: string
  approval_rate: number
  approval_rate_change: string
  avg_processing_time_hours: number
  processing_time_change: string
  document_type_distribution: {
    contratos: number
    propostas: number
    relatorios: number
    outros: number
  }
}

export interface DocumentTrend {
  date: string
  count: number
  is_prediction?: boolean
}

export interface ProcessMetrics {
  active_procedures: number
  pending_tasks: number
  running_tasks: number
  finished_tasks: number
}

export interface IntelligenceAlert {
  id: string
  title: string
  description: string
  severity: 'high' | 'medium' | 'low'
  created_at: string
  alert_type: string
  suggested_actions?: string[]
}

export interface LearnedPattern {
  id: string
  pattern_type: string
  pattern_value: string
  confidence: number
  occurrences: number
  description?: string
}

export interface PredictionScenario {
  optimistic: {
    value: number
    percentage_change: number
  }
  realistic: {
    value: number
    percentage_change: number
  }
  pessimistic: {
    value: number
    percentage_change: number
  }
}

export interface ActivityHeatmap {
  day: string
  hours: number[] // 24 valores representando atividade por hora
}

export interface AuditLog {
  id: string
  action: string
  user: string
  resource: string
  timestamp: string
  type: 'success' | 'warning' | 'info' | 'error'
}

export interface DocumentAnalysis {
  id: string
  document_id: string
  document_type: string
  extraction_result: Record<string, any>
  council_deliberation: Record<string, any>
  analysis_depth: string
  processing_time_ms: number
  status: string
  created_at: string
  completed_at?: string
}

/**
 * Service para APIs de Análises e Inteligência
 */
class AnalysesApiService {
  /**
   * Buscar visão geral de analytics
   */
  async getAnalyticsOverview(timeRange: '7d' | '30d' | '90d' | '1y' = '30d'): Promise<AnalyticsOverview> {
    const response = await api.get('/api/v1/ordoc-reports/api/analytics/overview/', {
      params: { time_range: timeRange }
    })
    return response.data
  }

  /**
   * Buscar tendências de documentos
   */
  async getDocumentTrends(timeRange: '7d' | '30d' | '90d' | '1y' = '30d'): Promise<DocumentTrend[]> {
    const response = await api.get('/api/v1/ordoc-reports/api/analytics/document_trends/', {
      params: { time_range: timeRange }
    })
    return response.data
  }

  /**
   * Buscar métricas de processos
   */
  async getProcessMetrics(timeRange: '7d' | '30d' | '90d' | '1y' = '30d'): Promise<ProcessMetrics> {
    const response = await api.get('/api/v1/ordoc-reports/api/analytics/process_metrics/', {
      params: { time_range: timeRange }
    })
    return response.data
  }

  /**
   * Buscar alertas de inteligência
   */
  async getIntelligenceAlerts(limit: number = 10): Promise<IntelligenceAlert[]> {
    const response = await api.get('/api/v1/intelligence/alerts/', {
      params: { 
        is_read: false,
        ordering: '-created_at',
        limit
      }
    })
    return response.data.results || response.data
  }

  /**
   * Marcar alerta como lido
   */
  async markAlertAsRead(alertId: string): Promise<void> {
    await api.post(`/api/v1/intelligence/alerts/${alertId}/mark_as_read/`)
  }

  /**
   * Responder a um alerta
   */
  async respondToAlert(
    alertId: string, 
    response: 'accept' | 'reject' | 'modify' | 'dismiss',
    modifications?: Record<string, any>
  ): Promise<void> {
    await api.post(`/api/v1/intelligence/alerts/${alertId}/respond/`, {
      response,
      modifications
    })
  }

  /**
   * Buscar padrões aprendidos pela IA
   */
  async getLearnedPatterns(limit: number = 10): Promise<LearnedPattern[]> {
    const response = await api.get('/api/v1/intelligence/patterns/', {
      params: { limit }
    })
    return response.data.results || response.data
  }

  /**
   * Buscar predições multivariadas
   */
  async getPredictionScenarios(timeRange: '30d' | '90d' = '90d'): Promise<PredictionScenario> {
    const response = await api.get('/api/v1/ordoc-reports/api/analytics/predictions/', {
      params: { time_range: timeRange }
    })
    return response.data
  }

  /**
   * Buscar heatmap de atividade
   */
  async getActivityHeatmap(timeRange: '7d' | '30d' = '7d'): Promise<ActivityHeatmap[]> {
    const response = await api.get('/api/v1/ordoc-reports/api/analytics/activity_heatmap/', {
      params: { time_range: timeRange }
    })
    return response.data
  }

  /**
   * Buscar logs de auditoria com filtros
   */
  async getAuditLogs(
    limit: number = 20,
    offset: number = 0,
    filters?: {
      type?: string
      action?: string
      search?: string
      start_date?: string
      end_date?: string
    }
  ): Promise<{ results: AuditLog[], count: number, ai_summary?: any }> {
    const params: any = { limit, offset }
    
    if (filters?.type) params.type = filters.type
    if (filters?.action) params.action = filters.action
    if (filters?.search) params.search = filters.search
    if (filters?.start_date) params.start_date = filters.start_date
    if (filters?.end_date) params.end_date = filters.end_date
    
    const response = await api.get('/api/v1/ordoc-reports/api/analytics/audit_logs/', {
      params
    })
    return response.data
  }

  /**
   * Buscar análises de documentos realizadas
   */
  async getDocumentAnalyses(limit: number = 10): Promise<DocumentAnalysis[]> {
    const response = await api.get('/api/v1/intelligence/analyses/', {
      params: { 
        limit,
        ordering: '-created_at'
      }
    })
    return response.data.results || response.data
  }

  /**
   * Buscar análise específica de documento
   */
  async getDocumentAnalysis(analysisId: string): Promise<DocumentAnalysis> {
    const response = await api.get(`/api/v1/intelligence/analyses/${analysisId}/`)
    return response.data
  }

  /**
   * Solicitar análise de documento
   */
  async analyzeDocument(
    documentId: string,
    documentContent: string,
    documentType: string = 'unknown',
    analysisDepth: 'quick' | 'full' = 'full'
  ): Promise<any> {
    const response = await api.post('/api/v1/intelligence/analyze/', {
      document_id: documentId,
      document_content: documentContent,
      document_type: documentType,
      analysis_depth: analysisDepth
    })
    return response.data
  }

  /**
   * Extração rápida de entidades
   */
  async quickExtract(text: string, entityTypes: string[]): Promise<any> {
    const response = await api.post('/api/v1/intelligence/extract/', {
      text,
      entity_types: entityTypes
    })
    return response.data
  }

  /**
   * Exportar dados de análise
   */
  async exportAnalytics(
    timeRange: string,
    format: 'csv' | 'pdf' | 'excel' = 'csv',
    reportType: 'documents' | 'processes' | 'users' | 'performance' = 'documents'
  ): Promise<Blob> {
    const response = await api.get('/api/v1/ordoc-reports/api/analytics/export/', {
      params: { time_range: timeRange, format, report_type: reportType },
      responseType: 'blob'
    })
    return response.data
  }

  /**
   * Gerar relatório customizado
   */
  async generateReport(params: {
    report_type: 'documents' | 'processes' | 'users' | 'performance'
    format: 'csv' | 'pdf' | 'excel'
    start_date: string
    end_date: string
  }): Promise<Blob> {
    const response = await api.post('/api/v1/ordoc-reports/api/analytics/generate_report/', params, {
      responseType: 'blob'
    })
    return response.data
  }

  /**
   * Buscar relatórios salvos
   */
  async getSavedReports(limit: number = 3): Promise<any[]> {
    const response = await api.get('/api/v1/ordoc-reports/api/analytics/saved_reports/', {
      params: { limit }
    })
    return response.data
  }

  /**
   * Buscar relatórios agendados
   */
  async getScheduledReports(limit: number = 3): Promise<any[]> {
    const response = await api.get('/api/v1/ordoc-reports/api/analytics/scheduled_reports/', {
      params: { limit }
    })
    return response.data
  }

  /**
   * Enviar feedback para aprendizado da IA
   */
  async submitFeedback(
    layer: 'user' | 'extraction' | 'council',
    documentType: string,
    actionType: 'approval' | 'rejection' | 'correction',
    originalValue: string,
    correctedValue?: string,
    context?: Record<string, any>
  ): Promise<void> {
    await api.post('/api/v1/intelligence/feedback/', {
      layer,
      document_type: documentType,
      action_type: actionType,
      original_value: originalValue,
      corrected_value: correctedValue,
      context
    })
  }
}

export const analysesApi = new AnalysesApiService()
