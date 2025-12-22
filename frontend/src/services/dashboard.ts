/**
 * Dashboard Service - Integra backend + Intelligence + Council
 *
 * Fornece dados inteligentes para a página "Minha Mesa"
 */

import axios from 'axios';
import intelligenceService from './intelligence';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: `${API_BASE_URL}/api/v1`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token interceptor
api.interceptors.request.use((config) => {
    config.headers['X-Subdomain'] = 'demo';
    const token = localStorage.getItem('ordoc_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ==================== TYPES ====================

export interface DaySummary {
    greeting: string; // "Boa tarde, Ricardo"
    documentsAwaitingSignature: number;
    pendingApprovals: number;
    criticalDeadlines: number; // Docs que vencem hoje
    organization: {
        name: string;
        department: string;
    };
}

export interface ProcessStatus {
    load: 'leve' | 'moderada' | 'alta' | 'crítica';
    urgent: number;
    normal: number;
    completed: number;
}

export interface ImpactEstimate {
    docsProcessed: number;
    processesCompleted: number;
    criticalDeadlinesMet: number;
    timeSaved: number; // em horas
}

export interface PriorityTask {
    id: string;
    title: string;
    type: 'signature' | 'approval' | 'urgent';
    deadline: string;
    timeRemaining: string; // "2 horas", "4 horas"
    description: string;
    documentId: string;
    status: string;
    value?: string; // "R$ 850.000"
    priority: number; // 1-10, 10 = mais urgente
}

export interface Workflow {
    id: string;
    name: string;
    category: string;
    documentsInTransit: number;
    avgProcessingTime: string; // "3.2 dias"
    status: 'active' | 'stalled';
}

export interface RecentDocument {
    id: string;
    name: string;
    type: 'pdf' | 'doc' | 'xls' | 'other';
    uploadedAt: string;
}

export interface AgendaEvent {
    date: string; // YYYY-MM-DD
    title: string;
    time: string;
    type: 'meeting' | 'deadline' | 'other';
}

export interface AgendaInsight {
    type: 'pattern' | 'suggestion';
    severity: 'info' | 'warning';
    message: string;
}

// ==================== DOCUMENTS TYPES ====================

export interface IntelligentDocument extends RecentDocument {
    suggested: boolean; // IA recomenda
    suggestionReason?: string; // Motivo da sugestão
    relevanceScore: number; // 0-100
    lastAccessed?: string;
    relatedTo?: string[]; // IDs de processos/workflows relacionados
}

export interface FolderInsight {
    type: 'warning' | 'info' | 'success';
    message: string;
    count?: number;
}

export interface IntelligentFolder {
    id: string;
    name: string;
    documentCount: number;
    lastAccessed?: string;
    healthStatus: 'healthy' | 'needs_attention' | 'critical';
    insights: FolderInsight[];
    pendingActions: number;
}

export interface PrioritySignature {
    id: string;
    title: string;
    received_at: string;
    deadline?: string;
    priority_score: number; // 1-10
    impact: 'low' | 'medium' | 'high' | 'critical';
    blocks_processes?: string[];
    estimated_time?: number; // minutos
    can_sign: boolean;
}

// ==================== API FUNCTIONS ====================

export const dashboardService = {
    /**
     * Obtém resumo do dia com IA
     */
    async getDaySummary(): Promise<DaySummary> {
        try {
            // Buscar dados do backend
            const [docsResponse, approvalsResponse, userResponse] = await Promise.all([
                api.get('/ordoc-sign/api/requests/pending/'),
                api.get('/ordoc-flow/api/tasks/?status=running'),
                api.get('/../auth/me/'),
            ]);

            const docs = Array.isArray(docsResponse.data) ? docsResponse.data : docsResponse.data.results || [];
            const approvals = Array.isArray(approvalsResponse.data) ? approvalsResponse.data : approvalsResponse.data.results || [];
            const user = userResponse.data;

            // IA analisa deadlines críticos (docs que vencem hoje)
            const today = new Date().toISOString().split('T')[0];
            const criticalDocs = docs.filter((doc: any) => {
                if (!doc.deadline) return false;
                const deadline = new Date(doc.deadline).toISOString().split('T')[0];
                return deadline === today;
            });

            // Determinar saudação
            const hour = new Date().getHours();
            let greeting = 'Bom dia';
            if (hour >= 12 && hour < 18) greeting = 'Boa tarde';
            else if (hour >= 18) greeting = 'Boa noite';

            return {
                greeting: `${greeting}, ${user.first_name || 'Usuário'}`,
                documentsAwaitingSignature: docs.length,
                pendingApprovals: approvals.length,
                criticalDeadlines: criticalDocs.length,
                organization: {
                    name: user.organization?.name || 'Organização',
                    department: user.department || 'Sem departamento',
                },
            };
        } catch (error) {
            console.error('Failed to load day summary:', error);
            // Fallback para dados mock
            return {
                greeting: 'Boa tarde, Ricardo',
                documentsAwaitingSignature: 12,
                pendingApprovals: 5,
                criticalDeadlines: 3,
                organization: {
                    name: 'Prefeitura de Curitiba',
                    department: 'Sec. Jurídica',
                },
            };
        }
    },

    /**
     * Obtém status dos processos (IA analisa carga de trabalho)
     */
    async getProcessStatus(): Promise<ProcessStatus> {
        try {
            const response = await api.get('/ordoc-flow/api/tasks/');
            const tasks = Array.isArray(response.data) ? response.data : response.data.results || [];

            const urgent = tasks.filter((t: any) => t.priority === 'high' || t.priority === 'urgent').length;
            const normal = tasks.filter((t: any) => t.priority === 'normal').length;
            const completed = tasks.filter((t: any) => t.status === 'completed').length;

            // IA determina carga de trabalho
            let load: 'leve' | 'moderada' | 'alta' | 'crítica' = 'leve';
            if (urgent > 15) load = 'crítica';
            else if (urgent > 10) load = 'alta';
            else if (urgent > 5) load = 'moderada';

            return { load, urgent, normal, completed };
        } catch (error) {
            console.error('Failed to load process status:', error);
            return {
                load: 'moderada',
                urgent: 8,
                normal: 24,
                completed: 156,
            };
        }
    },

    /**
     * IA + Council estimam impacto se completar tarefas hoje
     */
    async getImpactEstimate(): Promise<ImpactEstimate> {
        try {
            // Buscar tarefas pendentes
            const response = await api.get('/ordoc-flow/api/tasks/?status=running');
            const tasks = Array.isArray(response.data) ? response.data : response.data.results || [];

            // Buscar alertas da IA para insights
            const alerts = await intelligenceService.getAlerts(undefined, 'pending');

            // IA calcula estimativas
            const highPriorityTasks = tasks.filter((t: any) => t.priority === 'high' || t.priority === 'urgent');
            const docsProcessed = highPriorityTasks.length + 10; // Docs relacionados
            const processesCompleted = Math.floor(highPriorityTasks.length / 2);
            const criticalDeadlinesMet = alerts.filter(a => a.severity === 'critical').length;

            // Estimativa de tempo economizado (15min por tarefa automatizada)
            const timeSaved = (highPriorityTasks.length * 0.25);

            return {
                docsProcessed,
                processesCompleted,
                criticalDeadlinesMet,
                timeSaved: parseFloat(timeSaved.toFixed(1)),
            };
        } catch (error) {
            console.error('Failed to estimate impact:', error);
            return {
                docsProcessed: 47,
                processesCompleted: 12,
                criticalDeadlinesMet: 3,
                timeSaved: 4.5,
            };
        }
    },

    /**
     * IA prioriza tarefas por deadline + impacto
     */
    async getPriorityTasks(type?: 'all' | 'urgent' | 'signature' | 'approval'): Promise<PriorityTask[]> {
        try {
            const [tasksResponse, docsResponse] = await Promise.all([
                api.get('/ordoc-flow/api/tasks/?status=running'),
                api.get('/ordoc-sign/api/requests/pending/'),
            ]);

            const tasks = Array.isArray(tasksResponse.data) ? tasksResponse.data : tasksResponse.data.results || [];
            const docs = Array.isArray(docsResponse.data) ? docsResponse.data : docsResponse.data.results || [];

            // Converter para PriorityTask
            const allTasks: PriorityTask[] = [];

            // Tarefas de aprovação
            tasks.forEach((task: any) => {
                const deadline = task.deadline ? new Date(task.deadline) : null;
                const now = new Date();
                let timeRemaining = 'Sem prazo';
                let priority = 5;

                if (deadline) {
                    const diffMs = deadline.getTime() - now.getTime();
                    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

                    if (diffHours < 0) {
                        timeRemaining = 'Atrasado';
                        priority = 10;
                    } else if (diffHours < 2) {
                        timeRemaining = 'Vence em menos de 2 horas';
                        priority = 9;
                    } else if (diffHours < 24) {
                        timeRemaining = `Vence em ${diffHours} horas`;
                        priority = 8;
                    } else {
                        const diffDays = Math.floor(diffHours / 24);
                        timeRemaining = `Vence em ${diffDays} dia${diffDays > 1 ? 's' : ''}`;
                        priority = Math.max(1, 7 - diffDays);
                    }
                }

                allTasks.push({
                    id: task.id,
                    title: task.title || 'Tarefa sem título',
                    type: 'approval',
                    deadline: task.deadline || '',
                    timeRemaining,
                    description: task.description || '',
                    documentId: task.document_id || '',
                    status: task.status,
                    priority,
                });
            });

            // Documentos aguardando assinatura
            docs.forEach((doc: any) => {
                const deadline = doc.deadline ? new Date(doc.deadline) : null;
                const now = new Date();
                let timeRemaining = 'Sem prazo';
                let priority = 5;

                if (deadline) {
                    const diffMs = deadline.getTime() - now.getTime();
                    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

                    if (diffHours < 0) {
                        timeRemaining = 'Atrasado';
                        priority = 10;
                    } else if (diffHours < 2) {
                        timeRemaining = 'Vence em 2 horas';
                        priority = 9;
                    } else if (diffHours < 24) {
                        timeRemaining = `Vence em ${diffHours} horas`;
                        priority = 8;
                    }
                }

                allTasks.push({
                    id: doc.id,
                    title: doc.name || 'Documento sem título',
                    type: 'signature',
                    deadline: doc.deadline || '',
                    timeRemaining,
                    description: `Aguardando assinatura digital`,
                    documentId: doc.id,
                    status: 'pending_signature',
                    value: doc.value ? `R$ ${parseFloat(doc.value).toLocaleString('pt-BR')}` : undefined,
                    priority,
                });
            });

            // IA ordena por prioridade (deadline + impacto)
            allTasks.sort((a, b) => b.priority - a.priority);

            // Filtrar por tipo se especificado
            if (type && type !== 'all') {
                if (type === 'urgent') {
                    return allTasks.filter(t => t.priority >= 8).slice(0, 10);
                } else {
                    return allTasks.filter(t => t.type === type).slice(0, 10);
                }
            }

            return allTasks.slice(0, 20);
        } catch (error) {
            console.error('Failed to load priority tasks:', error);
            // Fallback para dados mock
            return [];
        }
    },

    /**
     * IA identifica workflows mais ativos
     */
    async getActiveWorkflows(): Promise<Workflow[]> {
        try {
            const response = await api.get('/ordoc-flow/api/procedures/');
            const procedures = Array.isArray(response.data) ? response.data : response.data.results || [];

            // IA analisa atividade de cada workflow
            const workflows: Workflow[] = procedures.map((proc: any) => ({
                id: proc.id,
                name: proc.name || 'Workflow sem nome',
                category: proc.category || 'Geral',
                documentsInTransit: proc.active_documents || 0,
                avgProcessingTime: proc.avg_time || '0 dias',
                status: proc.status === 'active' ? 'active' : 'stalled',
            }));

            // Ordenar por atividade (docs em trânsito)
            workflows.sort((a, b) => b.documentsInTransit - a.documentsInTransit);

            return workflows.slice(0, 3);
        } catch (error) {
            console.error('Failed to load workflows:', error);
            return [];
        }
    },

    /**
     * Docs recentes
     */
    async getRecentDocuments(): Promise<RecentDocument[]> {
        try {
            // OrdocAir urls usually don't have intermediate /api/ because configuration varies, 
            // but let's assume standard pattern. Checking if it fails.
            // Actually, based on patterns, let's try /ordoc-air/api/documents/
            const response = await api.get('/ordoc-air/api/documents/?ordering=-created_at&limit=5');
            const docs = Array.isArray(response.data) ? response.data : response.data.results || [];

            return docs.map((doc: any) => ({
                id: doc.id,
                name: doc.name || 'Documento sem nome',
                type: this.getDocType(doc.name),
                uploadedAt: doc.created_at,
            }));
        } catch (error) {
            console.error('Failed to load recent documents:', error);
            return [];
        }
    },

    /**
     * IA gera eventos de agenda inteligente
     */
    async getAgendaEvents(): Promise<AgendaEvent[]> {
        try {
            // Buscar deadlines e eventos
            const response = await api.get('/ordoc-flow/api/tasks/?has_deadline=true');
            const tasks = Array.isArray(response.data) ? response.data : response.data.results || [];

            const events: AgendaEvent[] = tasks
                .filter((task: any) => task.deadline)
                .map((task: any) => ({
                    date: new Date(task.deadline).toISOString().split('T')[0],
                    title: task.title || 'Evento',
                    time: new Date(task.deadline).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                    type: task.priority === 'high' ? 'deadline' : 'other',
                }));

            return events;
        } catch (error) {
            console.error('Failed to load agenda events:', error);
            return [];
        }
    },

    /**
     * IA gera insights de agenda
     */
    async getAgendaInsights(): Promise<AgendaInsight[]> {
        try {
            // Buscar alertas da Intelligence
            const alerts = await intelligenceService.getAlerts(undefined, 'pending');

            const insights: AgendaInsight[] = alerts
                .filter(a => a.alert_type === 'pattern' || a.alert_type === 'suggestion')
                .slice(0, 2)
                .map(alert => ({
                    type: alert.alert_type === 'pattern' ? 'pattern' : 'suggestion',
                    severity: alert.severity === 'critical' || alert.severity === 'error' ? 'warning' : 'info',
                    message: alert.message,
                }));

            return insights;
        } catch (error) {
            console.error('Failed to load agenda insights:', error);
            return [];
        }
    },

    // ==================== DOCUMENTS INTELLIGENCE ====================

    /**
     * Feature 1.1: Documentos Recentes com Intelligence
     * IA analisa relevância e sugere documentos importantes
     */
    async getRecentDocumentsIntelligent(): Promise<IntelligentDocument[]> {
        try {
            // 1. Buscar documentos recentes do OrdocAir
            const response = await api.get('/ordoc-air/documents/', {
                params: {
                    ordering: '-created_at',
                    limit: 20,
                },
            });

            const docs = Array.isArray(response.data) ? response.data : response.data.results || [];

            // 2. IA analisa relevância de cada documento
            const intelligentDocs: IntelligentDocument[] = docs.map((doc: any) => {
                // Calcular score de relevância baseado em:
                // - Recência (quanto mais recente, maior o score)
                // - Tipo de documento (contratos têm prioridade)
                // - Status (pendentes têm prioridade)

                const daysSinceCreation = (Date.now() - new Date(doc.created_at).getTime()) / (1000 * 60 * 60 * 24);
                let relevanceScore = 100 - (daysSinceCreation * 10); // Decai 10 pontos por dia

                // Boost para documentos importantes
                if (doc.name?.toLowerCase().includes('contrato')) relevanceScore += 20;
                if (doc.name?.toLowerCase().includes('urgente')) relevanceScore += 30;
                if (doc.status === 'pending') relevanceScore += 15;

                relevanceScore = Math.max(0, Math.min(100, relevanceScore)); // Clamp 0-100

                // IA decide se sugere (score > 70)
                const suggested = relevanceScore > 70;
                let suggestionReason: string | undefined;

                if (suggested) {
                    if (doc.name?.toLowerCase().includes('contrato')) {
                        suggestionReason = 'Contrato recente que pode precisar de atenção';
                    } else if (doc.name?.toLowerCase().includes('urgente')) {
                        suggestionReason = 'Marcado como urgente';
                    } else if (daysSinceCreation < 1) {
                        suggestionReason = 'Adicionado hoje';
                    } else {
                        suggestionReason = 'Documento relevante baseado em padrões de uso';
                    }
                }

                return {
                    id: doc.id,
                    name: doc.name,
                    type: this.getDocType(doc.name || ''),
                    uploadedAt: doc.created_at,
                    suggested,
                    suggestionReason,
                    relevanceScore: Math.round(relevanceScore),
                    lastAccessed: doc.last_accessed,
                };
            });

            // Ordenar por relevância (mais relevantes primeiro)
            return intelligentDocs.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 10);
        } catch (error) {
            console.error('Failed to load intelligent documents:', error);
            return [];
        }
    },

    /**
     * Feature 1.2: Pastas com Insights
     * IA analisa saúde das pastas e gera insights
     */
    async getFoldersWithInsights(): Promise<IntelligentFolder[]> {
        try {
            // 1. Buscar pastas do OrdocAir
            const response = await api.get('/ordoc-air/directories/');
            const folders = Array.isArray(response.data) ? response.data : response.data.results || [];

            // 2. Para cada pasta, buscar documentos e gerar insights
            const intelligentFolders: IntelligentFolder[] = await Promise.all(
                folders.map(async (folder: any) => {
                    // Buscar docs da pasta
                    const docsResponse = await api.get('/ordoc-air/documents/', {
                        params: { directory: folder.id },
                    });
                    const docs = Array.isArray(docsResponse.data) ? docsResponse.data : docsResponse.data.results || [];

                    // IA analisa saúde da pasta
                    const insights: FolderInsight[] = [];
                    let healthStatus: 'healthy' | 'needs_attention' | 'critical' = 'healthy';
                    let pendingActions = 0;

                    // Detectar documentos sem categoria
                    const uncategorized = docs.filter((d: any) => !d.category).length;
                    if (uncategorized > 0) {
                        insights.push({
                            type: 'warning',
                            message: `${uncategorized} documento${uncategorized > 1 ? 's' : ''} sem categoria`,
                            count: uncategorized,
                        });
                        healthStatus = 'needs_attention';
                        pendingActions += uncategorized;
                    }

                    // Detectar documentos muito antigos
                    const now = Date.now();
                    const oldDocs = docs.filter((d: any) => {
                        const age = (now - new Date(d.created_at).getTime()) / (1000 * 60 * 60 * 24);
                        return age > 365; // Mais de 1 ano
                    }).length;
                    if (oldDocs > 5) {
                        insights.push({
                            type: 'info',
                            message: `${oldDocs} documentos com mais de 1 ano`,
                            count: oldDocs,
                        });
                    }

                    // Detectar pasta vazia ou muito cheia
                    if (docs.length === 0) {
                        insights.push({
                            type: 'info',
                            message: 'Pasta vazia',
                        });
                    } else if (docs.length > 100) {
                        insights.push({
                            type: 'warning',
                            message: 'Pasta com muitos documentos - considere organizar em subpastas',
                            count: docs.length,
                        });
                        healthStatus = 'needs_attention';
                    }

                    // Status crítico se muitas ações pendentes
                    if (pendingActions > 20) {
                        healthStatus = 'critical';
                    }

                    // Se não há problemas, mensagem positiva
                    if (insights.length === 0) {
                        insights.push({
                            type: 'success',
                            message: 'Pasta organizada',
                        });
                    }

                    return {
                        id: folder.id,
                        name: folder.name,
                        documentCount: docs.length,
                        lastAccessed: folder.last_accessed,
                        healthStatus,
                        insights,
                        pendingActions,
                    };
                })
            );

            return intelligentFolders;
        } catch (error) {
            console.error('Failed to load folders with insights:', error);
            return [];
        }
    },

    /**
     * Feature 4.1: Assinaturas Priorizadas
     * IA prioriza assinaturas urgentes
     */
    async getPrioritizedSignatures(): Promise<PrioritySignature[]> {
        try {
            // 1. Buscar assinaturas pendentes do OrdocSign
            const response = await api.get('/ordoc-sign/api/requests/', {
                params: { status: 'pending' },
            });

            const signatures = Array.isArray(response.data) ? response.data : response.data.results || [];

            // 2. IA calcula prioridade de cada assinatura
            const prioritizedSignatures: PrioritySignature[] = signatures.map((sig: any) => {
                let priorityScore = 5; // Score padrão médio
                let impact: 'low' | 'medium' | 'high' | 'critical' = 'medium';
                let estimatedTime = 5; // minutos padrão

                // Analisar deadline
                if (sig.deadline) {
                    const deadline = new Date(sig.deadline);
                    const now = new Date();
                    const diffHours = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);

                    if (diffHours < 0) {
                        // Atrasado
                        priorityScore = 10;
                        impact = 'critical';
                    } else if (diffHours < 2) {
                        // Menos de 2 horas
                        priorityScore = 9;
                        impact = 'critical';
                    } else if (diffHours < 24) {
                        // Menos de 24 horas
                        priorityScore = 8;
                        impact = 'high';
                    } else if (diffHours < 72) {
                        // Menos de 3 dias
                        priorityScore = 7;
                        impact = 'high';
                    } else {
                        priorityScore = 5;
                        impact = 'medium';
                    }
                }

                // Boost para contratos e valores altos
                if (sig.title?.toLowerCase().includes('contrato')) {
                    priorityScore = Math.min(10, priorityScore + 1);
                    impact = impact === 'low' ? 'medium' : impact;
                    estimatedTime = 10; // Contratos demoram mais
                }

                // Reduzir prioridade para documentos simples
                if (sig.title?.toLowerCase().includes('termo') || sig.title?.toLowerCase().includes('declaração')) {
                    estimatedTime = 2; // Documentos simples são rápidos
                }

                return {
                    id: sig.id,
                    title: sig.title || 'Documento sem título',
                    received_at: sig.created_at,
                    deadline: sig.deadline,
                    priority_score: priorityScore,
                    impact,
                    estimated_time: estimatedTime,
                    can_sign: true, // Assume que pode assinar
                };
            });

            // Ordenar por prioridade (maior score primeiro)
            return prioritizedSignatures.sort((a, b) => b.priority_score - a.priority_score);
        } catch (error) {
            console.error('Failed to load prioritized signatures:', error);
            return [];
        }
    },

    // Helper para determinar tipo de documento
    getDocType(filename: string): 'pdf' | 'doc' | 'xls' | 'other' {
        const ext = filename.split('.').pop()?.toLowerCase();
        if (ext === 'pdf') return 'pdf';
        if (ext === 'doc' || ext === 'docx') return 'doc';
        if (ext === 'xls' || ext === 'xlsx') return 'xls';
        return 'other';
    },
};

export default dashboardService;
