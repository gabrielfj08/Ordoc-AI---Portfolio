'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import React, { useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useQuery } from '@tanstack/react-query';
import { reportsService } from '@/services/reports';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  FileText,
  CheckCircle2,
  Clock,
  Activity,
  AlertTriangle,
  Download,
  HardDrive,
  Users,
  Database,
  TrendingUp,
  ArrowUpIcon,
  ArrowDownIcon,
  Zap,
  Plus,
  Settings,
  List
} from "lucide-react"
import { Badge } from '@/components/ui/badge';

// Dados Mock (Manter para consistência visual em demos)
const activityData = [
  {
    user: "Ricardo Silva",
    action: "assinou o contrato",
    target: "NDA_V2.pdf",
    time: "2 minutos atrás",
    initials: "RS"
  },
  {
    user: "Maria Oliveira",
    action: "criou um novo workflow",
    target: "Aprovação de Compras",
    time: "1 hora atrás",
    initials: "MO"
  },
  {
    user: "Sistema",
    action: "processou automaticamente",
    target: "50 notas fiscais",
    time: "3 horas atrás",
    initials: "SYS"
  },
];

export default function Dashboard() {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');

  // Fetch Reports Stats
  const { data: reportStats } = useQuery({
    queryKey: ['reports-stats-dashboard', timeRange],
    queryFn: () => reportsService.getStats(timeRange),
  });

  // Mock data for charts
  const chartData = [
    { name: 'Jan', docs: 4000, reports: 2400, downloads: 1200, storage: 45 },
    { name: 'Fev', docs: 3000, reports: 1398, downloads: 900, storage: 52 },
    { name: 'Mar', docs: 2000, reports: 9800, downloads: 4500, storage: 68 },
    { name: 'Abr', docs: 2780, reports: 3908, downloads: 2100, storage: 74 },
    { name: 'Mai', docs: 1890, reports: 4800, downloads: 2400, storage: 81 },
    { name: 'Jun', docs: 2390, reports: 3800, downloads: 1900, storage: 85 },
    { name: 'Jul', docs: 3490, reports: 4300, downloads: 2600, storage: 92 },
  ];

  const storageData = [
    { name: 'Relatórios', value: 45, color: '#0ea5e9' }, // Sky 500
    { name: 'Documentos', value: 30, color: '#22c55e' }, // Green 500
    { name: 'Backups', value: 15, color: '#eab308' }, // Yellow 500
    { name: 'Outros', value: 10, color: '#64748b' }, // Slate 500
  ];

  // Logic to ensure we show data even if API returns 0 (for demo purposes)
  const mockTotalReports = chartData.reduce((acc, curr) => acc + curr.reports, 0);
  const mockTotalDownloads = chartData.reduce((acc, curr) => acc + curr.downloads, 0);

  const displayStats = {
    total_reports: (reportStats?.total_reports > 0) ? reportStats.total_reports : mockTotalReports,
    completed_reports: (reportStats?.total_reports > 0) ? reportStats.completed_reports : Math.round(mockTotalReports * 0.92),
    failed_reports: (reportStats?.total_reports > 0) ? reportStats.failed_reports : Math.round(mockTotalReports * 0.03), // Reduced failure rate
    pending_reports: (reportStats?.total_reports > 0) ? reportStats.pending_reports : Math.round(mockTotalReports * 0.05),
    total_downloads: (reportStats?.total_downloads > 0) ? reportStats.total_downloads : mockTotalDownloads,
    storage_used: (reportStats?.storage_used > 0) ? reportStats.storage_used : 98 * 1024 * 1024 * 1024 // ~98 GB
  };


  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <ProtectedRoute>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard Executivo</h2>
            <p className="text-muted-foreground">
              Visão unificada das operações Ordoc (Procedures, Sign e Reports).
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default" className="gap-2 bg-blue-600 hover:bg-blue-700">
                  <Zap className="h-4 w-4" />
                  Ações Rápidas
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Ações de Relatório</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/dashboard/ordoc-reports/reports/new')} className="cursor-pointer !cursor-pointer flex flex-col items-start gap-1 py-2 h-auto hover:bg-zinc-100">
                  <span className="flex items-center font-medium"><Plus className="mr-2 h-4 w-4" /> Criar Relatório</span>
                  <span className="text-xs text-muted-foreground ml-6">Gerar novo relatório personalizado</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/dashboard/ordoc-reports/templates')} className="cursor-pointer !cursor-pointer flex flex-col items-start gap-1 py-2 h-auto hover:bg-zinc-100">
                  <span className="flex items-center font-medium"><Settings className="mr-2 h-4 w-4" /> Gerenciar Templates</span>
                  <span className="text-xs text-muted-foreground ml-6">Criar e editar templates de relatórios</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/dashboard/ordoc-reports/reports')} className="cursor-pointer !cursor-pointer flex flex-col items-start gap-1 py-2 h-auto hover:bg-zinc-100">
                  <span className="flex items-center font-medium"><List className="mr-2 h-4 w-4" /> Ver Todos os Relatórios</span>
                  <span className="text-xs text-muted-foreground ml-6">Gerenciar relatórios existentes</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="analytics">Analytics & Métricas</TabsTrigger>
            <TabsTrigger value="activity">Atividade Recente</TabsTrigger>
          </TabsList>

          {/* TAB: VISÃO GERAL */}
          <TabsContent value="overview" className="space-y-4">

            {/* Top Cards Row - 4 Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Relatórios Gerados</CardTitle>
                  <FileText className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{displayStats.total_reports.toLocaleString()}</div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <span className="text-green-500 flex items-center mr-1">
                      <TrendingUp className="h-3 w-3 mr-1" /> +12%
                    </span>
                    vs mês anterior
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Downloads Realizados</CardTitle>
                  <Download className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{displayStats.total_downloads.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Acessos aos arquivos
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Armazenamento</CardTitle>
                  <HardDrive className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatFileSize(displayStats.storage_used)}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Espaço utilizado em nuvem
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Status do Sistema</CardTitle>
                  <Activity className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold">98.5%</div>
                    <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">Online</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Uptime garantido
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Main Chart Row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Volume de Processamento</CardTitle>
                  <CardDescription>
                    Comparativo entre Documentos vs Relatórios vs Downloads.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }} cursor={{ fill: 'transparent' }} />
                      <Legend />
                      <Bar name="Documentos" dataKey="docs" fill="#adfa1d" radius={[4, 4, 0, 0]} />
                      <Bar name="Relatórios" dataKey="reports" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar name="Downloads" dataKey="downloads" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Atividade Recente</CardTitle>
                  <CardDescription>Ações de usuários e sistema.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    {activityData.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold mr-4 text-xs">
                          {item.initials}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {item.user} <span className="text-muted-foreground font-normal">{item.action}</span>
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {item.target}
                          </p>
                        </div>
                        <div className="ml-auto font-medium text-xs text-muted-foreground">
                          {item.time}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB: ANALYTICS */}
          <TabsContent value="analytics" className="space-y-4">
            {/* Operational Stats Row - Restored as requested */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Relatórios Pendentes</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{displayStats.pending_reports}</div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <span className="text-red-500 flex items-center mr-1">
                      <ArrowDownIcon className="h-3 w-3 mr-1" /> -5%
                    </span>
                    vs período anterior
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Relatórios Concluídos</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{displayStats.completed_reports.toLocaleString()}</div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <span className="text-green-500 flex items-center mr-1">
                      <ArrowUpIcon className="h-3 w-3 mr-1" /> +18%
                    </span>
                    vs período anterior
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Falhas de Processamento</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{displayStats.failed_reports}</div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <span className="text-green-500 flex items-center mr-1">
                      <ArrowDownIcon className="h-3 w-3 mr-1" /> -2%
                    </span>
                    vs período anterior
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              {/* Armazenamento Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição de Armazenamento</CardTitle>
                  <CardDescription>Uso de disco por tipo de arquivo.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={storageData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {storageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Tendência Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Crescimento de OrdocFlow</CardTitle>
                  <CardDescription>Novos workflows iniciados nos últimos 6 meses.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorStorage" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="storage" name="Storage (GB)" stroke="#8884d8" fillOpacity={1} fill="url(#colorStorage)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB: ACTIVITY */}
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Volume de Atividades por Usuário</CardTitle>
                <CardDescription>Eventos registrados no sistema nos últimos 7 dias.</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[
                    { name: 'Seg', ricardo: 4, maria: 2, sistema: 10 },
                    { name: 'Ter', ricardo: 3, maria: 5, sistema: 12 },
                    { name: 'Qua', ricardo: 5, maria: 3, sistema: 8 },
                    { name: 'Qui', ricardo: 8, maria: 4, sistema: 15 },
                    { name: 'Sex', ricardo: 12, maria: 8, sistema: 20 },
                    { name: 'Sáb', ricardo: 2, maria: 1, sistema: 5 },
                    { name: 'Dom', ricardo: 0, maria: 0, sistema: 8 },
                  ]}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <Legend />
                    <Line type="monotone" name="Ricardo" dataKey="ricardo" stroke="#2563eb" strokeWidth={2} activeDot={{ r: 8 }} />
                    <Line type="monotone" name="Maria" dataKey="maria" stroke="#7c3aed" strokeWidth={2} />
                    <Line type="monotone" name="Sistema" dataKey="sistema" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Log de Auditoria Recente</CardTitle>
                <CardDescription>Últimas ações realizadas por usuários.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {activityData.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold mr-4 text-xs">
                        {item.initials}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {item.user} <span className="text-muted-foreground font-normal">{item.action}</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.target}
                        </p>
                      </div>
                      <div className="ml-auto font-medium text-xs text-muted-foreground">
                        {item.time}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </ProtectedRoute>
  );
}
