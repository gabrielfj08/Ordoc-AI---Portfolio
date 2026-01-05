'use client'

import { Card } from "@/components/ui/card"
import { Users } from "lucide-react"

import { useMyDayStore } from "@/stores/my-day-store"

export function TeamViewWidget() {
    const { canAccessTeamView, overview } = useMyDayStore()

    if (!canAccessTeamView) return null

    // Use API data or fallback to empty
    const members = overview?.team_stats || []

    return (
        <Card className="p-6 border-border/50 shadow-sm">
            <h3 className="font-bold mb-4 flex items-center gap-2">
                <Users className="size-5 text-blue-600" />
                Visão da Equipe
            </h3>
            <p className="text-xs text-muted-foreground mb-4">Resumo rápido dos membros</p>

            <div className="space-y-4">
                {members.map((member: any, i: number) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                        <span className="font-medium">{member.name}</span>
                        <span className={`font-semibold ${member.statusColor}`}>{member.status}</span>
                    </div>
                ))}
            </div>
        </Card>
    )
}
