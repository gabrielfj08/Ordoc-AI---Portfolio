import React, { useState } from 'react'
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { FileText, Filter, Sparkles, ChevronRight, Search, X, Star, Eye, Download, Share2, MoreVertical } from "lucide-react"
import { CardControls } from "@/components/my-day/card-controls"
import { DocumentPreviewTooltip } from "@/components/document-preview-tooltip"
import { useMyDayStore, selectSortedDocuments, selectIsRankingEnabled, selectDocumentRankings } from "@/stores/my-day-store"
import { rankingApi } from "@/services/ranking-api"

export function FeaturedDocumentsWidget() {
    const router = useRouter()
    const {
        recentDocuments,
        isRankingEnabled,
        documentRankings,
        toggleRanking
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

    const resetPage = () => setDocsPage(1)

    // Filtrar documentos (Lógica movida da page.tsx)
    const filteredDocs = recentDocuments.filter((doc) => {
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

    return (
        <Card className="p-6 border-border/50 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <FileText className="size-5 text-primary" />
                        Documentos em Destaque
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">Seleção inteligente baseada em suas tarefas e prioridades</p>
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
                    <CardControls cardId="documents" cardTitle="Documentos em Destaque" />
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
                                <div className="flex items-center gap-2">
                                    <div className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                                        {doc.file_name || doc.title}
                                    </div>
                                    {doc.recommendation_reason && (
                                        <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 h-4 border-0 
                                            ${doc.recommendation_reason === 'Tarefa Crítica' ? 'bg-destructive/10 text-destructive' :
                                                doc.recommendation_reason === 'Próximo Vencimento' ? 'bg-warning/10 text-warning-foreground' :
                                                    doc.recommendation_reason === 'Favorito' ? 'bg-yellow-500/10 text-yellow-600' :
                                                        'bg-secondary text-secondary-foreground'}`}>
                                            {doc.recommendation_reason}
                                        </Badge>
                                    )}
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
    )
}
