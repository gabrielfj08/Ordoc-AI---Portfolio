'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Package, Play, X, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { signatureService } from '@/services/signature';
import { FilterSignatureBatchesParams } from '@/types/ordoc-sign';

export default function SignatureBatchesPage() {
  const [filters, setFilters] = useState<FilterSignatureBatchesParams>({
    page: 1,
    page_size: 20
  });

  const { data: batchesData, isLoading, error, refetch } = useQuery({
    queryKey: ['signature-batches', filters],
    queryFn: () => signatureService.getBatches(filters),
  });

  const batches = batchesData?.results || [];

  const handleProcessBatch = async (id: string) => {
    try {
      await signatureService.processBatch(id);
      refetch();
    } catch (error) {
      console.error('Erro ao processar lote:', error);
      alert('Erro ao processar lote. Tente novamente.');
    }
  };

  const handleCancelBatch = async (id: string) => {
    if (!confirm('Tem certeza que deseja cancelar este lote?')) return;
    
    try {
      await signatureService.cancelBatch(id);
      refetch();
    } catch (error) {
      console.error('Erro ao cancelar lote:', error);
      alert('Erro ao cancelar lote. Tente novamente.');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <Package className="w-5 h-5 text-gray-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'cancelled':
        return <X className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Rascunho';
      case 'processing': return 'Processando';
      case 'completed': return 'Concluído';
      case 'failed': return 'Falhou';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/ordoc-sign" className="text-gray-500 hover:text-gray-700">
                ← Voltar
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-bold text-gray-900">Lotes de Assinatura</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => refetch()}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Atualizar
              </button>
              <Link
                href="/dashboard/ordoc-sign/batches/new"
                className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 flex items-center space-x-2"
              >
                <Package className="w-4 h-4" />
                <span>Novo Lote</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Carregando lotes...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <Package className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar lotes</h3>
            <p className="text-gray-600 mb-4">Não foi possível carregar a lista de lotes.</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Tentar novamente
            </button>
          </div>
        ) : batches.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum lote encontrado</h3>
            <p className="text-gray-600 mb-4">Crie seu primeiro lote de assinaturas.</p>
            <Link
              href="/dashboard/ordoc-sign/batches/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Package className="w-4 h-4 mr-2" />
              Novo Lote
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lote
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progresso
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Criado em
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {batches.map((batch) => (
                    <tr key={batch.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {batch.name}
                          </div>
                          {batch.description && (
                            <div className="text-sm text-gray-500">
                              {batch.description}
                            </div>
                          )}
                          {batch.template_name && (
                            <div className="text-xs text-gray-400 mt-1">
                              Template: {batch.template_name}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(batch.status)}
                          <span className="ml-2 text-sm text-gray-900">
                            {getStatusText(batch.status)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${batch.progress_percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-900">
                            {batch.progress_percentage.toFixed(0)}%
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {batch.completed_requests}/{batch.total_requests} concluídas
                          {batch.failed_requests > 0 && (
                            <span className="text-red-600 ml-2">
                              ({batch.failed_requests} falharam)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {batch.total_requests} solicitações
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(batch.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        {batch.status === 'draft' && (
                          <button
                            onClick={() => handleProcessBatch(batch.id)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Processar
                          </button>
                        )}
                        {batch.status === 'processing' && (
                          <button
                            onClick={() => handleCancelBatch(batch.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Cancelar
                          </button>
                        )}
                        <Link
                          href={`/dashboard/ordoc-sign/batches/${batch.id}`}
                          className="text-green-600 hover:text-green-800"
                        >
                          Ver Detalhes
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
