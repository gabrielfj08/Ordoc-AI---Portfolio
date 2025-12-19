'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  DocumentTextIcon,
  PaperClipIcon,
  ChatBubbleLeftIcon,
  PlayIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { ExternalProcedureService, ExternalProcedureDocumentService } from '@/services/ordoc-cidadao';
import type { ShowExternalProcedureAPIResponse, IndexExternalTaskDocument } from '@/services/ordoc-cidadao';

const statusConfig = {
  draft: { label: 'Rascunho', color: 'bg-gray-100 text-gray-800', icon: ClockIcon },
  submitted: { label: 'Enviado', color: 'bg-blue-100 text-blue-800', icon: ClockIcon },
  in_analysis: { label: 'Em Análise', color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon },
  approved: { label: 'Aprovado', color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
  rejected: { label: 'Rejeitado', color: 'bg-red-100 text-red-800', icon: XCircleIcon },
  completed: { label: 'Concluído', color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
  started: { label: 'Iniciado', color: 'bg-blue-100 text-blue-800', icon: ClockIcon },
};

export default function CidadaoProcedureDetailPage() {
  const [procedure, setProcedure] = useState<ShowExternalProcedureAPIResponse | null>(null);
  const [documents, setDocuments] = useState<IndexExternalTaskDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [finishNote, setFinishNote] = useState('');
  const router = useRouter();
  const params = useParams();
  const procedureId = Number(params.id);

  useEffect(() => {
    loadProcedureData();
  }, [procedureId]);

  const loadProcedureData = async () => {
    try {
      setIsLoading(true);
      const [procedureResponse, documentsResponse] = await Promise.all([
        ExternalProcedureService.show('', '', Number(procedureId)),
        ExternalProcedureDocumentService.index({ procedureId }),
      ]);
      setProcedure(procedureResponse);
      setDocuments(documentsResponse.data);
    } catch (error) {
      console.error('Erro ao carregar dados do procedimento:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunProcedure = async () => {
    try {
      await ExternalProcedureService.run('', '', procedureId);
      await loadProcedureData(); // Reload to get updated status
    } catch (error) {
      console.error('Erro ao executar procedimento:', error);
    }
  };

  const handleRequestFinish = async () => {
    try {
      await ExternalProcedureService.requestFinish('', '', Number(procedureId), { note: finishNote });
      setShowFinishModal(false);
      setFinishNote('');
      await loadProcedureData(); // Reload to get updated status
    } catch (error) {
      console.error('Erro ao solicitar finalização:', error);
    }
  };

  const downloadDocument = async (documentId: number, documentName: string) => {
    try {
      const blob = await ExternalProcedureDocumentService.download('', '', documentId);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!procedure) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Procedimento não encontrado</h2>
          <button
            onClick={() => router.push('/cidadao/dashboard/procedures')}
            className="text-blue-600 hover:text-blue-500"
          >
            Voltar para procedimentos
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = statusConfig[procedure.status as keyof typeof statusConfig] || statusConfig.draft;
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/cidadao/dashboard/procedures')}
                className="text-gray-500 hover:text-gray-700"
              >
                ← Voltar
              </button>
              <h1 className="text-xl font-semibold text-gray-900">{procedure.name}</h1>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusInfo.label}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {procedure.status === 'draft' && (
                <button
                  onClick={handleRunProcedure}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <PlayIcon className="h-4 w-4" />
                  <span>Executar</span>
                </button>
              )}
              {procedure.status === 'in_analysis' && (
                <button
                  onClick={() => setShowFinishModal(true)}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  <CheckCircleIcon className="h-4 w-4" />
                  <span>Solicitar Finalização</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Procedure Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informações do Procedimento</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Criado em</label>
                  <p className="mt-1 text-sm text-gray-900">{new Date(procedure.createdAt).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Última atualização</label>
                  <p className="mt-1 text-sm text-gray-900">{new Date(procedure.updatedAt).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            </div>

            {/* Schema Fields */}
            {procedure.schema && procedure.schema.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Campos do Procedimento</h3>
                <div className="space-y-4">
                  {procedure.schema.map((field: any) => {
                    const fieldValue = procedure.payload?.find(p => p.fieldId === field.id)?.value;
                    
                    return (
                      <div key={field.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {field.name}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <div className="text-sm text-gray-900">
                          {fieldValue || <span className="text-gray-400 italic">Não preenchido</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Documents */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Documentos</h3>
              {documents.length === 0 ? (
                <p className="text-sm text-gray-500">Nenhum documento anexado</p>
              ) : (
                <div className="space-y-3">
                  {documents.map((document) => (
                    <div
                      key={document.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        <PaperClipIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{document.name}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(document.createdAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => downloadDocument(document.id, document.name)}
                        className="text-blue-600 hover:text-blue-500 text-sm"
                      >
                        Baixar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Ações</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push(`/cidadao/dashboard/procedures/${procedure.id}/edit`)}
                  disabled={procedure.status !== 'draft'}
                  className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <DocumentTextIcon className="h-4 w-4" />
                  <span>Editar Procedimento</span>
                </button>
                
                <button
                  onClick={() => router.push(`/cidadao/dashboard/procedures/${procedure.id}/comments`)}
                  className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <ChatBubbleLeftIcon className="h-4 w-4" />
                  <span>Ver Comentários</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Finish Modal */}
      {showFinishModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Solicitar Finalização</h3>
              <textarea
                value={finishNote}
                onChange={(e) => setFinishNote(e.target.value)}
                placeholder="Adicione uma justificativa para a solicitação de finalização..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
              />
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setShowFinishModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRequestFinish}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Solicitar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
