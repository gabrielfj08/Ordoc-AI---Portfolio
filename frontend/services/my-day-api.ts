import apiClient from './api-client'

const ORDOC_FLOW_BASE = '/api/v1/ordoc-flow'
const ORDOC_AIR_BASE = '/api/v1/ordoc-air'
const ORDOC_SIGN_BASE = '/api/v1/ordoc-sign'
const DASHBOARD_BASE = '/api/v1/dashboard'

export interface DashboardOverview {
    total_documents: number
    active_users: number
    active_procedures: number
    approval_rate: number
    documents_change: string
    users_change: string
    procedures_change: string
    approval_rate_change: string
    procedure_stats: {
        urgent: number
        normal: number
        completed: number
        total: number
    }
    task_stats: {
        urgent: number
        normal: number
        completed: number
        total: number
    }
    team_stats: Array<{
        name: string
        status: string
        statusColor: string
        avatar: string | null
    }>
}

export interface RecentDocument {
    id: string
    title: string
    file_name: string
    file_size: number
    created_at: string
    relevance_score?: number
    recommendation_reason?: string
    is_starred?: boolean
    document_type?: string
}

export interface ActiveWorkflow {
    id: string
    name: string
    document_count: number
    average_time_days: number
    status: 'active' | 'paused'
    // Rich UI fields (optional for compatibility)
    current_step?: string
    deadline_label?: string
    deadline_status?: 'normal' | 'learning' | 'urgent' | 'late'
    responsible?: string
    code?: string // e.g. "Pregão 045/2025"
}

export interface PendingSummary {
    pending_signatures: number
    pending_approvals: number
}

export interface DashboardConfig {
    organization: {
        id: string | null
        type: string
        subtype: string
        features: Record<string, any>
    }
    user: {
        roles: string[]
        can_access_team_view: boolean
    }
    dashboard: {
        cards: string[]
    }
}

export const myDayApi = {
    /**
     * Get dashboard configuration (enabled cards, org subtype/features)
     */
    getDashboardConfig: async () => {
        const response = await apiClient.get<DashboardConfig>(
            `${DASHBOARD_BASE}/config/`
        )
        return response.data
    },

    /**
     * Get dashboard overview with all metrics
     */
    getDashboardOverview: async () => {
        const response = await apiClient.get<DashboardOverview>(
            `${ORDOC_FLOW_BASE}/dashboard/overview/`
        )
        return response.data
    },

    /**
     * Get smart recommended documents (previously just recent)
     */
    getRecentDocuments: async (limit = 5) => {
        const response = await apiClient.get<{ results: RecentDocument[] }>(
            `${ORDOC_AIR_BASE}/documents/recommended/`,
            {
                params: {
                    page_size: limit,
                },
            }
        )
        // If the backend returns a paginated response structure (count, next, results), use .results
        // If it returns a plain list (Response(results[:5])), use .data directly (or cast).
        // My backend code handles pagination: 
        // if page is not None: return self.get_paginated_response(page) -> { count, results: [...] }
        // else: return Response(results[:5]) -> [...]
        // Frontend apiClient.get usually returns AxiosResponse.
        // If paginated, data has 'results'. If not, data IS the list.
        // Let's assume pagination is applied or consistent wrapper.
        // The implementation uses paginate_queryset, so it returns paginated response.
        return response.data.results || (Array.isArray(response.data) ? response.data : [])
    },

    /**
     * Get active workflows with document counts
     */
    getActiveWorkflows: async (limit = 3) => {
        const response = await apiClient.get<{ results: any[] }>(
            `${ORDOC_FLOW_BASE}/procedures/`,
            {
                params: {
                    status: 'running,started',
                    ordering: '-created_at',
                    page_size: limit,
                },
            }
        )

        // Transform to ActiveWorkflow format
        const workflows: ActiveWorkflow[] = response.data.results.map((proc, index) => {
            // Simulated logic for rich fields (mocking based on user requirements for now 
            // since backend field mapping is not yet confirmed)
            const isRed = index === 0;
            const isYellow = index === 1;

            return {
                id: proc.id,
                name: proc.name || 'Workflow sem nome',
                code: proc.code || `PRO-${2025000 + index}`, // Placeholder code
                document_count: proc.document_count || 0,
                average_time_days: proc.average_processing_time_days || 0,
                status: proc.status === 'running' || proc.status === 'started' ? 'active' : 'paused',
                current_step: proc.current_step || 'Etapa desconhecida',
                responsible: proc.responsible_name,
                deadline_label: isRed ? 'Prazo: HOJE' : (isYellow ? '2 dias restantes' : 'No prazo'),
                deadline_status: isRed ? 'urgent' : (isYellow ? 'learning' : 'normal'),
            }
        })

        return workflows
    },

    /**
     * Get pending signatures and approvals count
     */
    getPendingSummary: async () => {
        // Get pending signatures (using valid status values: pending and in_progress)
        const signaturesResponse = await apiClient.get<{ count: number }>(
            `${ORDOC_SIGN_BASE}/requests/`,
            {
                params: {
                    status: 'pending,in_progress',
                    page_size: 1,
                },
            }
        )

        // Get pending approvals (tasks assigned to current user)
        const approvalsResponse = await apiClient.get<{ count: number }>(
            `${ORDOC_FLOW_BASE}/tasks/`,
            {
                params: {
                    status: 'running,started',
                    page_size: 1,
                },
            }
        )

        return {
            pending_signatures: signaturesResponse.data.count,
            pending_approvals: approvalsResponse.data.count,
        }
    },

    /**
     * Get items for 'Continue Working' widget (last active task and document)
     */
    getContinueWorkingItems: async () => {
        // Get last modified active task
        const tasksResponse = await apiClient.get<{ results: any[] }>(
            `${ORDOC_FLOW_BASE}/tasks/my_tasks/`,
            {
                params: {
                    status: 'running,started',
                    ordering: '-updated_at',
                    page_size: 1,
                },
            }
        )

        // Get last modified document
        const docsResponse = await apiClient.get<{ results: RecentDocument[] }>(
            `${ORDOC_AIR_BASE}/documents/`,
            {
                params: {
                    ordering: '-updated_at',
                    page_size: 1,
                },
            }
        )

        return {
            lastTask: tasksResponse.data.results[0] || null,
            lastDocument: docsResponse.data.results[0] || null,
        }
    },

    /**
     * Get user info for greeting
     */
    getUserInfo: async () => {
        const response = await apiClient.get<{
            user: {
                username: string
                first_name: string
                last_name: string
                email: string
                view_mode: 'personal' | 'team'
                can_access_team_view: boolean
            }
        }>('/api/auth/me/')
        return response.data.user
    },

    /**
     * Update user preferences
     */
    updateUserPreferences: async (data: { view_mode?: 'personal' | 'team' }) => {
        const response = await apiClient.patch('/api/auth/me/', data)
        return response.data
    },
}
