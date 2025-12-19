'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ClipboardDocumentListIcon,
  PaperClipIcon,
  ChatBubbleLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PlayIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { ExternalTaskService, ExternalTaskDocumentService, ExternalTaskCommentService } from '@/services/ordoc-cidadao';
import type { 
  ShowExternalTaskAPIResponse, 
  IndexExternalTaskDocument, 
  IndexExternalTaskComment,
  CreateExternalTaskCommentPayload 
} from '@/services/ordoc-cidadao';

const statusConfig = {
  pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon },
  in_progress: { label: 'Em Andamento', color: 'bg-blue-100 text-blue-800', icon: PlayIcon },
  completed: { label: 'Concluída', color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
  cancelled: { label: 'Cancelada', color: 'bg-red-100 text-red-800', icon: XCircleIcon },
};

export default function CidadaoTaskDetailPage() {
  const [task, setTask] = useState<ShowExternalTaskAPIResponse | null>(null);
  const [documents, setDocuments] = useState<IndexExternalTaskDocument[]>([]);
  const [comments, setComments] = useState<IndexExternalTaskComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showRefuseModal, setShowRefuseModal] = useState(false);
  const [refuseNote, setRefuseNote] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const router = useRouter();
  const params = useParams();
  const taskId = Number(params.id);

  useEffect(() => {
    loadTaskData();
  }, [taskId]);

  const loadTaskData = async () => {
    try {
      setIsLoading(true);
      const [taskResponse, documentsResponse, commentsResponse] = await Promise.all([
        ExternalTaskService.show('', '', Number(taskId)),
        ExternalTaskDocumentService.index({ taskId }),
        ExternalTaskCommentService.index(taskId),
      ]);
      setTask(taskResponse);
      setDocuments(documentsResponse.data);
      setComments(commentsResponse.data);
    } catch (error) {
      console.error('Erro ao carregar dados da tarefa:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptTask = async () => {
    try {
      await ExternalTaskService.accept('', '', taskId);
      await loadTaskData(); // Reload to get updated status
    } catch (error) {
      console.error('Erro ao aceitar tarefa:', error);
    }
  };

  const handleRefuseTask = async () => {
    try {
      await ExternalTaskService.refuse('', '', taskId);
      setShowRefuseModal(false);
      setRefuseNote('');
      await loadTaskData(); // Reload to get updated status
    } catch (error) {
      console.error('Erro ao recusar tarefa:', error);
    }
  };

  const handleFinishTask = async () => {
    try {
      await ExternalTaskService.finish('', '', taskId, {});
      await loadTaskData(); // Reload to get updated status
    } catch (error) {
      console.error('Erro ao finalizar tarefa:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setIsSubmittingComment(true);
      await ExternalTaskCommentService.create(taskId, { content: newComment });
      setNewComment('');
      await loadTaskData(); // Reload to get updated comments
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const downloadDocument = async (documentId: number, documentName: string) => {
    try {
      const blob = await ExternalTaskDocumentService.download(documentId);
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

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Tarefa não encontrada</h2>
          <button
            onClick={() => router.push('/cidadao/dashboard/tasks')}
            className="text-blue-600 hover:text-blue-500"
          >
            Voltar para tarefas
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = statusConfig[task.status];
  const StatusIcon = statusInfo.icon;
  const overdue = new Date(task.dueDate) < new Date();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/cidadao/dashboard/tasks')}
                className="text-gray-500 hover:text-gray-700"
              >
                ← Voltar
              </button>
              <h1 className="text-xl font-semibold text-gray-900">{task.name}</h1>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusInfo.label}
              </span>
              {overdue && task.status !== 'completed' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Atrasada
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {task.status === 'pending' && (
                <>
                  <button
                    onClick={handleAcceptTask}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    <CheckCircleIcon className="h-4 w-4" />
                    <span>Aceitar</span>
                  </button>
                  <button
                    onClick={() => setShowRefuseModal(true)}
                    className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                  >
                    <XCircleIcon className="h-4 w-4" />
                    <span>Recusar</span>
                  </button>
                </>
              )}
              {task.status === 'in_progress' && (
                <button
                  onClick={handleFinishTask}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <CheckCircleIcon className="h-4 w-4" />
                  <span>Finalizar</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Task Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Detalhes da Tarefa</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Descrição</label>
                  <p className="mt-1 text-sm text-gray-900">{task.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Prazo</label>
                    <p className={`mt-1 text-sm ${overdue ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                      {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Procedimento</label>
                    <p className="mt-1 text-sm text-gray-900">{task.procedure.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Criada por</label>
                    <p className="mt-1 text-sm text-gray-900">{task.createdBy.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Atribuída a</label>
                    <p className="mt-1 text-sm text-gray-900">{task.assignee.name}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Comentários</h3>
              
              {/* Add Comment */}
              <div className="mb-6">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Adicione um comentário..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || isSubmittingComment}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PlusIcon className="h-4 w-4" />
                    <span>{isSubmittingComment ? 'Adicionando...' : 'Adicionar'}</span>
                  </button>
                </div>
              </div>

              {/* Comments List */}
              {comments.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">Nenhum comentário ainda</p>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="border border-gray-200 rounded-md p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">{comment.createdBy.name}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
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

            {/* Task Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informações</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Criada em</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(task.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Última atualização</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(task.updatedAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                {task.groupAssignee && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Grupo</label>
                    <p className="mt-1 text-sm text-gray-900">{task.groupAssignee.name}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Refuse Modal */}
      {showRefuseModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recusar Tarefa</h3>
              <textarea
                value={refuseNote}
                onChange={(e) => setRefuseNote(e.target.value)}
                placeholder="Adicione uma justificativa para a recusa..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                required
              />
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setShowRefuseModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleRefuseTask}
                  disabled={!refuseNote.trim()}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Recusar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
