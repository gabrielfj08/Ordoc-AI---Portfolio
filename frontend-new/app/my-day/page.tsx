"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AIAlertsWidget } from "@/components/intelligence/ai-alerts-widget"
import { PriorityTasksWidget } from "@/components/tasks/priority-tasks-widget"
import { ContinueWorkingWidget } from "@/components/my-day/continue-working-widget"
import { TeamViewWidget } from "@/components/my-day/team-view-widget"
import dynamic from 'next/dynamic'

const AssistantWidget = dynamic(() => import("@/components/my-day/assistant-widget").then(mod => ({ default: mod.AssistantWidget })), { ssr: false })
import { DocumentPreviewTooltip } from "@/components/document-preview-tooltip"
import {
    FileText,
    Workflow,
    Users,
    Target,
    TrendingUp,
    TrendingDown,
    Clock,
    Sparkles,
    BarChart3,
    AlertCircle,
    CheckCircle2,
    Filter,
    ChevronRight,
    Star,
    Eye,
    Download,
    Share2,
    MoreVertical,
    Upload,
    PlayCircle,
    PauseCircle,
    Rocket,
    Activity,
    Calendar,
    Database,
    X,
    Search,
} from "lucide-react"
import { myDayApi, type DashboardOverview, type RecentDocument, type ActiveWorkflow, type PendingSummary } from "@/services/my-day-api"
import { rankingApi, type RankedEntity } from "@/services/ranking-api"
import { useMyDayStore, selectSortedDocuments, selectIsRankingEnabled, selectDocumentRankings } from "@/stores/my-day-store"
import { CardControls } from "@/components/my-day/card-controls"

export default function MeuDiaPage() {
    const router = useRouter()

    // Zustand store
    const {
        overview,
        recentDocuments,
        activeWorkflows,
        pending,
        userName,
        isLoading,
        isRankingEnabled,
        documentRankings,
        procedureRankings,
        viewMode,
        fetchDashboardData,
        toggleRanking,
        privacyMode,
    } = useMyDayStore()

    // Local UI state (filters, pagination)
    const [docsPage, setDocsPage] = useState(1)
    const docsPerPage = 5
    const [showDocsFilters, setShowDocsFilters] = useState(false)
    const [docsFilters, setDocsFilters] = useState({
        search: '',
        dateRange: 'all' as 'all' | 'today' | 'week' | 'month',
        fileType: 'all' as 'all' | 'pdf' | 'doc' | 'xls' | 'img',
    })
    const [showWorkflowsFilters, setShowWorkflowsFilters] = useState(false)
    const [workflowsFilters, setWorkflowsFilters] = useState({
        search: '',
        status: 'all' as 'all' | 'active' | 'paused',
    })

    // Fetch data on mount
    useEffect(() => {
        fetchDashboardData()

        // Refresh every 5 minutes
        const interval = setInterval(fetchDashboardData, 300000)
        return () => clearInterval(interval)
    }, [])

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return "Bom dia"
        if (hour < 18) return "Boa tarde"
        return "Boa noite"
    }

    const formatDate = () => {
        return new Date().toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    }

    // Filtrar documentos
    const filteredDocs = recentDocuments.filter((doc: RecentDocument) => {
        // Filtro de busca
        if (docsFilters.search) {
            const searchLower = docsFilters.search.toLowerCase()
            const matchName = doc.file_name?.toLowerCase().includes(searchLower)
            const matchTitle = doc.title?.toLowerCase().includes(searchLower)
            if (!matchName && !matchTitle) return false
        }

        // Filtro de data
        if (docsFilters.dateRange !== 'all') {
            const docDate = new Date(doc.created_at)
            const now = new Date()
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

            if (docsFilters.dateRange === 'today') {
                if (docDate < today) return false
            } else if (docsFilters.dateRange === 'week') {
                const weekAgo = new Date(today)
                weekAgo.setDate(weekAgo.getDate() - 7)
                if (docDate < weekAgo) return false
            } else if (docsFilters.dateRange === 'month') {
                const monthAgo = new Date(today)
                monthAgo.setMonth(monthAgo.getMonth() - 1)
                if (docDate < monthAgo) return false
            }
        }

        // Filtro de tipo de arquivo
        if (docsFilters.fileType !== 'all') {
            const ext = doc.file_name?.split('.').pop()?.toLowerCase()
            if (docsFilters.fileType === 'pdf' && ext !== 'pdf') return false
            if (docsFilters.fileType === 'doc' && !['doc', 'docx'].includes(ext || '')) return false
            if (docsFilters.fileType === 'xls' && !['xls', 'xlsx'].includes(ext || '')) return false
            if (docsFilters.fileType === 'img' && !['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) return false
        }

        return true
    })

    // Ordenar documentos por ranking da IA (se habilitado)
    const sortedDocs = isRankingEnabled && documentRankings.length > 0
        ? rankingApi.sortByRanking(filteredDocs, documentRankings)
        : filteredDocs

    // Resetar página quando filtros mudarem
    const resetPage = () => setDocsPage(1)

    // Filtrar workflows
    const filteredWorkflows = activeWorkflows.filter((workflow: ActiveWorkflow) => {
        // Filtro de busca
        if (workflowsFilters.search) {
            const searchLower = workflowsFilters.search.toLowerCase()
            const matchName = workflow.name?.toLowerCase().includes(searchLower)
            if (!matchName) return false
        }

        // Filtro de status
        if (workflowsFilters.status !== 'all') {
            if (workflowsFilters.status !== workflow.status) return false
        }

        return true
    })

    // Ordenar workflows por ranking da IA (se habilitado)
    const sortedWorkflows = isRankingEnabled && procedureRankings.length > 0
        ? rankingApi.sortByRanking(filteredWorkflows, procedureRankings)
        : filteredWorkflows

    if (isLoading && !overview) {
        return (
            <div className="container mx-auto p-6 max-w-[1600px]">
                <div className="space-y-8">
                    <div className="h-32 bg-muted animate-pulse rounded-lg" />
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-40 bg-muted animate-pulse rounded-lg" />
                        ))}
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className="container mx-auto p-6 max-w-[1600px]">
            <div className="space-y-8 animate-in fade-in duration-500">
                {/* Header com saudação + Card Assistente lado a lado */}
                <div className="grid lg:grid-cols-2 gap-6 items-center">
                    {/* Coluna esquerda - Saudação */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="size-4" />
                            <span style={{ textTransform: 'capitalize' }}>{formatDate()}</span>
                        </div>
                        <h1 className="text-5xl font-bold tracking-tight text-balance flex items-center flex-wrap gap-4">
                            <span className="bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
                                {getGreeting()}, {userName || 'Usuário'}
                            </span>
                            {viewMode === 'team' && (
                                <Badge variant="secondary" className="text-lg py-1 px-3 border-primary/20 bg-primary/5 text-primary">
                                    <Users className="size-5 mr-2" />
                                    Visão da Equipe
                                </Badge>
                            )}
                        </h1>
                        <p className="text-base text-muted-foreground">
                            Você tem{" "}
                            <span className="text-orange-600 font-semibold">
                                {pending.pending_signatures} documento{pending.pending_signatures !== 1 ? 's' : ''} aguardando assinatura
                            </span>
                            {" "}e{" "}
                            <span className="text-orange-600 font-semibold">
                                {pending.pending_approvals} aprovaç{pending.pending_approvals !== 1 ? 'ões' : 'ão'} pendente{pending.pending_approvals !== 1 ? 's' : ''}
                            </span>
                        </p>

                        {/* Informações da Organização */}
                        <div className="flex items-center gap-3 mt-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="size-2 rounded-full bg-success" />
                                <span className="font-medium text-muted-foreground">ORGANIZAÇÃO</span>
                            </div>
                            <span className="text-foreground">Operando em Organização • Sem departamento</span>
                        </div>
                    </div>

                    {/* Coluna direita - Assistente Ordoc Premium */}
                    <div className="w-full">
                        <AssistantWidget overview={overview} pending={pending} privacyMode={privacyMode} />
                    </div>
                </div>

                {/* Métricas principais */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        {
                            label: "Total de Documentos",
                            value: overview?.total_documents?.toString() || "0",
                            change: overview?.documents_change || "+0%",
                            trend: (overview?.documents_change || "+0%").startsWith("-") ? "down" : "up",
                            icon: FileText,
                            color: "primary",
                            target: "200",
                        },
                        {
                            label: "Usuários Ativos",
                            value: overview?.active_users?.toString() || "0",
                            change: overview?.users_change || "+0%",
                            trend: (overview?.users_change || "+0%").startsWith("-") ? "down" : "up",
                            icon: Users,
                            color: "chart-2",
                            target: "10",
                        },
                        {
                            label: "Taxa de Aprovação",
                            value: `${overview?.approval_rate || 89}%`,
                            change: "-2%",
                            trend: "down",
                            icon: Target,
                            color: "chart-4",
                            target: "95%",
                        },
                        {
                            label: "Tempo Médio",
                            value: "1.3h",
                            change: "-15%",
                            trend: "up",
                            icon: Clock,
                            color: "chart-3",
                            target: "1h",
                        },
                    ].map((stat) => (
                        <Card
                            key={stat.label}
                            onClick={() => {
                                if (stat.label === "Total de Documentos") router.push('/documents')
                                else if (stat.label === "Usuários Ativos") router.push('/settings/users')
                                else if (stat.label === "Taxa de Aprovação") router.push('/processes')
                                else if (stat.label === "Tempo Médio") router.push('/processes')
                            }}
                            className="p-6 hover:shadow-xl transition-all border-border/50 hover:border-primary/20 group cursor-pointer relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-orange-600/10 transition-colors" />
                            <div className="relative">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="size-12 rounded-2xl bg-orange-600/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <stat.icon className="size-6 text-primary" />
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className={`gap-1 font-semibold ${stat.trend === "up" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}
                                    >
                                        {stat.trend === "up" ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                                        {stat.change}
                                    </Badge>
                                </div>
                                <div className="text-3xl font-bold tracking-tight mb-1">{stat.value}</div>
                                <div className="text-sm text-muted-foreground mb-3">{stat.label}</div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">Meta: {stat.target}</span>
                                    <span className="text-primary font-semibold">Ver detalhes →</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Layout principal em 3 colunas */}
                <div className="grid gap-6 lg:grid-cols-12">
                    {/* Coluna principal - 2/3 da largura */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Widget de Processos */}
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

                        {/* Continue de onde parou */}
                        <ContinueWorkingWidget />

                        {/* Documentos Recentes */}
                        <Card className="p-6 border-border/50 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <FileText className="size-5 text-primary" />
                                        Documentos Recentes
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-1">Acesso rápido aos seus arquivos</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant={showDocsFilters ? "default" : "ghost"}
                                        size="sm"
                                        className="rounded-full gap-2"
                                        onClick={() => setShowDocsFilters(!showDocsFilters)}
                                    >
                                        <Filter className="size-4" />
                                        Filtrar
                                        {(docsFilters.search || docsFilters.dateRange !== 'all' || docsFilters.fileType !== 'all') && (
                                            <span className="ml-1 size-2 rounded-full bg-primary-foreground" />
                                        )}
                                    </Button>
                                    {documentRankings.length > 0 && (
                                        <Button
                                            variant={isRankingEnabled ? "default" : "outline"}
                                            size="sm"
                                            className="rounded-full gap-2"
                                            onClick={() => toggleRanking()}
                                        >
                                            <Sparkles className="size-4" />
                                            Ranking IA
                                        </Button>
                                    )}
                                    <CardControls cardId="documents" cardTitle="Documentos Recentes" />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="rounded-full gap-2 text-primary"
                                        onClick={() => router.push('/documents')}
                                    >
                                        Ver todos
                                        <ChevronRight className="size-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Filtros */}
                            {showDocsFilters && (
                                <div className="mb-4 p-4 rounded-lg border bg-secondary/30 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold text-sm">Filtros</h4>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setDocsFilters({ search: '', dateRange: 'all', fileType: 'all' })
                                                resetPage()
                                            }}
                                            className="text-xs h-7"
                                        >
                                            Limpar filtros
                                        </Button>
                                    </div>

                                    {/* Busca */}
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Buscar por nome do documento..."
                                            value={docsFilters.search}
                                            onChange={(e) => {
                                                setDocsFilters({ ...docsFilters, search: e.target.value })
                                                resetPage()
                                            }}
                                            className="pl-9 pr-9 h-9"
                                        />
                                        {docsFilters.search && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    setDocsFilters({ ...docsFilters, search: '' })
                                                    resetPage()
                                                }}
                                                className="absolute right-1 top-1/2 -translate-y-1/2 size-7"
                                            >
                                                <X className="size-3" />
                                            </Button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        {/* Filtro de data */}
                                        <div>
                                            <label className="text-xs font-medium text-muted-foreground mb-2 block">
                                                Período
                                            </label>
                                            <div className="flex flex-wrap gap-1">
                                                {[
                                                    { value: 'all', label: 'Todos' },
                                                    { value: 'today', label: 'Hoje' },
                                                    { value: 'week', label: '7 dias' },
                                                    { value: 'month', label: '30 dias' },
                                                ].map(option => (
                                                    <Button
                                                        key={option.value}
                                                        variant={docsFilters.dateRange === option.value ? 'default' : 'outline'}
                                                        size="sm"
                                                        onClick={() => {
                                                            setDocsFilters({ ...docsFilters, dateRange: option.value as any })
                                                            resetPage()
                                                        }}
                                                        className="text-xs h-7"
                                                    >
                                                        {option.label}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Filtro de tipo */}
                                        <div>
                                            <label className="text-xs font-medium text-muted-foreground mb-2 block">
                                                Tipo de Arquivo
                                            </label>
                                            <div className="flex flex-wrap gap-1">
                                                {[
                                                    { value: 'all', label: 'Todos' },
                                                    { value: 'pdf', label: 'PDF' },
                                                    { value: 'doc', label: 'Word' },
                                                    { value: 'xls', label: 'Excel' },
                                                    { value: 'img', label: 'Imagem' },
                                                ].map(option => (
                                                    <Button
                                                        key={option.value}
                                                        variant={docsFilters.fileType === option.value ? 'default' : 'outline'}
                                                        size="sm"
                                                        onClick={() => {
                                                            setDocsFilters({ ...docsFilters, fileType: option.value as any })
                                                            resetPage()
                                                        }}
                                                        className="text-xs h-7"
                                                    >
                                                        {option.label}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Resultado da filtragem */}
                                    <div className="text-xs text-muted-foreground pt-2 border-t">
                                        {sortedDocs.length} documento{sortedDocs.length !== 1 ? 's' : ''} encontrado{sortedDocs.length !== 1 ? 's' : ''}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-0.5">
                                {sortedDocs.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <FileText className="size-12 mx-auto mb-2 opacity-50" />
                                        <p>{(docsFilters.search || docsFilters.dateRange !== 'all' || docsFilters.fileType !== 'all') ? 'Nenhum documento encontrado' : 'Nenhum documento recente'}</p>
                                    </div>
                                ) : sortedDocs.slice((docsPage - 1) * docsPerPage, docsPage * docsPerPage).map((doc) => (
                                    <DocumentPreviewTooltip key={doc.id} document={doc}>
                                        <div
                                            onClick={() => router.push(`/documents/${doc.id}`)}
                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-all group cursor-pointer border border-transparent hover:border-border/50"
                                        >
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                                            >
                                                {doc.is_starred ? <Star className="size-3.5 fill-warning text-warning" /> : <Star className="size-3.5" />}
                                            </Button>
                                            <div className="size-9 rounded-lg bg-gradient-to-br from-destructive/20 to-destructive/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                                <FileText className="size-5 text-destructive" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                                                    {doc.file_name || doc.title}
                                                </div>
                                                <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1 flex-wrap">
                                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                                        {doc.file_name?.split('.').pop()?.toUpperCase() || 'PDF'}
                                                    </Badge>
                                                    <span>{(doc.file_size / 1024 / 1024).toFixed(1)} MB</span>
                                                    <span>•</span>
                                                    <span>
                                                        {new Date(doc.created_at).toLocaleString('pt-BR', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                    {doc.relevance_score && (
                                                        <>
                                                            <span>•</span>
                                                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-success/10 text-success">
                                                                {Math.round(doc.relevance_score * 100)}% relevância
                                                            </Badge>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" className="size-8 rounded-full hover:bg-secondary">
                                                    <Eye className="size-3.5" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="size-8 rounded-full hover:bg-secondary">
                                                    <Download className="size-3.5" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="size-8 rounded-full hover:bg-secondary">
                                                    <Share2 className="size-3.5" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="size-8 rounded-full hover:bg-secondary">
                                                    <MoreVertical className="size-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </DocumentPreviewTooltip>
                                ))}
                            </div>

                            {/* Paginação */}
                            {sortedDocs.length > docsPerPage && (
                                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                    <div className="text-sm text-muted-foreground">
                                        Mostrando {((docsPage - 1) * docsPerPage) + 1} - {Math.min(docsPage * docsPerPage, sortedDocs.length)} de {sortedDocs.length}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setDocsPage(p => Math.max(1, p - 1))}
                                            disabled={docsPage === 1}
                                            className="rounded-full"
                                        >
                                            Anterior
                                        </Button>
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: Math.ceil(sortedDocs.length / docsPerPage) }, (_, i) => i + 1).map(page => (
                                                <Button
                                                    key={page}
                                                    variant={page === docsPage ? "default" : "ghost"}
                                                    size="sm"
                                                    onClick={() => setDocsPage(page)}
                                                    className="size-8 rounded-full p-0"
                                                >
                                                    {page}
                                                </Button>
                                            ))}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setDocsPage(p => Math.min(Math.ceil(sortedDocs.length / docsPerPage), p + 1))}
                                            disabled={docsPage === Math.ceil(sortedDocs.length / docsPerPage)}
                                            className="rounded-full"
                                        >
                                            Próximo
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </Card>

                        {/* Workflows Ativos */}
                        <Card className="p-6 border-border/50 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <Rocket className="size-5 text-chart-3" />
                                        Workflows Mais Ativos
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-1">Processos com maior volume de documentos</p>
                                </div>
                                <Button
                                    variant={showWorkflowsFilters ? "default" : "ghost"}
                                    size="sm"
                                    className="rounded-full gap-2"
                                    onClick={() => setShowWorkflowsFilters(!showWorkflowsFilters)}
                                >
                                    <Filter className="size-4" />
                                    Filtrar
                                    {(workflowsFilters.search || workflowsFilters.status !== 'all') && (
                                        <span className="ml-1 size-2 rounded-full bg-primary-foreground" />
                                    )}
                                </Button>
                            </div>

                            {/* Filtros */}
                            {showWorkflowsFilters && (
                                <div className="mb-4 p-4 rounded-lg border bg-secondary/30 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold text-sm">Filtros</h4>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setWorkflowsFilters({ search: '', status: 'all' })}
                                            className="text-xs h-7"
                                        >
                                            Limpar filtros
                                        </Button>
                                    </div>

                                    {/* Busca */}
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Buscar por nome do workflow..."
                                            value={workflowsFilters.search}
                                            onChange={(e) => setWorkflowsFilters({ ...workflowsFilters, search: e.target.value })}
                                            className="pl-9 pr-9 h-9"
                                        />
                                        {workflowsFilters.search && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setWorkflowsFilters({ ...workflowsFilters, search: '' })}
                                                className="absolute right-1 top-1/2 -translate-y-1/2 size-7"
                                            >
                                                <X className="size-3" />
                                            </Button>
                                        )}
                                    </div>

                                    {/* Filtro de status */}
                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground mb-2 block">
                                            Status
                                        </label>
                                        <div className="flex gap-2">
                                            {[
                                                { value: 'all', label: 'Todos' },
                                                { value: 'active', label: 'Ativos' },
                                                { value: 'paused', label: 'Pausados' },
                                            ].map(option => (
                                                <Button
                                                    key={option.value}
                                                    variant={workflowsFilters.status === option.value ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={() => setWorkflowsFilters({ ...workflowsFilters, status: option.value as any })}
                                                    className="text-xs h-7 flex-1"
                                                >
                                                    {option.label}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Resultado da filtragem */}
                                    <div className="text-xs text-muted-foreground pt-2 border-t">
                                        {sortedWorkflows.length} workflow{sortedWorkflows.length !== 1 ? 's' : ''} encontrado{sortedWorkflows.length !== 1 ? 's' : ''}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                {sortedWorkflows.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Workflow className="size-12 mx-auto mb-2 opacity-50" />
                                        <p>{(workflowsFilters.search || workflowsFilters.status !== 'all') ? 'Nenhum workflow encontrado' : 'Nenhum workflow ativo'}</p>
                                    </div>
                                ) : sortedWorkflows.map((workflow) => (
                                    <div
                                        key={workflow.id}
                                        onClick={() => router.push(`/processes/${workflow.id}`)}
                                        className="flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-md transition-all group cursor-pointer"
                                    >
                                        {workflow.status === "active" ? (
                                            <div className="size-10 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
                                                <PlayCircle className="size-5 text-success" />
                                            </div>
                                        ) : (
                                            <div className="size-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                                                <PauseCircle className="size-5 text-muted-foreground" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-sm">{workflow.name}</div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                {workflow.document_count} documento{workflow.document_count !== 1 ? 's' : ''}
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <Badge
                                                variant={workflow.status === "active" ? "default" : "secondary"}
                                                className={workflow.status === "active" ? "bg-warning/10 text-warning-foreground" : ""}
                                            >
                                                {workflow.status === "active" ? "Ativo" : "Pausado"}
                                            </Badge>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                Tempo médio: {workflow.average_time_days} dia{workflow.average_time_days !== 1 ? 's' : ''}
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="rounded-full"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                router.push(`/processes/${workflow.id}`)
                                            }}
                                        >
                                            Ver detalhes
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar direita - 1/3 da largura */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Tarefas Prioritárias */}
                        <PriorityTasksWidget />

                        {/* Alertas de IA */}
                        <AIAlertsWidget />

                        {/* Status do Sistema */}
                        <Card className="p-6 border-border/50 shadow-sm">
                            <h3 className="font-bold mb-5 flex items-center gap-2">
                                <Activity className="size-5 text-chart-2" />
                                Status do Sistema
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { name: "API Core", status: "Operacional", uptime: "99.9%", color: "success" },
                                    { name: "Database", status: "Operacional", uptime: "100%", color: "success" },
                                    { name: "Storage", status: "17.3 MB usados", uptime: "45% capacidade", color: "success" },
                                ].map((item, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-3">
                                                <div className={`size-2.5 rounded-full bg-${item.color} shadow-lg shadow-${item.color}/50`} />
                                                <span className="font-semibold">{item.name}</span>
                                            </div>
                                            <Badge variant="secondary" className="text-xs font-medium">
                                                {item.uptime}
                                            </Badge>
                                        </div>
                                        <div className="text-xs text-muted-foreground pl-5">{item.status}</div>
                                    </div>
                                ))}
                                <Button variant="outline" size="sm" className="w-full mt-4 rounded-full bg-transparent">
                                    Ver Status Completo
                                </Button>
                            </div>
                        </Card>

                        {/* Agenda Inteligente */}
                        <Card className="p-6 border-border/50 shadow-sm">
                            <h3 className="font-bold mb-5 flex items-center gap-2">
                                <Calendar className="size-5 text-chart-4" />
                                Agenda Inteligente
                            </h3>
                            <div className="space-y-3">
                                <div className="text-center p-6 rounded-xl bg-muted/30 border border-dashed border-border">
                                    <Calendar className="size-8 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-sm text-muted-foreground">Nenhum evento próximo</p>
                                    <Button variant="link" size="sm" className="mt-2">
                                        Adicionar evento
                                    </Button>
                                </div>
                            </div>
                        </Card>

                        {/* Armazenamento */}
                        <Card className="p-6 border-border/50 shadow-sm">
                            <h3 className="font-bold mb-5 flex items-center gap-2">
                                <Database className="size-5 text-chart-5" />
                                Armazenamento
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-baseline gap-2 mb-3">
                                        <span className="text-2xl font-bold">17.3 MB</span>
                                        <span className="text-sm text-muted-foreground">de 100 GB</span>
                                    </div>
                                    <Progress value={0.02} className="h-2" />
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="size-3 rounded-sm bg-orange-600" />
                                            <span>Documentos</span>
                                        </div>
                                        <span className="font-medium">17.3 MB</span>
                                    </div>
                                    <div className="flex items-center justify-between text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <div className="size-3 rounded-sm bg-chart-2" />
                                            <span>Arquivos temporários</span>
                                        </div>
                                        <span>0 MB</span>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" className="w-full rounded-full bg-transparent">
                                    Gerenciar armazenamento
                                </Button>
                            </div>
                        </Card>

                        {/* Visão de Equipe */}
                        <TeamViewWidget />
                    </div>
                </div>


            </div>
        </div>
    )
}
