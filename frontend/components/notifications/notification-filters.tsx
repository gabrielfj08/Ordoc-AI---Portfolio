'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export type NotificationFilter = 'all' | 'unread' | 'task' | 'approval' | 'deadline' | 'system'

interface NotificationFiltersProps {
    activeFilter: NotificationFilter
    onFilterChange: (filter: NotificationFilter) => void
    counts: {
        all: number
        unread: number
        task: number
        approval: number
        deadline: number
        system: number
    }
}

export function NotificationFilters({ activeFilter, onFilterChange, counts }: NotificationFiltersProps) {
    const filters: { id: NotificationFilter; label: string }[] = [
        { id: 'all', label: 'Todas' },
        { id: 'unread', label: 'Não lidas' },
        { id: 'system', label: 'Sistema' },
        { id: 'task', label: 'Tarefas' },
        { id: 'approval', label: 'Aprovações' },
        { id: 'deadline', label: 'Prazos' },
    ]

    return (
        <div className="flex gap-2 p-3 border-b overflow-x-auto scrollbar-hide">
            {filters.map(filter => {
                const count = counts[filter.id] || 0
                const isActive = activeFilter === filter.id

                return (
                    <Button
                        key={filter.id}
                        variant={isActive ? 'default' : 'outline'}
                        size="sm"
                        className="gap-2 shrink-0 rounded-full"
                        onClick={() => onFilterChange(filter.id)}
                    >
                        {filter.label}
                        {count > 0 && (
                            <Badge
                                variant={isActive ? 'secondary' : 'default'}
                                className="ml-1 h-5 min-w-5 px-1.5"
                            >
                                {count > 99 ? '99+' : count}
                            </Badge>
                        )}
                    </Button>
                )
            })}
        </div>
    )
}
