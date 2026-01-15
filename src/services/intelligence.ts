/**
 * Intelligence Service - API client para módulo de Inteligência Artificial
 *
 * Integra com backend Intelligence module:
 * - Análise de documentos com LLM Council
 * - Extração rápida de entidades
 * - Alertas proativos
 * - Feedbacks e aprendizado
 * - Padrões identificados
 * - Validação de compliance
 */

import apiClient from './api';

// ============================================================================
// INTERFACES - Baseadas no backend intelligence module
// ============================================================================

export interface AnalysisRequest {
    document_id: string;
    document_content: string;
    document_type?: string;
    analysis_depth?: 'quick' | 'full';
    context?: Record<string, any>;
}

export interface ExtractionResult {
    parties?: Array<{
        name: string;
        role: string;
        identification?: string;
    }>;
    dates?: Array<{
        type: string;
        date: string;
        description?: string;
    }>;
    values?: Array<{
        type: string;
        amount: number;
        currency: string;
        description?: string;
    }>;
    clauses?: Array<{
        type: string;
        content: string;
        importance: 'high' | 'medium' | 'low';
    }>;
    metadata?: Record<string, any>;
}

export interface CouncilOpinion {
    member_domain: string;
    confidence: number;
    analysis: string;
    key_findings: string[];
    concerns: string[];
    recommendations: string[];
}

export interface CouncilDeliberation {
    final_category?: string;
    confidence_score: number;
    summary: string;
    key_points: string[];
    concerns: string[];
    recommendations: string[];
    member_opinions: CouncilOpinion[];
    consensus_level: 'high' | 'medium' | 'low';
    total_processing_time_ms: number;
    alerts?: ProactiveAlert[];
}

export interface ProactiveAlert {
    id?: string;
    document_id?: string;
    document_type?: string;
    alert_type: 'security' | 'compliance' | 'quality' | 'suggestion' | 'warning';
    severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
    title: string;
    message: string;
    details?: Record<string, any>;
    location?: string;
    suggested_actions?: string[];
    is_read?: boolean;
    is_dismissed?: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface AnalysisResult {
    extraction?: ExtractionResult;
    deliberation?: CouncilDeliberation;
    alerts?: ProactiveAlert[];
    processing_time_ms?: number;
}

export interface QuickExtractRequest {
    text: string;
    entity_types: ('person' | 'organization' | 'date' | 'money' | 'email' | 'phone' | 'cpf' | 'cnpj')[];
}

export interface DocumentAnalysis {
    id: string;
    document_id: string;
    document_type: string;
    extraction_result: ExtractionResult;
    council_deliberation: CouncilDeliberation;
    analysis_depth: 'quick' | 'full';
    processing_time_ms: number;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    requested_by?: string;
    completed_at?: string;
    created_at: string;
    updated_at: string;
}

export interface LearnedPattern {
    id: string;
    pattern_type: string;
    scope: 'user' | 'organization' | 'platform';
    pattern_data: Record<string, any>;
    confidence: number;
    occurrences: number;
    first_seen: string;
    last_seen: string;
    is_active: boolean;
}

export interface KnowledgeFeedback {
    id: string;
    feedback_type: string;
    entity_type: string;
    entity_id: string;
    action: string;
    context: Record<string, any>;
    created_at: string;
}

export interface ComplianceValidationRequest {
    document_id: string;
    document_content: string;
    validation_rules?: Array<{
        rule_type: string;
        parameters?: Record<string, any>;
    }>;
}

export interface ComplianceValidationResult {
    document_id: string;
    is_compliant: boolean;
    violations: Array<{
        rule_type: string;
        severity: 'critical' | 'high' | 'medium' | 'low';
        description: string;
        location?: string;
        suggested_fix?: string;
    }>;
    warnings: Array<{
        message: string;
        details?: string;
    }>;
    validated_at: string;
}

export interface ActivityFeedItem {
    id: string;
    activity_type: string;
    entity_type: string;
    entity_id: string;
    entity_name: string;
    user_name: string;
    description: string;
    timestamp: string;
    metadata?: Record<string, any>;
}

export interface LanguageModelStatus {
    is_available: boolean;
    provider: string;
    models: Array<{
        name: string;
        status: 'available' | 'unavailable' | 'error';
        last_check: string;
    }>;
    council_members: Array<{
        domain: string;
        model: string;
        status: 'active' | 'inactive';
    }>;
}

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

// ============================================================================
// SERVICE CLASS
// ============================================================================

class IntelligenceService {
    private baseURL = '/api/v1/intelligence';

    // ========================================================================
    // ANÁLISE DE DOCUMENTOS
    // ========================================================================

    /**
     * Analisar documento com LLM Council
     * POST /api/v1/intelligence/analyze/
     */
    async analyzeDocument(data: AnalysisRequest): Promise<AnalysisResult> {
        const response = await apiClient.post<AnalysisResult>(`${this.baseURL}/analyze/`, data);
        return response.data;
    }

    /**
     * Extração rápida de entidades (sem LLM Council completo)
     * POST /api/v1/intelligence/extract/
     */
    async quickExtract(data: QuickExtractRequest): Promise<ExtractionResult> {
        const response = await apiClient.post<ExtractionResult>(`${this.baseURL}/extract/`, data);
        return response.data;
    }

    /**
     * Validar compliance de documento
     * POST /api/v1/intelligence/validate-compliance/
     */
    async validateCompliance(data: ComplianceValidationRequest): Promise<ComplianceValidationResult> {
        const response = await apiClient.post<ComplianceValidationResult>(
            `${this.baseURL}/validate-compliance/`,
            data
        );
        return response.data;
    }

    /**
     * Obter análise existente de documento
     * GET /api/v1/intelligence/analyses/:id/
     */
    async getAnalysis(documentId: string): Promise<DocumentAnalysis> {
        const response = await apiClient.get<DocumentAnalysis>(`${this.baseURL}/analyses/${documentId}/`);
        return response.data;
    }

    /**
     * Listar análises de documentos
     * GET /api/v1/intelligence/analyses/
     */
    async listAnalyses(params?: {
        document_type?: string;
        status?: string;
        page?: number;
        page_size?: number;
    }): Promise<PaginatedResponse<DocumentAnalysis>> {
        const response = await apiClient.get<PaginatedResponse<DocumentAnalysis>>(
            `${this.baseURL}/analyses/`,
            { params }
        );
        return response.data;
    }

    // ========================================================================
    // ALERTAS PROATIVOS
    // ========================================================================

    /**
     * Listar alertas
     * GET /api/v1/intelligence/alerts/
     */
    async listAlerts(params?: {
        alert_type?: string;
        severity?: string;
        is_read?: boolean;
        is_dismissed?: boolean;
        document_id?: string;
        page?: number;
        page_size?: number;
    }): Promise<PaginatedResponse<ProactiveAlert>> {
        const response = await apiClient.get<PaginatedResponse<ProactiveAlert>>(
            `${this.baseURL}/alerts/`,
            { params }
        );
        return response.data;
    }

    /**
     * Obter alerta específico
     * GET /api/v1/intelligence/alerts/:id/
     */
    async getAlert(id: string): Promise<ProactiveAlert> {
        const response = await apiClient.get<ProactiveAlert>(`${this.baseURL}/alerts/${id}/`);
        return response.data;
    }

    /**
     * Marcar alerta como lido
     * POST /api/v1/intelligence/alerts/:id/mark_read/
     */
    async markAlertAsRead(id: string): Promise<ProactiveAlert> {
        const response = await apiClient.post<ProactiveAlert>(`${this.baseURL}/alerts/${id}/mark_read/`);
        return response.data;
    }

    /**
     * Descartar alerta
     * POST /api/v1/intelligence/alerts/:id/dismiss/
     */
    async dismissAlert(id: string): Promise<ProactiveAlert> {
        const response = await apiClient.post<ProactiveAlert>(`${this.baseURL}/alerts/${id}/dismiss/`);
        return response.data;
    }

    /**
     * Obter contadores de alertas por severidade
     * GET /api/v1/intelligence/alerts/severity_counts/
     */
    async getAlertSeverityCounts(): Promise<Record<string, number>> {
        const response = await apiClient.get<Record<string, number>>(
            `${this.baseURL}/alerts/severity_counts/`
        );
        return response.data;
    }

    // ========================================================================
    // FEEDBACKS E APRENDIZADO
    // ========================================================================

    /**
     * Enviar feedback para aprendizado
     * POST /api/v1/intelligence/feedback/
     */
    async submitFeedback(data: {
        feedback_type: string;
        entity_type: string;
        entity_id: string;
        action: string;
        context?: Record<string, any>;
    }): Promise<KnowledgeFeedback> {
        const response = await apiClient.post<KnowledgeFeedback>(`${this.baseURL}/feedback/`, data);
        return response.data;
    }

    /**
     * Listar feedbacks
     * GET /api/v1/intelligence/feedback/
     */
    async listFeedbacks(params?: {
        feedback_type?: string;
        entity_type?: string;
        page?: number;
        page_size?: number;
    }): Promise<PaginatedResponse<KnowledgeFeedback>> {
        const response = await apiClient.get<PaginatedResponse<KnowledgeFeedback>>(
            `${this.baseURL}/feedback/`,
            { params }
        );
        return response.data;
    }

    // ========================================================================
    // PADRÕES APRENDIDOS
    // ========================================================================

    /**
     * Listar padrões aprendidos
     * GET /api/v1/intelligence/patterns/
     */
    async listPatterns(params?: {
        pattern_type?: string;
        scope?: 'user' | 'organization' | 'platform';
        is_active?: boolean;
        min_confidence?: number;
        page?: number;
        page_size?: number;
    }): Promise<PaginatedResponse<LearnedPattern>> {
        const response = await apiClient.get<PaginatedResponse<LearnedPattern>>(
            `${this.baseURL}/patterns/`,
            { params }
        );
        return response.data;
    }

    /**
     * Obter padrão específico
     * GET /api/v1/intelligence/patterns/:id/
     */
    async getPattern(id: string): Promise<LearnedPattern> {
        const response = await apiClient.get<LearnedPattern>(`${this.baseURL}/patterns/${id}/`);
        return response.data;
    }

    // ========================================================================
    // RANKING E ESTATÍSTICAS
    // ========================================================================

    /**
     * Obter ranking de documentos/usuários
     * GET /api/v1/intelligence/ranking/
     */
    async getRanking(params: {
        ranking_type: 'most_analyzed' | 'most_active_users' | 'document_types' | 'alert_types';
        period?: 'day' | 'week' | 'month' | 'year';
        limit?: number;
    }): Promise<Array<{ name: string; count: number; metadata?: Record<string, any> }>> {
        const response = await apiClient.get<Array<{ name: string; count: number; metadata?: Record<string, any> }>>(
            `${this.baseURL}/ranking/`,
            { params }
        );
        return response.data;
    }

    // ========================================================================
    // ACTIVITY FEED
    // ========================================================================

    /**
     * Obter feed de atividades recentes
     * GET /api/v1/intelligence/activity-feed/
     */
    async getActivityFeed(params?: {
        activity_type?: string;
        entity_type?: string;
        limit?: number;
        hours?: number;
    }): Promise<ActivityFeedItem[]> {
        const response = await apiClient.get<ActivityFeedItem[]>(
            `${this.baseURL}/activity-feed/`,
            { params }
        );
        return response.data;
    }

    // ========================================================================
    // STATUS DO SISTEMA
    // ========================================================================

    /**
     * Verificar status dos modelos de linguagem
     * GET /api/v1/intelligence/status/
     */
    async getStatus(): Promise<LanguageModelStatus> {
        const response = await apiClient.get<LanguageModelStatus>(`${this.baseURL}/status/`);
        return response.data;
    }
}

// Singleton instance
export const intelligenceService = new IntelligenceService();
export default intelligenceService;
