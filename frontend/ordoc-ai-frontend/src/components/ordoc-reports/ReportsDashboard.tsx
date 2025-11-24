'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  DocumentChartBarIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { reportsService } from '@/services/reports';
import { formatDate } from '@/lib/utils';

interface DashboardStats {
  total_reports: number;
  pending_reports: number;
  completed_reports: number;
  failed_reports: number;
  total_downloads: number;
  storage_used: number;
}

interface RecentReport {
  id: string;
  title: string;
  status: string;
  format: string;
  created_at: string;
  file_size?: number;
}

export default function ReportsDashboard() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['reports-stats', timeRange],
    queryFn: () => reportsService.getStats(timeRange),
  });

  const { data: recentReports, isLoading: reportsLoading } = useQuery({
    queryKey: ['recent-reports'],
    queryFn: () => reportsService.getRecentReports(10),
  });

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'failed': return 'text-red-600';
      case 'processing': return 'text-blue-600';
      default: return 'text-yellow-600';
    }
  };

  const statsCards = [
    {
      title: 'Total de Relatórios',
      value: stats?.total_reports || 0,
      icon: DocumentChartBarIcon,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive' as const,
    },
    {
      title: 'Pendentes',
      value: stats?.pending_reports || 0,
      icon: ClockIcon,
      color: 'bg-yellow-500',
      change: '-5%',
      changeType: 'negative' as const,
    },
    {
      title: 'Concluídos',
      value: stats?.completed_reports || 0,
      icon: CheckCircleIcon,
      color: 'bg-green-500',
      change: '+18%',
      changeType: 'positive' as const,
    },
    {
      title: 'Falharam',
      value: stats?.failed_reports || 0,
      icon: ExclamationTriangleIcon,
      color: 'bg-red-500',
      change: '-2%',
      changeType: 'negative' as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard de Relatórios</h1>
          <p className="text-gray-600">Visão geral dos relatórios gerados e estatísticas</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as 'week' | 'month' | 'quarter')}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">Última Semana</option>
            <option value="month">Último Mês</option>
            <option value="quarter">Último Trimestre</option>
          </select>
          <a
            href="/dashboard/ordoc-reports/create"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Novo Relatório
          </a>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                {statsLoading ? (
                  <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                ) : (
                  <p className="text-2xl font-bold text-gray-900">
                    {card.value.toLocaleString()}
                  </p>
                )}
                <div className="flex items-center mt-2">
                  <span
                    className={`text-sm font-medium ${
                      card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {card.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs período anterior</span>
                </div>
              </div>
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Estatísticas adicionais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Storage e Downloads */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Uso de Armazenamento</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Espaço utilizado</span>
              <span className="text-sm font-medium text-gray-900">
                {statsLoading ? (
                  <div className="animate-pulse bg-gray-200 h-4 w-20 rounded"></div>
                ) : (
                  formatFileSize(stats?.storage_used)
                )}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total de downloads</span>
              <span className="text-sm font-medium text-gray-900">
                {statsLoading ? (
                  <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
                ) : (
                  (stats?.total_downloads || 0).toLocaleString()
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Ações rápidas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
          <div className="space-y-3">
            <a
              href="/dashboard/ordoc-reports/create"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <PlusIcon className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <div className="text-sm font-medium text-gray-900">Criar Relatório</div>
                <div className="text-xs text-gray-500">Gerar novo relatório personalizado</div>
              </div>
            </a>
            <a
              href="/dashboard/ordoc-reports/templates"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <DocumentChartBarIcon className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <div className="text-sm font-medium text-gray-900">Gerenciar Templates</div>
                <div className="text-xs text-gray-500">Criar e editar templates de relatórios</div>
              </div>
            </a>
            <a
              href="/dashboard/ordoc-reports/reports"
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <ArrowDownTrayIcon className="h-5 w-5 text-purple-600 mr-3" />
              <div>
                <div className="text-sm font-medium text-gray-900">Ver Todos os Relatórios</div>
                <div className="text-xs text-gray-500">Gerenciar relatórios existentes</div>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Relatórios recentes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Relatórios Recentes</h3>
            <a
              href="/dashboard/ordoc-reports/reports"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Ver todos
            </a>
          </div>
        </div>
        <div className="p-6">
          {reportsLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center space-x-4">
                  <div className="bg-gray-200 h-10 w-10 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
                    <div className="bg-gray-200 h-3 w-1/2 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentReports && recentReports.length > 0 ? (
            <div className="space-y-4">
              {recentReports.map((report: RecentReport) => (
                <div key={report.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <DocumentChartBarIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{report.title}</h4>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className={`text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status === 'completed' ? 'Concluído' :
                           report.status === 'failed' ? 'Falhou' :
                           report.status === 'processing' ? 'Processando' : 'Pendente'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(new Date(report.created_at))}
                        </span>
                        <span className="text-xs text-gray-500">
                          {report.format.toUpperCase()}
                        </span>
                        {report.file_size && (
                          <span className="text-xs text-gray-500">
                            {formatFileSize(report.file_size)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {report.status === 'completed' && (
                      <button
                        onClick={() => window.open(`/api/reports/${report.id}/download`, '_blank')}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Download"
                      >
                        <ArrowDownTrayIcon className="h-4 w-4" />
                      </button>
                    )}
                    <a
                      href={`/dashboard/ordoc-reports/reports/${report.id}`}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Ver detalhes
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <DocumentChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum relatório recente</h3>
              <p className="mt-1 text-sm text-gray-500">Comece criando seu primeiro relatório</p>
              <div className="mt-6">
                <a
                  href="/dashboard/ordoc-reports/create"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Criar Relatório
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
