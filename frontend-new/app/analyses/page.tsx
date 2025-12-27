"use client"

import { useState, useEffect } from "react"
import { OrdocLogo } from "@/components/ordoc-logo"
import { analysesApi, type IntelligenceAlert, type LearnedPattern, type AuditLog } from "@/services/analyses-api"
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
import { ProcessMetrics } from "./components/process-metrics"

export default function AnalysesPage() {
  return (
    <div className="container mx-auto p-6 max-w-[1600px]">
      <AnalisesView />
    </div>
  )
}

function AnalisesView() {
  const [selectedView, setSelectedView] = useState<"visao-geral" | "inteligencia" | "relatorios" | "auditoria">(
    "visao-geral",
  )
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("30d")

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold tracking-tight mb-2 flex items-center gap-3">
            <BarChart3 className="size-10 text-primary" />
            Analytics & Intelligence
          </h2>
          <p className="text-muted-foreground text-lg">
            Insights preditivos, análises avançadas e relatórios customizáveis
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-secondary/30 p-1 rounded-full">
            {[
              { value: "7d", label: "7d" },
              { value: "30d", label: "30d" },
              { value: "90d", label: "90d" },
              { value: "1y", label: "1a" },
            ].map((option) => (
              <Button
                key={option.value}
                variant="ghost"
                size="sm"
                className={`rounded-full px-4 transition-all ${timeRange === option.value
                  ? "bg-orange-600 text-primary-foreground hover:bg-orange-600/90"
                  : "hover:bg-secondary/50"
                  }`}
                onClick={() => setTimeRange(option.value as any)}
              >
                {option.label}
              </Button>
            ))}
          </div>
          <Button
            className="gap-2 rounded-full shadow-lg bg-gradient-to-r from-primary to-primary/80"
            onClick={async () => {
              try {
                const blob = await analysesApi.exportAnalytics(timeRange, 'csv', 'documents')
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `analises-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                window.URL.revokeObjectURL(url)
              } catch (error) {
                console.error('Erro ao exportar:', error)
              }
            }}
          >
            <Download className="size-4" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {[
          { id: "visao-geral", label: "Visão Geral", icon: LayoutGrid },
          { id: "inteligencia", label: "Inteligência", icon: Sparkles },
          { id: "relatorios", label: "Relatórios", icon: FileText },
          { id: "auditoria", label: "Auditoria", icon: Shield },
        ].map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            className={`gap-2 rounded-full px-5 whitespace-nowrap transition-all ${selectedView === tab.id
              ? "bg-orange-600/10 text-primary hover:bg-orange-600/20 shadow-md"
              : "hover:bg-secondary/50"
              }`}
            onClick={() => setSelectedView(tab.id as any)}
          >
            <tab.icon className="size-4" />
            {tab.label}
          </Button>
        ))}
      </div>

      {selectedView === "visao-geral" && <VisaoGeralAnalytics timeRange={timeRange} />}
      {selectedView === "inteligencia" && <InteligenciaAnalytics />}
      {selectedView === "relatorios" && <RelatoriosAnalytics />}
      {selectedView === "auditoria" && <AuditoriaAnalytics />}
    </div>
  )
}

interface AnalyticsProps {
  timeRange: "7d" | "30d" | "90d" | "1y"
}

function VisaoGeralAnalytics({ timeRange }: AnalyticsProps) {
  const [loading, setLoading] = useState(true)
  const [overview, setOverview] = useState<any>(null)
  const [trends, setTrends] = useState<any[]>([])
  const [heatmap, setHeatmap] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Carregando dados para período:', timeRange)
        setLoading(true)
        const [overviewData, trendsData, heatmapData] = await Promise.all([
          analysesApi.getAnalyticsOverview(timeRange),
          analysesApi.getDocumentTrends(timeRange),
          analysesApi.getActivityHeatmap('7d')
        ])
        setOverview(overviewData)
        setTrends(trendsData)
        setHeatmap(heatmapData)
        console.log('Dados carregados com sucesso para:', timeRange)
      } catch (error) {
        console.error('Erro ao carregar dados de análises:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [timeRange])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Métricas de Processos */}
      <ProcessMetrics timeRange={timeRange} />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-6 border-border/50">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                <Activity className="size-5 text-primary" />
                Tendência de Documentos
              </h3>
              <p className="text-sm text-muted-foreground">Processamento nos últimos 30 dias com previsão IA</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1.5">
                <div className="size-2 rounded-full bg-orange-600" />
                Real
              </Badge>
              <Badge variant="secondary" className="gap-1.5">
                <div className="size-2 rounded-full bg-orange-600/40 border-2 border-primary/60 border-dashed" />
                Previsão
              </Badge>
            </div>
          </div>

          {/* Gráfico de linha com SVG */}
          <div className="h-80 relative">
            <svg className="w-full h-full" viewBox="0 0 800 320" preserveAspectRatio="none">
              {/* Grid de fundo */}
              <g className="opacity-10">
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <line key={`h-${i}`} x1="0" y1={i * 50} x2="800" y2={i * 50} stroke="currentColor" strokeWidth="1" />
                ))}
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                  <line key={`v-${i}`} x1={i * 80} y1="0" x2={i * 80} y2="320" stroke="currentColor" strokeWidth="1" />
                ))}
              </g>

              {/* Área sob a curva (gradiente) */}
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(var(--primary))" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="rgb(var(--primary))" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="predictionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(var(--primary))" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="rgb(var(--primary))" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Linha de dados reais */}
              <path
                d="M 0 250 L 80 220 L 160 240 L 240 200 L 320 180 L 400 150 L 480 120 L 560 100 L 640 80"
                fill="none"
                stroke="rgb(var(--primary))"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-lg"
              />

              {/* Área sob linha real */}
              <path
                d="M 0 250 L 80 220 L 160 240 L 240 200 L 320 180 L 400 150 L 480 120 L 560 100 L 640 80 L 640 320 L 0 320 Z"
                fill="url(#lineGradient)"
              />

              {/* Linha de predição (tracejada) */}
              <path
                d="M 640 80 L 720 60 L 800 50"
                fill="none"
                stroke="rgb(var(--primary))"
                strokeWidth="3"
                strokeDasharray="8 4"
                strokeLinecap="round"
                opacity="0.5"
              />

              {/* Área sob predição */}
              <path d="M 640 80 L 720 60 L 800 50 L 800 320 L 640 320 Z" fill="url(#predictionGradient)" />

              {/* Pontos de dados com animação hover */}
              {[
                { x: 0, y: 250 },
                { x: 80, y: 220 },
                { x: 160, y: 240 },
                { x: 240, y: 200 },
                { x: 320, y: 180 },
                { x: 400, y: 150 },
                { x: 480, y: 120 },
                { x: 560, y: 100 },
                { x: 640, y: 80 },
              ].map((point, i) => (
                <g key={i} className="cursor-pointer hover:scale-125 transition-transform origin-center">
                  <circle cx={point.x} cy={point.y} r="6" fill="rgb(var(--primary))" className="drop-shadow-md" />
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="10"
                    fill="rgb(var(--primary))"
                    opacity="0.2"
                    className="animate-ping"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                </g>
              ))}

              {/* Pontos de predição */}
              {[
                { x: 720, y: 60 },
                { x: 800, y: 50 },
              ].map((point, i) => (
                <circle
                  key={i}
                  cx={point.x}
                  cy={point.y}
                  r="5"
                  fill="rgb(var(--primary))"
                  opacity="0.5"
                  strokeWidth="2"
                  stroke="rgb(var(--primary))"
                  strokeDasharray="2 2"
                />
              ))}
            </svg>

            {/* Labels do eixo X */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-xs text-muted-foreground">
              {["1 Nov", "5 Nov", "10 Nov", "15 Nov", "20 Nov", "25 Nov", "30 Nov", "5 Dez", "10 Dez", "15 Dez"].map(
                (label, i) => (
                  <span key={i}>{label}</span>
                ),
              )}
            </div>
          </div>

          {/* Insights abaixo do gráfico */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">+45%</div>
              <div className="text-xs text-muted-foreground">Crescimento previsto</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">256</div>
              <div className="text-xs text-muted-foreground">Previsão próx. mês</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">98%</div>
              <div className="text-xs text-muted-foreground">Confiabilidade IA</div>
            </div>
          </div>
        </Card>

        {/* Sidebar com gráficos complementares */}
        <div className="space-y-6">
          <Card className="p-6 border-border/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                Distribuição por Tipo
              </h3>
              <div className="text-2xl font-bold text-primary">177</div>
            </div>

            <div className="space-y-4">
              {[
                { label: "Contratos", value: 98, percentage: 55, color: "bg-primary" },
                { label: "Propostas", value: 48, percentage: 27, color: "bg-chart-2" },
                { label: "Relatórios", value: 31, percentage: 18, color: "bg-chart-3" },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{item.value}</span>
                      <span className="text-xs text-muted-foreground">({item.percentage}%)</span>
                    </div>
                  </div>
                  <div className="h-2 bg-secondary/30 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t text-center">
              <div className="text-xs text-muted-foreground">Total de documentos processados</div>
            </div>
          </Card>

          <Card className="p-6 border-border/50">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Activity className="size-4 text-success" />
              Health Monitor
            </h3>
            <div className="space-y-4">
              {[
                { name: "API Core", status: "Operacional", uptime: "99.9%", color: "success" },
                { name: "Database", status: "Operacional", uptime: "100%", color: "success" },
                { name: "Storage", status: "17.3 MB", uptime: "45%", color: "warning" },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-2.5 rounded-full bg-${item.color} shadow-lg shadow-${item.color}/50 animate-pulse`}
                      />
                      <span className="font-semibold text-sm">{item.name}</span>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">{item.uptime}</span>
                  </div>
                  <Progress value={Number.parseFloat(item.uptime)} className="h-1.5" />
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-3 rounded-full bg-transparent">
                Dashboard Completo →
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Gráfico de barras comparativo */}
        <Card className="p-6 border-border/50">
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
              <BarChart3 className="size-5 text-primary" />
              Comparativo Mensal
            </h3>
            <p className="text-sm text-muted-foreground">Documentos processados por categoria</p>
          </div>

          <div className="space-y-4">
            {[
              { label: "Contratos", current: 98, previous: 85, color: "primary" },
              { label: "Propostas", current: 48, previous: 52, color: "chart-2" },
              { label: "Relatórios", current: 31, previous: 28, color: "chart-3" },
              { label: "Outros", current: 12, previous: 15, color: "chart-4" },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">Atual: {item.current}</span>
                    <span className="text-muted-foreground text-xs">Anterior: {item.previous}</span>
                    <Badge
                      variant={item.current > item.previous ? "default" : "secondary"}
                      className={`text-xs ${item.current > item.previous ? "bg-success/10 text-success" : "bg-muted"}`}
                    >
                      {item.current > item.previous ? "+" : ""}
                      {(((item.current - item.previous) / item.previous) * 100).toFixed(0)}%
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 h-8 bg-secondary/30 rounded-lg overflow-hidden">
                    <div
                      className={`h-full bg-${item.color}/30 rounded-lg transition-all duration-1000`}
                      style={{ width: `${(item.previous / 100) * 100}%` }}
                    />
                  </div>
                  <div className="flex-1 h-8 bg-secondary/30 rounded-lg overflow-hidden">
                    <div
                      className={`h-full bg-${item.color} rounded-lg transition-all duration-1000 shadow-lg`}
                      style={{ width: `${(item.current / 100) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Heatmap de atividade */}
        <Card className="p-6 border-border/50">
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
              <Calendar className="size-5 text-primary" />
              Mapa de Calor - Atividade
            </h3>
            <p className="text-sm text-muted-foreground">Padrões de uso por hora do dia</p>
          </div>

          <div className="space-y-2">
            {heatmap.length > 0 ? heatmap.map((dayData, dayIndex) => (
              <div key={dayData.day} className="flex items-center gap-2">
                <div className="w-20 text-xs text-muted-foreground text-right">{dayData.day}</div>
                <div className="flex-1 flex gap-1">
                  {dayData.hours.map((count: number, hourIndex: number) => {
                    const maxValue = 50 // Valor máximo esperado
                    const intensity = Math.min(count / maxValue, 1)
                    return (
                      <div
                        key={hourIndex}
                        className="flex-1 h-6 rounded transition-all hover:scale-125 hover:z-10 cursor-pointer"
                        style={{
                          backgroundColor: count > 0 
                            ? `rgb(234 88 12 / ${intensity * 0.8 + 0.2})` 
                            : 'rgb(var(--muted) / 0.3)',
                        }}
                        title={`${dayData.day} ${hourIndex}:00 - ${count} docs`}
                      />
                    )
                  })}
                </div>
              </div>
            )) : (
              // Fallback se não houver dados
              ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"].map((day, dayIndex) => (
                <div key={day} className="flex items-center gap-2">
                  <div className="w-20 text-xs text-muted-foreground text-right">{day}</div>
                  <div className="flex-1 flex gap-1">
                    {Array.from({ length: 24 }).map((_, hourIndex) => (
                      <div
                        key={hourIndex}
                        className="flex-1 h-6 rounded bg-muted/20"
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
            <span className="text-xs text-muted-foreground">Menos ativo</span>
            <div className="flex gap-1">
              {[0.1, 0.3, 0.5, 0.7, 0.9].map((opacity, i) => (
                <div
                  key={i}
                  className="size-4 rounded"
                  style={{ backgroundColor: `rgb(var(--primary) / ${opacity})` }}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">Mais ativo</span>
          </div>
        </Card>
      </div>
    </div>
  )
}

function InteligenciaAnalytics() {
  const [loading, setLoading] = useState(true)
  const [alerts, setAlerts] = useState<IntelligenceAlert[]>([])
  const [patterns, setPatterns] = useState<LearnedPattern[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [alertsData, patternsData] = await Promise.all([
          analysesApi.getIntelligenceAlerts(10),
          analysesApi.getLearnedPatterns(10)
        ])
        setAlerts(alertsData)
        setPatterns(patternsData)
      } catch (error) {
        console.error('Erro ao carregar dados de inteligência:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 bg-muted animate-pulse rounded-lg" />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-64 bg-muted animate-pulse rounded-lg" />
          <div className="h-64 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="p-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <div className="flex items-start gap-6">
          <div className="size-16 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shrink-0">
            <Sparkles className="size-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">Painel de Inteligência</h3>
            <p className="text-muted-foreground mb-4">
              Análises preditivas impulsionadas por IA para otimizar processos e antecipar demandas
            </p>
            <div className="flex items-center gap-3">
            <Badge className="bg-success/10 text-success border-success/20 px-4 py-1.5">
              <div className="size-2 rounded-full bg-success mr-2 animate-pulse" />
              IA Ativa
            </Badge>
            <Badge variant="secondary">{alerts.length} alertas ativos</Badge>
            <Badge variant="secondary">{patterns.length} padrões aprendidos</Badge>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Alertas Inteligentes */}
        <Card className="p-5 border-border/50">
          <h3 className="font-bold mb-2 flex items-center gap-2">
            <AlertCircle className="size-5 text-warning" />
            Alertas de Inteligência
          </h3>
          <div className="space-y-2">
            {alerts.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <AlertCircle className="size-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhum alerta ativo no momento</p>
              </div>
            ) : alerts.slice(0, 3).map((alert, i) => (
              <div
                key={alert.id}
                className={`p-3 rounded-xl border-2 ${
                  alert.severity === "high"
                    ? "border-destructive/20 bg-destructive/5"
                    : alert.severity === "medium"
                    ? "border-warning/20 bg-warning/5"
                    : "border-primary/20 bg-orange-600/5"
                } hover:shadow-md transition-all cursor-pointer group`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`size-2 rounded-full mt-1 ${
                      alert.severity === "high"
                        ? "bg-destructive"
                        : alert.severity === "medium"
                        ? "bg-warning"
                        : "bg-orange-600"
                    } animate-pulse`}
                  />
                  <div className="flex-1">
                    <div className="font-semibold mb-0.5 group-hover:text-primary transition-colors text-sm">
                      {alert.title}
                    </div>
                    <div className="text-xs text-muted-foreground mb-1">
                      {alert.description}
                    </div>
                    <div className="text-xs text-muted-foreground opacity-70">
                      {new Date(alert.created_at).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-2 rounded-full bg-transparent text-sm h-9">
            Ver todos os alertas
          </Button>
        </Card>

        {/* Padrões Aprendidos */}
        <Card className="p-5 border-border/50">
          <h3 className="font-bold mb-2 flex items-center gap-2">
            <Rocket className="size-5 text-primary" />
            Padrões Aprendidos
          </h3>
          <div className="space-y-2">
            {patterns.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <Rocket className="size-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhum padrão aprendido ainda</p>
              </div>
            ) : patterns.slice(0, 4).map((item, i) => (
              <div key={item.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.pattern_type}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">{item.pattern_value}</span>
                    <Badge variant="secondary" className="text-xs">
                      {Math.round(item.confidence * 100)}% confiánça
                    </Badge>
                  </div>
                </div>
                <Progress value={item.confidence * 100} className="h-1.5" />
                {item.description && (
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Análise Preditiva com múltiplos cenários */}
      <Card className="p-5 border-border/50">
        <div className="mb-3">
          <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
            <TrendingUp className="size-5 text-primary" />
            Previsão Multivariada - Próximos 90 Dias
          </h3>
          <p className="text-sm text-muted-foreground">
            Cenários otimista, realista e pessimista baseados em análise histórica
          </p>
        </div>

        <div className="h-64 relative">
          <svg className="w-full h-full" viewBox="0 0 1000 400" preserveAspectRatio="none">
            {/* Grid de fundo */}
            <g className="opacity-10">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <line key={`h-${i}`} x1="0" y1={i * 50} x2="1000" y2={i * 50} stroke="currentColor" strokeWidth="1" />
              ))}
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                <line
                  key={`v-${i}`}
                  x1={i * 83.33}
                  y1="0"
                  x2={i * 83.33}
                  y2="400"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              ))}
            </g>

            {/* Dados históricos */}
            <path
              d="M 0 300 L 83 280 L 166 290 L 249 260 L 332 250 L 415 220 L 498 200"
              fill="none"
              stroke="rgb(var(--primary))"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Cenário Otimista */}
            <path
              d="M 498 200 L 581 170 L 664 140 L 747 110 L 830 80 L 913 50 L 1000 30"
              fill="none"
              stroke="rgb(var(--success))"
              strokeWidth="3"
              strokeDasharray="8 4"
              strokeLinecap="round"
              opacity="0.7"
            />

            {/* Cenário Realista */}
            <path
              d="M 498 200 L 581 185 L 664 170 L 747 155 L 830 140 L 913 125 L 1000 110"
              fill="none"
              stroke="rgb(var(--primary))"
              strokeWidth="3"
              strokeDasharray="8 4"
              strokeLinecap="round"
              opacity="0.7"
            />

            {/* Cenário Pessimista */}
            <path
              d="M 498 200 L 581 210 L 664 215 L 747 220 L 830 225 L 913 230 L 1000 235"
              fill="none"
              stroke="rgb(var(--destructive))"
              strokeWidth="3"
              strokeDasharray="8 4"
              strokeLinecap="round"
              opacity="0.7"
            />

            {/* Área de confiança (zona cinza) */}
            <path
              d="M 498 200 L 581 170 L 664 140 L 747 110 L 830 80 L 913 50 L 1000 30 L 1000 235 L 913 230 L 830 225 L 747 220 L 664 215 L 581 210 L 498 200 Z"
              fill="rgb(var(--primary))"
              opacity="0.05"
            />
          </svg>

          {/* Labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground px-4">
            {["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"].map((month) => (
              <span key={month}>{month}</span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-border/50">
          {[
            { label: "Cenário Otimista", value: "+68%", color: "success", desc: "420 documentos" },
            { label: "Cenário Realista", value: "+45%", color: "primary", desc: "280 documentos" },
            { label: "Cenário Pessimista", value: "+12%", color: "destructive", desc: "198 documentos" },
          ].map((scenario, i) => (
            <div
              key={i}
              className={`text-center p-4 rounded-xl border-2 border-${scenario.color}/20 bg-${scenario.color}/5`}
            >
              <div className={`text-2xl font-bold text-${scenario.color} mb-1`}>{scenario.value}</div>
              <div className="text-sm font-semibold mb-1">{scenario.label}</div>
              <div className="text-xs text-muted-foreground">{scenario.desc}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function RelatoriosAnalytics() {
  const [reportType, setReportType] = useState<'documents' | 'processes' | 'users' | 'performance'>('documents')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [format, setFormat] = useState<'csv' | 'pdf' | 'excel'>('csv')
  const [loading, setLoading] = useState(false)
  const [savedReports, setSavedReports] = useState<any[]>([])
  const [scheduledReports, setScheduledReports] = useState<any[]>([])
  const [loadingReports, setLoadingReports] = useState(true)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoadingReports(true)
        const [saved, scheduled] = await Promise.all([
          analysesApi.getSavedReports(3),
          analysesApi.getScheduledReports(3)
        ])
        setSavedReports(saved)
        setScheduledReports(scheduled)
      } catch (error) {
        console.error('Erro ao carregar relatórios:', error)
      } finally {
        setLoadingReports(false)
      }
    }
    fetchReports()
  }, [])

  const reportTypes = [
    { id: 'documents', label: 'Documentos' },
    { id: 'processes', label: 'Processos' },
    { id: 'users', label: 'Usuários' },
    { id: 'performance', label: 'Performance' }
  ]

  const formats = [
    { id: 'csv', label: 'CSV' },
    { id: 'excel', label: 'Excel' },
    { id: 'pdf', label: 'PDF' }
  ]

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      alert('Por favor, selecione as datas de início e fim')
      return
    }

    try {
      setLoading(true)
      const blob = await analysesApi.generateReport({
        report_type: reportType,
        format: format,
        start_date: new Date(startDate).toISOString(),
        end_date: new Date(endDate).toISOString()
      })
      
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `relatorio_${reportType}_${startDate}_${endDate}.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Erro ao gerar relatório:', error)
      alert('Erro ao gerar relatório. Verifique os parâmetros e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-6 border-border/50">
          <h3 className="text-xl font-bold mb-4">Gerador de Relatórios</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Crie relatórios customizados com filtros e exportação em múltiplos formatos
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold mb-2 block">Tipo de Relatório</label>
              <div className="grid grid-cols-2 gap-3">
                {reportTypes.map((type) => (
                  <Button
                    key={type.id}
                    variant={reportType === type.id ? 'default' : 'outline'}
                    className={`rounded-xl ${
                      reportType === type.id
                        ? 'bg-orange-600 hover:bg-orange-600/90'
                        : 'hover:bg-orange-600/5 hover:border-primary/30 bg-transparent'
                    }`}
                    onClick={() => setReportType(type.id as any)}
                  >
                    {type.label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Período</label>
              <div className="flex gap-3">
                <Input
                  type="date"
                  className="rounded-xl"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  max={endDate || undefined}
                />
                <Input
                  type="date"
                  className="rounded-xl"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || undefined}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Formato de Exportação</label>
              <div className="flex gap-3">
                {formats.map((fmt) => (
                  <Button
                    key={fmt.id}
                    variant={format === fmt.id ? 'default' : 'outline'}
                    size="sm"
                    className={`rounded-full ${
                      format === fmt.id
                        ? 'bg-orange-600 hover:bg-orange-600/90'
                        : 'hover:bg-orange-600/5 hover:border-primary/30 bg-transparent'
                    }`}
                    onClick={() => setFormat(fmt.id as any)}
                  >
                    {fmt.label}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              className="w-full gap-2 rounded-full shadow-lg mt-6"
              onClick={handleGenerateReport}
              disabled={loading || !startDate || !endDate}
            >
              {loading ? (
                <>
                  <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Download className="size-4" />
                  Gerar Relatório
                </>
              )}
            </Button>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6 border-border/50">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <FileText className="size-5 text-primary" />
              Relatórios Salvos
            </h3>
            {loadingReports ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : savedReports.length === 0 ? (
              <div className="text-center p-8 rounded-xl bg-muted/30 border border-dashed border-border">
                <FileText className="size-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Nenhum relatório salvo</p>
              </div>
            ) : (
              <div className="space-y-2">
                {savedReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-3 rounded-lg border border-border/50 hover:bg-secondary/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="font-semibold text-sm group-hover:text-primary transition-colors">
                        {report.title}
                      </div>
                      <Badge variant="secondary" className="text-xs uppercase">
                        {report.format}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-0.5">
                      <div>
                        {new Date(report.created_at).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      {report.metadata?.ai_insight && (
                        <div className="flex items-center gap-1 text-primary">
                          <Sparkles className="size-3" />
                          <span>{report.metadata.ai_insight}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6 border-border/50">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Clock className="size-5 text-primary" />
              Relatórios Agendados
            </h3>
            {loadingReports ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : scheduledReports.length === 0 ? (
              <div className="text-center p-8 rounded-xl bg-muted/30 border border-dashed border-border">
                <Clock className="size-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Nenhum relatório agendado</p>
              </div>
            ) : (
              <div className="space-y-2">
                {scheduledReports.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="p-3 rounded-lg border border-border/50 hover:bg-secondary/30 transition-all cursor-pointer"
                  >
                    <div className="font-semibold text-sm mb-1">{schedule.name}</div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Badge variant="secondary" className="text-xs">
                          {schedule.frequency}
                        </Badge>
                        <span className="uppercase">{schedule.default_format}</span>
                      </div>
                      <span>
                        Próximo: {new Date(schedule.next_run).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: 'short'
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

function AuditoriaAnalytics() {
  const [loading, setLoading] = useState(true)
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [aiSummary, setAiSummary] = useState<any>(null)
  const [showFilters, setShowFilters] = useState(false)
  
  // Filtros
  const [filterType, setFilterType] = useState<string>('')
  const [filterAction, setFilterAction] = useState<string>('')
  const [filterSearch, setFilterSearch] = useState<string>('')
  const [filterStartDate, setFilterStartDate] = useState<string>('')
  const [filterEndDate, setFilterEndDate] = useState<string>('')
  const [selectedLog, setSelectedLog] = useState<any>(null)

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const params: any = { limit: 20, offset: 0 }
      
      if (filterType) params.type = filterType
      if (filterAction) params.action = filterAction
      if (filterSearch) params.search = filterSearch
      if (filterStartDate) params.start_date = new Date(filterStartDate).toISOString()
      if (filterEndDate) params.end_date = new Date(filterEndDate).toISOString()
      
      const data = await analysesApi.getAuditLogs(params.limit, params.offset, params)
      setLogs(data.results)
      setTotalCount(data.count)
      setAiSummary(data.ai_summary)
    } catch (error) {
      console.error('Erro ao carregar logs de auditoria:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [filterType, filterAction, filterSearch, filterStartDate, filterEndDate])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-24 bg-muted animate-pulse rounded-lg" />
        <div className="space-y-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Insights de IA */}
      {aiSummary && (
        <Card className={`p-5 border-2 ${
          aiSummary.status === 'critical' ? 'border-destructive/30 bg-destructive/5' :
          aiSummary.status === 'warning' ? 'border-warning/30 bg-warning/5' :
          'border-success/30 bg-success/5'
        }`}>
          <div className="flex items-start gap-4">
            <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 ${
              aiSummary.status === 'critical' ? 'bg-destructive/20' :
              aiSummary.status === 'warning' ? 'bg-warning/20' :
              'bg-success/20'
            }`}>
              <Sparkles className={`size-6 ${
                aiSummary.status === 'critical' ? 'text-destructive' :
                aiSummary.status === 'warning' ? 'text-warning' :
                'text-success'
              }`} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold mb-1">Análise de IA - Segurança do Sistema</h4>
              <p className="text-sm text-muted-foreground mb-3">{aiSummary.message}</p>
              {aiSummary.recommendations && aiSummary.recommendations.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-semibold">Recomendações:</p>
                  <ul className="text-xs text-muted-foreground space-y-0.5">
                    {aiSummary.recommendations.map((rec: string, i: number) => (
                      <li key={i} className="flex items-center gap-2">
                        <ChevronRight className="size-3" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {aiSummary.type_counts && (
              <div className="flex gap-3">
                <div className="text-center">
                  <div className="size-8 rounded-lg bg-success/20 flex items-center justify-center mb-1">
                    <span className="text-xs font-bold text-success">{aiSummary.type_counts.success}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Sucesso</span>
                </div>
                <div className="text-center">
                  <div className="size-8 rounded-lg bg-warning/20 flex items-center justify-center mb-1">
                    <span className="text-xs font-bold text-warning">{aiSummary.type_counts.warning}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Avisos</span>
                </div>
                <div className="text-center">
                  <div className="size-8 rounded-lg bg-destructive/20 flex items-center justify-center mb-1">
                    <span className="text-xs font-bold text-destructive">{aiSummary.type_counts.error}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Erros</span>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      <Card className="p-6 border-border/50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
              <Shield className="size-6 text-primary" />
              Trilha de Auditoria Global
            </h3>
            <p className="text-sm text-muted-foreground">Registro imutável de todas as ações críticas do sistema</p>
          </div>
          <Button
            variant="outline"
            className="gap-2 rounded-full bg-transparent"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="size-4" />
            {showFilters ? 'Ocultar' : 'Filtrar'}
          </Button>
        </div>

        {/* Filtros */}
        {showFilters && (
          <div className="mb-6 p-4 rounded-xl bg-muted/30 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold mb-2 block">Buscar</label>
                <Input
                  placeholder="Usuário, ação ou recurso..."
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e.target.value)}
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="text-xs font-semibold mb-2 block">Tipo</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm"
                >
                  <option value="">Todos os tipos</option>
                  <option value="success">Sucesso</option>
                  <option value="warning">Aviso</option>
                  <option value="error">Erro</option>
                  <option value="info">Info</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold mb-2 block">Categoria</label>
                <select
                  value={filterAction}
                  onChange={(e) => setFilterAction(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm"
                >
                  <option value="">Todas as categorias</option>
                  <option value="documento">Documento</option>
                  <option value="usuario">Usuário</option>
                  <option value="processo">Processo</option>
                  <option value="sistema">Sistema</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold mb-2 block">Data Início</label>
                <Input
                  type="date"
                  value={filterStartDate}
                  onChange={(e) => setFilterStartDate(e.target.value)}
                  max={filterEndDate || undefined}
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="text-xs font-semibold mb-2 block">Data Fim</label>
                <Input
                  type="date"
                  value={filterEndDate}
                  onChange={(e) => setFilterEndDate(e.target.value)}
                  min={filterStartDate || undefined}
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => {
                  setFilterType('')
                  setFilterAction('')
                  setFilterSearch('')
                  setFilterStartDate('')
                  setFilterEndDate('')
                }}
              >
                Limpar Filtros
              </Button>
              <span className="text-xs text-muted-foreground">
                {totalCount} registro{totalCount !== 1 ? 's' : ''} encontrado{totalCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="size-12 mx-auto mb-2 opacity-50" />
              <p>Nenhum log de auditoria disponível</p>
            </div>
          ) : logs.map((log, i) => (
            <div
              key={log.id}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-secondary/30 transition-all cursor-pointer border border-transparent hover:border-border/50"
            >
              <div
                className={`size-2 rounded-full ${
                  log.type === "success" 
                    ? "bg-success" 
                    : log.type === "warning" 
                    ? "bg-warning" 
                    : log.type === "error"
                    ? "bg-destructive"
                    : "bg-orange-600"
                } shrink-0`}
              />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm mb-1">{log.action}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                  <span className="font-medium">{log.user}</span>
                  <span>•</span>
                  <span>{log.resource}</span>
                  <span>•</span>
                  <span>
                    {new Date(log.timestamp).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Eye className="size-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Button variant="outline" className="rounded-full gap-2 bg-transparent">
            Carregar mais registros
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </Card>
    </div>
  )
}

