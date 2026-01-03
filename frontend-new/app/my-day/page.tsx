"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { CardsSkeleton } from "@/components/ui/skeletons"
import {
    FileText,
    Users,
    TrendingUp,
    TrendingDown,
    Clock,
    Sparkles,
    AlertCircle,
    Activity,
} from "lucide-react"
import { useMyDayStore } from "@/stores/my-day-store"
import dynamic from 'next/dynamic'

// Widgets
import { DynamicCardRenderer } from "@/components/my-day/dynamic-card-renderer"
import { AIAlertsWidget } from "@/components/intelligence/ai-alerts-widget"
import { PriorityTasksWidget } from "@/components/tasks/priority-tasks-widget"
import { ContinueWorkingWidget } from "@/components/my-day/continue-working-widget"
import { TeamViewWidget } from "@/components/my-day/team-view-widget"
import { SmartAgendaWidget } from "@/components/my-day/smart-agenda-widget"
import { StorageWidget } from "@/components/my-day/storage-widget"
import { ProcessStatusWidget } from "@/components/my-day/process-status-widget"
import { FeaturedDocumentsWidget } from "@/components/my-day/featured-documents-widget"
import { ActiveWorkflowsWidget } from "@/components/my-day/active-workflows-widget"

// New Dynamic Widgets
import { ComplianceOverviewWidget } from "@/components/my-day/compliance-overview-widget"
import { CourtMovementsWidget } from "@/components/my-day/court-movements-widget"
import { OfficialDiariesWidget } from "@/components/my-day/official-diaries-widget"

const AssistantWidget = dynamic(() => import("@/components/my-day/assistant-widget").then(mod => ({ default: mod.AssistantWidget })), { ssr: false })

export default function MeuDiaPage() {
    const router = useRouter()
    const {
        overview,
        pending,
        userName,
        isLoading,
        viewMode,
        fetchDashboardData,
        privacyMode,
        aiStats,
    } = useMyDayStore()

    // Fetch data on mount
    useEffect(() => {
        fetchDashboardData()
        const interval = setInterval(fetchDashboardData, 300000)
        return () => clearInterval(interval)
    }, [])

    // --- Helpers ---
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

    // --- Card Mapping ---
    // Maps backend Card IDs (from config/dashboard-cards.tsx) to React Components
    const CARD_COMPONENTS_MAP = {
        // Core Content
        'documents': <FeaturedDocumentsWidget />,
        'workflows': <ActiveWorkflowsWidget />,
        'continue-working': <ContinueWorkingWidget />,

        // Insights
        'process-status': <ProcessStatusWidget />,
        'ai-alerts': <AIAlertsWidget />,
        'pending-actions': <PriorityTasksWidget />, // Mapped from pending-actions logical ID

        // Team & System
        'team-view': <TeamViewWidget />,
        'smart-agenda': <SmartAgendaWidget />,
        'system-status': null, // Optional: Maybe implement later or keep as placeholder
        'storage': <StorageWidget />,

        // Dynamic Features
        'compliance-overview': <ComplianceOverviewWidget />,
        'court-key-movements': <CourtMovementsWidget />,
        'official-diaries': <OfficialDiariesWidget />,
    }

    if (isLoading && !overview) {
        return (
            <div className="container mx-auto p-6 max-w-[1600px]">
                <div className="space-y-8">
                    <Skeleton className="h-32 rounded-lg" />
                    <CardsSkeleton count={4} />
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6 max-w-[1600px]">
            <div className="space-y-8 animate-in fade-in duration-500">

                {/* 1. Header Fixo (Saudação & Assistente) */}
                <div className="grid lg:grid-cols-2 gap-6 items-center">
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
                                {pending?.pending_signatures || 0} documento{pending?.pending_signatures !== 1 ? 's' : ''} aguardando assinatura
                            </span>
                            {" "}e{" "}
                            <span className="text-orange-600 font-semibold">
                                {pending?.pending_approvals || 0} aprovaç{pending?.pending_approvals !== 1 ? 'ões' : 'ão'} pendente{pending?.pending_approvals !== 1 ? 's' : ''}
                            </span>
                        </p>
                    </div>

                    <div className="w-full">
                        <AssistantWidget overview={overview} pending={pending} privacyMode={privacyMode} />
                    </div>
                </div>

                {/* 2. Métricas Fixas (Highlight Bars) */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        {
                            label: "Documentos Processados",
                            value: aiStats?.analysisCount?.toString() || "0",
                            change: "+12%",
                            trend: "up",
                            icon: FileText,
                            color: "primary",
                            target: "Meta: 500",
                        },
                        {
                            label: "Alertas de Inteligência",
                            value: aiStats?.alertsCount?.toString() || "0",
                            change: "+5%",
                            trend: "up",
                            icon: AlertCircle,
                            color: "chart-2",
                            target: "Críticos: 0",
                        },
                        {
                            label: "Status da Plataforma",
                            value: aiStats?.systemStatus === 'online' ? "Online" : "Ativo",
                            change: "100%",
                            trend: "up",
                            icon: Activity,
                            color: "success",
                            target: "Uptime: 99.9%",
                        },
                        {
                            label: "Padrões Identificados",
                            value: aiStats?.patternsCount?.toString() || "0",
                            change: "+3",
                            trend: "up",
                            icon: Sparkles,
                            color: "chart-3",
                            target: "Novos: 2",
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
                            </div>
                        </Card>
                    ))}
                </div>

                {/* 3. Layout Dinâmico (Colunas) */}
                <div className="grid gap-6 lg:grid-cols-12">

                    {/* Coluna Principal (2/3) - Content & Insights */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* 
                            DynamicCardRenderer vai calcular a prioridade baseada no usuário + config do backend
                            e renderizar APENAS os cards habilitados 
                        */}
                        <DynamicCardRenderer
                            cardComponents={CARD_COMPONENTS_MAP}
                            // Renderizamos juntos content e insights para eles competirem por prioridade nessa coluna
                            category="content"
                        />
                        <DynamicCardRenderer
                            cardComponents={CARD_COMPONENTS_MAP}
                            category="insights"
                        />
                    </div>

                    {/* Coluna Lateral (1/3) - Team & System */}
                    <div className="lg:col-span-4 space-y-6">
                        <DynamicCardRenderer
                            cardComponents={CARD_COMPONENTS_MAP}
                            category="team"
                        />
                        <DynamicCardRenderer
                            cardComponents={CARD_COMPONENTS_MAP}
                            category="system"
                        />
                    </div>
                </div>

            </div>
        </div>
    )
}
