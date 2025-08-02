'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Search, 
  Filter, 
  CheckSquare, 
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Clock,
  User,
  FileText,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { signaturesService } from '@/services/ordoc-flow/signatures';
import { Signature, FilterSignaturesParams } from '@/types/ordoc-flow';

const SignaturesPage = () => {
  const router = useRouter();
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalObjects, setTotalObjects] = useState(0);
  
  const [params, setParams] = useState<FilterSignaturesParams>({
    direction: 'asc',
    order: 'created_at',
    page: 1,
    perPage: 20,
    q: '',
    status: '',
    procedure_id: undefined,
    requester_id: undefined,
    signable_type: '',
  });

  const [showFilters, setShowFilters] = useState(false);
  const [selectedSignature, setSelectedSignature] = useState<Signature | null>(null);
  const [showActions, setShowActions] = useState<number | null>(null);

  useEffect(() => {
    loadSignatures();
  }, [params]);

  const loadSignatures = async () => {
    try {
      setLoading(true);
      const response = await signaturesService.getSignatures(params);
      setSignatures(response.data);
      setTotalPages(response.totalPages);
      setTotalObjects(response.total);
    } catch (error) {
      console.error('Erro ao carregar assinaturas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setParams(prev => ({ ...prev, q: value, page: 1 }));
  };

  const handleStatusFilter = (status: string) => {
    setParams(prev => ({ ...prev, status: status as 'pending' | 'signed' | 'refused' | '', page: 1 }));
  };

  const handleSort = (field: string) => {
    setParams(prev => ({
      ...prev,
      order: field,
      direction: prev.order === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handlePageChange = (page: number) => {
    setParams(prev => ({ ...prev, page }));
  };

  const handleApprove = async (signature: Signature) => {
    try {
      await signaturesService.approveSignature(signature.id);
      loadSignatures();
    } catch (error) {
      console.error('Erro ao aprovar assinatura:', error);
    }
  };

  const handleReject = async (signature: Signature) => {
    try {
      await signaturesService.rejectSignature(signature.id);
      loadSignatures();
    } catch (error) {
      console.error('Erro ao rejeitar assinatura:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pendente', icon: Clock },
      signed: { color: 'bg-green-100 text-green-800', text: 'Assinado', icon: CheckCircle },
      refused: { color: 'bg-red-100 text-red-800', text: 'Recusado', icon: XCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assinaturas</h1>
            <p className="text-gray-600">Gerencie assinaturas e aprovações do sistema</p>
          </div>
          <button
            onClick={() => router.push('/dashboard/ordoc-flow/signatures/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nova Assinatura
          </button>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar assinaturas..."
              value={params.q}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filtros
          </button>
        </div>

        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={params.status}
                  onChange={(e) => handleStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos</option>
                  <option value="pending">Pendente</option>
                  <option value="signed">Assinado</option>
                  <option value="refused">Recusado</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Carregando assinaturas...</p>
          </div>
        ) : signatures.length === 0 ? (
          <div className="p-8 text-center">
            <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma assinatura encontrada</h3>
            <p className="text-gray-600 mb-4">
              {params.q || params.status ? 
                'Nenhuma assinatura corresponde aos filtros aplicados.' : 
                'Comece criando sua primeira assinatura.'
              }
            </p>
            {!params.q && !params.status && (
              <div className="mt-6">
                <button
                  onClick={() => router.push('/dashboard/ordoc-flow/signatures/new')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeira Assinatura
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Procedimento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Requerente
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('status')}
                    >
                      Status
                      {params.order === 'status' && (
                        <span className="ml-1">
                          {params.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('created_at')}
                    >
                      Criado em
                      {params.order === 'created_at' && (
                        <span className="ml-1">
                          {params.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data da Assinatura
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {signatures.map((signature) => (
                    <tr key={signature.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">Procedimento #{signature.procedure_id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">Requerente #{signature.requester_id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(signature.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{signature.signable_type}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(signature.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {signature.signed_at ? new Date(signature.signed_at).toLocaleDateString('pt-BR') : 
                         signature.refused_at ? new Date(signature.refused_at).toLocaleDateString('pt-BR') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="relative">
                          <button
                            onClick={() => setShowActions(showActions === signature.id ? null : signature.id)}
                            className="text-gray-400 hover:text-gray-600 p-1"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {showActions === signature.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                              <button
                                onClick={() => {
                                  router.push(`/dashboard/ordoc-flow/signatures/${signature.id}`);
                                  setShowActions(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                Visualizar
                              </button>
                              {signature.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => {
                                      handleApprove(signature);
                                      setShowActions(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50 flex items-center gap-2"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    Aprovar
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleReject(signature);
                                      setShowActions(null);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center gap-2"
                                  >
                                    <XCircle className="w-4 h-4" />
                                    Rejeitar
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => {
                                  setSelectedSignature(signature);
                                  setShowActions(null);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                Excluir
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Mostrando {((params.page - 1) * params.perPage) + 1} a {Math.min(params.page * params.perPage, totalObjects)} de {totalObjects} assinaturas
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(params.page - 1)}
                    disabled={params.page === 1}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Anterior
                  </button>
                  <span className="text-sm text-gray-700">
                    Página {params.page} de {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(params.page + 1)}
                    disabled={params.page === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SignaturesPage;
