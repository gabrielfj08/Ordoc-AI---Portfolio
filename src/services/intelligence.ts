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

export interface SuggestedAction {
    action_type: string;
    label: string;
    description?: string;
    auto_applicable?: boolean;
    payload?: Record<string, any>;
}

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
    suggested_actions?: SuggestedAction[];
    is_read?: boolean;
    is_dismissed?: boolean;
    created_at?: string;
    updated_at?: string;
}

// ============================================================================
// CHAT INTERFACES
// ============================================================================

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    agent_contributions?: Array<{
        agent_id: string;
        agent_name: string;
        confidence?: number;
    }>;
    reasoning?: string;
    confidence_score?: number;
    processing_time_ms?: number;
    references?: Array<any>;
    user_feedback?: 'helpful' | 'not_helpful' | 'incorrect' | 'perfect';
    feedback_comment?: string;
    created_at: string;
    edited_at?: string;
}

export interface ChatConversation {
    id: string;
    document_id?: string;
    title: string;
    summary?: string;
    active_agents?: string[];
    is_active: boolean;
    user_satisfaction_score?: number;
    created_at: string;
    updated_at: string;
    last_message_at?: string;
    last_message?: {
        role: string;
        content: string;
        created_at: string;
    };
    message_count?: number;
}

export interface SendMessageRequest {
    content: string;
}

export interface SendMessageResponse {
    user_message: ChatMessage;
    assistant_message: ChatMessage;
}

export interface CreateConversationRequest {
    document_id?: string;
    document_content_type?: string;
    title?: string;
}

// ============================================================================
// AGENT INTERFACES
// ============================================================================

export interface AgentRegistry {
    id: string;
    name: string;
    display_name: string;
    description: string;
    agent_type: 'core' | 'specialized' | 'learned' | 'temporary';
    specializations: string[];
    supported_document_types?: string[];
    model_name: string;
    temperature: number;
    learns_from_feedback: boolean;
    auto_improve_prompt: boolean;
    total_invocations: number;
    average_confidence: number;
    average_processing_time_ms: number;
    success_rate: number;
    status: 'active' | 'inactive' | 'training' | 'deprecated';
    prompt_version: number;
    created_at: string;
    updated_at: string;
    last_used_at?: string;
}

export interface AgentPerformanceMetric {
    id: string;
    agent_name: string;
    period_start: string;
    period_end: string;
    invocations: number;
    total_tokens: number;
    avg_response_time_ms: number;
    avg_confidence_score: number;
    positive_feedback_count: number;
    negative_feedback_count: number;
    feedback_ratio: number;
    correct_predictions: number;
    incorrect_predictions: number;
    accuracy: number;
    patterns_learned: number;
    prompt_refinements: number;
    created_at: string;
}

export interface AgentLearningEvent {
    id: string;
    agent_name: string;
    event_type: 'prompt_refinement' | 'pattern_learned' | 'feedback_incorporated' | 'model_updated' | 'specialization_added';
    description: string;
    changes: Record<string, any>;
    confidence_before: number;
    confidence_after: number;
    performance_delta: number;
    created_at: string;
}

export interface AgentPerformanceSummary {
    agent_id: string;
    agent_name: string;
    period_days: number;
    total_invocations: number;
    average_confidence: number;
    average_response_time_ms: number;
    positive_feedback: number;
    negative_feedback: number;
    feedback_ratio: number;
    accuracy: number;
    learning_events: Record<string, number>;
    prompt_version: number;
    status: string;
}

export interface CreateAgentRequest {
    name: string;
    display_name: string;
    description: string;
    system_prompt: string;
    specializations: string[];
    agent_type?: 'core' | 'specialized' | 'learned' | 'temporary';
    model_name?: string;
    temperature?: number;
    sector?: string;
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
    private baseURL = '/intelligence';

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
        const response = await apiClient.post<ProactiveAlert>(`${this.baseURL}/alerts/${id}/mark_as_read/`);
        return response.data;
    }

    /**
     * Descartar alerta
     * POST /api/v1/intelligence/alerts/:id/dismiss/
     */
    async dismissAlert(id: string): Promise<ProactiveAlert> {
        // O backend usa mark_as_read para ambos lido e descartado (setando para 'dismissed')
        const response = await apiClient.post<ProactiveAlert>(`${this.baseURL}/alerts/${id}/mark_as_read/`);
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
        entity_type?: 'document' | 'task' | 'procedure';
        view_mode?: 'personal' | 'team';
        limit?: number;
    }): Promise<Array<{
        entity_type: string;
        entity_id: string;
        score: number;
        personal_score: number;
        department_score: number;
        organization_score: number;
        sector_score: number;
        last_updated: string;
    }>> {
        const response = await apiClient.get<Array<any>>(
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
    // CHAT - Conversas Inteligentes com Documentos
    // ========================================================================

    /**
     * Criar nova conversa
     * POST /api/v1/intelligence/chat/conversations/
     */
    async createConversation(data: CreateConversationRequest): Promise<ChatConversation> {
        const response = await apiClient.post<ChatConversation>(
            `${this.baseURL}/chat/conversations/`,
            data
        );
        return response.data;
    }

    /**
     * Listar conversas do usuário
     * GET /api/v1/intelligence/chat/conversations/list/
     */
    async listConversations(params?: {
        is_active?: boolean;
        limit?: number;
    }): Promise<{ conversations: ChatConversation[] }> {
        const response = await apiClient.get<{ conversations: ChatConversation[] }>(
            `${this.baseURL}/chat/conversations/list/`,
            { params }
        );
        return response.data;
    }

    /**
     * Obter conversa específica
     * GET /api/v1/intelligence/chat/conversations/{id}/
     */
    async getConversation(conversationId: string): Promise<ChatConversation> {
        const response = await apiClient.get<ChatConversation>(
            `${this.baseURL}/chat/conversations/${conversationId}/`
        );
        return response.data;
    }

    /**
     * Enviar mensagem e receber resposta da IA
     * POST /api/v1/intelligence/chat/conversations/{id}/messages/
     */
    async sendMessage(conversationId: string, data: SendMessageRequest): Promise<SendMessageResponse> {
        const response = await apiClient.post<SendMessageResponse>(
            `${this.baseURL}/chat/conversations/${conversationId}/messages/`,
            data
        );
        return response.data;
    }

    /**
     * Obter histórico de mensagens
     * GET /api/v1/intelligence/chat/conversations/{id}/messages/list/
     */
    async getMessages(conversationId: string, params?: {
        limit?: number;
    }): Promise<{ messages: ChatMessage[] }> {
        const response = await apiClient.get<{ messages: ChatMessage[] }>(
            `${this.baseURL}/chat/conversations/${conversationId}/messages/list/`,
            { params }
        );
        return response.data;
    }

    /**
     * Submeter feedback sobre mensagem
     * POST /api/v1/intelligence/chat/conversations/{id}/messages/{msg_id}/feedback/
     */
    async submitMessageFeedback(
        conversationId: string,
        messageId: string,
        data: {
            feedback: 'helpful' | 'not_helpful' | 'incorrect' | 'perfect';
            comment?: string;
        }
    ): Promise<{ message: string }> {
        const response = await apiClient.post<{ message: string }>(
            `${this.baseURL}/chat/conversations/${conversationId}/messages/${messageId}/feedback/`,
            data
        );
        return response.data;
    }

    /**
     * Encerrar conversa
     * POST /api/v1/intelligence/chat/conversations/{id}/close/
     */
    async closeConversation(
        conversationId: string,
        data?: { satisfaction_score?: number }
    ): Promise<{ message: string }> {
        const response = await apiClient.post<{ message: string }>(
            `${this.baseURL}/chat/conversations/${conversationId}/close/`,
            data || {}
        );
        return response.data;
    }

    // ========================================================================
    // AGENTS - Registro e Gerenciamento de Agentes Dinâmicos
    // ========================================================================

    /**
     * Criar novo agente
     * POST /api/v1/intelligence/agents/
     */
    async createAgent(data: CreateAgentRequest): Promise<AgentRegistry> {
        const response = await apiClient.post<AgentRegistry>(
            `${this.baseURL}/agents/`,
            data
        );
        return response.data;
    }

    /**
     * Listar agentes
     * GET /api/v1/intelligence/agents/list/
     */
    async listAgents(params?: {
        agent_type?: 'core' | 'specialized' | 'learned' | 'temporary';
        status?: 'active' | 'inactive' | 'training' | 'deprecated';
        specialization?: string;
    }): Promise<{ agents: AgentRegistry[] }> {
        const response = await apiClient.get<{ agents: AgentRegistry[] }>(
            `${this.baseURL}/agents/list/`,
            { params }
        );
        return response.data;
    }

    /**
     * Obter agente específico
     * GET /api/v1/intelligence/agents/{id}/
     */
    async getAgent(agentId: string): Promise<AgentRegistry> {
        const response = await apiClient.get<AgentRegistry>(
            `${this.baseURL}/agents/${agentId}/`
        );
        return response.data;
    }

    /**
     * Atualizar agente
     * PATCH /api/v1/intelligence/agents/{id}/update/
     */
    async updateAgent(agentId: string, data: Partial<AgentRegistry>): Promise<AgentRegistry> {
        const response = await apiClient.patch<AgentRegistry>(
            `${this.baseURL}/agents/${agentId}/update/`,
            data
        );
        return response.data;
    }

    /**
     * Deletar agente (soft delete)
     * DELETE /api/v1/intelligence/agents/{id}/delete/
     */
    async deleteAgent(agentId: string): Promise<{ message: string }> {
        const response = await apiClient.delete<{ message: string }>(
            `${this.baseURL}/agents/${agentId}/delete/`
        );
        return response.data;
    }

    /**
     * Obter resumo de performance do agente
     * GET /api/v1/intelligence/agents/{id}/performance/
     */
    async getAgentPerformance(agentId: string, days: number = 30): Promise<AgentPerformanceSummary> {
        const response = await apiClient.get<AgentPerformanceSummary>(
            `${this.baseURL}/agents/${agentId}/performance/`,
            { params: { days } }
        );
        return response.data;
    }

    /**
     * Obter métricas detalhadas do agente
     * GET /api/v1/intelligence/agents/{id}/metrics/
     */
    async getAgentMetrics(agentId: string, days: number = 7): Promise<{ metrics: AgentPerformanceMetric[] }> {
        const response = await apiClient.get<{ metrics: AgentPerformanceMetric[] }>(
            `${this.baseURL}/agents/${agentId}/metrics/`,
            { params: { days } }
        );
        return response.data;
    }

    /**
     * Obter eventos de aprendizado do agente
     * GET /api/v1/intelligence/agents/{id}/learning/
     */
    async getAgentLearningEvents(
        agentId: string,
        params?: {
            event_type?: string;
            limit?: number;
        }
    ): Promise<{ events: AgentLearningEvent[] }> {
        const response = await apiClient.get<{ events: AgentLearningEvent[] }>(
            `${this.baseURL}/agents/${agentId}/learning/`,
            { params }
        );
        return response.data;
    }

    /**
     * Selecionar melhores agentes para uma tarefa
     * POST /api/v1/intelligence/agents/select/
     */
    async selectAgentsForTask(data: {
        document_type?: string;
        specializations_needed?: string[];
        max_agents?: number;
    }): Promise<{ selected_agents: AgentRegistry[]; count: number }> {
        const response = await apiClient.post<{ selected_agents: AgentRegistry[]; count: number }>(
            `${this.baseURL}/agents/select/`,
            data
        );
        return response.data;
    }

    /**
     * Obter todas as especializações disponíveis
     * GET /api/v1/intelligence/agents/specializations/
     */
    async getSpecializations(): Promise<{ specializations: string[] }> {
        const response = await apiClient.get<{ specializations: string[] }>(
            `${this.baseURL}/agents/specializations/`
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
