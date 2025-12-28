import { DashboardCardConfig } from '@/types/dashboard-cards'
import { MyDayState } from '@/stores/my-day-store'

/**
 * Registry of all available dashboard cards
 * 
 * Cards are configured with:
 * - id: Unique identifier
 * - title: Display name
 * - category: Grouping for organization
 * - defaultPriority: Base score (0-100)
 * - minWidth: Minimum responsive width
 * - isVisible: Condition to show card
 * - getContentCount: Optional counter for priority boost
 */
export const DASHBOARD_CARDS: DashboardCardConfig[] = [
    // Content Cards
    {
        id: 'documents',
        title: 'Documentos Recentes',
        category: 'content',
        defaultPriority: 80,
        minWidth: 'lg',
        isVisible: (state) => state.recentDocuments.length > 0,
        getContentCount: (state) => state.recentDocuments.length,
    },
    {
        id: 'workflows',
        title: 'Workflows Ativos',
        category: 'content',
        defaultPriority: 75,
        minWidth: 'md',
        isVisible: (state) => state.activeWorkflows.length > 0,
        getContentCount: (state) => state.activeWorkflows.length,
    },
    {
        id: 'continue-working',
        title: 'Continue de onde parou',
        category: 'content',
        defaultPriority: 70,
        minWidth: 'md',
        isVisible: () => true, // Always visible
    },

    // Insights Cards
    {
        id: 'process-status',
        title: 'Estado dos Processos',
        category: 'insights',
        defaultPriority: 65,
        minWidth: 'md',
        isVisible: (state) => state.overview !== null,
    },
    {
        id: 'ai-alerts',
        title: 'Alertas da IA',
        category: 'insights',
        defaultPriority: 60,
        minWidth: 'md',
        isVisible: () => true, // Always visible
    },
    {
        id: 'pending-actions',
        title: 'Ações Pendentes',
        category: 'insights',
        defaultPriority: 55,
        minWidth: 'sm',
        isVisible: (state) =>
            (state.pending.pending_signatures + state.pending.pending_approvals) > 0,
        getContentCount: (state) =>
            state.pending.pending_signatures + state.pending.pending_approvals,
    },

    // Team Cards
    {
        id: 'team-view',
        title: 'Visão da Equipe',
        category: 'team',
        defaultPriority: 50,
        minWidth: 'md',
        isVisible: () => true, // Always visible
    },
    {
        id: 'smart-agenda',
        title: 'Agenda Inteligente',
        category: 'team',
        defaultPriority: 45,
        minWidth: 'sm',
        isVisible: () => true, // Always visible
    },

    // System Cards
    {
        id: 'system-status',
        title: 'Status do Sistema',
        category: 'system',
        defaultPriority: 40,
        minWidth: 'sm',
        isVisible: () => true, // Always visible
    },
    {
        id: 'storage',
        title: 'Armazenamento',
        category: 'system',
        defaultPriority: 35,
        minWidth: 'sm',
        isVisible: () => true, // Always visible
    },
]

/**
 * Get card configuration by ID
 */
export function getCardById(cardId: string): DashboardCardConfig | undefined {
    return DASHBOARD_CARDS.find(card => card.id === cardId)
}

/**
 * Get cards by category
 */
export function getCardsByCategory(category: DashboardCardConfig['category']): DashboardCardConfig[] {
    return DASHBOARD_CARDS.filter(card => card.category === category)
}
