'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Workflow, ChevronRight, PlayCircle } from "lucide-react"
import { useMyDayStore } from "@/stores/my-day-store"
import { PrivacyBadge } from "@/components/common/privacy-badge"

export function ContinueWorkingWidget() {
    const privacyMode = useMyDayStore(state => state.privacyMode)
    const continueWorkingItems = useMyDayStore(state => state.continueWorkingItems)

    // Map store items to widget format
    const items = []

    if (continueWorkingItems?.lastDocument) {
        items.push({
            id: 'doc-' + continueWorkingItems.lastDocument.id,
            title: continueWorkingItems.lastDocument.title || continueWorkingItems.lastDocument.file_name,
            subtitle: "Editado recentemente",
            icon: FileText,
            color: "text-orange-600",
            bg: "bg-orange-50",
            href: `/documents/${continueWorkingItems.lastDocument.id}`
        })
    }

    if (continueWorkingItems?.lastTask) {
        items.push({
            id: 'task-' + continueWorkingItems.lastTask.id,
            title: continueWorkingItems.lastTask.name,
            subtitle: `Prioridade ${continueWorkingItems.lastTask.priority === 'high' ? 'Alta' : 'Normal'} • ${continueWorkingItems.lastTask.status}`,
            icon: Workflow,
            color: "text-blue-600",
            bg: "bg-blue-50",
            href: `/tasks/${continueWorkingItems.lastTask.id}`
        })
    }

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

            {items.length === 0 ? (
                <div className="flex flex-col justify-center items-center text-center text-muted-foreground py-8">
                    <PlayCircle className="size-8 mb-2 opacity-50" />
                    <p>Nenhuma atividade recente</p>
                </div>
            ) : (
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
            )}
        </Card>
    )
}
