'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Brain, ChevronRight, Flame, AlertCircle, Clock, Calendar } from 'lucide-react'
import { tasksApi } from '@/app/processes/api'
import type { Task } from '@/app/processes/types'
import {
    useIntelligentPriority,
    getPriorityColor,
    getPriorityBadgeVariant,
    getPriorityLabel,
} from '@/hooks/use-intelligent-priority'

import { useMyDayStore } from '@/stores/my-day-store'

export function PriorityTasksWidget() {
    const router = useRouter()
    const { priorityTasks: tasks, isLoading: loading } = useMyDayStore()
    const { prioritizedTasks } = useIntelligentPriority(tasks)

    const topTasks = prioritizedTasks.slice(0, 5)

    const formatDeadline = (deadline: string | null) => {
        if (!deadline) return null

        const date = new Date(deadline)
        const now = new Date()
        const diff = date.getTime() - now.getTime()
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24))

        if (days < 0) return { label: 'Atrasada', color: 'text-destructive', urgent: true }
        if (days === 0) return { label: 'Hoje', color: 'text-destructive', urgent: true }
        if (days === 1) return { label: 'Amanhã', color: 'text-warning', urgent: true }
        if (days <= 3) return { label: `${days} dias`, color: 'text-warning', urgent: false }
        if (days <= 7) return { label: `${days} dias`, color: 'text-muted-foreground', urgent: false }
        return { label: date.toLocaleDateString('pt-BR'), color: 'text-muted-foreground', urgent: false }
    }

    if (loading) {
        return (
            <Card className="p-6 border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 via-background to-background dark:from-orange-950/20">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-muted rounded w-2/3" />
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-20 bg-muted rounded" />
                        ))}
                    </div>
                </div>
            </Card>
        )
    }

    return (
        <Card className="p-6 border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 via-background to-background dark:from-orange-950/20 shadow-lg">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className="size-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                        <Flame className="size-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Tarefas Prioritárias</h3>
                        <p className="text-xs text-muted-foreground">Ordenadas por urgência (IA)</p>
                    </div>
                </div>
                <Badge variant="outline" className="gap-1">
                    <Brain className="size-3" />
                    IA
                </Badge>
            </div>

            {topTasks.length === 0 ? (
                <div className="text-center py-8">
                    <div className="size-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
                        <AlertCircle className="size-8 text-success" />
                    </div>
                    <p className="font-semibold text-success-foreground mb-1">
                        Nenhuma tarefa pendente
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Todas as tarefas foram concluídas!
                    </p>
                </div>
            ) : (
                <>
                    <ScrollArea className="h-[360px]">
                        <div className="space-y-3 pr-4">
                            {topTasks.map((task, index) => {
                                const priority = task.intelligentPriority
                                const deadline = formatDeadline(task.deadline)
                                const priorityColor = getPriorityColor(priority.level)

                                return (
                                    <div
                                        key={task.id}
                                        onClick={() => router.push(`/processes/${task.procedure}`)}
                                        className="p-4 rounded-xl border bg-card hover:shadow-md transition-all group cursor-pointer"
                                    >
                                        <div className="flex items-start gap-3">
                                            {/* Ranking */}
                                            <div
                                                className={`size-8 rounded-lg flex items-center justify-center shrink-0 font-bold text-sm ${index === 0
                                                    ? 'bg-destructive text-destructive-foreground'
                                                    : index === 1
                                                        ? 'bg-warning text-warning-foreground'
                                                        : 'bg-muted text-muted-foreground'
                                                    }`}
                                            >
                                                {index + 1}
                                            </div>

                                            <div className="flex-1 min-w-0 space-y-2">
                                                {/* Título e Score */}
                                                <div className="flex items-start justify-between gap-2">
                                                    <h4 className="font-semibold text-sm line-clamp-2 flex-1">
                                                        {task.name}
                                                    </h4>
                                                    <Badge
                                                        variant={getPriorityBadgeVariant(priority.level)}
                                                        className="shrink-0 gap-1"
                                                    >
                                                        <Brain className="size-3" />
                                                        {Math.round(priority.score)}
                                                    </Badge>
                                                </div>

                                                {/* Metadados */}
                                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                                    {/* Deadline */}
                                                    {deadline && (
                                                        <div className={`flex items-center gap-1 ${deadline.color}`}>
                                                            {deadline.urgent && <Clock className="size-3" />}
                                                            <Calendar className="size-3" />
                                                            <span className="font-medium">{deadline.label}</span>
                                                        </div>
                                                    )}

                                                    {/* Prioridade Manual */}
                                                    {task.priority === 'high' && (
                                                        <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                                                            ALTA
                                                        </Badge>
                                                    )}

                                                    {/* Status */}
                                                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                                        {task.status === 'started' && '🚀 Iniciada'}
                                                        {task.status === 'running' && '▶️ Em execução'}
                                                        {task.status === 'draft' && '📝 Rascunho'}
                                                    </Badge>
                                                </div>

                                                {/* Recomendação principal */}
                                                {priority.recommendations[0] && (
                                                    <p className={`text-xs ${priorityColor} line-clamp-1`}>
                                                        {priority.recommendations[0]}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Arrow */}
                                            <ChevronRight className="size-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </ScrollArea>

                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-4 rounded-full gap-2"
                        onClick={() => router.push('/processes')}
                    >
                        Ver todas as tarefas
                        <ChevronRight className="size-4" />
                    </Button>
                </>
            )}
        </Card>
    )
}
