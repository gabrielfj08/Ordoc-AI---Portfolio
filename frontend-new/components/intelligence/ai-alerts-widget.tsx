'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
    Brain, 
    AlertCircle, 
    AlertTriangle, 
    Info, 
    XOctagon,
    ChevronRight,
    CheckCircle,
    X
} from 'lucide-react'
import { alertsApi, type Alert } from '@/services/intelligence-api'
import { useToast } from '@/hooks/use-toast'

export function AIAlertsWidget() {
    const router = useRouter()
    const [alerts, setAlerts] = useState<Alert[]>([])
    const [loading, setLoading] = useState(true)
    const [unreadCount, setUnreadCount] = useState(0)
    const { toast } = useToast()

    const fetchAlerts = async () => {
        try {
            setLoading(true)
            const response = await alertsApi.list({ is_read: false })
            setAlerts(response.results.slice(0, 5)) // Mostrar apenas os 5 mais recentes
            setUnreadCount(response.count)
        } catch (error) {
            console.error('Erro ao carregar alertas:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAlerts()
        // Atualizar a cada 30 segundos
        const interval = setInterval(fetchAlerts, 30000)
        return () => clearInterval(interval)
    }, [])

    const handleMarkAsRead = async (alertId: string) => {
        try {
            await alertsApi.markAsRead(alertId)
            setAlerts(prev => prev.filter(a => a.id !== alertId))
            setUnreadCount(prev => Math.max(0, prev - 1))
            toast({
                description: 'Alerta marcado como lido',
            })
        } catch (error) {
            toast({
                variant: 'destructive',
                description: 'Erro ao marcar alerta como lido',
            })
        }
    }

    const handleMarkAllAsRead = async () => {
        try {
            await alertsApi.markAllAsRead()
            setAlerts([])
            setUnreadCount(0)
            toast({
                description: 'Todos os alertas foram marcados como lidos',
            })
        } catch (error) {
            toast({
                variant: 'destructive',
                description: 'Erro ao marcar alertas como lidos',
            })
        }
    }

    const getAlertIcon = (severity: Alert['severity']) => {
        switch (severity) {
            case 'critical':
                return <XOctagon className="size-5 text-destructive" />
            case 'error':
                return <AlertCircle className="size-5 text-destructive" />
            case 'warning':
                return <AlertTriangle className="size-5 text-warning" />
            case 'info':
            default:
                return <Info className="size-5 text-primary" />
        }
    }

    const getAlertColor = (severity: Alert['severity']) => {
        switch (severity) {
            case 'critical':
                return 'bg-destructive/10 border-destructive/30'
            case 'error':
                return 'bg-destructive/10 border-destructive/20'
            case 'warning':
                return 'bg-warning/10 border-warning/20'
            case 'info':
            default:
                return 'bg-primary/10 border-primary/20'
        }
    }

    const getSeverityBadge = (severity: Alert['severity']) => {
        const labels = {
            critical: 'Crítico',
            error: 'Erro',
            warning: 'Aviso',
            info: 'Info'
        }
        const variants = {
            critical: 'destructive',
            error: 'destructive',
            warning: 'secondary',
            info: 'default'
        } as const

        return (
            <Badge variant={variants[severity]} className="text-xs">
                {labels[severity]}
            </Badge>
        )
    }

    if (loading) {
        return (
            <Card className="p-6 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 via-background to-background dark:from-purple-950/20">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-muted rounded w-1/2" />
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-16 bg-muted rounded" />
                        ))}
                    </div>
                </div>
            </Card>
        )
    }

    return (
        <Card className="p-6 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 via-background to-background dark:from-purple-950/20 shadow-lg">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className="size-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <Brain className="size-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            Alertas de IA
                            {unreadCount > 0 && (
                                <Badge variant="destructive" className="size-6 rounded-full flex items-center justify-center p-0 text-xs">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </Badge>
                            )}
                        </h3>
                        <p className="text-xs text-muted-foreground">Insights automáticos</p>
                    </div>
                </div>
                {alerts.length > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleMarkAllAsRead}
                        className="text-xs"
                    >
                        Marcar tudo como lido
                    </Button>
                )}
            </div>

            {alerts.length === 0 ? (
                <div className="text-center py-8">
                    <div className="size-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
                        <CheckCircle className="size-8 text-success" />
                    </div>
                    <p className="font-semibold text-success-foreground mb-1">
                        Nenhum alerta pendente
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Todos os documentos estão processados corretamente
                    </p>
                </div>
            ) : (
                <>
                    <ScrollArea className="h-[300px] pr-4">
                        <div className="space-y-3">
                            {alerts.map(alert => (
                                <div
                                    key={alert.id}
                                    className={`p-4 rounded-xl border transition-all hover:shadow-md ${getAlertColor(alert.severity)}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 shrink-0">
                                            {getAlertIcon(alert.severity)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <h4 className="font-semibold text-sm line-clamp-1">
                                                    {alert.title}
                                                </h4>
                                                {getSeverityBadge(alert.severity)}
                                            </div>
                                            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                                {alert.message}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(alert.created_at).toLocaleString('pt-BR', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-7 rounded-full"
                                                    onClick={() => handleMarkAsRead(alert.id)}
                                                >
                                                    <X className="size-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>

                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-4 rounded-full gap-2"
                        onClick={() => router.push('/intelligence/alerts')}
                    >
                        Ver todos os alertas
                        <ChevronRight className="size-4" />
                    </Button>
                </>
            )}
        </Card>
    )
}
