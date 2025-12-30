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
    X,
    Sparkles
} from 'lucide-react'
import { alertsApi, type Alert, type SuggestedAction } from '@/services/intelligence-api'
import { useToast } from '@/hooks/use-toast'

import { useMyDayStore } from '@/stores/my-day-store'
import { PrivacyBadge } from '@/components/common/privacy-badge'

export function AIAlertsWidget() {
    const router = useRouter()
    const [alerts, setAlerts] = useState<Alert[]>([])
    const [loading, setLoading] = useState(true)
    const [unreadCount, setUnreadCount] = useState(0)
    const [showExample, setShowExample] = useState(true)
    const { toast } = useToast()
    const privacyMode = useMyDayStore(state => state.privacyMode)

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

    const handleAction = async (alertId: string, action: SuggestedAction) => {
        try {
            // TODO: Implementar chamada de API para executar ação
            console.log('Executando ação:', action.action_type, action.payload)

            toast({
                description: `Aplicando: ${action.label}`,
            })

            // Se for "Ignorar" ou "Aplicar", marcar como lido/resolvido
            await handleMarkAsRead(alertId)

        } catch (error) {
            toast({
                variant: 'destructive',
                description: 'Erro ao executar ação',
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

    // Filtrar alertas com ações (destaques) vs alertas informativos
    const actionableAlerts = alerts.filter(a => a.suggested_actions && a.suggested_actions.length > 0)
    const infoAlerts = alerts.filter(a => !a.suggested_actions || a.suggested_actions.length === 0)

    return (
        <Card className="p-6 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 via-background to-background dark:from-purple-950/20 shadow-lg">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className="size-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <Brain className="size-6 text-white" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                Recomendações da IA
                                {unreadCount > 0 && (
                                    <Badge variant="destructive" className="size-6 rounded-full flex items-center justify-center p-0 text-xs text-white">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </Badge>
                                )}
                            </h3>
                            {privacyMode?.mode === 'local' && (
                                <PrivacyBadge className="bg-purple-100 text-purple-700 border-purple-200" collapsed />
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">Insights automáticos</p>
                    </div>
                </div>
            </div>

            {/* Alertas com Ações (Destaque) */}
            {actionableAlerts.map(alert => (
                <div key={alert.id} className="mb-6 p-4 rounded-xl bg-white/50 dark:bg-purple-900/10 border border-purple-200/50 dark:border-purple-800/50 relative group/rec">
                    <button
                        onClick={() => handleMarkAsRead(alert.id)}
                        className="absolute top-2 right-2 size-6 rounded-full flex items-center justify-center opacity-0 group-hover/rec:opacity-100 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-400 transition-all"
                    >
                        <X className="size-3.5" />
                    </button>

                    <h4 className="font-bold text-purple-700 dark:text-purple-400 text-sm mb-2 flex items-center gap-2">
                        <Sparkles className="size-4" />
                        {alert.title}
                    </h4>
                    <p className="text-sm text-purple-600 dark:text-purple-300 mb-4 leading-relaxed">
                        {alert.message}
                    </p>

                    {alert.suggested_actions && (
                        <div className="flex gap-2 flex-wrap">
                            {alert.suggested_actions.map((action, idx) => (
                                <Button
                                    key={idx}
                                    size="sm"
                                    variant={action.action_type === 'ignore' ? 'ghost' : action.action_type === 'apply_once' ? 'outline' : 'default'}
                                    className={
                                        action.action_type === 'apply_always'
                                            ? "bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex-1"
                                            : action.action_type === 'apply_once'
                                                ? "border-purple-300 text-purple-600 hover:bg-purple-50 rounded-lg flex-1"
                                                : "text-purple-500 hover:text-purple-700 hover:bg-purple-50 rounded-lg"
                                    }
                                    onClick={() => handleAction(alert.id, action)}
                                >
                                    {action.label}
                                </Button>
                            ))}
                        </div>
                    )}
                </div>
            ))}

            {/* Lista de Alertas Informativos */}
            {infoAlerts.length > 0 && (
                <ScrollArea className="h-[200px] pr-4">
                    <div className="space-y-3">
                        {infoAlerts.map(alert => (
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
                                            <Badge variant={alert.severity === 'critical' || alert.severity === 'error' ? 'destructive' : 'secondary'} className="text-xs">
                                                {alert.severity}
                                            </Badge>
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
            )}

            {(alerts.length > 0 || actionableAlerts.length > 0) && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-4 rounded-full gap-2 text-purple-600"
                    onClick={() => router.push('/intelligence/alerts')}
                >
                    Ver todos os alertas
                    <ChevronRight className="size-4" />
                </Button>
            )}

            {alerts.length === 0 && actionableAlerts.length === 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                    <Sparkles className="size-8 mx-auto mb-2 text-purple-200" />
                    Nenhuma recomendação no momento
                </div>
            )}
        </Card>
    )
}
