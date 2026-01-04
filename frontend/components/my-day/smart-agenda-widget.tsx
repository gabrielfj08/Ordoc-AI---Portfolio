"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon, Clock, ArrowRight, NotebookPen, Filter, Search, X, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMyDayStore } from "@/stores/my-day-store"
import type { Task } from "@/app/processes/types"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CardControls, CardPinIndicator } from "@/components/my-day/card-controls"
import { Input } from "@/components/ui/input"

export function SmartAgendaWidget() {
    const router = useRouter()
    const { priorityTasks, isLoading } = useMyDayStore()
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [tasksForDate, setTasksForDate] = useState<Task[]>([])
    const [showFilters, setShowFilters] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        if (priorityTasks && date) {
            const filtered = priorityTasks.filter(task => {
                if (!task.deadline) return false
                const taskDate = new Date(task.deadline)
                const matchesDate = taskDate.toDateString() === date.toDateString()
                const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase())
                return matchesDate && matchesSearch
            })
            setTasksForDate(filtered)
        }
    }, [priorityTasks, date, searchTerm])

    if (isLoading) {
        return (
            <Card className="p-6 border-border/50 shadow-sm h-full">
                <h3 className="font-bold mb-5 flex items-center gap-2">
                    <CalendarIcon className="size-5 text-chart-4" />
                    Agenda
                </h3>
                <div className="flex gap-6 h-[300px]">
                    <div className="flex-1 bg-muted animate-pulse rounded-lg" />
                    <div className="flex-1 space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />
                        ))}
                    </div>
                </div>
            </Card>
        )
    }

    return (
        <Card className="p-6 border-border/50 shadow-sm grow flex flex-col overflow-hidden relative">
            <CardPinIndicator cardId="smart-agenda" />

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <CalendarIcon className="size-5 text-orange-600" />
                        Agenda
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">Visualize e organize seus compromissos e tarefas</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant={showFilters ? "default" : "ghost"}
                        size="sm"
                        className="rounded-full gap-2"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter className="size-4" />
                        Filtrar
                        {searchTerm && (
                            <span className="ml-1 size-2 rounded-full bg-primary-foreground" />
                        )}
                    </Button>
                    <CardControls cardId="smart-agenda" cardTitle="Agenda" />
                    <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full gap-2 text-primary"
                        onClick={() => router.push('/processes/tasks')}
                    >
                        Ver todas
                        <ChevronRight className="size-4" />
                    </Button>
                </div>
            </div>

            {/* Filtros */}
            {showFilters && (
                <div className="mb-6 p-4 rounded-lg border bg-secondary/30 relative">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar tarefas por nome..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-9 h-9"
                        />
                        {searchTerm && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSearchTerm('')}
                                className="absolute right-1 top-1/2 -translate-y-1/2 size-7"
                            >
                                <X className="size-3" />
                            </Button>
                        )}
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-4 w-full">
                {/* Calendar Section - Full Width Horizontal, Standard Vertical */}
                <div className="w-full">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        showOutsideDays={false}
                        className="p-1"
                    />
                </div>

                {/* Task Notes Section - Minimalist */}
                <div className="space-y-4 w-full">
                    <div className="text-[11px] font-bold text-muted-foreground/50 uppercase tracking-[0.15em] px-1">
                        Notas de Tarefas
                    </div>

                    <ScrollArea className="max-h-[300px] min-h-[60px] w-full">
                        <div className="space-y-4 px-1 w-full">
                            {tasksForDate.length === 0 ? (
                                <div className="text-center py-8 border border-dashed border-border/20 rounded-lg w-full">
                                    <p className="text-sm text-muted-foreground">Sem tarefas para este dia</p>
                                </div>
                            ) : (
                                tasksForDate.map(task => (
                                    <div
                                        key={task.id}
                                        className="py-2 border-l-2 border-l-orange-500 pl-4 transition-all cursor-pointer w-full hover:bg-muted/30"
                                        onClick={() => router.push(`/processes/tasks/${task.id}`)}
                                    >
                                        <div className="text-sm font-semibold mb-1 line-clamp-1">
                                            {task.name}
                                        </div>
                                        {task.deadline && (
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
                                                <Clock className="size-3" />
                                                {new Date(task.deadline).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </Card>
    )
}

