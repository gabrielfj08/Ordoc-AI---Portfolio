"use client"

import { useState } from "react"
import { OrdocLogo } from "@/components/ordoc-logo"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Bell,
  Settings,
  FileText,
  Workflow,
  PenTool,
  BarChart3,
  Calendar,
  Clock,
  TrendingUp,
  CheckCircle2,
  Users,
  Activity,
  ChevronRight,
  Download,
  Eye,
  MoreVertical,
  Grid3x3,
  FolderKanban,
  Plus,
  Home,
  Mail,
  LayoutGrid,
  List,
  Filter,
  Star,
  Folder,
  Upload,
  Share2,
  Copy,
  Trash2,
  ArrowUpDown,
  AlertCircle,
  PlayCircle,
  PauseCircle,
  Sparkles,
  Shield,
  Key,
  FileCheck,
  TrendingDown,
  Target,
  Rocket,
  Database,
  Menu,
  ChevronLeft,
  HardDrive,
} from "lucide-react"

export default function DocumentsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  return (
    <div className="container mx-auto p-6 max-w-[1600px]">
      <DocumentosView sidebarCollapsed={sidebarCollapsed} />
    </div>
  )
}

function DocumentosView({ sidebarCollapsed }: { sidebarCollapsed: boolean }) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [selectedCategory, setSelectedCategory] = useState("meu-drive")

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header com ações rápidas */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-4xl font-bold tracking-tight mb-2">Documentos</h2>
          <p className="text-muted-foreground">Gerencie e organize seus arquivos com facilidade</p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="gap-2 rounded-full shadow-lg shadow-primary/20">
            <Upload className="size-4" />
            Novo Upload
          </Button>
          <Button variant="outline" className="gap-2 rounded-full bg-transparent">
            <Plus className="size-4" />
            Nova Pasta
          </Button>
        </div>
      </div>

      {/* Layout com sidebar e conteúdo principal */}
      <div className="flex gap-6">
        {/* Sidebar de categorias */}
        <div className={`shrink-0 transition-all duration-300 ease-in-out ${sidebarCollapsed ? "w-16" : "w-64"}`}>
          <Card className="p-4 border-border/50 h-fit sticky top-24">
            <div className="space-y-1">
              {[
                { id: "meu-drive", label: "Meu Drive", icon: FolderKanban, badge: null },
                { id: "prioridades", label: "Prioridades", icon: Star, badge: "3" },
                { id: "pendentes", label: "Pendentes", icon: Clock, badge: "20" },
                { id: "compartilhados", label: "Compartilhados", icon: Users, badge: null },
                { id: "templates", label: "Templates", icon: Copy, badge: null },
                { id: "lixeira", label: "Lixeira", icon: Trash2, badge: null },
              ].map((item) => (
                <Button
                  key={item.id}
                  variant={selectedCategory === item.id ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-3 rounded-xl transition-all ${selectedCategory === item.id ? "bg-orange-600/10 text-primary hover:bg-orange-600/20" : ""
                    } ${sidebarCollapsed ? "px-2" : ""}`}
                  onClick={() => setSelectedCategory(item.id)}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <item.icon className="size-4 shrink-0" />
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="rounded-full">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Button>
              ))}
            </div>

            {!sidebarCollapsed && (
              <div className="mt-6 pt-6 border-t border-border">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Pastas</div>
                <div className="space-y-1">
                  {[
                    { name: "Pasta Atenção", badge: "20", color: "destructive" },
                    { name: "Pasta Crítica", badge: "20", color: "warning" },
                    { name: "Pasta Saudável", badge: "10", color: "success" },
                  ].map((folder) => (
                    <Button key={folder.name} variant="ghost" className="w-full justify-start gap-3 rounded-xl group">
                      <Folder className={`size-4 text-${folder.color}`} />
                      <span className="flex-1 text-left text-sm">{folder.name}</span>
                      <Badge variant="secondary" className="rounded-full text-xs">
                        {folder.badge}
                      </Badge>
                    </Button>
                  ))}
                </div>

                <div className="mt-4 p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <HardDrive className="size-4 text-primary" />
                    <span className="text-xs font-semibold">Armazenamento</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-primary/60 w-[45%]" />
                    </div>
                    <p className="text-xs text-muted-foreground">17.3 MB de 100 GB usado</p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Área principal de documentos */}
        <div className="flex-1 min-w-0">
          <Card className="p-6 border-border/50">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2 rounded-full bg-transparent">
                  <Filter className="size-4" />
                  Filtrar
                </Button>
                <Button variant="outline" size="sm" className="gap-2 rounded-full bg-transparent">
                  <ArrowUpDown className="size-4" />
                  Ordenar
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="rounded-full"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="size-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="rounded-full"
                  onClick={() => setViewMode("list")}
                >
                  <List className="size-4" />
                </Button>
              </div>
            </div>

            {/* Seção "Minhas Pastas" */}
            {selectedCategory === "meu-drive" && (
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Folder className="size-5 text-primary" />
                  Minhas Pastas
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { name: "Pasta Atenção", docs: "20 documentos", icon: AlertCircle, color: "destructive" },
                    { name: "Pasta Crítica", docs: "20 documentos", icon: AlertCircle, color: "warning" },
                    { name: "Pasta Saudável", docs: "10 documentos", icon: CheckCircle2, color: "success" },
                  ].map((folder) => (
                    <div
                      key={folder.name}
                      className="group p-5 rounded-2xl border-2 border-border hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-background to-secondary/20"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={`size-12 rounded-xl bg-${folder.color}/10 flex items-center justify-center group-hover:scale-110 transition-transform`}
                        >
                          <Folder className={`size-6 text-${folder.color}`} />
                        </div>
                        <folder.icon className={`size-5 text-${folder.color}`} />
                      </div>
                      <div>
                        <div className="font-bold text-base mb-1 group-hover:text-primary transition-colors">
                          {folder.name}
                        </div>
                        <div className="text-sm text-muted-foreground">{folder.docs}</div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="secondary" className="text-[10px]">
                          Atenção
                        </Badge>
                        <span>20 documentos sem categoria</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Seção "Recentes" ou "Outros Arquivos" */}
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Clock className="size-5 text-chart-2" />
                {selectedCategory === "meu-drive" ? "Recentes" : "Documentos"}
              </h3>

              {viewMode === "list" ? (
                <div className="space-y-1">
                  {Array.from({ length: 12 }, (_, i) => ({
                    name: `Documento_Untagged_${28 - i}.pdf`,
                    size: "2 MB",
                    time: `Há ${i < 4 ? 19 : 14} horas`,
                    relevance: "92%",
                    suggested: i < 4,
                  })).map((doc, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-secondary/30 transition-all group cursor-pointer border border-transparent hover:border-border/50"
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-9 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      >
                        <Star className="size-4" />
                      </Button>
                      <div className="size-12 rounded-xl bg-gradient-to-br from-destructive/20 to-destructive/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <FileText className="size-6 text-destructive" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate group-hover:text-primary transition-colors flex items-center gap-2">
                          {doc.name}
                          {doc.suggested && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-orange-600/10 text-primary">
                              Sugerido
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1 flex-wrap">
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                            PDF
                          </Badge>
                          <span>{doc.size}</span>
                          <span>•</span>
                          <span>{doc.time}</span>
                          <span>•</span>
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-success/10 text-success">
                            {doc.relevance} relevância
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="size-9 rounded-full hover:bg-secondary">
                          <Eye className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="size-9 rounded-full hover:bg-secondary">
                          <Download className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="size-9 rounded-full hover:bg-secondary">
                          <Share2 className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="size-9 rounded-full hover:bg-secondary">
                          <MoreVertical className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {Array.from({ length: 12 }, (_, i) => ({
                    name: `Documento_${28 - i}.pdf`,
                    size: "2 MB",
                    time: `Há ${i < 4 ? 19 : 14}h`,
                  })).map((doc, i) => (
                    <div
                      key={i}
                      className="group p-4 rounded-2xl border-2 border-border hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer bg-background"
                    >
                      <div className="aspect-[3/4] rounded-xl bg-gradient-to-br from-destructive/20 to-destructive/5 flex items-center justify-center mb-3 group-hover:scale-[1.02] transition-transform">
                        <FileText className="size-16 text-destructive" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                          {doc.name}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {doc.size} • {doc.time}
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="size-8 rounded-full">
                          <Eye className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="size-8 rounded-full">
                          <Download className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="size-8 rounded-full">
                          <MoreVertical className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

