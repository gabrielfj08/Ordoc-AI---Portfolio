"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Database, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMyDayStore } from "@/stores/my-day-store"

export function StorageWidget() {
    const router = useRouter()
    const { storageStats: stats } = useMyDayStore()
    // Local loading state is not needed if we rely on global loading or just show skeleton if null
    // But since fetchDashboardData happens on page load, stats might be null initially.
    // However, Dashboard usually shows a global loader.
    // Let's treat null stats as loading.
    const loading = !stats

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B'
        const k = 1024
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
    }

    if (loading) {
        return (
            <Card className="p-6 border-border/50 shadow-sm h-[240px] flex items-center justify-center">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </Card>
        )
    }

    const percentage = stats ? (stats.usage_percentage * 100) : 0
    const totalUsed = stats ? formatBytes(stats.total_used_bytes) : '0 B'
    const limit = stats ? formatBytes(stats.limit_bytes) : '100 GB'

    return (
        <Card className="p-6 border-border/50 shadow-sm">
            <h3 className="font-bold mb-5 flex items-center gap-2">
                <Database className="size-5 text-chart-5" />
                Armazenamento
            </h3>
            <div className="space-y-4">
                <div>
                    <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-2xl font-bold">{totalUsed}</span>
                        <span className="text-sm text-muted-foreground">de {limit}</span>
                    </div>
                    {/* Progress bar logic: requires value between 0 and 100 */}
                    <Progress value={percentage} className="h-2" />
                </div>
                <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="size-3 rounded-sm bg-orange-600" />
                            <span>Documentos ({stats?.breakdown.active_documents.count || 0})</span>
                        </div>
                        <span className="font-medium text-muted-foreground">
                            {formatBytes(stats?.breakdown.active_documents.bytes || 0)}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <div className="size-3 rounded-sm bg-destructive/60" />
                            <span>Lixeira ({stats?.breakdown.trash.count || 0})</span>
                        </div>
                        <span>{formatBytes(stats?.breakdown.trash.bytes || 0)}</span>
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="w-full rounded-full bg-transparent hover:bg-secondary/50"
                    onClick={() => router.push('/documents')}
                >
                    Gerenciar documentos
                </Button>
            </div>
        </Card>
    )
}
