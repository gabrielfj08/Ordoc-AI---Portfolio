"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
    X,
} from "lucide-react"

interface Document {
    id: string
    name: string
    type: string
    size: string
    owner: string
    createdAt: string
    modifiedAt: string
    location: string
}

interface Folder {
    id: string
    name: string
    itemCount: number
    owner: string
    createdAt: string
    modifiedAt: string
    location: string
}

interface Activity {
    id: string
    action: string
    count: number
    date: string
    items: {
        name: string
        type: string
        location: string
    }[]
}

interface AIInsight {
    type: "warning" | "suggestion" | "info"
    message: string
    action?: {
        label: string
        onClick: () => void
    }
}

interface DocumentDetailsPanelProps {
    isOpen: boolean
    onClose: () => void
    selectedDocument?: Document | null
    selectedFolder?: Folder | null
}

export function DocumentDetailsPanel({
    isOpen,
    onClose,
    selectedDocument,
    selectedFolder,
}: DocumentDetailsPanelProps) {
    const [activeTab, setActiveTab] = useState("details")

    const item = selectedDocument || selectedFolder
    const isFolder = !!selectedFolder

    // Mock activities - em produção, viria do backend
    const activities: Activity[] = [
        {
            id: "1",
            action: "criou",
            count: 1,
            date: "12 a 27 de dez",
            items: [
                { name: "Documento sem título", type: "document", location: "Meu Drive" },
            ],
        },
        {
            id: "2",
            action: "editou",
            count: 1,
            date: "18 a 21 de dez",
            items: [
                { name: "Documento sem título", type: "document", location: "Meu Drive" },
            ],
        },
        {
            id: "3",
            action: "criou",
            count: 3,
            date: "06 a 23 de dez",
            items: [
                { name: "Meu Drive", type: "folder", location: "Meu Drive" },
                { name: "Documento sem título", type: "document", location: "Meu Drive" },
                { name: "Controle de projetos", type: "spreadsheet", location: "Meu Drive" },
            ],
        },
    ]

    // Mock AI insights - em produção, viria da IA
    const aiInsights: AIInsight[] = selectedDocument
        ? [
            {
                type: "warning",
                message: "Este documento não foi aberto há 15 dias. Considere arquivá-lo?",
                action: {
                    label: "Arquivar",
                    onClick: () => console.log("Arquivar documento"),
                },
            },
            {
                type: "suggestion",
                message: "Documentos similares encontrados: Relatório Q3, Análise Mensal",
                action: {
                    label: "Ver similares",
                    onClick: () => console.log("Ver documentos similares"),
                },
            },
            {
                type: "info",
                message: "Sugestão: Adicionar à pasta 'Relatórios 2024' para melhor organização",
                action: {
                    label: "Mover",
                    onClick: () => console.log("Mover documento"),
                },
            },
        ]
        : selectedFolder
            ? [
                {
                    type: "warning",
                    message: "Esta pasta contém 5 documentos sem categoria",
                    action: {
                        label: "Categorizar",
                        onClick: () => console.log("Categorizar documentos"),
                    },
                },
                {
                    type: "suggestion",
                    message: "Considere criar subpastas para melhor organização",
                },
            ]
            : []

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-[400px] sm:w-[440px] overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Meu Drive</SheetTitle>
                </SheetHeader>

                {!item ? (
                    // Estado vazio
                    <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
                        <div className="relative mb-4">
                            <FileText className="size-16 text-muted-foreground" />
                            <div className="absolute -bottom-1 -right-1 size-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <Sparkles className="size-4 text-primary" />
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Selecione um item para ver os detalhes
                        </p>
                    </div>
                ) : (
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="details">Detalhes</TabsTrigger>
                            <TabsTrigger value="activities">Atividades</TabsTrigger>
                        </TabsList>

                        {/* Aba Detalhes */}
                        <TabsContent value="details" className="space-y-6 mt-6">
                            {/* Ícone/Preview */}
                            <div className="flex justify-center">
                                <div className="size-24 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                                    {isFolder ? (
                                        <Folder className="size-12 text-primary" />
                                    ) : (
                                        <FileText className="size-12 text-primary" />
                                    )}
                                </div>
                            </div>

                            {/* Nome */}
                            <div className="text-center">
                                <h3 className="font-semibold text-lg">{item.name}</h3>
                                {!isFolder && selectedDocument && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {selectedDocument.type}
                                    </p>
                                )}
                            </div>

                            <Separator />

                            {/* Informações */}
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <User className="size-4 text-muted-foreground mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Proprietário</p>
                                        <p className="text-sm font-medium">{item.owner}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <MapPin className="size-4 text-muted-foreground mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Localização</p>
                                        <p className="text-sm font-medium">{item.location}</p>
                                    </div>
                                </div>

                                {!isFolder && selectedDocument && (
                                    <div className="flex items-start gap-3">
                                        <HardDrive className="size-4 text-muted-foreground mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-xs text-muted-foreground">Tamanho</p>
                                            <p className="text-sm font-medium">{selectedDocument.size}</p>
                                        </div>
                                    </div>
                                )}

                                {isFolder && selectedFolder && (
                                    <div className="flex items-start gap-3">
                                        <FileText className="size-4 text-muted-foreground mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-xs text-muted-foreground">Itens</p>
                                            <p className="text-sm font-medium">{selectedFolder.itemCount} documentos</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start gap-3">
                                    <Calendar className="size-4 text-muted-foreground mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Criado em</p>
                                        <p className="text-sm font-medium">{item.createdAt}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Clock className="size-4 text-muted-foreground mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Modificado em</p>
                                        <p className="text-sm font-medium">{item.modifiedAt}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Insights de IA */}
                            {aiInsights.length > 0 && (
                                <>
                                    <Separator />
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="size-4 text-primary" />
                                            <h4 className="text-sm font-semibold">Insights de IA</h4>
                                        </div>
                                        {aiInsights.map((insight, index) => (
                                            <div
                                                key={index}
                                                className={`p-3 rounded-lg border ${insight.type === "warning"
                                                        ? "bg-yellow-500/5 border-yellow-500/20"
                                                        : insight.type === "suggestion"
                                                            ? "bg-blue-500/5 border-blue-500/20"
                                                            : "bg-primary/5 border-primary/20"
                                                    }`}
                                            >
                                                <div className="flex items-start gap-2">
                                                    {insight.type === "warning" ? (
                                                        <AlertCircle className="size-4 text-yellow-600 mt-0.5 shrink-0" />
                                                    ) : insight.type === "suggestion" ? (
                                                        <Lightbulb className="size-4 text-blue-600 mt-0.5 shrink-0" />
                                                    ) : (
                                                        <TrendingUp className="size-4 text-primary mt-0.5 shrink-0" />
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs leading-relaxed">{insight.message}</p>
                                                        {insight.action && (
                                                            <Button
                                                                variant="link"
                                                                size="sm"
                                                                className="h-auto p-0 mt-1 text-xs"
                                                                onClick={insight.action.onClick}
                                                            >
                                                                {insight.action.label}
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </TabsContent>

                        {/* Aba Atividades */}
                        <TabsContent value="activities" className="space-y-6 mt-6">
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm font-semibold mb-4">Semana passada</h4>
                                    <div className="space-y-4">
                                        {activities.map((activity) => (
                                            <div key={activity.id} className="flex gap-3">
                                                <Avatar className="size-8 shrink-0">
                                                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                                        R
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm">
                                                        Você {activity.action} {activity.count} {activity.count === 1 ? "item" : "itens"} em{" "}
                                                        {activity.date}
                                                    </p>
                                                    <div className="mt-2 space-y-1">
                                                        {activity.items.map((item, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                                            >
                                                                <Badge variant="secondary" className="size-5 p-0 flex items-center justify-center">
                                                                    {item.type === "folder" ? (
                                                                        <Folder className="size-3" />
                                                                    ) : item.type === "spreadsheet" ? (
                                                                        <FileText className="size-3 text-green-600" />
                                                                    ) : (
                                                                        <FileText className="size-3" />
                                                                    )}
                                                                </Badge>
                                                                <span className="truncate">
                                                                    {item.location} → {item.name}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                )}
            </SheetContent>
        </Sheet>
    )
}
