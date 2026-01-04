'use client'

import { Badge } from '@/components/ui/badge'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { Progress } from '@/components/ui/progress'
import { Brain, Calendar, Flag, Clock, TrendingUp } from 'lucide-react'
import type { IntelligentPriority } from '@/hooks/use-intelligent-priority'
import {
    getPriorityLabel,
    getPriorityBadgeVariant,
    getPriorityColor,
} from '@/hooks/use-intelligent-priority'

interface IntelligentPriorityBadgeProps {
    priority: IntelligentPriority
    showScore?: boolean
    size?: 'sm' | 'md' | 'lg'
}

export function IntelligentPriorityBadge({
    priority,
    showScore = true,
    size = 'md',
}: IntelligentPriorityBadgeProps) {
    const variant = getPriorityBadgeVariant(priority.level)
    const label = getPriorityLabel(priority.level)
    const color = getPriorityColor(priority.level)

    const sizeClasses = {
        sm: 'text-[10px] px-1.5 py-0',
        md: 'text-xs px-2 py-0.5',
        lg: 'text-sm px-3 py-1',
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Badge
                        variant={variant}
                        className={`${sizeClasses[size]} gap-1 cursor-help`}
                    >
                        <Brain className="size-3" />
                        {label}
                        {showScore && (
                            <span className="font-bold ml-0.5">
                                {Math.round(priority.score)}
                            </span>
                        )}
                    </Badge>
                </TooltipTrigger>
                <TooltipContent className="w-80 p-4" side="top">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="font-semibold flex items-center gap-2">
                                <Brain className="size-4" />
                                Prioridade Inteligente
                            </h4>
                            <span className={`font-bold text-lg ${color}`}>
                                {Math.round(priority.score)}/100
                            </span>
                        </div>

                        <Progress value={priority.score} className="h-2" />

                        <div className="space-y-2 text-xs">
                            <div className="font-semibold text-muted-foreground uppercase tracking-wide">
                                Fatores
                            </div>

                            {/* Deadline */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Calendar className="size-3.5 text-primary" />
                                    <span>Prazo</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Progress
                                        value={(priority.factors.deadline / 30) * 100}
                                        className="h-1 w-16"
                                    />
                                    <span className="font-medium w-8 text-right">
                                        {priority.factors.deadline}/30
                                    </span>
                                </div>
                            </div>

                            {/* Prioridade Manual */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Flag className="size-3.5 text-orange-500" />
                                    <span>Prioridade</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Progress
                                        value={(priority.factors.manualPriority / 25) * 100}
                                        className="h-1 w-16"
                                    />
                                    <span className="font-medium w-8 text-right">
                                        {priority.factors.manualPriority}/25
                                    </span>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="size-3.5 text-green-500" />
                                    <span>Status</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Progress
                                        value={(priority.factors.status / 20) * 100}
                                        className="h-1 w-16"
                                    />
                                    <span className="font-medium w-8 text-right">
                                        {priority.factors.status}/20
                                    </span>
                                </div>
                            </div>

                            {/* Idade */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock className="size-3.5 text-purple-500" />
                                    <span>Idade</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Progress
                                        value={(priority.factors.age / 25) * 100}
                                        className="h-1 w-16"
                                    />
                                    <span className="font-medium w-8 text-right">
                                        {priority.factors.age}/25
                                    </span>
                                </div>
                            </div>
                        </div>

                        {priority.recommendations.length > 0 && (
                            <div className="space-y-2 pt-2 border-t">
                                <div className="font-semibold text-muted-foreground uppercase tracking-wide text-xs">
                                    Recomendações
                                </div>
                                <ul className="space-y-1 text-xs">
                                    {priority.recommendations.map((rec, idx) => (
                                        <li key={idx} className="flex items-start gap-1">
                                            <span className="text-muted-foreground">•</span>
                                            <span>{rec}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
