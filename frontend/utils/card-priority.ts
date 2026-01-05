import { DashboardCardConfig, CardPreferences, PriorityFactors, PrioritizedCard } from '@/types/dashboard-cards'
import { MyDayState } from '@/stores/my-day-store'

/**
 * Calculate dynamic priority for a dashboard card
 */
export function calculateCardPriority(
    card: DashboardCardConfig,
    state: MyDayState,
    preferences: CardPreferences
): number {
    const factors = getPriorityFactors(card, state, preferences)

    return (
        factors.baseScore +
        factors.contentBoost +
        factors.rankingBoost +
        factors.timeBoost +
        factors.userPreferenceBoost
    )
}

/**
 * Get detailed priority factors for debugging/analytics
 */
export function getPriorityFactors(
    card: DashboardCardConfig,
    state: MyDayState,
    preferences: CardPreferences
): PriorityFactors {
    const factors: PriorityFactors = {
        baseScore: card.defaultPriority,
        contentBoost: 0,
        rankingBoost: 0,
        timeBoost: 0,
        userPreferenceBoost: 0,
    }

    // Content boost: More items = higher priority
    if (card.getContentCount) {
        const contentCount = card.getContentCount(state)
        factors.contentBoost = Math.min(contentCount * 2, 20)
    }

    // Ranking boost: Cards with active rankings get priority
    if (card.id === 'documents' && state.documentRankings.length > 0) {
        factors.rankingBoost = 15
    }
    if (card.id === 'workflows' && state.procedureRankings.length > 0) {
        factors.rankingBoost = 15
    }

    // Time boost: Contextual relevance (e.g., team card higher on Monday morning)
    const hour = new Date().getHours()
    const dayOfWeek = new Date().getDay()

    if (card.id === 'team' && dayOfWeek === 1 && hour < 12) {
        factors.timeBoost = 10 // Monday morning boost
    }
    if (card.id === 'workflows' && hour >= 9 && hour <= 17) {
        factors.timeBoost = 5 // Business hours boost
    }

    // User preference boost/penalty
    if (preferences.pinnedCards.includes(card.id)) {
        factors.userPreferenceBoost = 100 // Pinned cards always on top
    }
    if (preferences.hiddenCards.includes(card.id)) {
        factors.userPreferenceBoost = -1000 // Hidden cards filtered out
    }

    return factors
}

/**
 * Sort and prioritize cards for display
 */
export function prioritizeCards(
    cards: DashboardCardConfig[],
    state: MyDayState,
    preferences: CardPreferences,
    maxCards?: number
): PrioritizedCard[] {
    const prioritized = cards
        .filter(card => card.isVisible(state))
        .map(card => ({
            ...card,
            calculatedPriority: calculateCardPriority(card, state, preferences)
        }))
        .filter(card => card.calculatedPriority >= 0) // Remove hidden cards
        .sort((a, b) => b.calculatedPriority - a.calculatedPriority)

    return maxCards ? prioritized.slice(0, maxCards) : prioritized
}

/**
 * Get card content count helper
 */
export function getCardContentCount(
    cardId: string,
    state: MyDayState
): number {
    switch (cardId) {
        case 'documents':
            return state.recentDocuments.length
        case 'workflows':
            return state.activeWorkflows.length
        case 'pending':
            return state.pending.pending_signatures + state.pending.pending_approvals
        default:
            return 0
    }
}
