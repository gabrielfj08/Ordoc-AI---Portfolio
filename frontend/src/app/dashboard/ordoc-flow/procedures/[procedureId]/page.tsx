'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  MoreVertical,
  Users,
  ListTodo,
  AlertCircle
} from 'lucide-react';
import { proceduresService } from '@/services/ordoc-flow/procedures';
import { Procedure } from '@/types/ordoc-flow';
import ErrorState from '@/components/ui/ErrorState';

const ProcedureDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const procedureId = parseInt(params.procedureId as string);

  const [procedure, setProcedure] = useState<Procedure | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    loadProcedure();
  }, [procedureId]);

  const loadProcedure = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await proceduresService.getProcedure(procedureId);
      if (response.success && response.data) {
        setProcedure(response.data);
      } else {
        setError(response.message || 'Erro ao carregar procedimento');
      }
    } catch (error) {
      console.error('Erro ao carregar procedimento:', error);
      setError('Erro ao carregar detalhes do procedimento.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!procedure) return;

    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o procedimento "${procedure.name}"? Esta ação não pode ser desfeita.`
    );

    if (confirmed) {
      const response = await proceduresService.deleteProcedure(procedure.id);
      if (response.success) {
        router.push('/dashboard/ordoc-flow/procedures');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { icon: Clock, color: 'gray', label: 'Rascunho' },
      active: { icon: CheckCircle, color: 'blue', label: 'Ativo' },
      completed: { icon: CheckCircle, color: 'green', label: 'Concluído' },
      cancelled: { icon: XCircle, color: 'red', label: 'Cancelado' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-${config.color}-100 text-${config.color}-800`}>
        <Icon className="w-4 h-4" />
        {config.label}
      </span>
    );
  };

  const getProgressPercentage = () => {
    if (!procedure || !procedure.tasks_count) return 0;
    return Math.round(((procedure.completed_tasks_count || 0) / procedure.tasks_count) * 100);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !procedure) {
    return (
      <div className="p-6">
        <ErrorState message={error || 'Procedimento não encontrado'} />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard/ordoc-flow/procedures')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{procedure.name}</h1>
              <p className="text-gray-600">Detalhes do procedimento</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {getStatusBadge(procedure.status)}
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>

              {showActions && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => {
                      handleDelete();
                      setShowActions(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Excluir
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Informações Básicas
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Nome</label>
                <p className="text-base text-gray-900 mt-1">{procedure.name}</p>
              </div>

              {procedure.description && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Descrição</label>
                  <p className="text-base text-gray-900 mt-1">{procedure.description}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div className="mt-1">
                  {getStatusBadge(procedure.status)}
                </div>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <ListTodo className="w-5 h-5" />
                Progresso das Tarefas
              </h2>
              <span className="text-2xl font-bold text-blue-600">
                {getProgressPercentage()}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Tarefas Totais</p>
                <p className="text-2xl font-bold text-gray-900">{procedure.tasks_count || 0}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600">Concluídas</p>
                <p className="text-2xl font-bold text-green-600">{procedure.completed_tasks_count || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Metadata */}
        <div className="space-y-6">
          {/* Statistics Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Estatísticas
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <ListTodo className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Tarefas</span>
                </div>
                <span className="text-lg font-bold text-blue-600">
                  {procedure.tasks_count || 0}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Concluídas</span>
                </div>
                <span className="text-lg font-bold text-green-600">
                  {procedure.completed_tasks_count || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Metadata Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Informações do Sistema
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">ID</label>
                <p className="text-sm text-gray-900 mt-1">{procedure.id}</p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Template</label>
                <p className="text-sm text-gray-900 mt-1">#{procedure.procedure_template_id}</p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Requerente</label>
                <p className="text-sm text-gray-900 mt-1">#{procedure.requester_id}</p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Criado em</label>
                <p className="text-sm text-gray-900 mt-1">
                  {new Date(procedure.created_at).toLocaleString('pt-BR')}
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Atualizado em</label>
                <p className="text-sm text-gray-900 mt-1">
                  {new Date(procedure.updated_at).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close actions menu */}
      {showActions && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowActions(false)}
        />
      )}
    </div>
  );
};

export default ProcedureDetailPage;
