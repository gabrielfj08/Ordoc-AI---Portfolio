import React from 'react'
import { usePrioritizedCards } from '@/hooks/use-prioritized-cards'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Pin, EyeOff } from 'lucide-react'

/**
 * Debug component to visualize card priorities
 * 
 * This component shows how cards are being prioritized by the AI system.
 * It's meant for development/testing and can be hidden in production.
 */
export function CardPriorityDebug() {
    const prioritizedCards = usePrioritizedCards()

    return (
        <Card className="border-dashed border-2 border-primary/20 bg-primary/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                    <Sparkles className="size-4" />
                    Debug: Priorização de Cards
                </CardTitle>
                <CardDescription className="text-xs">
                    Ordem dinâmica baseada em uso e preferências
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {prioritizedCards.map((card, index) => (
                        <div
                            key={card.id}
                            className="flex items-center justify-between p-2 rounded-lg bg-background/50 border text-xs"
                        >
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center">
                                    {index + 1}
                                </Badge>
                                <span className="font-medium">{card.title}</span>
                                <Badge variant="secondary" className="text-[10px]">
                                    {card.category}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">
                                    Score: <span className="font-mono font-bold">{card.calculatedPriority.toFixed(1)}</span>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 p-3 rounded-lg bg-muted/50 text-[10px] text-muted-foreground">
                    <p className="font-semibold mb-1">Como funciona:</p>
                    <ul className="space-y-0.5 list-disc list-inside">
                        <li>Score base + conteúdo + rankings ativos</li>
                        <li>Contexto temporal (hora/dia da semana)</li>
                        <li>Preferências do usuário (pin/hide)</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    )
}
