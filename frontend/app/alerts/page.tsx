'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Brain,
    AlertCircle,
    AlertTriangle,
    Info,
    XOctagon,
    Search,
    Filter,
    CheckCircle,
    X,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
} from 'lucide-react'
import { alertsApi, type Alert } from '@/services/intelligence-api'
import { useToast } from '@/hooks/use-toast'

export default function AlertsPage() {
    const [alerts, setAlerts] = useState<Alert[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [severityFilter, setSeverityFilter] = useState<Alert['severity'] | 'all'>('all')
    const [statusFilter, setStatusFilter] = useState<'read' | 'unread' | 'all'>('unread')
    const [page, setPage] = useState(1)
    const [totalCount, setTotalCount] = useState(0)
    const { toast } = useToast()

    const pageSize = 20

    const fetchAlerts = async () => {
        try {
            setLoading(true)
            const params: any = {
                page,
            }

            if (severityFilter !== 'all') {
                params.severity = severityFilter
            }

            if (statusFilter !== 'all') {
                params.is_read = statusFilter === 'read'
            }

            const response = await alertsApi.list(params)
            setAlerts(response.results)
            setTotalCount(response.count)
        } catch (error) {
            console.error('Erro ao carregar alertas:', error)
            toast({
                variant: 'destructive',
                description: 'Erro ao carregar alertas',
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAlerts()
    }, [page, severityFilter, statusFilter])

    const handleMarkAsRead = async (alertId: string) => {
        try {
            await alertsApi.markAsRead(alertId)
            setAlerts(prev => prev.map(a => (a.id === alertId ? { ...a, is_read: true } : a)))
            toast({ description: 'Alerta marcado como lido' })
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
            setAlerts(prev => prev.map(a => ({ ...a, is_read: true })))
            toast({ description: 'Todos os alertas foram marcados como lidos' })
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
                return 'bg-destructive/10 border-destructive/30 hover:bg-destructive/20'
            case 'error':
                return 'bg-destructive/10 border-destructive/20 hover:bg-destructive/15'
            case 'warning':
                return 'bg-warning/10 border-warning/20 hover:bg-warning/15'
            case 'info':
            default:
                return 'bg-primary/10 border-primary/20 hover:bg-primary/15'
        }
    }

    const getSeverityBadge = (severity: Alert['severity']) => {
        const labels = {
            critical: 'Crítico',
            error: 'Erro',
            warning: 'Aviso',
            info: 'Info',
        }
        const variants = {
            critical: 'destructive',
            error: 'destructive',
            warning: 'secondary',
            info: 'default',
        } as const

        return (
            <Badge variant={variants[severity]} className="text-xs">
                {labels[severity]}
            </Badge>
        )
    }

    const filteredAlerts = alerts.filter(alert =>
        alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.message.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const unreadCount = alerts.filter(a => !a.is_read).length
    const totalPages = Math.ceil(totalCount / pageSize)

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-4xl font-bold flex items-center gap-3">
                            <div className="size-12 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                                <Brain className="size-7 text-white" />
                            </div>
                            Alertas de IA
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Insights automáticos e notificações do sistema inteligente
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {unreadCount > 0 && (
                            <Badge variant="destructive" className="size-8 rounded-full flex items-center justify-center text-sm">
                                {unreadCount}
                            </Badge>
                        )}
                        <Button onClick={fetchAlerts} variant="outline" size="icon">
                            <RefreshCw className="size-4" />
                        </Button>
                    </div>
                </div>

                {/* Filtros */}
                <Card className="p-6">
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Busca */}
                        <div className="flex-1 min-w-[300px]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar alertas..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Filtro de Severidade */}
                        <Select value={severityFilter} onValueChange={(v: any) => setSeverityFilter(v)}>
                            <SelectTrigger className="w-[180px]">
                                <Filter className="size-4 mr-2" />
                                <SelectValue placeholder="Severidade" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas</SelectItem>
                                <SelectItem value="critical">Crítico</SelectItem>
                                <SelectItem value="error">Erro</SelectItem>
                                <SelectItem value="warning">Aviso</SelectItem>
                                <SelectItem value="info">Info</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Filtro de Status */}
                        <Tabs value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)} className="w-auto">
                            <TabsList>
                                <TabsTrigger value="unread">Não lidos</TabsTrigger>
                                <TabsTrigger value="read">Lidos</TabsTrigger>
                                <TabsTrigger value="all">Todos</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        {/* Marcar todos como lido */}
                        {unreadCount > 0 && (
                            <Button onClick={handleMarkAllAsRead} variant="outline" size="sm">
                                <CheckCircle className="size-4 mr-2" />
                                Marcar todos como lidos
                            </Button>
                        )}
                    </div>
                </Card>

                {/* Lista de Alertas */}
                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map(i => (
                            <Card key={i} className="p-6">
                                <div className="animate-pulse space-y-3">
                                    <div className="h-4 bg-muted rounded w-3/4" />
                                    <div className="h-3 bg-muted rounded w-full" />
                                    <div className="h-3 bg-muted rounded w-1/2" />
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : filteredAlerts.length === 0 ? (
                    <Card className="p-12 text-center">
                        <CheckCircle className="size-16 text-success mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Nenhum alerta encontrado</h3>
                        <p className="text-muted-foreground">
                            {searchTerm
                                ? 'Tente ajustar os filtros de busca'
                                : 'Todos os alertas estão sob controle'}
                        </p>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {filteredAlerts.map(alert => (
                            <Card
                                key={alert.id}
                                className={`p-6 border transition-all ${getAlertColor(alert.severity)} ${
                                    alert.is_read ? 'opacity-60' : ''
                                }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 shrink-0">{getAlertIcon(alert.severity)}</div>

                                    <div className="flex-1 min-w-0 space-y-2">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                                    {alert.title}
                                                    {!alert.is_read && (
                                                        <Badge variant="default" className="size-2 rounded-full p-0" />
                                                    )}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {getSeverityBadge(alert.severity)}
                                                    <span className="text-xs text-muted-foreground">
                                                        {alert.source}
                                                    </span>
                                                </div>
                                            </div>

                                            {!alert.is_read && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="size-8 shrink-0"
                                                    onClick={() => handleMarkAsRead(alert.id)}
                                                >
                                                    <X className="size-4" />
                                                </Button>
                                            )}
                                        </div>

                                        <p className="text-sm text-foreground">{alert.message}</p>

                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span>
                                                {new Date(alert.created_at).toLocaleString('pt-BR', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </span>
                                            {alert.is_read && <Badge variant="outline" className="text-xs">Lido</Badge>}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Paginação */}
                {totalPages > 1 && (
                    <Card className="p-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Mostrando {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, totalCount)} de {totalCount} alertas
                            </p>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    <ChevronLeft className="size-4" />
                                    Anterior
                                </Button>

                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum
                                        if (totalPages <= 5) {
                                            pageNum = i + 1
                                        } else if (page <= 3) {
                                            pageNum = i + 1
                                        } else if (page >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i
                                        } else {
                                            pageNum = page - 2 + i
                                        }

                                        return (
                                            <Button
                                                key={pageNum}
                                                variant={page === pageNum ? 'default' : 'ghost'}
                                                size="sm"
                                                onClick={() => setPage(pageNum)}
                                                className="size-9"
                                            >
                                                {pageNum}
                                            </Button>
                                        )
                                    })}
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                >
                                    Próxima
                                    <ChevronRight className="size-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    )
}
