"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { tasksApi } from "@/app/processes/api"
import type { Task } from "@/app/processes/types"
import { Badge } from "@/components/ui/badge"

export function SmartAgendaWidget() {
    const router = useRouter()
    const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadAgenda = async () => {
            try {
                // Busca tarefas com deadline definido, ordenadas por data
                // Status ativos apenas
                const response = await tasksApi.myTasks({
                    status: 'running,started',
                    ordering: 'deadline',
                    page_size: 5
                })

                // Filtrar apenas tarefas com deadline futuro ou hoje
                // O backend já deve ordenar, mas precisamos garantir que tarefas sem deadline fiquem de fora ou no fim
                // Aqui assumimos que tasksApi retorna o que pedimos. 
                // Nota: O backend pode precisar de ajuste se 'deadline' não for um campo de ordenação suportado,
                // mas geralmente é.

                const tasksWithDeadline = response.results.filter(t => t.deadline)
                setUpcomingTasks(tasksWithDeadline)
            } catch (error) {
                console.error("Erro ao carregar agenda:", error)
            } finally {
                setIsLoading(false)
            }
        }

        loadAgenda()
    }, [])

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const today = new Date()
        const isToday = date.toDateString() === today.toDateString()
        const isTomorrow = new Date(today.setDate(today.getDate() + 1)).toDateString() === date.toDateString()

        if (isToday) return "Hoje"
        if (isTomorrow) return "Amanhã"

        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    }

    const getTime = (dateString: string) => {
        // Se tiver hora, mostrar. Se for só data (YYYY-MM-DD), assumir dia todo.
        if (dateString.includes('T')) {
            return new Date(dateString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }
        return null
    }

    if (isLoading) {
        return (
            <Card className="p-6 border-border/50 shadow-sm h-full">
                <h3 className="font-bold mb-5 flex items-center gap-2">
                    <Calendar className="size-5 text-chart-4" />
                    Agenda Inteligente
                </h3>
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-12 bg-muted animate-pulse rounded-lg" />
                    ))}
                </div>
            </Card>
        )
    }

    return (
        <Card className="p-6 border-border/50 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold flex items-center gap-2">
                    <Calendar className="size-5 text-chart-4" />
                    Agenda Inteligente
                </h3>
                <Button variant="ghost" size="icon" className="size-8 rounded-full">
                    <ArrowRight className="size-4" />
                </Button>
            </div>

            <div className="space-y-3 flex-1">
                {upcomingTasks.length === 0 ? (
                    <div className="text-center p-6 rounded-xl bg-muted/30 border border-dashed border-border">
                        <Calendar className="size-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Nenhum evento próximo</p>
                        <Button variant="link" size="sm" className="mt-2">
                            Adicionar evento
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {upcomingTasks.map(task => (
                            <div
                                key={task.id}
                                className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 border border-transparent hover:border-border/50 transition-all cursor-pointer group"
                                onClick={() => router.push(`/processes/tasks/${task.id}`)}
                            >
                                <div className="flex flex-col items-center justify-center size-10 rounded-lg bg-primary/10 text-primary shrink-0">
                                    <span className="text-xs font-bold uppercase">
                                        {formatDate(task.deadline!).split(' ')[0].substring(0, 3)}
                                    </span>
                                    <span className="text-sm font-bold">
                                        {new Date(task.deadline!).getDate()}
                                    </span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                                        {task.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                                        <Clock className="size-3" />
                                        <span>
                                            {formatDate(task.deadline!)}
                                            {getTime(task.deadline!) && ` • ${getTime(task.deadline!)}`}
                                        </span>
                                        {task.priority === 'high' && (
                                            <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 border-destructive/30 text-destructive">
                                                Urgente
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {upcomingTasks.length > 0 && (
                <Button variant="outline" className="w-full mt-4 rounded-full" size="sm">
                    Ver agenda completa
                </Button>
            )}
        </Card>
    )
}
