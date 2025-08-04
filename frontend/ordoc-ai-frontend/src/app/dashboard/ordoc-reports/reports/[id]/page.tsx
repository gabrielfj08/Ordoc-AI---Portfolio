'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { reportsService } from '@/services/reports';
import { Report } from '@/types/ordoc-reports';
import Link from 'next/link';
import { ArrowLeftIcon, DocumentArrowDownIcon, EyeIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function ReportDetailPage() {
  const params = useParams();
  const reportId = params.id as string;

  const { data: report, isLoading, error } = useQuery<Report>({
    queryKey: ['report', reportId],
    queryFn: () => reportsService.getReport(reportId),
    enabled: !!reportId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Relatório não encontrado</h3>
        <p className="text-gray-500 mb-4">O relatório solicitado não existe ou você não tem permissão para acessá-lo.</p>
        <Link
          href="/dashboard/ordoc-reports/reports"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Voltar aos Relatórios
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const formatFileSize = (bytes: number | null | undefined) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluído';
      case 'processing': return 'Processando';
      case 'failed': return 'Falhou';
      case 'pending': return 'Pendente';
      default: return status;
    }
  };

  const getFormatDisplay = (format: string) => {
    switch (format) {
      case 'html': return 'HTML';
      case 'pdf': return 'PDF';
      case 'excel': return 'Excel';
      case 'csv': return 'CSV';
      default: return format.toUpperCase();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard/ordoc-reports/reports"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Voltar aos Relatórios
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            {report.status === 'completed' && report.file_url && (
              <a
                href={report.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                Download
              </a>
            )}
            {report.status === 'completed' && (
              <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                <EyeIcon className="h-4 w-4 mr-2" />
                Visualizar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Report Info */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">{report.title}</h1>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
              {getStatusDisplay(report.status)}
            </span>
          </div>
          {report.description && (
            <p className="mt-2 text-gray-600">{report.description}</p>
          )}
        </div>

        <div className="px-6 py-4">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Template</dt>
              <dd className="mt-1 text-sm text-gray-900">{report.template_name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Formato</dt>
              <dd className="mt-1 text-sm text-gray-900">{getFormatDisplay(report.format)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Criado em</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatDate(report.created_at)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Atualizado em</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatDate(report.updated_at)}</dd>
            </div>
            {report.expires_at && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Expira em</dt>
                <dd className="mt-1 text-sm text-gray-900 flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1 text-gray-400" />
                  {formatDate(report.expires_at)}
                </dd>
              </div>
            )}
            {report.file_size && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Tamanho do arquivo</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatFileSize(report.file_size)}</dd>
              </div>
            )}
            {report.completed_at && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Concluído em</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(report.completed_at)}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Error Message */}
        {report.error_message && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="rounded-md bg-red-50 p-4">
              <h3 className="text-sm font-medium text-red-800">Erro na geração</h3>
              <p className="mt-1 text-sm text-red-700">{report.error_message}</p>
            </div>
          </div>
        )}

        {/* Processing Status */}
        {(report.status === 'processing' || report.status === 'pending') && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="rounded-md bg-yellow-50 p-4">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-3"></div>
                <h3 className="text-sm font-medium text-yellow-800">
                  {report.status === 'processing' ? 'Processando relatório...' : 'Relatório na fila...'}
                </h3>
              </div>
              <p className="mt-1 text-sm text-yellow-700">
                O relatório está sendo processado. Esta página será atualizada automaticamente quando concluído.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
