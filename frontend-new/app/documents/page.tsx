"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  FolderKanban,
  Star,
  Clock,
  Users,
  Trash2,
  LayoutGrid,
  List,
  Plus,
  FileText,
  Eye,
  Download,
  Share2,
  MoreVertical,
  Info,
  HardDrive,
  FileSignature,
  AlertCircle,
  X,
  Search,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  FolderPlus,
  FileUp,
  FolderUp,
  FileSpreadsheet,
  ChevronRight,
  Folder
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ImperativePanelHandle } from "react-resizable-panels"
import { useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useDocuments } from "@/hooks/use-documents"
import { useDocumentFilters } from "@/hooks/use-document-filters"
import { AIInsightsPanel } from "./components/ai-insights-panel"
import { CreateFolderDialog } from "./components/create-folder-dialog"
import { UploadDocumentDialog } from "./components/upload-document-dialog"
import { RenameDocumentDialog } from "./components/rename-document-dialog"
import { DocumentActionsMenu } from "./components/document-actions-menu"
import { Document, documentsApi } from "@/services/documents-api"
import { cn } from "@/lib/utils"

export default function DocumentsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedCategory, setSelectedCategory] = useState("meu-drive")
  const [detailsPanelOpen, setDetailsPanelOpen] = useState(true)
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [activeTypeFilter, setActiveTypeFilter] = useState<string | null>(null)
  const [createFolderOpen, setCreateFolderOpen] = useState(false)
  const [uploadDocumentOpen, setUploadDocumentOpen] = useState(false)
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [documentToRename, setDocumentToRename] = useState<Document | null>(null)

  // Directory Navigation
  const [currentDirectory, setCurrentDirectory] = useState<string | undefined>(undefined)
  const [directoryPath, setDirectoryPath] = useState<{ id: string, name: string }[]>([]) // Future: Breadcrumbs

  // Sidebar Controls
  const [isCollapsed, setIsCollapsed] = useState(false)
  const sidebarRef = useRef<ImperativePanelHandle>(null)

  const toggleSidebar = () => {
    const sidebar = sidebarRef.current
    if (sidebar) {
      if (isCollapsed) {
        sidebar.expand()
      } else {
        sidebar.collapse()
      }
    }
  }

  const searchParams = useSearchParams()
  const router = useRouter()
  const globalSearch = searchParams.get('q')

  const handleCreateBlankDocument = async () => {
    try {
      const doc = await documentsApi.createBlankDocument()
      toast.success("Documento criado com sucesso")
      refetch()
      router.push(`/documents/${doc.id}`)
    } catch (error) {
      console.error(error)
      toast.error("Erro ao criar documento")
    }
  }

  // Fetch dynamic filters
  const { filters, loading: filtersLoading } = useDocumentFilters()

  const { documents, directories, loading, error, total, refetch } = useDocuments({
    directory: currentDirectory,
    search: globalSearch || undefined,
    // Filters based on Sidebar Category
    is_favorited: selectedCategory === "favoritos" ? true : undefined,
    is_shared: selectedCategory === "compartilhados" ? true : undefined,
    in_trash: selectedCategory === "lixeira" ? true : undefined,
    requires_signature: selectedCategory === "pending_signature" ? true : undefined,
    has_deadline: selectedCategory === "with_deadline" ? true : undefined,
    criticality: selectedCategory === "critical" ? "critical" : undefined,
    is_archived: selectedCategory === "lixeira" ? undefined : undefined, // Legacy support if needed

    document_type: activeTypeFilter || undefined,
    ordering: selectedCategory === "recentes" ? "-updated_at" : "-created_at",
  })

  const handleDocumentClick = (doc: Document) => {
    setSelectedDocument(doc)
    setDetailsPanelOpen(true)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Agora"
    if (diffMins < 60) return `Há ${diffMins} min`
    if (diffHours < 24) return `Há ${diffHours}h`
    if (diffDays < 7) return `Há ${diffDays} dias`
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            ref={sidebarRef}
            defaultSize={18}
            minSize={15}
            maxSize={30}
            collapsible={true}
            collapsedSize={4}
            onCollapse={() => setIsCollapsed(true)}
            onExpand={() => setIsCollapsed(false)}
            className={cn("bg-background transition-all duration-300 ease-in-out", isCollapsed && "min-w-[50px]")}
          >
            <aside className="h-full border-r bg-background flex flex-col overflow-hidden">
              {/* Header */}
              <div className={cn("p-4 border-b flex items-center transition-all duration-300", isCollapsed ? "justify-center px-2 flex-col gap-2" : "justify-between")}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className={cn("shadow-md transition-all duration-300 bg-white text-gray-700 hover:bg-gray-50 border", isCollapsed ? "size-12 p-0 rounded-full" : "h-14 w-auto px-6 rounded-2xl gap-3")}
                      title="Novo"
                    >
                      <Plus className="size-6 text-primary" />
                      <span className={cn("transition-all duration-300 overflow-hidden whitespace-nowrap text-base font-medium", isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100")}>
                        Novo
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56" sideOffset={8}>
                    <DropdownMenuItem className="gap-3 py-2 cursor-pointer" onClick={() => setCreateFolderOpen(true)}>
                      <FolderPlus className="size-4 text-gray-500" />
                      <span>Nova pasta</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem className="gap-3 py-2 cursor-pointer" onClick={() => setUploadDocumentOpen(true)}>
                      <FileUp className="size-4 text-gray-500" />
                      <span>Upload de arquivo</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-3 py-2 cursor-pointer">
                      <FolderUp className="size-4 text-gray-500" />
                      <span>Upload de pasta</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="gap-3 py-2 cursor-pointer">
                        <FileText className="size-4 text-blue-600" />
                        <span>Documentos Ordoc</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem className="gap-3 py-2 cursor-pointer" onClick={handleCreateBlankDocument}>
                          <FileText className="size-4 text-gray-500" />
                          <span>Documento em branco</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-3 py-2 cursor-pointer">
                          <Sparkles className="size-4 text-purple-500" />
                          <span>Com base em modelo</span>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    <DropdownMenuItem className="gap-3 py-2 cursor-pointer">
                      <FileSpreadsheet className="size-4 text-green-600" />
                      <span>Planilhas</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Toggle Button */}
                {isCollapsed ? (
                  <Button variant="ghost" size="icon" onClick={() => sidebarRef.current?.expand()} className="size-8 text-muted-foreground hover:text-foreground mt-4">
                    <PanelLeftOpen className="size-4" />
                  </Button>
                ) : (
                  <div />
                )}
              </div>

              <ScrollArea className="flex-1 py-2">
                <nav className={cn("flex flex-col space-y-[1px] transition-all duration-300", isCollapsed ? "px-0" : "px-4")}>
                  {/* Meu Drive */}
                  <Button
                    variant={selectedCategory === "meu-drive" && !currentDirectory ? "secondary" : "ghost"}
                    className={cn(
                      "w-full gap-3 transition-all duration-300 relative group min-h-[32px] rounded-full",
                      isCollapsed ? "justify-center px-0 size-8 mx-auto" : "justify-start pl-4",
                      selectedCategory === "meu-drive" && !currentDirectory && "bg-orange-100 text-orange-700 hover:bg-orange-200 font-medium"
                    )}
                    onClick={() => {
                      setSelectedCategory("meu-drive")
                      setCurrentDirectory(undefined)
                    }}
                    title={isCollapsed ? "Meu Drive" : undefined}
                  >
                    <FolderKanban className="size-4 shrink-0" />
                    <span className={cn("flex-1 text-left transition-all duration-300 overflow-hidden whitespace-nowrap text-sm", isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100")}>
                      Meu Drive
                    </span>
                    {!isCollapsed && <Badge variant="secondary" className="rounded-full text-[10px] h-4 min-w-4 flex items-center justify-center ml-auto mr-0">{total}</Badge>}
                  </Button>

                  {/* Recentes */}
                  <Button
                    variant={selectedCategory === "recentes" ? "secondary" : "ghost"}
                    className={cn(
                      "w-full gap-3 rounded-full transition-all duration-300 min-h-[32px]",
                      isCollapsed ? "justify-center px-0 size-8 mx-auto" : "justify-start pl-4",
                      selectedCategory === "recentes" && "bg-orange-100 text-orange-700 hover:bg-orange-200 font-medium"
                    )}
                    onClick={() => setSelectedCategory("recentes")}
                    title="Recentes"
                  >
                    <Clock className="size-4 shrink-0" />
                    <span className={cn("flex-1 text-left transition-all duration-300 overflow-hidden whitespace-nowrap text-sm font-medium", isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100")}>Recentes</span>
                  </Button>

                  {/* Favoritos */}
                  <Button
                    variant={selectedCategory === "favoritos" ? "secondary" : "ghost"}
                    className={cn(
                      "w-full gap-3 rounded-full transition-all duration-300 min-h-[32px]",
                      isCollapsed ? "justify-center px-0 size-8 mx-auto" : "justify-start pl-4",
                      selectedCategory === "favoritos" && "bg-orange-100 text-orange-700 hover:bg-orange-200 font-medium"
                    )}
                    onClick={() => setSelectedCategory("favoritos")}
                    title="Favoritos"
                  >
                    <Star className="size-4 shrink-0" />
                    <span className={cn("flex-1 text-left transition-all duration-300 overflow-hidden whitespace-nowrap text-sm font-medium", isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100")}>Favoritos</span>
                  </Button>

                  {/* Compartilhados */}
                  <Button
                    variant={selectedCategory === "compartilhados" ? "secondary" : "ghost"}
                    className={cn(
                      "w-full gap-3 rounded-full transition-all duration-300 min-h-[32px]",
                      isCollapsed ? "justify-center px-0 size-8 mx-auto" : "justify-start pl-4",
                      selectedCategory === "compartilhados" && "bg-orange-100 text-orange-700 hover:bg-orange-200 font-medium"
                    )}
                    onClick={() => setSelectedCategory("compartilhados")}
                    title="Compartilhados"
                  >
                    <Users className="size-4 shrink-0" />
                    <span className={cn("flex-1 text-left transition-all duration-300 overflow-hidden whitespace-nowrap text-sm font-medium", isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100")}>Compartilhados</span>
                  </Button>

                  {/* Divider / Section Header */}
                  <div className={cn("transition-all duration-300 pt-2 pb-1", isCollapsed ? "px-0 text-center" : "px-4")}>
                    {isCollapsed ? (
                      <div className="h-px w-6 bg-border mx-auto" />
                    ) : (
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap overflow-hidden pl-2">
                        Por Status
                      </p>
                    )}
                  </div>

                  {/* Status Buttons */}
                  <Button
                    variant={selectedCategory === "pending_signature" ? "secondary" : "ghost"}
                    className={cn(
                      "w-full gap-3 rounded-full transition-all duration-300 min-h-[32px]",
                      isCollapsed ? "justify-center px-0 size-8 mx-auto" : "justify-start pl-4",
                      selectedCategory === "pending_signature" && "bg-orange-100 text-orange-700 hover:bg-orange-200 font-medium"
                    )}
                    onClick={() => setSelectedCategory("pending_signature")}
                    title="Aguardando Assinatura"
                  >
                    <FileSignature className="size-4 shrink-0" />
                    <span className={cn("flex-1 text-left text-sm transition-all duration-300 overflow-hidden whitespace-nowrap font-medium", isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100")}>
                      Aguardando Assinatura
                    </span>
                    {!isCollapsed && <Badge variant="destructive" className="rounded-full text-[10px] h-4 min-w-4 flex items-center justify-center ml-auto mr-0">{filters?.flag_filters.find(f => f.id === 'pending_signature')?.count || 0}</Badge>}
                  </Button>

                  <Button
                    variant={selectedCategory === "with_deadline" ? "secondary" : "ghost"}
                    className={cn(
                      "w-full gap-3 rounded-full transition-all duration-300 min-h-[32px]",
                      isCollapsed ? "justify-center px-0 size-8 mx-auto" : "justify-start pl-4",
                      selectedCategory === "with_deadline" && "bg-orange-100 text-orange-700 hover:bg-orange-200 font-medium"
                    )}
                    onClick={() => setSelectedCategory("with_deadline")}
                    title="Prazos Vencendo"
                  >
                    <AlertCircle className="size-4 shrink-0" />
                    <span className={cn("flex-1 text-left text-sm transition-all duration-300 overflow-hidden whitespace-nowrap font-medium", isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100")}>
                      Prazos Vencendo
                    </span>
                    {!isCollapsed && <Badge variant="destructive" className="rounded-full text-[10px] h-4 min-w-4 flex items-center justify-center ml-auto mr-0">{filters?.flag_filters.find(f => f.id === 'with_deadline')?.count || 0}</Badge>}
                  </Button>

                  <Button
                    variant={selectedCategory === "critical" ? "secondary" : "ghost"}
                    className={cn(
                      "w-full gap-3 rounded-full transition-all duration-300 min-h-[32px]",
                      isCollapsed ? "justify-center px-0 size-8 mx-auto" : "justify-start pl-4",
                      selectedCategory === "critical" && "bg-orange-100 text-orange-700 hover:bg-orange-200 font-medium"
                    )}
                    onClick={() => setSelectedCategory("critical")}
                    title="Críticos"
                  >
                    <Eye className="size-4 shrink-0" />
                    <span className={cn("flex-1 text-left text-sm transition-all duration-300 overflow-hidden whitespace-nowrap font-medium", isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100")}>
                      Críticos
                    </span>
                    {!isCollapsed && <Badge variant="outline" className="rounded-full text-[10px] h-4 min-w-4 flex items-center justify-center ml-auto mr-0">{filters?.flag_filters.find(f => f.id === 'critical')?.count || 0}</Badge>}
                  </Button>

                  <div className="pt-2">
                    <Button
                      variant={selectedCategory === "lixeira" ? "secondary" : "ghost"}
                      className={cn(
                        "w-full gap-3 rounded-full transition-all duration-300 min-h-[32px]",
                        isCollapsed ? "justify-center px-0 size-8 mx-auto" : "justify-start pl-4",
                        selectedCategory === "lixeira" && "bg-orange-100 text-orange-700 hover:bg-orange-200 font-medium"
                      )}
                      onClick={() => setSelectedCategory("lixeira")}
                      title="Lixeira"
                    >
                      <Trash2 className="size-4 shrink-0" />
                      <span className={cn("flex-1 text-left transition-all duration-300 overflow-hidden whitespace-nowrap text-sm font-medium", isCollapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100")}>Lixeira</span>
                    </Button>
                  </div>

                </nav>
              </ScrollArea>

              {/* Footer Storage */}
              <div className={cn("p-4 border-t transition-all duration-300", isCollapsed ? "opacity-0 invisible h-0 p-0" : "opacity-100 visible pl-6")}>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <HardDrive className="size-3" />
                    <span className="font-medium whitespace-nowrap">Armazenamento</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[17%]" />
                  </div>
                  <p className="text-xs text-muted-foreground whitespace-nowrap">17.3 GB de 100 GB usados</p>
                </div>
              </div>
            </aside>
          </ResizablePanel>


          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={82}>
            <div className="h-full flex flex-row overflow-hidden">
              {/* Main Content */}
              <main className="flex-1 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b bg-background">
                  <h1 className="text-lg font-medium">Documentos</h1>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-muted rounded-md p-0.5">
                      <Button
                        variant={viewMode === "grid" ? "secondary" : "ghost"}
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => setViewMode("grid")}
                      >
                        <LayoutGrid className="size-4" />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "secondary" : "ghost"}
                        size="sm"
                        className="h-7 px-2"
                        onClick={() => setViewMode("list")}
                      >
                        <List className="size-4" />
                      </Button>
                    </div>
                    <Button
                      variant={detailsPanelOpen ? "secondary" : "ghost"}
                      size="sm"
                      className="h-7 px-2"
                      onClick={() => setDetailsPanelOpen(!detailsPanelOpen)}
                    >
                      <Info className="size-4" />
                    </Button>
                  </div>
                </div>

                {/* AI Insights & Filters */}
                <AIInsightsPanel />

                <div className="flex items-center gap-3 px-4 py-3 border-b bg-background overflow-x-auto">
                  {/* DYNAMIC FILTERS ONLY - Search removed */}
                  <div className="flex gap-2">
                    {/* Filtro "Todos" */}
                    <Badge
                      variant={!activeTypeFilter ? "default" : "outline"}
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => setActiveTypeFilter(null)}
                    >
                      Todos {filters && `(${filters.total_documents})`}
                    </Badge>

                    {/* Filtros de Tipo (Top 3 mais usados) */}
                    {!filtersLoading && filters?.type_filters.slice(0, 3).map((filter) => (
                      <Badge
                        key={filter.value}
                        variant={activeTypeFilter === filter.value ? "default" : "outline"}
                        className={cn(
                          "cursor-pointer transition-colors",
                          activeTypeFilter === filter.value
                            ? "bg-primary text-white hover:bg-primary/90"
                            : "hover:bg-accent"
                        )}
                        onClick={() => setActiveTypeFilter(
                          activeTypeFilter === filter.value ? null : filter.value
                        )}
                      >
                        {filter.label} ({filter.count})
                      </Badge>
                    ))}

                    {/* Filtro LGPD (se existir) */}
                    {!filtersLoading && filters?.flag_filters.find(f => f.id === 'lgpd') && (
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-accent text-red-600 border-red-200"
                      >
                        {filters.flag_filters.find(f => f.id === 'lgpd')?.label} (
                        {filters.flag_filters.find(f => f.id === 'lgpd')?.count})
                      </Badge>
                    )}
                  </div>
                </div>

                <ScrollArea className="flex-1">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                      <Clock className="size-4" />
                      <span className="font-medium">
                        {activeTypeFilter
                          ? filters?.type_filters.find(f => f.value === activeTypeFilter)?.label
                          : "Recentes"}
                      </span>
                      {activeTypeFilter && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 px-2 text-xs"
                          onClick={() => setActiveTypeFilter(null)}
                        >
                          <X className="size-3 mr-1" />
                          Limpar filtro
                        </Button>
                      )}
                    </div>

                    {loading ? (
                      <div className="text-center py-12 text-muted-foreground">Carregando documentos...</div>
                    ) : error ? (
                      <div className="text-center py-12 text-destructive">Erro ao carregar documentos</div>
                    ) : documents.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        {activeTypeFilter
                          ? `Nenhum documento do tipo "${filters?.type_filters.find(f => f.value === activeTypeFilter)?.label}" encontrado`
                          : "Nenhum documento encontrado"}
                      </div>
                    ) : viewMode === "grid" ? (
                      /* GRID VIEW */
                      <div className="space-y-6">

                        {/* Folders Section */}
                        {directories.length > 0 && !activeTypeFilter && (
                          <div className="space-y-3">
                            <h2 className="text-sm font-medium text-muted-foreground">Pastas</h2>
                            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
                              {directories.map((dir) => (
                                <div
                                  key={dir.id}
                                  className="group cursor-pointer transition-all"
                                  onDoubleClick={() => setCurrentDirectory(dir.id)}
                                >
                                  <div className="border rounded-lg p-3 flex items-center gap-3 bg-background hover:bg-muted/50 transition-colors hover:shadow-sm">
                                    <Folder className="size-5 text-gray-500 fill-gray-500/20" />
                                    <span className="text-sm font-medium truncate flex-1">{dir.name}</span>
                                    <Button variant="ghost" size="icon" className="size-6 opacity-0 group-hover:opacity-100">
                                      <MoreVertical className="size-3" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Documents Section */}
                        <div className="space-y-3">
                          {(directories.length > 0 && !activeTypeFilter) && (
                            <h2 className="text-sm font-medium text-muted-foreground">Arquivos</h2>
                          )}
                          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
                            {documents.map((doc) => (
                              <div
                                key={doc.id}
                                className={cn(
                                  "group cursor-pointer transition-all",
                                  selectedDocument?.id === doc.id && "ring-2 ring-primary ring-offset-2"
                                )}
                                onClick={() => handleDocumentClick(doc)}
                              >
                                <div className={cn(
                                  "border rounded-lg overflow-hidden bg-background transition-all",
                                  "hover:shadow-lg hover:border-primary/50",
                                  selectedDocument?.id === doc.id && "border-primary shadow-md"
                                )}>
                                  <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border-b">
                                    <FileText className="size-16 text-gray-300" />

                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <DocumentActionsMenu
                                        document={doc}
                                        onRefresh={refetch}
                                        onRename={(d) => {
                                          setDocumentToRename(d)
                                          setRenameDialogOpen(true)
                                        }}
                                      />
                                    </div>

                                    <div className="absolute top-2 left-2 flex flex-wrap gap-1 max-w-[calc(100%-3rem)]">
                                      {doc.contains_sensitive_data && (
                                        <Badge className="text-[9px] px-1.5 py-0.5 bg-red-500 text-white border-0 shadow-sm">
                                          LGPD
                                        </Badge>
                                      )}
                                      {doc.requires_signature && (
                                        <Badge className="text-[9px] px-1.5 py-0.5 bg-blue-500 text-white border-0 shadow-sm">
                                          Assinar
                                        </Badge>
                                      )}
                                      {doc.criticality === "critical" && (
                                        <Badge className="text-[9px] px-1.5 py-0.5 bg-red-600 text-white border-0 shadow-sm">
                                          URGENTE
                                        </Badge>
                                      )}
                                      {doc.criticality === "high" && (
                                        <Badge className="text-[9px] px-1.5 py-0.5 bg-orange-500 text-white border-0 shadow-sm">
                                          ALTA
                                        </Badge>
                                      )}
                                    </div>
                                  </div>

                                  <div className="p-3">
                                    <div className="flex items-start gap-2">
                                      <FileText className="size-4 text-red-500 shrink-0 mt-0.5" />
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate leading-tight mb-1">
                                          {doc.name}
                                        </p>
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                          {doc.document_type_display && doc.document_type !== "other" && (
                                            <>
                                              <span className="truncate">{doc.document_type_display}</span>
                                              <span>•</span>
                                            </>
                                          )}
                                          <span>{formatRelativeTime(doc.created_at)}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* LIST VIEW */
                      <div className="border rounded-lg overflow-hidden bg-background">
                        <div className="grid grid-cols-[40px_1fr_140px_120px_100px_140px] gap-4 px-4 py-2 bg-muted/50 border-b text-xs font-medium text-muted-foreground">
                          <div></div>
                          <div>Nome</div>
                          <div>Tipo</div>
                          <div>Proprietário</div>
                          <div>Modificado</div>
                          <div>Tamanho</div>
                        </div>

                        <div className="divide-y">
                          {documents.map((doc) => (
                            <div
                              key={doc.id}
                              className={cn(
                                "grid grid-cols-[40px_1fr_140px_120px_100px_140px] gap-4 px-4 py-2.5 items-center group",
                                "cursor-pointer transition-colors hover:bg-muted/30",
                                selectedDocument?.id === doc.id && "bg-orange-50"
                              )}
                              onClick={() => handleDocumentClick(doc)}
                            >
                              <div className="flex items-center justify-center">
                                <FileText className="size-5 text-red-500" />
                              </div>

                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-sm truncate">{doc.name}</span>
                                {doc.contains_sensitive_data && (
                                  <Badge variant="destructive" className="text-[9px] px-1.5 py-0 shrink-0">LGPD</Badge>
                                )}
                                {doc.criticality === "critical" && (
                                  <Badge variant="destructive" className="text-[9px] px-1.5 py-0 shrink-0">URGENTE</Badge>
                                )}
                              </div>

                              <div className="text-sm text-muted-foreground truncate">
                                {doc.document_type_display || "Documento"}
                              </div>

                              <div className="text-sm text-muted-foreground truncate">Você</div>

                              <div className="text-sm text-muted-foreground">
                                {formatRelativeTime(doc.created_at)}
                              </div>

                              <div className="text-sm text-muted-foreground flex items-center justify-between">
                                <span>{formatFileSize(doc.file_size)}</span>
                                <DocumentActionsMenu
                                  document={doc}
                                  onRefresh={refetch}
                                  onRename={(d) => {
                                    setDocumentToRename(d)
                                    setRenameDialogOpen(true)
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </main>

              {/* Details Panel */}
              {detailsPanelOpen && selectedDocument && (
                <aside className="w-80 border-l bg-background flex flex-col shrink-0">
                  <div className="flex items-center justify-between p-3 border-b">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-7 text-xs bg-orange-50 text-primary">
                        Detalhes
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        Atividades
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => setDetailsPanelOpen(false)}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>

                  <ScrollArea className="flex-1">
                    <div className="p-4 space-y-4">
                      <div className="relative h-44 bg-muted rounded-lg flex items-center justify-center">
                        <FileText className="size-12 text-muted-foreground/30" />
                        <div className="absolute bottom-2 right-2 flex gap-1">
                          <Button size="sm" variant="secondary" className="h-7 w-7 p-0">
                            <Eye className="size-3" />
                          </Button>
                          <Button size="sm" variant="secondary" className="h-7 w-7 p-0">
                            <Download className="size-3" />
                          </Button>
                        </div>
                      </div>

                      <h3 className="font-medium text-sm leading-tight">{selectedDocument.name}</h3>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Tipo:</span>
                          <p className="font-medium">{selectedDocument.document_type_display || "Outro"}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Tamanho:</span>
                          <p className="font-medium">{formatFileSize(selectedDocument.file_size)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Criado:</span>
                          <p className="font-medium">{formatRelativeTime(selectedDocument.created_at)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Versão:</span>
                          <p className="font-medium">{selectedDocument.version}</p>
                        </div>
                      </div>

                      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
                        <div className="p-3 space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="size-6 rounded bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                              <Sparkles className="size-3 text-white" />
                            </div>
                            <span className="text-xs font-semibold">Insights de IA</span>
                          </div>

                          {selectedDocument.contains_sensitive_data && (
                            <div className="bg-white rounded-md p-2 text-xs border-l-2 border-red-500">
                              <p className="font-medium text-red-700">⚠️ Dados Sensíveis (LGPD)</p>
                              <p className="text-muted-foreground mt-1">
                                Documento contém informações protegidas pela LGPD
                              </p>
                              <Button variant="link" className="h-auto p-0 text-xs text-primary mt-1">
                                → Revisar permissões
                              </Button>
                            </div>
                          )}

                          {(selectedDocument.criticality === "high" || selectedDocument.criticality === "critical") && (
                            <div className="bg-white rounded-md p-2 text-xs border-l-2 border-orange-500">
                              <p className="font-medium text-orange-700">
                                🔴 Criticidade {selectedDocument.criticality_display}
                              </p>
                              <p className="text-muted-foreground mt-1">
                                Documento requer atenção prioritária
                              </p>
                            </div>
                          )}

                          {selectedDocument.requires_signature && (
                            <div className="bg-white rounded-md p-2 text-xs border-l-2 border-green-500">
                              <p className="font-medium text-green-700">✍️ Requer Assinatura</p>
                              <p className="text-muted-foreground mt-1">
                                Documento precisa ser assinado digitalmente
                              </p>
                              <Button variant="link" className="h-auto p-0 text-xs text-primary mt-1">
                                → Assinar agora
                              </Button>
                            </div>
                          )}
                        </div>
                      </Card>
                    </div>
                  </ScrollArea>

                  <div className="p-3 border-t flex gap-2">
                    <Button variant="outline" className="flex-1" size="sm">
                      <Share2 className="size-3 mr-1" />
                      Compartilhar
                    </Button>
                    <Button className="flex-1 bg-primary" size="sm">
                      <Eye className="size-3 mr-1" />
                      Abrir
                    </Button>
                  </div>
                </aside>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup >
      </div >
      <CreateFolderDialog
        open={createFolderOpen}
        onOpenChange={setCreateFolderOpen}
        onSuccess={refetch}
        currentDirectory={currentDirectory}
      />
      <UploadDocumentDialog
        open={uploadDocumentOpen}
        onOpenChange={setUploadDocumentOpen}
        onSuccess={refetch}
        currentDirectory={currentDirectory}
      />
      <RenameDocumentDialog
        open={renameDialogOpen}
        onOpenChange={setRenameDialogOpen}
        document={documentToRename}
        onSuccess={refetch}
      />
    </div >
  )
}
