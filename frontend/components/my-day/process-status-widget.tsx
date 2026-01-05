import React from 'react'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Workflow } from "lucide-react"
import { useMyDayStore } from "@/stores/my-day-store"

export function ProcessStatusWidget() {
    const { overview } = useMyDayStore()

    if (!overview) return null

    return (
        <Card className="p-6 border-border/50 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Workflow className="size-5 text-primary" />
                        Estado dos Processos
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">Visão geral da carga de trabalho atual</p>
                </div>
                <Badge className="bg-warning/10 text-warning-foreground border-warning/20 px-4 py-1.5 font-semibold">
                    Carga Moderada
                </Badge>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 to-destructive/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative text-center p-8 rounded-2xl bg-gradient-to-br from-destructive/5 to-transparent border-2 border-destructive/10 hover:border-destructive/30 hover:shadow-lg transition-all cursor-pointer">
                        <div className="text-5xl font-black text-destructive mb-3 group-hover:scale-110 transition-transform">
                            {overview?.procedure_stats?.urgent || 0}
                        </div>
                        <div className="text-sm font-bold text-foreground mb-1">Urgente</div>
                        <div className="text-xs text-muted-foreground">Requer atenção imediata</div>
                    </div>
                </div>

                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative text-center p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent border-2 border-primary/10 hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer">
                        <div className="text-5xl font-black text-primary mb-3 group-hover:scale-110 transition-transform">
                            {overview?.procedure_stats?.normal || 0}
                        </div>
                        <div className="text-sm font-bold text-foreground mb-1">Normal</div>
                        <div className="text-xs text-muted-foreground">Dentro do prazo</div>
                    </div>
                </div>

                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-success/10 to-success/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative text-center p-8 rounded-2xl bg-gradient-to-br from-success/5 to-transparent border-2 border-success/10 hover:border-success/30 hover:shadow-lg transition-all cursor-pointer">
                        <div className="text-5xl font-black text-success mb-3 group-hover:scale-110 transition-transform">
                            {overview?.procedure_stats?.completed || 0}
                        </div>
                        <div className="text-sm font-bold text-foreground mb-1">Concluídas</div>
                        <div className="text-xs text-muted-foreground">Última semana</div>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-muted-foreground">Progresso geral</span>
                    <span className="font-bold">
                        {overview?.procedure_stats?.total
                            ? Math.round(((overview.procedure_stats.completed || 0) / overview.procedure_stats.total) * 100)
                            : 0}%
                    </span>
                </div>
                <Progress
                    value={overview?.procedure_stats?.total
                        ? ((overview.procedure_stats.completed || 0) / overview.procedure_stats.total) * 100
                        : 0
                    }
                    className="h-3"
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                        {(overview?.procedure_stats?.urgent || 0) + (overview?.procedure_stats?.normal || 0)} de {overview?.procedure_stats?.total || 0} processos em andamento
                    </span>
                    <span>Previsão: 3 dias</span>
                </div>
            </div>
        </Card>
    )
}
