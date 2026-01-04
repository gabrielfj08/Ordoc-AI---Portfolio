import React, { ReactNode } from 'react'
import { usePrioritizedCards } from '@/hooks/use-prioritized-cards'

interface CardMapping {
    [key: string]: ReactNode
}

interface DynamicCardRendererProps {
    /**
     * Mapping of card IDs to their rendered components
     * Example: { 'documents': <DocumentsCard />, 'workflows': <WorkflowsCard /> }
     */
    cardComponents: CardMapping

    /**
     * Optional filter to only render specific card categories
     */
    category?: 'content' | 'insights' | 'team' | 'system'

    /**
     * Maximum number of cards to render
     */
    maxCards?: number

    /**
     * Wrapper className for the container
     */
    className?: string
}

/**
 * Dynamic Card Renderer
 * 
 * Renders cards in order of calculated priority (AI-based).
 * Each user sees cards in different order based on their behavior.
 * 
 * Example:
 * - Ricardo (uses docs): Documentos → Workflows → Processos
 * - Lucas (uses workflows): Workflows → Processos → Documentos
 */
export function DynamicCardRenderer({
    cardComponents,
    category,
    maxCards,
    className = 'space-y-6'
}: DynamicCardRendererProps) {
    const allPrioritizedCards = usePrioritizedCards(maxCards)

    // Filter by category if specified
    const prioritizedCards = category
        ? allPrioritizedCards.filter(card => card.category === category)
        : allPrioritizedCards

    return (
        <div className={className}>
            {prioritizedCards.map(card => {
                const component = cardComponents[card.id]

                // Skip if component not provided
                if (!component) return null

                return (
                    <div key={card.id} data-card-id={card.id} data-priority={card.calculatedPriority}>
                        {component}
                    </div>
                )
            })}
        </div>
    )
}

/**
 * Hook to get card order for debugging
 */
export function useCardOrder(category?: 'content' | 'insights' | 'team' | 'system'): string[] {
    const cards = usePrioritizedCards()
    const filtered = category ? cards.filter(c => c.category === category) : cards
    return filtered.map(c => c.id)
}
