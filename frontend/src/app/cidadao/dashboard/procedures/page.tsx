'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  DocumentTextIcon,
  PlusIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { ExternalProcedureService } from '@/services/ordoc-cidadao';
import type { IndexExternalProcedure, externalProcedureStatus } from '@/services/ordoc-cidadao';

const statusConfig = {
  draft: { label: 'Rascunho', color: 'bg-gray-100 text-gray-800', icon: ClockIcon },
  submitted: { label: 'Enviado', color: 'bg-blue-100 text-blue-800', icon: ClockIcon },
  in_analysis: { label: 'Em Análise', color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon },
  approved: { label: 'Aprovado', color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
  rejected: { label: 'Rejeitado', color: 'bg-red-100 text-red-800', icon: XCircleIcon },
  completed: { label: 'Concluído', color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
  started: { label: 'Iniciado', color: 'bg-blue-100 text-blue-800', icon: ClockIcon },
};

export default function CidadaoProceduresPage() {
  const [procedures, setProcedures] = useState<IndexExternalProcedure[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<externalProcedureStatus | 'all'>('all');
  const router = useRouter();

  useEffect(() => {
    loadProcedures();
  }, [selectedStatus]);

  const loadProcedures = async () => {
    try {
      setIsLoading(true);
      const params = selectedStatus !== 'all' ? { status: selectedStatus } : {};
      const response = await ExternalProcedureService.index('', '', params);
      setProcedures(response.data);
    } catch (error) {
      console.error('Erro ao carregar procedimentos:', error);
    } finally {
      setIsLoading(false);
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
              <h1 className="text-xl font-semibold text-gray-900">Meus Procedimentos</h1>
            </div>
            <button
              onClick={() => router.push('/cidadao/dashboard/procedures/new')}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Novo Procedimento</span>
            </button>
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
              Todos
            </button>
            {Object.entries(statusConfig).map(([status, config]) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status as externalProcedureStatus)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedStatus === status
                    ? config.color
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {config.label}
              </button>
            ))}
          </div>
        </div>

        {/* Procedures List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Carregando procedimentos...</p>
            </div>
          ) : procedures.length === 0 ? (
            <div className="p-8 text-center">
              <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum procedimento encontrado</h3>
              <p className="text-gray-600 mb-4">
                {selectedStatus === 'all'
                  ? 'Você ainda não possui procedimentos cadastrados.'
                  : `Não há procedimentos com status "${statusConfig[selectedStatus as keyof typeof statusConfig]?.label}".`}
              </p>
              <button
                onClick={() => router.push('/cidadao/dashboard/procedures/new')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Criar Primeiro Procedimento
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {procedures.map((procedure) => {
                const statusInfo = statusConfig[procedure.status] || statusConfig.draft;
                const StatusIcon = statusInfo.icon;

                return (
                  <div
                    key={procedure.id}
                    className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/cidadao/dashboard/procedures/${procedure.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">{procedure.name}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusInfo.label}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Criado em: {formatDate(procedure.createdAt)}</span>
                          <span>Atualizado em: {formatDate(procedure.updatedAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/cidadao/dashboard/procedures/${procedure.id}`);
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
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
