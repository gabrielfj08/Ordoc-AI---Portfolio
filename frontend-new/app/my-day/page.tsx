"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
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
} from "lucide-react"

export default function MeuDiaPage() {
    return (
        <div className="container mx-auto p-6 max-w-[1600px]">
            <div className="space-y-8 animate-in fade-in duration-500">
                {/* Header com saudação + Card Assistente lado a lado */}
                <div className="grid lg:grid-cols-2 gap-6 items-start">
                    {/* Coluna esquerda - Saudação */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="size-4" />
                            <span>Quarta-feira, 24 de Dezembro de 2025</span>
                        </div>
                        <h1 className="text-5xl font-bold tracking-tight text-balance bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text">
                            Boa tarde, Ricardo
                        </h1>
                        <p className="text-base text-muted-foreground">
                            Você tem{" "}
                            <span className="text-orange-600 font-semibold">0 documentos aguardando assinatura</span>
                            {" "}e{" "}
                            <span className="text-orange-600 font-semibold">0 aprovações pendentes</span>
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

                    {/* Coluna direita - Card Assistente */}
                    <Card className="p-4 border-orange-300 bg-gradient-to-br from-orange-400 to-orange-500 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-lg bg-white shadow-md flex items-center justify-center">
                                    <Sparkles className="size-5 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base">Assistente</h3>
                                    <p className="text-xs text-white/90">Análise de documentos e processos em andamento.</p>
                                </div>
                            </div>
                            <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">Atualizado agora</Badge>
                        </div>

                        {/* Estatísticas e Ações lado a lado */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 rounded-lg border border-white/30 bg-white/10">
                                <div className="flex items-center gap-2 mb-1">
                                    <BarChart3 className="size-3.5 text-white" />
                                    <span className="text-xs font-semibold text-white">Estatísticas da semana</span>
                                </div>
                                <p className="text-xs text-white/90">
                                    <span className="font-bold text-white">0</span> docs processados • <span className="font-bold text-white">89%</span> aprovados de primeira
                                </p>
                            </div>

                            {/* Ações rápidas */}
                            <div className="p-3 rounded-lg border border-white/30 bg-white/10">
                                <div className="flex items-center gap-2 mb-1">
                                    <AlertCircle className="size-3.5 text-white" />
                                    <span className="text-xs font-semibold text-white">Ações rápidas</span>
                                </div>
                                <p className="text-xs text-white/90">
                                    Todos os documentos estão em dia. Continue o bom trabalho!
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Métricas principais */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        {
                            label: "Total de Documentos",
                            value: "177",
                            change: "+12%",
                            trend: "up",
                            icon: FileText,
                            color: "primary",
                            description: "vs. mês anterior",
                        },
                        {
                            label: "Usuários Ativos",
                            value: "6",
                            change: "+4%",
                            trend: "up",
                            icon: Users,
                            color: "chart-2",
                            description: "agora online",
                        },
                        {
                            label: "Processos Ativos",
                            value: "12",
                            change: "+24%",
                            trend: "up",
                            icon: Workflow,
                            color: "chart-3",
                            description: "em andamento",
                        },
                        {
                            label: "Taxa de Aprovação",
                            value: "89%",
                            change: "-2%",
                            trend: "down",
                            icon: Target,
                            color: "chart-4",
                            description: "na primeira vez",
                        },
                    ].map((stat) => (
                        <Card
                            key={stat.label}
                            className="relative p-6 hover:shadow-xl hover:scale-[1.02] transition-all border-border/50 hover:border-primary/30 group cursor-pointer overflow-hidden"
                        >
                            <div
                                className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}/5 rounded-full -mr-16 -mt-16 blur-2xl`}
                            />
                            <div className="relative">
                                <div className="flex items-start justify-between mb-4">
                                    <div
                                        className={`size-12 rounded-2xl bg-${stat.color}/10 flex items-center justify-center text-${stat.color} group-hover:scale-110 transition-transform`}
                                    >
                                        <stat.icon className="size-6" />
                                    </div>
                                    <Badge
                                        variant={stat.trend === "up" ? "default" : "secondary"}
                                        className={`gap-1 font-semibold ${stat.trend === "up" ? "bg-success/10 text-success hover:bg-success/20" : "bg-muted"}`}
                                    >
                                        {stat.trend === "up" ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                                        {stat.change}
                                    </Badge>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                                    <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
                                    <div className="text-xs text-muted-foreground/80">{stat.description}</div>
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
                                            6
                                        </div>
                                        <div className="text-sm font-bold text-foreground mb-1">Urgente</div>
                                        <div className="text-xs text-muted-foreground">Requer atenção imediata</div>
                                    </div>
                                </div>

                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative text-center p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent border-2 border-primary/10 hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer">
                                        <div className="text-5xl font-black text-primary mb-3 group-hover:scale-110 transition-transform">
                                            6
                                        </div>
                                        <div className="text-sm font-bold text-foreground mb-1">Normal</div>
                                        <div className="text-xs text-muted-foreground">Dentro do prazo</div>
                                    </div>
                                </div>

                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-success/10 to-success/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative text-center p-8 rounded-2xl bg-gradient-to-br from-success/5 to-transparent border-2 border-success/10 hover:border-success/30 hover:shadow-lg transition-all cursor-pointer">
                                        <div className="text-5xl font-black text-success mb-3 group-hover:scale-110 transition-transform">
                                            0
                                        </div>
                                        <div className="text-sm font-bold text-foreground mb-1">Concluídas</div>
                                        <div className="text-xs text-muted-foreground">Última semana</div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-muted-foreground">Progresso geral</span>
                                    <span className="font-bold">67%</span>
                                </div>
                                <Progress value={67} className="h-3" />
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>8 de 12 processos em andamento</span>
                                    <span>Previsão: 3 dias</span>
                                </div>
                            </div>
                        </Card>

                        {/* Documentos Recentes - Continuará no próximo arquivo devido ao tamanho */}
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
                                    <Button variant="ghost" size="sm" className="rounded-full gap-2">
                                        <Filter className="size-4" />
                                        Filtrar
                                    </Button>
                                    <Button variant="ghost" size="sm" className="rounded-full gap-2 text-primary">
                                        Ver todos
                                        <ChevronRight className="size-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-1">
                                {[
                                    {
                                        name: "Documento_Untagged_28.pdf",
                                        time: "15h atrás",
                                        size: "2 MB",
                                        relevance: "92%",
                                        starred: false,
                                    },
                                    {
                                        name: "Documento_Untagged_27.pdf",
                                        time: "19h atrás",
                                        size: "2 MB",
                                        relevance: "92%",
                                        starred: true,
                                    },
                                    {
                                        name: "Documento_Untagged_26.pdf",
                                        time: "1 dia atrás",
                                        size: "2 MB",
                                        relevance: "89%",
                                        starred: false,
                                    },
                                    {
                                        name: "Documento_Untagged_24.pdf",
                                        time: "1 dia atrás",
                                        size: "1.8 MB",
                                        relevance: "87%",
                                        starred: false,
                                    },
                                    {
                                        name: "Documento_Untagged_23.pdf",
                                        time: "2 dias atrás",
                                        size: "2.1 MB",
                                        relevance: "85%",
                                        starred: false,
                                    },
                                ].map((doc, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-secondary/50 transition-all group cursor-pointer border border-transparent hover:border-border/50"
                                    >
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-9 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                                        >
                                            {doc.starred ? <Star className="size-4 fill-warning text-warning" /> : <Star className="size-4" />}
                                        </Button>
                                        <div className="size-11 rounded-xl bg-gradient-to-br from-destructive/20 to-destructive/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                            <FileText className="size-6 text-destructive" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                                                {doc.name}
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
                            </div>
                            <div className="space-y-4">
                                {[
                                    { name: "Revisão de Contratos", docs: "45 documentos", time: "0 dias", status: "active" },
                                    { name: "Aprovação Financeira", docs: "32 documentos", time: "1 dia", status: "active" },
                                    { name: "Workflow sem nome", docs: "0 documentos", time: "Tempo médio: 0 dias", status: "paused" },
                                ].map((workflow, i) => (
                                    <div
                                        key={i}
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
                                            <div className="text-xs text-muted-foreground mt-1">{workflow.docs}</div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <Badge
                                                variant={workflow.status === "active" ? "default" : "secondary"}
                                                className={workflow.status === "active" ? "bg-warning/10 text-warning-foreground" : ""}
                                            >
                                                {workflow.status === "active" ? "Ativo" : "Pausado"}
                                            </Badge>
                                            <div className="text-xs text-muted-foreground mt-1">{workflow.time}</div>
                                        </div>
                                        <Button variant="ghost" size="sm" className="rounded-full">
                                            Ver detalhes
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar direita - 1/3 da largura */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Assistente Inteligente */}
                        <Card className="p-6 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background shadow-lg">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="size-12 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                                    <Sparkles className="size-6 text-primary-foreground" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Assistente Ordoc</h3>
                                    <p className="text-xs text-muted-foreground">Powered by IA</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="text-sm">
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <span className="text-2xl font-bold text-primary">0</span>
                                        <span className="text-muted-foreground">docs processados hoje</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground">89% aprovados de primeira • 2.3s tempo médio</div>
                                </div>

                                <div className="flex items-start gap-3 p-4 rounded-xl bg-success/10 border border-success/20">
                                    <CheckCircle2 className="size-5 text-success mt-0.5 shrink-0" />
                                    <div className="text-sm">
                                        <p className="font-bold text-success-foreground">Tudo em dia!</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Nenhuma ação pendente. Você está em dia com todas as tarefas.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        Sugestões rápidas
                                    </div>
                                    <Button variant="outline" size="sm" className="w-full justify-start gap-2 rounded-xl bg-transparent">
                                        <Upload className="size-4" />
                                        Fazer upload de documento
                                    </Button>
                                    <Button variant="outline" size="sm" className="w-full justify-start gap-2 rounded-xl bg-transparent">
                                        <Workflow className="size-4" />
                                        Criar novo processo
                                    </Button>
                                </div>
                            </div>
                        </Card>

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
                    </div>
                </div>

                {/* Botão flutuante */}
                <button className="fixed bottom-8 right-8 size-14 rounded-full bg-orange-600 text-primary-foreground shadow-2xl hover:shadow-primary/20 hover:scale-110 transition-all flex items-center justify-center group z-30">
                    <span className="text-2xl group-hover:rotate-90 transition-transform">+</span>
                </button>
            </div>
        </div>
    )
}
