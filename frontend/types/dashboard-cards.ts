import { MyDayState } from '@/stores/my-day-store'

/**
 * Card configuration for dynamic dashboard
 */
export interface DashboardCardConfig {
    id: string
    title: string
    category: 'content' | 'insights' | 'team' | 'system'
    defaultPriority: number
    minWidth: 'sm' | 'md' | 'lg' | 'full'
    requiredData?: (keyof MyDayState)[]
    isVisible: (state: MyDayState) => boolean
    getContentCount?: (state: MyDayState) => number
}

/**
 * Card with calculated priority
 */
export interface PrioritizedCard extends DashboardCardConfig {
    calculatedPriority: number
}

/**
 * User preferences for card layout
 */
export interface CardPreferences {
    pinnedCards: string[]
    hiddenCards: string[]
    customOrder: string[]
    lastModified: string
}

/**
 * Priority calculation factors
 */
export interface PriorityFactors {
    baseScore: number
    contentBoost: number
    rankingBoost: number
    timeBoost: number
    userPreferenceBoost: number
}
