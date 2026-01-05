"use client"

import { useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Workflow, FolderKanban, Clock, PlayCircle, CheckCircle2 } from 'lucide-react'
import { useDashboard } from '@/app/processes/hooks'

interface ProcessMetricsProps {
    timeRange?: string
}

export function ProcessMetrics({ timeRange = "30d" }: ProcessMetricsProps) {
    const { stats, loading, fetchDashboard } = useDashboard()

    useEffect(() => {
        // Recarregar dados quando o período mudar
        fetchDashboard()
    }, [timeRange])

    const metrics = [
        {
            label: "Procedimentos Ativos",
            value: loading ? "..." : (stats?.procedure_stats?.running || 0).toString(),
            status: "running",
            icon: FolderKanban,
            color: "orange",
        },
        {
            label: "Tarefas Pendentes",
            value: loading ? "..." : (stats?.task_stats?.draft || 0).toString(),
            status: "draft",
            icon: Clock,
            color: "blue",
        },
        {
            label: "Tarefas em Andamento",
            value: loading ? "..." : (stats?.task_stats?.started || 0).toString(),
            status: "started",
            icon: PlayCircle,
            color: "purple",
        },
        {
            label: `Concluídas (${timeRange})`,
            value: loading ? "..." : (stats?.task_stats?.finished || 0).toString(),
            status: "finished",
            icon: CheckCircle2,
            color: "green",
        },
    ]

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <Workflow className="size-6 text-primary" />
                <h3 className="text-2xl font-bold">Gestão de Processos</h3>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {metrics.map((stat, i) => (
                    <Card
                        key={i}
                        className="p-5 hover:shadow-xl transition-all border-border/50 hover:border-primary/20 group cursor-pointer"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div
                                className={`size-11 rounded-xl bg-${stat.color}-100 flex items-center justify-center group-hover:scale-110 transition-transform`}
                            >
                                <stat.icon className={`size-5 text-${stat.color}-600`} />
                            </div>
                            <Badge variant="secondary" className="text-xs">
                                {stat.status}
                            </Badge>
                        </div>
                        <div className="text-2xl font-bold tracking-tight mb-1">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
