'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Workflow, ChevronRight, PlayCircle } from "lucide-react"
import { useMyDayStore } from "@/stores/my-day-store"
import { PrivacyBadge } from "@/components/common/privacy-badge"

export function ContinueWorkingWidget() {
    const privacyMode = useMyDayStore(state => state.privacyMode)
    const items = [
        {
            id: 1,
            title: "Contrato_Fornecedor_2025.pdf",
            subtitle: "Parou na página 4 • Assinaturaendente",
            icon: FileText,
            color: "text-orange-600",
            bg: "bg-orange-50",
            href: "/documents/1"
        },
        {
            id: 2,
            title: "Aprovação de Orçamento Q1",
            subtitle: "Parou na tarefa \"Revisar valores\"",
            icon: Workflow,
            color: "text-blue-600",
            bg: "bg-blue-50",
            href: "/processes/2"
        }
    ]

    return (
        <Card className="p-6 border-border/50 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-xl font-bold">
                    <PlayCircle className="size-5 text-orange-600" />
                    <h3>Continue de onde parou</h3>
                    {privacyMode?.mode === 'local' && (
                        <PrivacyBadge className="ml-2" collapsed />
                    )}
                </div>
            </div>

            <div className="space-y-3">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center gap-4 p-4 rounded-xl bg-secondary/20 border border-transparent hover:border-border hover:bg-secondary/40 transition-all cursor-pointer group"
                    >
                        <div className={`size-10 rounded-lg ${item.bg} flex items-center justify-center shrink-0`}>
                            <item.icon className={`size-5 ${item.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm truncate">{item.title}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{item.subtitle}</div>
                        </div>
                        <ChevronRight className="size-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                ))}
            </div>
        </Card>
    )
}
