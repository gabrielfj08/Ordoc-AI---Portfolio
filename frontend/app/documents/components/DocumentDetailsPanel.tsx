"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { activitiesApi } from "@/services/intelligence-api"
import { Document, Directory, directoriesApi, documentsApi } from "@/services/documents-api"
import { format, isToday, isYesterday } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import {
    FileText,
    Folder,
    Calendar,
    HardDrive,
    User,
    MapPin,
    Clock,
    Sparkles,
    AlertCircle,
    Lightbulb,
    TrendingUp,
    Eye,
    Download,
    X,
} from "lucide-react"

interface AIInsight {
    type: "warning" | "suggestion" | "info"
    message: string
    action?: {
        label: string
        onClick: () => void
    }
}

import { useDocumentsStore } from "@/stores/documentsStore"

export function DocumentDetailsPanel() {
    const {
        selectedItemId,
        selectedItemType,
        rightPanelOpen,
        rightPanelTab,
        setRightPanelTab,
        toggleRightPanel,
        setSelectedItem
    } = useDocumentsStore()

    const isOpen = rightPanelOpen && !!selectedItemId

    const [activeTab, setActiveTab] = useState("details")



    const isFolder = selectedItemType === 'folder'

    // Fetch details
    const { data: item } = useQuery({
        queryKey: ['details', selectedItemType, selectedItemId],
        queryFn: async () => {
            if (!selectedItemId) return null
            if (isFolder) {
                return directoriesApi.retrieve(selectedItemId)
            } else {
                return documentsApi.retrieve(selectedItemId)
            }
        },
        enabled: !!selectedItemId && isOpen
    })

    // Fetch activities
    const { data: activities, isLoading: isLoadingActivities } = useQuery({
        queryKey: ['activity', selectedItemType, selectedItemId],
        queryFn: async () => {
            if (!selectedItemId) return []
            if (isFolder) {
                return directoriesApi.getActivity(selectedItemId)
            } else {
                return documentsApi.getActivity(selectedItemId)
            }
        },
        enabled: isOpen && rightPanelTab === 'activities' && !!selectedItemId
    })

    // Fetch directory stats/insights
    const { data: directoryStats } = useQuery({
        queryKey: ['directory-stats', selectedItemId],
        queryFn: () => directoriesApi.getStats(selectedItemId!),
        enabled: !!selectedItemId && isFolder && isOpen && rightPanelTab === 'details'
    })

    // Real AI insights from backend
    // For documents, we could fetch analysis results, but for now we only show real folder insights
    // to avoid sending "fake" hardcoded data.
    const aiInsights: AIInsight[] = isFolder && directoryStats?.insights
        ? directoryStats.insights
        : []

    // Helper formatting
    const formatFileSize = (bytes: number) => {
        if (!bytes) return "0 B"
        if (bytes < 1024) return `${bytes} B`
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    }

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "-"
        try {
            return format(new Date(dateStr), "dd 'de' MMM 'às' HH:mm", { locale: ptBR })
        } catch {
            return dateStr
        }
    }

    if (!isOpen) return null

    if (!item) {
        return (
            <aside className="w-80 border-l bg-background flex flex-col shrink-0 items-center justify-center p-4">
                <div className="relative mb-4">
                    <FileText className="size-16 text-muted-foreground" />
                    <Sparkles className="absolute -bottom-1 -right-1 size-6 text-primary" />
                </div>
                <p className="text-sm text-center text-muted-foreground">
                    Selecione um item para ver os detalhes
                </p>
            </aside>
        )
    }

    return (
        <aside className="w-80 border-l bg-background flex flex-col shrink-0">
            <div className="flex items-center justify-between p-3 border-b">
                <div className="flex-1" />
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => {
                        toggleRightPanel()
                        // Optionally clear selection if closing panel implies deselection
                        // setSelectedItem(null, null) 
                    }}
                >
                    <X className="size-4" />
                </Button>
            </div>

            <Tabs value={rightPanelTab} onValueChange={(v) => setRightPanelTab(v as any)} className="flex-1 flex flex-col overflow-hidden">
                <div className="px-3 pt-2">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="details">Detalhes</TabsTrigger>
                        <TabsTrigger value="activities">Atividades</TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col">
                    <TabsContent value="details" className="flex-1 overflow-hidden flex flex-col mt-0">
                        <ScrollArea className="flex-1">
                            <div className="p-4 space-y-6">
                                {/* Header Info */}
                                <div className="space-y-4">
                                    <div className="relative h-40 bg-muted/30 rounded-lg flex items-center justify-center border border-dashed">
                                        {isFolder ? (
                                            <Folder className="size-16 text-primary/40" />
                                        ) : (
                                            <FileText className="size-16 text-primary/40" />
                                        )}

                                        {!isFolder && (
                                            <div className="absolute bottom-2 right-2 flex gap-1">
                                                <Button size="sm" variant="secondary" className="h-7 w-7 p-0 bg-background shadow-sm">
                                                    <Eye className="size-3" />
                                                </Button>
                                                <Button size="sm" variant="secondary" className="h-7 w-7 p-0 bg-background shadow-sm">
                                                    <Download className="size-3" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-center">
                                        <h3 className="font-semibold text-base leading-tight px-1">{item.name}</h3>
                                        {!isFolder && (
                                            <Badge variant="outline" className="mt-2 text-[10px] font-normal">
                                                {(item as Document).document_type_display || 'Documento'}
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <Separator />

                                {/* Meta Info */}
                                <div className="space-y-3 text-sm">
                                    {!isFolder && (
                                        <div className="flex justify-between items-center py-1">
                                            <span className="text-muted-foreground text-xs">Tamanho</span>
                                            <span className="font-medium font-mono text-xs">{formatFileSize((item as Document).file_size)}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center py-1">
                                        <span className="text-muted-foreground text-xs">Proprietário</span>
                                        <div className="flex items-center gap-1.5">
                                            <User className="size-3 text-muted-foreground" />
                                            <span className="font-medium text-xs">{item.created_by || 'Sistema'}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center py-1">
                                        <span className="text-muted-foreground text-xs">Criado em</span>
                                        <span className="font-medium text-xs">{formatDate(item.created_at)}</span>
                                    </div>

                                    <div className="flex justify-between items-center py-1">
                                        <span className="text-muted-foreground text-xs">Modificado</span>
                                        <span className="font-medium text-xs">{formatDate(item.updated_at)}</span>
                                    </div>

                                    {isFolder && (
                                        <div className="flex justify-between items-center py-1">
                                            <span className="text-muted-foreground text-xs">Caminho</span>
                                            <span className="font-medium text-xs truncate max-w-[150px]">{(item as Directory).path}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Insights */}
                                {aiInsights.length > 0 && (
                                    <>
                                        <Separator />
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <div className="size-6 rounded bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                                                    <Sparkles className="size-3 text-white" />
                                                </div>
                                                <span className="text-xs font-semibold">Insights de IA</span>
                                            </div>

                                            {(item as Document).contains_sensitive_data && (
                                                <div className="bg-red-50 rounded-md p-2 text-xs border border-red-100">
                                                    <div className="flex items-center gap-1.5 text-red-700 font-medium mb-1">
                                                        <AlertCircle className="size-3" />
                                                        LGPD Detectada
                                                    </div>
                                                    <p className="text-red-600/80 leading-tight">Este documento contém dados pessoais sensíveis.</p>
                                                </div>
                                            )}

                                            {aiInsights.map((insight, idx) => (
                                                <div key={idx} className="bg-muted/50 rounded-md p-2.5 text-xs border">
                                                    <p className="text-muted-foreground mb-1.5">{insight.message}</p>
                                                    {insight.action && (
                                                        <button
                                                            onClick={insight.action.onClick}
                                                            className="text-primary font-medium hover:underline flex items-center gap-1"
                                                        >
                                                            {insight.action.label}
                                                            <TrendingUp className="size-3" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="activities" className="flex-1 overflow-hidden flex flex-col mt-0">
                        <ScrollArea className="flex-1">
                            <div className="p-4 space-y-6">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Histórico Recente</h4>

                                {isLoadingActivities ? (
                                    <div className="py-8 flex justify-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                                    </div>
                                ) : !activities || activities.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Clock className="size-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-xs">Nenhuma atividade registrada.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-0">
                                        {activities && activities.length > 0 ? (
                                            Object.entries(
                                                [...(activities || [])]
                                                    .filter(a => a.date && !isNaN(new Date(a.date).getTime()))
                                                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                                    .reduce((groups, activity) => {
                                                        const dateObj = new Date(activity.date)
                                                        let dateLabel = format(dateObj, "dd 'de' MMMM", { locale: ptBR })
                                                        if (isToday(dateObj)) dateLabel = "Hoje"
                                                        if (isYesterday(dateObj)) dateLabel = "Ontem"

                                                        if (!groups[dateLabel]) groups[dateLabel] = []
                                                        groups[dateLabel].push(activity)
                                                        return groups
                                                    }, {} as Record<string, any[]>)
                                            ).map(([label, groupItems]: [string, any]) => (
                                                <div key={label} className="mb-6 group/date">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <Badge variant="secondary" className="text-[10px] font-normal px-2 py-0.5 h-auto text-muted-foreground bg-muted/50">
                                                            {label}
                                                        </Badge>
                                                        <Separator className="flex-1 opacity-50" />
                                                    </div>

                                                    <div className="relative pl-4 space-y-6 ml-2 border-l border-border/40 pb-2">
                                                        {groupItems.map((activity: any) => (
                                                            <div key={activity.id} className="relative pl-6 group/item">
                                                                {/* Connector Node */}
                                                                <div className="absolute -left-[5px] top-1.5 size-2.5 rounded-full bg-background border-2 border-muted-foreground/30 group-hover/item:border-primary group-hover/item:scale-110 transition-all z-10" />

                                                                {/* Connector Line to Icon (Logic: Horizontal line?) */}

                                                                <div className="flex flex-col gap-1.5">
                                                                    {/* Header: User & Time */}
                                                                    <div className="flex justify-between items-start">
                                                                        <span className="text-xs font-semibold text-foreground/90">
                                                                            {activity.user_name || 'Sistema'}
                                                                        </span>
                                                                        <span className="text-[10px] text-muted-foreground font-mono">
                                                                            {format(new Date(activity.date), "HH:mm")}
                                                                        </span>
                                                                    </div>

                                                                    {/* Body: Action & Context */}
                                                                    <div>
                                                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                                                            {activity.action === 'creation' && 'Criou este item'}
                                                                            {activity.action === 'approval' && (
                                                                                activity.context?.action_detail === 'create' ? 'Criou pasta' : 'Aprovou'
                                                                            )}
                                                                            {activity.action === 'share' && 'Compartilhou este item'}
                                                                            {activity.action === 'signature' && 'Assinou este item'}
                                                                            {activity.action === 'correction' && 'Fez uma correção'}
                                                                            {activity.action === 'observation' && 'Visualizou'}

                                                                            {!['creation', 'share', 'signature', 'correction', 'observation', 'approval'].includes(activity.action) && activity.action}
                                                                        </p>

                                                                        {/* Context Details (e.g. created a sub-folder inside this folder) */}
                                                                        {activity.context?.folder_name && item.name !== activity.context.folder_name && (
                                                                            <div className="mt-1.5 flex items-center gap-1.5 p-1.5 rounded bg-muted/40 border border-border/40 max-w-full">
                                                                                <Folder className="size-3 text-primary/60 shrink-0" />
                                                                                <span className="text-[10px] font-medium truncate">{activity.context.folder_name}</span>
                                                                            </div>
                                                                        )}

                                                                        {activity.items && activity.items.length > 0 && activity.items[0].name !== item.name && (
                                                                            <div className="mt-1.5 flex items-center gap-1.5 p-1.5 rounded bg-muted/40 border border-border/40 max-w-full">
                                                                                <FileText className="size-3 text-primary/60 shrink-0" />
                                                                                <span className="text-xs truncate">{activity.items[0].name}</span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))
                                        ) : null}
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </TabsContent>
                </div>
            </Tabs>
        </aside>
    )
}
