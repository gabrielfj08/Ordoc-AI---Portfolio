import { useMemo } from 'react'
import { useMyDayStore } from '@/stores/my-day-store'
import { DASHBOARD_CARDS } from '@/config/dashboard-cards'
import { prioritizeCards } from '@/utils/card-priority'
import type { PrioritizedCard } from '@/types/dashboard-cards'

/**
 * Hook to get prioritized dashboard cards
 * 
 * Returns cards sorted by calculated priority, filtered by visibility
 * and user preferences (hidden/pinned)
 */
export function usePrioritizedCards(maxCards?: number): PrioritizedCard[] {
    const state = useMyDayStore()
    const { cardPreferences } = state

    const prioritizedCards = useMemo(() => {
        return prioritizeCards(
            DASHBOARD_CARDS,
            state,
            cardPreferences,
            maxCards
        )
    }, [
        state.recentDocuments.length,
        state.activeWorkflows.length,
        state.documentRankings.length,
        state.procedureRankings.length,
        state.isRankingEnabled,
        cardPreferences.pinnedCards,
        cardPreferences.hiddenCards,
        maxCards,
    ])

    return prioritizedCards
}

/**
 * Hook to get cards by category
 */
export function useCardsByCategory(category: 'content' | 'insights' | 'team' | 'system') {
    const allCards = usePrioritizedCards()
    return allCards.filter(card => card.category === category)
}

/**
 * Hook to check if a card is pinned
 */
export function useIsCardPinned(cardId: string): boolean {
    const { cardPreferences } = useMyDayStore()
    return cardPreferences.pinnedCards.includes(cardId)
}

/**
 * Hook to check if a card is hidden
 */
export function useIsCardHidden(cardId: string): boolean {
    const { cardPreferences } = useMyDayStore()
    return cardPreferences.hiddenCards.includes(cardId)
}
