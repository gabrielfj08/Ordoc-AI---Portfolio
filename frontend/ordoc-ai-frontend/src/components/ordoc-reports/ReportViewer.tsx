'use client';

import React, { useState } from 'react';
import { DocumentArrowDownIcon, PrinterIcon, ShareIcon, EyeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Report } from '@/types/ordoc-reports';
import ExportModal from './ExportModal';

interface ReportViewerProps {
  report: Report;
  onExport?: () => void;
}

export default function ReportViewer({ report, onExport }: ReportViewerProps) {
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'fullscreen'>('preview');

  const handlePrint = () => {
    if (report.file_url) {
      const printWindow = window.open(report.file_url, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    }
  };

  const handleShare = () => {
    if (navigator.share && report.file_url) {
      navigator.share({
        title: report.title,
        text: report.description || 'Relatório gerado',
        url: report.file_url,
      }).catch(console.error);
    } else {
      // Fallback: copy to clipboard
      if (report.file_url) {
        navigator.clipboard.writeText(report.file_url).then(() => {
          alert('Link copiado para a área de transferência!');
        });
      }
    }
  };

  const handleDownload = () => {
    if (report.file_url) {
      const link = document.createElement('a');
      link.href = report.file_url;
      link.download = `${report.title}.${report.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (report.status !== 'completed' || !report.file_url) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <EyeIcon className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {report.status === 'processing' ? 'Relatório sendo processado' : 'Relatório não disponível'}
          </h3>
          <p className="text-gray-600">
            {report.status === 'processing' 
              ? 'O relatório está sendo gerado. Aguarde a conclusão para visualizar.'
              : 'Este relatório não está disponível para visualização.'}
          </p>
          {report.error_message && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">{report.error_message}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-medium text-gray-900">{report.title}</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {report.format.toUpperCase()}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode(viewMode === 'preview' ? 'fullscreen' : 'preview')}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <EyeIcon className="h-4 w-4 mr-2" />
              {viewMode === 'preview' ? 'Tela Cheia' : 'Preview'}
            </button>
            
            <button
              onClick={handlePrint}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <PrinterIcon className="h-4 w-4 mr-2" />
              Imprimir
            </button>
            
            <button
              onClick={handleShare}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <ShareIcon className="h-4 w-4 mr-2" />
              Compartilhar
            </button>
            
            <button
              onClick={() => setExportModalOpen(true)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
              Exportar
            </button>
            
            <button
              onClick={handleDownload}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
            >
              <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {viewMode === 'fullscreen' ? (
          <div className="fixed inset-0 z-50 bg-white">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">{report.title}</h3>
              <button
                onClick={() => setViewMode('preview')}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="h-full">
              <iframe
                src={report.file_url}
                className="w-full h-full border-0"
                title={report.title}
              />
            </div>
          </div>
        ) : (
          <div className="aspect-[4/3] w-full">
            <iframe
              src={report.file_url}
              className="w-full h-full border-0"
              title={report.title}
            />
          </div>
        )}
      </div>

      {/* Report Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Informações do Relatório</h4>
        <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">Template</dt>
            <dd className="mt-1 text-sm text-gray-900">{report.template_name}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Formato</dt>
            <dd className="mt-1 text-sm text-gray-900">{report.format.toUpperCase()}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Criado em</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {new Date(report.created_at).toLocaleString('pt-BR')}
            </dd>
          </div>
          {report.completed_at && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Concluído em</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(report.completed_at).toLocaleString('pt-BR')}
              </dd>
            </div>
          )}
          {report.file_size && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Tamanho</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {(report.file_size / 1024 / 1024).toFixed(2)} MB
              </dd>
            </div>
          )}
          {report.expires_at && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Expira em</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(report.expires_at).toLocaleString('pt-BR')}
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        reportId={report.id}
        title={report.title}
      />
    </div>
  );
}
