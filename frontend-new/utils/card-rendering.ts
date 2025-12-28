/**
 * Card mapping for dynamic rendering
 * 
 * Maps card IDs from the registry to their actual rendered components
 * This allows us to dynamically order cards while maintaining the exact same visual appearance
 */

import { ReactNode } from 'react'

export interface CardRenderProps {
    id: string
    priority: number
    component: ReactNode
}

/**
 * Helper to create a card render entry
 */
export function createCardEntry(
    id: string,
    priority: number,
    component: ReactNode
): CardRenderProps {
    return { id, priority, component }
}

/**
 * Sort cards by priority (highest first)
 */
export function sortCardsByPriority(cards: CardRenderProps[]): CardRenderProps[] {
    return [...cards].sort((a, b) => b.priority - a.priority)
}
