'use client';

import React, { useState } from 'react';
import { formatDate } from '@/lib/utils';

// Interface para um relatório gerado
interface GeneratedReport {
  id: string;
  title: string;
  description?: string;
  template_name?: string;
  format: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  completed_at?: string;
  file_url?: string;
  file_size?: number;
  expires_at?: string;
  error_message?: string;
}

interface ReportsListProps {
  reports: {
    results?: GeneratedReport[];
    count?: number;
  } | GeneratedReport[];
  onRefresh: () => void;
}

const getStatusBadge = (status: string) => {
  const statusConfig = {
    pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
    processing: { label: 'Processando', color: 'bg-blue-100 text-blue-800' },
    completed: { label: 'Concluído', color: 'bg-green-100 text-green-800' },
    failed: { label: 'Falhou', color: 'bg-red-100 text-red-800' },
  };
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

const getFormatBadge = (format: string) => {
  const formatConfig = {
    pdf: { label: 'PDF', color: 'bg-red-50 text-red-700 border-red-200' },
    xlsx: { label: 'Excel', color: 'bg-green-50 text-green-700 border-green-200' },
    csv: { label: 'CSV', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    html: { label: 'HTML', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  };
  
  const config = formatConfig[format.toLowerCase() as keyof typeof formatConfig] || 
    { label: format.toUpperCase(), color: 'bg-gray-50 text-gray-700 border-gray-200' };
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${config.color}`}>
      {config.label}
    </span>
  );
};

const formatFileSize = (bytes?: number) => {
  if (!bytes) return '-';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

export default function ReportsList({ reports, onRefresh }: ReportsListProps) {
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  
  // Normalizar dados - pode vir como array direto ou objeto com results
  const reportsList = Array.isArray(reports) ? reports : (reports?.results || []);
  const totalCount = Array.isArray(reports) ? reports.length : (reports?.count || 0);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedReports(reportsList.map(r => r.id));
    } else {
      setSelectedReports([]);
    }
  };

  const handleSelectReport = (reportId: string, checked: boolean) => {
    if (checked) {
      setSelectedReports(prev => [...prev, reportId]);
    } else {
      setSelectedReports(prev => prev.filter(id => id !== reportId));
    }
  };

  const handleDownload = async (report: GeneratedReport) => {
    if (!report.file_url) {
      alert('Arquivo não disponível para download');
      return;
    }
    
    try {
      // Criar link temporário para download
      const link = document.createElement('a');
      link.href = report.file_url;
      link.download = `${report.title}.${report.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erro ao fazer download:', error);
      alert('Erro ao fazer download do arquivo');
    }
  };

  const handleDelete = async (reportId: string) => {
    if (!confirm('Tem certeza que deseja excluir este relatório?')) {
      return;
    }
    
    try {
      // TODO: Implementar delete no service
      // await reportsService.deleteReport(reportId);
      alert('Funcionalidade de exclusão será implementada em breve');
      onRefresh();
    } catch (error) {
      console.error('Erro ao excluir relatório:', error);
      alert('Erro ao excluir relatório');
    }
  };

  if (reportsList.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum relatório encontrado</h3>
        <p className="text-gray-600 mb-4">Você ainda não gerou nenhum relatório.</p>
        <a
          href="/dashboard/ordoc-reports/create"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Gerar primeiro relatório
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      {/* Header com informações e ações em lote */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">
              Relatórios ({totalCount})
            </h2>
            {selectedReports.length > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                {selectedReports.length} relatório(s) selecionado(s)
              </p>
            )}
          </div>
          
          {selectedReports.length > 0 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => alert('Funcionalidade de download em lote será implementada')}
                className="px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Download Selecionados
              </button>
              <button
                onClick={() => alert('Funcionalidade de exclusão em lote será implementada')}
                className="px-3 py-2 text-sm text-red-700 bg-red-100 rounded-md hover:bg-red-200"
              >
                Excluir Selecionados
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabela de relatórios */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedReports.length === reportsList.length && reportsList.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Relatório
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Formato
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Criado em
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tamanho
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reportsList.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedReports.includes(report.id)}
                    onChange={(e) => handleSelectReport(report.id, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{report.title}</div>
                    {report.description && (
                      <div className="text-sm text-gray-500">{report.description}</div>
                    )}
                    {report.template_name && (
                      <div className="text-xs text-gray-400 mt-1">Template: {report.template_name}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(report.status)}
                  {report.status === 'failed' && report.error_message && (
                    <div className="text-xs text-red-600 mt-1" title={report.error_message}>
                      {report.error_message.length > 50 
                        ? `${report.error_message.substring(0, 50)}...` 
                        : report.error_message}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  {getFormatBadge(report.format)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {formatDate(new Date(report.created_at))}
                  {report.completed_at && (
                    <div className="text-xs text-gray-500 mt-1">
                      Concluído: {formatDate(new Date(report.completed_at))}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {formatFileSize(report.file_size)}
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    {report.status === 'completed' && report.file_url && (
                      <button
                        onClick={() => handleDownload(report)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Download"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(report.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Excluir"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
