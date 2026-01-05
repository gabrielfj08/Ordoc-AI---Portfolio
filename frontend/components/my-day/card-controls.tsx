import React from 'react'
import { Pin, EyeOff, Eye, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useMyDayStore } from '@/stores/my-day-store'
import { useIsCardPinned, useIsCardHidden } from '@/hooks/use-prioritized-cards'

interface CardControlsProps {
    cardId: string
    cardTitle: string
}

/**
 * Card controls component
 * 
 * Provides pin/hide functionality for dashboard cards
 * Appears as a dropdown menu in the card header
 */
export function CardControls({ cardId, cardTitle }: CardControlsProps) {
    const { pinCard, hideCard, unhideCard, cardPreferences } = useMyDayStore()
    const isPinned = useIsCardPinned(cardId)
    const isHidden = useIsCardHidden(cardId)

    const handlePin = () => {
        if (isPinned) {
            // Unpin by removing from pinned array
            useMyDayStore.setState(state => ({
                cardPreferences: {
                    ...state.cardPreferences,
                    pinnedCards: state.cardPreferences.pinnedCards.filter(id => id !== cardId),
                    lastModified: new Date().toISOString(),
                }
            }))
        } else {
            pinCard(cardId)
        }
    }

    const handleHide = () => {
        hideCard(cardId)
    }

    const handleUnhide = () => {
        unhideCard(cardId)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-foreground"
                >
                    <MoreVertical className="size-4" />
                    <span className="sr-only">Opções do card</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handlePin} className="gap-2">
                    <Pin className={`size-4 ${isPinned ? 'fill-current' : ''}`} />
                    {isPinned ? 'Desafixar card' : 'Fixar no topo'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {isHidden ? (
                    <DropdownMenuItem onClick={handleUnhide} className="gap-2">
                        <Eye className="size-4" />
                        Mostrar card
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem onClick={handleHide} className="gap-2 text-destructive">
                        <EyeOff className="size-4" />
                        Ocultar card
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

/**
 * Card pin indicator badge
 * 
 * Shows a small pin icon when a card is pinned
 */
export function CardPinIndicator({ cardId }: { cardId: string }) {
    const isPinned = useIsCardPinned(cardId)

    if (!isPinned) return null

    return (
        <div className="absolute top-2 right-2 size-6 rounded-full bg-primary/10 flex items-center justify-center">
            <Pin className="size-3 text-primary fill-current" />
        </div>
    )
}
