'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { FileText, Send, X, Users, Clock, CheckCircle } from 'lucide-react';
import { signatureService } from '@/services/signature';
import { FilterSignatureRequestsParams } from '@/types/ordoc-sign';

export default function SignatureRequestsPage() {
  const [filters, setFilters] = useState<FilterSignatureRequestsParams>({
    page: 1,
    page_size: 20
  });

  const { data: requestsData, isLoading, error, refetch } = useQuery({
    queryKey: ['signature-requests', filters],
    queryFn: () => signatureService.getRequests(filters),
  });

  const requests = requestsData?.results || [];

  const handleSubmitRequest = async (id: string) => {
    try {
      await signatureService.submitRequest(id);
      refetch();
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
      alert('Erro ao enviar solicitação. Tente novamente.');
    }
  };

  const handleCancelRequest = async (id: string) => {
    if (!confirm('Tem certeza que deseja cancelar esta solicitação?')) return;
    
    try {
      await signatureService.cancelRequest(id);
      refetch();
    } catch (error) {
      console.error('Erro ao cancelar solicitação:', error);
      alert('Erro ao cancelar solicitação. Tente novamente.');
    }
  };

  const handleDeleteRequest = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta solicitação?')) return;
    
    try {
      await signatureService.deleteRequest(id);
      refetch();
    } catch (error) {
      console.error('Erro ao excluir solicitação:', error);
      alert('Erro ao excluir solicitação. Tente novamente.');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <FileText className="w-5 h-5 text-gray-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'in_progress':
        return <Users className="w-5 h-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <X className="w-5 h-5 text-red-500" />;
      case 'expired':
        return <X className="w-5 h-5 text-red-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Rascunho';
      case 'pending': return 'Pendente';
      case 'in_progress': return 'Em Andamento';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      case 'expired': return 'Expirado';
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
              <h1 className="text-xl font-bold text-gray-900">Solicitações de Assinatura</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => refetch()}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Atualizar
              </button>
              <Link
                href="/dashboard/ordoc-sign/requests/new"
                className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Nova Solicitação</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Carregando solicitações...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <FileText className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar solicitações</h3>
            <p className="text-gray-600 mb-4">Não foi possível carregar a lista de solicitações.</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Tentar novamente
            </button>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma solicitação encontrada</h3>
            <p className="text-gray-600 mb-4">Crie sua primeira solicitação de assinatura.</p>
            <Link
              href="/dashboard/ordoc-sign/requests/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Send className="w-4 h-4 mr-2" />
              Nova Solicitação
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Solicitação
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Documento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Criado em
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expira em
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {request.title}
                          </div>
                          {request.description && (
                            <div className="text-sm text-gray-500">
                              {request.description}
                            </div>
                          )}
                          {request.template_name && (
                            <div className="text-xs text-gray-400 mt-1">
                              Template: {request.template_name}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(request.status)}
                          <span className="ml-2 text-sm text-gray-900">
                            {getStatusText(request.status)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.document_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(request.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.expires_at 
                          ? new Date(request.expires_at).toLocaleDateString('pt-BR')
                          : '-'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        {request.status === 'draft' && (
                          <button
                            onClick={() => handleSubmitRequest(request.id)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Enviar
                          </button>
                        )}
                        {(request.status === 'pending' || request.status === 'in_progress') && (
                          <button
                            onClick={() => handleCancelRequest(request.id)}
                            className="text-yellow-600 hover:text-yellow-800"
                          >
                            Cancelar
                          </button>
                        )}
                        <Link
                          href={`/dashboard/ordoc-sign/requests/${request.id}`}
                          className="text-green-600 hover:text-green-800"
                        >
                          Ver Detalhes
                        </Link>
                        <button
                          onClick={() => handleDeleteRequest(request.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Excluir
                        </button>
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
