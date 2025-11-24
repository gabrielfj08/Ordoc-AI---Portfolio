'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  PencilSquareIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentArrowDownIcon,
} from '@heroicons/react/24/outline';
import { ExternalSignatureService } from '@/services/ordoc-cidadao';
import type { IndexExternalSignature } from '@/services/ordoc-cidadao';

export default function CidadaoSignaturesPage() {
  const [signatures, setSignatures] = useState<IndexExternalSignature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string | 'all'>('all');
  const router = useRouter();

  useEffect(() => {
    loadSignatures();
  }, [selectedStatus]);

  const loadSignatures = async () => {
    try {
      setIsLoading(true);
      const params = selectedStatus !== 'all' ? { status: selectedStatus } : {};
      const response = await ExternalSignatureService.index(params);
      setSignatures(response.data);
    } catch (error) {
      console.error('Erro ao carregar assinaturas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSign = async (signatureId: number) => {
    try {
      await ExternalSignatureService.sign(signatureId);
      await loadSignatures(); // Reload to get updated status
    } catch (error) {
      console.error('Erro ao assinar documento:', error);
    }
  };

  const downloadDocument = async (signatureId: number, documentName: string) => {
    try {
      const blob = await ExternalSignatureService.download(signatureId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = documentName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao baixar documento:', error);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon };
      case 'signed':
        return { label: 'Assinado', color: 'bg-green-100 text-green-800', icon: CheckCircleIcon };
      case 'refused':
        return { label: 'Recusado', color: 'bg-red-100 text-red-800', icon: XCircleIcon };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-800', icon: ClockIcon };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/cidadao/dashboard')}
                className="text-gray-500 hover:text-gray-700"
              >
                ← Voltar
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Assinaturas Pendentes</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedStatus === 'all'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas
            </button>
            {['pending', 'signed', 'refused'].map((status) => {
              const config = getStatusConfig(status);
              return (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedStatus === status
                      ? config.color
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Signatures List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Carregando assinaturas...</p>
            </div>
          ) : signatures.length === 0 ? (
            <div className="p-8 text-center">
              <PencilSquareIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma assinatura encontrada</h3>
              <p className="text-gray-600">
                {selectedStatus === 'all'
                  ? 'Você não possui documentos para assinar no momento.'
                  : `Não há assinaturas com status "${getStatusConfig(selectedStatus).label}".`}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {signatures.map((signature) => {
                const statusInfo = getStatusConfig(signature.status);
                const StatusIcon = statusInfo.icon;

                return (
                  <div
                    key={signature.id}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">{signature.documentName}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusInfo.label}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Criado em: {formatDate(signature.createdAt)}</span>
                          <span>Atualizado em: {formatDate(signature.updatedAt)}</span>
                          <span>Procedimento ID: {signature.procedureId}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => downloadDocument(signature.id, signature.documentName)}
                          className="flex items-center space-x-1 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Baixar documento"
                        >
                          <DocumentArrowDownIcon className="h-5 w-5" />
                        </button>
                        
                        {signature.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleSign(signature.id)}
                              className="flex items-center space-x-2 bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition-colors text-sm"
                            >
                              <PencilSquareIcon className="h-4 w-4" />
                              <span>Assinar</span>
                            </button>
                            <button
                              onClick={() => router.push(`/cidadao/dashboard/signatures/${signature.id}/refuse`)}
                              className="flex items-center space-x-2 bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors text-sm"
                            >
                              <XCircleIcon className="h-4 w-4" />
                              <span>Recusar</span>
                            </button>
                          </>
                        )}
                        
                        <button
                          onClick={() => router.push(`/cidadao/dashboard/signatures/${signature.id}`)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Ver detalhes"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
