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
            onClick={() => {
              const csvData = `Período,Total de Documentos,Usuários Ativos,Taxa de Aprovação,Tempo Médio\n${timeRange},177,6,89%,1.3h`
              const blob = new Blob([csvData], { type: 'text/csv' })
              const url = window.URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `analises-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
              window.URL.revokeObjectURL(url)
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
  return (
    <div className="space-y-6">
      {/* Métricas principais em destaque com tendências */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total de Documentos", value: "177", change: "+12%", trend: "up", icon: FileText, target: "200" },
          { label: "Usuários Ativos", value: "6", change: "+4%", trend: "up", icon: Users, target: "10" },
          { label: "Taxa de Aprovação", value: "89%", change: "-2%", trend: "down", icon: Target, target: "95%" },
          { label: "Tempo Médio", value: "1.3h", change: "-15%", trend: "up", icon: Clock, target: "1h" },
        ].map((stat, i) => (
          <Card
            key={i}
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
                  className={`gap-1 font-semibold ${stat.trend === "up" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                    }`}
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
          <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-border/50">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">+45%</div>
              <div className="text-xs text-muted-foreground mt-1">Crescimento previsto</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">256</div>
              <div className="text-xs text-muted-foreground mt-1">Previsão próx. mês</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">98%</div>
              <div className="text-xs text-muted-foreground mt-1">Confiabilidade IA</div>
            </div>
          </div>
        </Card>

        {/* Sidebar com gráficos complementares */}
        <div className="space-y-6">
          <Card className="p-6 border-border/50">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              Distribuição por Tipo
            </h3>

            <div className="relative size-48 mx-auto mb-6">
              <svg className="size-full -rotate-90" viewBox="0 0 200 200">
                {/* Gráfico de donut */}
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="rgb(var(--primary))"
                  strokeWidth="40"
                  strokeDasharray="251.2 251.2"
                  strokeDashoffset="0"
                  opacity="0.2"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="rgb(var(--primary))"
                  strokeWidth="40"
                  strokeDasharray="157 94.2"
                  strokeDashoffset="0"
                  className="transition-all duration-1000"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="rgb(var(--chart-2))"
                  strokeWidth="40"
                  strokeDasharray="62.8 188.4"
                  strokeDashoffset="-157"
                  className="transition-all duration-1000"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke="rgb(var(--chart-3))"
                  strokeWidth="40"
                  strokeDasharray="31.4 219.8"
                  strokeDashoffset="-219.8"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold">177</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { label: "Contratos", value: 98, percentage: 55, color: "primary" },
                { label: "Propostas", value: 48, percentage: 27, color: "chart-2" },
                { label: "Relatórios", value: 31, percentage: 18, color: "chart-3" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`size-3 rounded-full bg-${item.color}`} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{item.value}</span>
                    <span className="text-xs text-muted-foreground">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
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
            {["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"].map((day, dayIndex) => (
              <div key={day} className="flex items-center gap-2">
                <div className="w-20 text-xs text-muted-foreground text-right">{day}</div>
                <div className="flex-1 flex gap-1">
                  {Array.from({ length: 24 }).map((_, hourIndex) => {
                    // Gera intensidade determinística baseada em índices
                    const intensity = ((dayIndex * 24 + hourIndex) * 37 % 100) / 100
                    return (
                      <div
                        key={hourIndex}
                        className="flex-1 h-6 rounded transition-all hover:scale-125 hover:z-10 cursor-pointer"
                        style={{
                          backgroundColor: `rgb(var(--primary) / ${intensity * 0.8 + 0.1})`,
                        }}
                        title={`${day} ${hourIndex}:00 - ${Math.round(intensity * 50)} docs`}
                      />
                    )
                  })}
                </div>
              </div>
            ))}
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
              <Badge variant="secondary">2 análises realizadas</Badge>
              <Badge variant="secondary">Última atualização: agora</Badge>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Alertas Inteligentes */}
        <Card className="p-6 border-border/50">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <AlertCircle className="size-5 text-warning" />
            Alertas de Inteligência
          </h3>
          <div className="space-y-3">
            {[
              {
                title: "Pico de demanda detectado",
                desc: "Esperado aumento de 35% em documentos nos próximos 7 dias",
                severity: "high",
                time: "5 min atrás",
              },
              {
                title: "Gargalo identificado",
                desc: "Processo de aprovação 40% mais lento que a média",
                severity: "medium",
                time: "1h atrás",
              },
              {
                title: "Oportunidade de otimização",
                desc: "3 processos podem ser automatizados, economia de 12h/semana",
                severity: "low",
                time: "3h atrás",
              },
            ].map((alert, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl border-2 ${alert.severity === "high"
                  ? "border-destructive/20 bg-destructive/5"
                  : alert.severity === "medium"
                    ? "border-warning/20 bg-warning/5"
                    : "border-primary/20 bg-orange-600/5"
                  } hover:shadow-md transition-all cursor-pointer group`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`size-2 rounded-full mt-1.5 ${alert.severity === "high"
                      ? "bg-destructive"
                      : alert.severity === "medium"
                        ? "bg-warning"
                        : "bg-orange-600"
                      } animate-pulse`}
                  />
                  <div className="flex-1">
                    <div className="font-semibold mb-1 group-hover:text-primary transition-colors">{alert.title}</div>
                    <div className="text-sm text-muted-foreground mb-2">{alert.desc}</div>
                    <div className="text-xs text-muted-foreground">{alert.time}</div>
                  </div>
                  <ChevronRight className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4 rounded-full bg-transparent">
            Ver todos os alertas
          </Button>
        </Card>

        {/* Padrões Aprendidos */}
        <Card className="p-6 border-border/50">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Rocket className="size-5 text-primary" />
            Padrões Aprendidos
          </h3>
          <div className="space-y-4">
            {[
              { pattern: "Horário de pico", value: "14h - 16h", confidence: 95 },
              { pattern: "Dia mais ativo", value: "Terça-feira", confidence: 89 },
              { pattern: "Tempo médio processamento", value: "1.3 horas", confidence: 92 },
              { pattern: "Taxa de rejeição", value: "11%", confidence: 87 },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.pattern}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{item.value}</span>
                    <Badge variant="secondary" className="text-xs">
                      {item.confidence}% confiança
                    </Badge>
                  </div>
                </div>
                <Progress value={item.confidence} className="h-2" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Análise Preditiva com múltiplos cenários */}
      <Card className="p-6 border-border/50">
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
            <TrendingUp className="size-5 text-primary" />
            Previsão Multivariada - Próximos 90 Dias
          </h3>
          <p className="text-sm text-muted-foreground">
            Cenários otimista, realista e pessimista baseados em análise histórica
          </p>
        </div>

        <div className="h-96 relative">
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

        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border/50">
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
                {["Documentos", "Processos", "Usuários", "Performance"].map((type) => (
                  <Button
                    key={type}
                    variant="outline"
                    className="rounded-xl hover:bg-orange-600/5 hover:border-primary/30 bg-transparent"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Período</label>
              <div className="flex gap-3">
                <Input type="date" className="rounded-xl" />
                <Input type="date" className="rounded-xl" />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Formato de Exportação</label>
              <div className="flex gap-3">
                {["PDF", "Excel", "CSV"].map((format) => (
                  <Button
                    key={format}
                    variant="outline"
                    size="sm"
                    className="rounded-full hover:bg-orange-600/5 hover:border-primary/30 bg-transparent"
                  >
                    {format}
                  </Button>
                ))}
              </div>
            </div>

            <Button className="w-full gap-2 rounded-full shadow-lg mt-6">
              <Download className="size-4" />
              Gerar Relatório
            </Button>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6 border-border/50">
            <h3 className="font-bold mb-4">Relatórios Salvos</h3>
            <div className="text-center p-8 rounded-xl bg-muted/30 border border-dashed border-border">
              <FileText className="size-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Nenhum relatório salvo</p>
            </div>
          </Card>

          <Card className="p-6 border-border/50">
            <h3 className="font-bold mb-4">Relatórios Agendados</h3>
            <div className="space-y-3">
              {[
                { name: "Relatório Mensal", freq: "Mensal", next: "1 Jan 2026" },
                { name: "Dashboard Semanal", freq: "Semanal", next: "29 Dez 2025" },
              ].map((report, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg border border-border/50 hover:bg-secondary/30 transition-all cursor-pointer"
                >
                  <div className="font-semibold text-sm mb-1">{report.name}</div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{report.freq}</span>
                    <span>Próximo: {report.next}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function AuditoriaAnalytics() {
  return (
    <div className="space-y-6">
      <Card className="p-6 border-border/50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
              <Shield className="size-6 text-primary" />
              Trilha de Auditoria Global
            </h3>
            <p className="text-sm text-muted-foreground">Registro imutável de todas as ações críticas do sistema</p>
          </div>
          <Button variant="outline" className="gap-2 rounded-full bg-transparent">
            <Filter className="size-4" />
            Filtrar
          </Button>
        </div>

        <div className="space-y-2">
          {[
            {
              action: "Documento assinado",
              user: "Ricardo Ferreira",
              resource: "Contrato_Final.pdf",
              time: "2 min atrás",
              type: "success",
            },
            {
              action: "Usuário autenticado",
              user: "Maria Silva",
              resource: "Sistema",
              time: "15 min atrás",
              type: "info",
            },
            {
              action: "Processo aprovado",
              user: "João Santos",
              resource: "Processo #872",
              time: "1h atrás",
              type: "success",
            },
            {
              action: "Tentativa de acesso negada",
              user: "IP: 192.168.1.100",
              resource: "Admin Panel",
              time: "3h atrás",
              type: "warning",
            },
          ].map((log, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-secondary/30 transition-all cursor-pointer border border-transparent hover:border-border/50"
            >
              <div
                className={`size-2 rounded-full ${log.type === "success" ? "bg-success" : log.type === "warning" ? "bg-warning" : "bg-orange-600"
                  } shrink-0`}
              />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm mb-1">{log.action}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                  <span className="font-medium">{log.user}</span>
                  <span>•</span>
                  <span>{log.resource}</span>
                  <span>•</span>
                  <span>{log.time}</span>
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

