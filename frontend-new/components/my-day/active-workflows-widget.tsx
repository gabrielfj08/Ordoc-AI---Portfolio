import React, { useState } from 'react'
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Rocket,
    Filter,
    Search,
    ClipboardList,
    Scale,
    FileStack,
    ChevronRight,
    Clock,
    AlertCircle,
    Hourglass,
} from "lucide-react"
import { useMyDayStore } from "@/stores/my-day-store"
import { CardControls } from "@/components/my-day/card-controls"

export function ActiveWorkflowsWidget() {
    const router = useRouter()
    const { activeWorkflows, isRankingEnabled, procedureRankings, dashboardConfig } = useMyDayStore()

    const [showWorkflowsFilters, setShowWorkflowsFilters] = useState(false)
    const [workflowsFilters, setWorkflowsFilters] = useState({
        search: '',
        status: 'all' as 'all' | 'active' | 'paused',
    })

    // --- Contextual Configuration ---
    const getContextConfig = () => {
        const type = dashboardConfig?.organization?.type?.toLowerCase() || ''
        const subtype = dashboardConfig?.organization?.subtype?.toLowerCase() || ''
        const features = dashboardConfig?.organization?.features || {}

        // Standard Icon Color (Orange/Primary) for all segments
        const standardIconColor = 'text-orange-600'

        // 1. Licitações (Consultoria)
        if (subtype.includes('licita') || features.context === 'bidding') {
            return {
                title: 'Licitações em Andamento',
                subtitle: 'Suas propostas ativas ordenadas por prazo',
                icon: ClipboardList,
                iconColor: standardIconColor,
                itemLabel: 'licitações',
                primaryActionLabel: 'Assinar',
                defaultActionLabel: 'Ver',
                emptyLabel: 'Nenhuma licitação encontrada',
            }
        }

        // 2. Tramitações (Órgão Público)
        if (type.includes('gov') || type.includes('public') || subtype.includes('secretaria') || features.context === 'public_sector') {
            return {
                title: 'Tramitações em Andamento',
                subtitle: 'Processos administrativos do seu departamento',
                icon: FileStack,
                iconColor: standardIconColor,
                itemLabel: 'tramitações',
                primaryActionLabel: 'Cobrar',
                defaultActionLabel: 'Ver',
                emptyLabel: 'Nenhuma tramitação pendente',
            }
        }

        // 3. Jurídico (Advocacia)
        if (type.includes('law') || subtype.includes('advoca') || features.context === 'legal') {
            return {
                title: 'Casos com Movimentação',
                subtitle: 'Processos judiciais com atividade recente',
                icon: Scale,
                iconColor: standardIconColor,
                itemLabel: 'casos',
                primaryActionLabel: 'Elaborar',
                defaultActionLabel: 'Ver',
                emptyLabel: 'Nenhum caso com movimentação recente',
            }
        }

        // Default: Generic Corporate
        return {
            title: 'Processos em Andamento',
            subtitle: 'Seus processos internos ativos',
            icon: Rocket,
            iconColor: standardIconColor,
            itemLabel: 'processos',
            primaryActionLabel: 'Ver',
            defaultActionLabel: 'Ver',
            emptyLabel: 'Nenhum processo em andamento',
        }
    }

    const context = getContextConfig()
    const Icon = context.icon

    // Filter logic
    const filteredWorkflows = activeWorkflows.filter((workflow) => {
        if (workflowsFilters.search) {
            const searchLower = workflowsFilters.search.toLowerCase()
            const matchName = workflow.name?.toLowerCase().includes(searchLower)
            const matchCode = workflow.code?.toLowerCase().includes(searchLower)
            if (!matchName && !matchCode) return false
        }
        if (workflowsFilters.status !== 'all') {
            if (workflowsFilters.status !== workflow.status) return false
        }
        return true
    })

    // Sort by Urgency (Critical > Late > Warning > Normal) AND THEN by AI Ranking
    const sortedWorkflows = [...filteredWorkflows].sort((a, b) => {
        const getPriorityScore = (status?: string) => {
            switch (status) {
                case 'urgent': return 4
                case 'late': return 3
                case 'learning': return 2 // Warning
                default: return 1
            }
        }

        const priorityA = getPriorityScore(a.deadline_status)
        const priorityB = getPriorityScore(b.deadline_status)

        if (priorityA !== priorityB) {
            return priorityB - priorityA // Higher priority first
        }

        // If same priority, use AI ranking if available
        if (isRankingEnabled && procedureRankings.length > 0) {
            const scoreA = procedureRankings.find(r => r.entity_id === a.id)?.score || 0
            const scoreB = procedureRankings.find(r => r.entity_id === b.id)?.score || 0
            return scoreB - scoreA
        }

        return 0
    })

    // Limit to 5 items
    const displayWorkflows = sortedWorkflows.slice(0, 5)

    // Helper to get status color
    // Standard: Title icon style (No background, just colored icon)
    const getStatusColorConfig = (status?: string) => {
        switch (status) {
            case 'urgent': return { text: 'text-destructive', icon: context.icon }
            case 'late': return { text: 'text-destructive', icon: context.icon }
            case 'learning': return { text: 'text-yellow-600', icon: context.icon }
            case 'normal':
            default: return { text: 'text-orange-600', icon: context.icon } // Match Title Color
        }
    }

    // Helper for status badge style
    const getBadgeConfig = (status?: string) => {
        switch (status) {
            case 'urgent': return { className: "bg-destructive/10 text-destructive border-0" }
            case 'late': return { className: "bg-destructive/10 text-destructive border-0" }
            case 'learning': return { className: "bg-yellow-500/10 text-yellow-700 border-0" }
            case 'normal':
            default: return { className: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-0" }
        }
    }

    return (
        <Card className="flex flex-col border-border/50 shadow-sm overflow-hidden bg-white/50 dark:bg-card/50">
            {/* Header */}
            <div className="p-6 pb-2">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                            <Icon className="size-5 text-orange-600" />
                            {context.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            {context.subtitle}
                        </p>
                    </div>


                    <div className="flex items-center gap-2">
                        <Button
                            variant={showWorkflowsFilters ? "default" : "outline"}
                            size="sm"
                            className="gap-2"
                            onClick={() => setShowWorkflowsFilters(!showWorkflowsFilters)}
                        >
                            <Filter className="size-4" />
                            Filtrar
                        </Button>
                        <CardControls cardId="workflows" cardTitle={context.title} />
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary gap-2"
                            onClick={() => router.push('/processes')}
                        >
                            Ver todos
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                {showWorkflowsFilters && (
                    <div className="mb-4 p-4 rounded-lg border bg-secondary/30 space-y-3 animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-sm">Filtros Ativos</h4>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setWorkflowsFilters({ search: '', status: 'all' })}
                                className="text-xs h-7 hover:bg-destructive/10 hover:text-destructive"
                            >
                                Limpar filtros
                            </Button>
                        </div>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                <Input
                                    placeholder={`Buscar ${context.itemLabel}...`}
                                    value={workflowsFilters.search}
                                    onChange={(e) => setWorkflowsFilters({ ...workflowsFilters, search: e.target.value })}
                                    className="pl-9 h-9 bg-background"
                                />
                            </div>
                            <div className="flex gap-1">
                                {[
                                    { value: 'all', label: 'Todos' },
                                    { value: 'active', label: 'Ativos' },
                                    { value: 'paused', label: 'Pausados' },
                                ].map(option => (
                                    <Button
                                        key={option.value}
                                        variant={workflowsFilters.status === option.value ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setWorkflowsFilters({ ...workflowsFilters, status: option.value as any })}
                                        className="h-9"
                                    >
                                        {option.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* List */}
            <div className="flex-1 px-6 space-y-0 divide-y divide-border/40">
                {displayWorkflows.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <Icon className="size-12 mx-auto mb-3 opacity-20" />
                        <p>{context.emptyLabel}</p>
                    </div>
                ) : displayWorkflows.map((workflow, index) => {
                    const statusConfig = getStatusColorConfig(workflow.deadline_status)
                    const StatusIcon = statusConfig.icon
                    const badgeStyle = getBadgeConfig(workflow.deadline_status)

                    return (
                        <div
                            key={workflow.id}
                            className="group flex flex-col sm:flex-row sm:items-start gap-4 py-4 hover:bg-secondary/20 transition-colors -mx-2 px-2 rounded-lg cursor-pointer relative"
                            onClick={() => router.push(`/processes/${workflow.id}`)}
                        >
                            {/* Status Icon Box (Left) - Matching Title Style: Standard Icon without Background Box */}
                            <div className={`mt-1 size-9 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform bg-transparent ${statusConfig.text}`}>
                                <StatusIcon className="size-5" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 space-y-1">
                                {/* Title Row */}
                                <div className="flex items-center gap-2">
                                    <h4 className="font-semibold text-sm truncate text-foreground group-hover:text-primary transition-colors">
                                        {workflow.name} {workflow.code ? <span className="text-muted-foreground font-normal">- {workflow.code}</span> : ''}
                                    </h4>
                                </div>

                                {/* Metadata Row */}
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                                    {workflow.current_step && (
                                        <span className="truncate max-w-[200px] sm:max-w-xs font-medium">{workflow.current_step}</span>
                                    )}
                                    {workflow.current_step && <span>•</span>}

                                    {workflow.responsible && (
                                        <>
                                            <span>{workflow.responsible}</span>
                                            <span>•</span>
                                        </>
                                    )}
                                    <span>{workflow.document_count} doc{workflow.document_count !== 1 ? 's' : ''}</span>
                                </div>

                                {/* Tags / Deadline Row */}
                                <div className="flex flex-wrap gap-2 mt-1.5 items-center">
                                    {workflow.deadline_label && (
                                        <Badge variant="outline" className={`${badgeStyle.className} text-[10px] px-1.5 py-0 h-5 font-medium`}>
                                            <Clock className="size-3 mr-1" />
                                            {workflow.deadline_label}
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            {/* Action Button (Right) */}
                            <div className="shrink-0 self-center">
                                <Button
                                    variant={workflow.deadline_status === 'urgent' ? "default" : "secondary"}
                                    size="sm"
                                    className={`${workflow.deadline_status === 'urgent' ? "bg-orange-600 hover:bg-orange-700 text-white shadow-sm h-8 text-xs px-3" : "bg-white border border-border/60 hover:bg-secondary text-foreground h-8 px-3"}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(`/processes/${workflow.id}`)
                                    }}
                                >
                                    <span className="mr-1">
                                        {workflow.deadline_status === 'urgent' ? context.primaryActionLabel : context.defaultActionLabel}
                                    </span>
                                </Button>
                            </div>
                        </div>
                    )
                })}
            </div>


        </Card>
    )
}
