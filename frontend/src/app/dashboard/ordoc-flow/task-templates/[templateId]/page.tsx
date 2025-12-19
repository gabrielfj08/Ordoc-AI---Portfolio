'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Edit,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  Trash2,
  MoreVertical,
  Users,
  ListOrdered
} from 'lucide-react';
import { taskTemplatesService } from '@/services/ordoc-flow/task-templates';
import { TaskTemplate } from '@/types/ordoc-flow';
import ErrorState from '@/components/ui/ErrorState';

const TaskTemplateDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const templateId = parseInt(params.templateId as string);

  const [template, setTemplate] = useState<TaskTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    loadTemplate();
  }, [templateId]);

  const loadTemplate = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskTemplatesService.getTaskTemplate(templateId);
      if (response.success && response.data) {
        setTemplate(response.data);
      } else {
        setError(response.message || 'Erro ao carregar template de tarefa');
      }
    } catch (error) {
      console.error('Erro ao carregar template de tarefa:', error);
      setError('Erro ao carregar detalhes do template de tarefa.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!template) return;

    const response = await taskTemplatesService.toggleTaskTemplateStatus(template.id);

    if (response.success) {
      loadTemplate();
    }
  };

  const handleDelete = async () => {
    if (!template) return;

    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o template de tarefa "${template.name}"? Esta ação não pode ser desfeita.`
    );

    if (confirmed) {
      const response = await taskTemplatesService.deleteTaskTemplate(template.id);
      if (response.success) {
        router.push('/dashboard/ordoc-flow/task-templates');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-4 h-4" />
          Ativo
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
        <XCircle className="w-4 h-4" />
        Inativo
      </span>
    );
  };

  const getAssigneeTypeBadge = (type: string) => {
    const typeConfig = {
      user: { color: 'blue', label: 'Usuário' },
      group: { color: 'purple', label: 'Grupo' },
      role: { color: 'orange', label: 'Função' },
    };

    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.user;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-${config.color}-100 text-${config.color}-800`}>
        {config.label}
      </span>
    );
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

  if (error || !template) {
    return (
      <div className="p-6">
        <ErrorState message={error || 'Template de tarefa não encontrado'} />
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
              onClick={() => router.push('/dashboard/ordoc-flow/task-templates')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{template.name}</h1>
              <p className="text-gray-600">Detalhes do template de tarefa</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {getStatusBadge(template.status)}
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
                      router.push(`/dashboard/ordoc-flow/task-templates/${template.id}/edit`);
                      setShowActions(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      handleToggleStatus();
                      setShowActions(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    {template.status === 'active' ? (
                      <>
                        <XCircle className="w-4 h-4" />
                        Desativar
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Ativar
                      </>
                    )}
                  </button>
                  <hr className="my-1" />
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
                <p className="text-base text-gray-900 mt-1">{template.name}</p>
              </div>

              {template.description && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Descrição</label>
                  <p className="text-base text-gray-900 mt-1">{template.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(template.status)}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <ListOrdered className="w-4 h-4" />
                    Ordem
                  </label>
                  <p className="text-base text-gray-900 mt-1">{template.order}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Assignment Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Informações de Atribuição
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Tipo de Atribuição</label>
                <div className="mt-1">
                  {getAssigneeTypeBadge(template.assignee_type)}
                </div>
              </div>

              {template.assignee_id && (
                <div>
                  <label className="text-sm font-medium text-gray-500">ID do Responsável</label>
                  <p className="text-base text-gray-900 mt-1">#{template.assignee_id}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Metadata */}
        <div className="space-y-6">
          {/* Metadata Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Informações do Sistema
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">ID</label>
                <p className="text-sm text-gray-900 mt-1">{template.id}</p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Template de Procedimento</label>
                <p className="text-sm text-gray-900 mt-1">#{template.procedure_template_id}</p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Criado em</label>
                <p className="text-sm text-gray-900 mt-1">
                  {new Date(template.created_at).toLocaleString('pt-BR')}
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Atualizado em</label>
                <p className="text-sm text-gray-900 mt-1">
                  {new Date(template.updated_at).toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Ações Rápidas
            </h2>
            <div className="space-y-2">
              <button
                onClick={() => router.push(`/dashboard/ordoc-flow/task-templates/${template.id}/edit`)}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
                Editar Template
              </button>

              <button
                onClick={handleToggleStatus}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {template.status === 'active' ? (
                  <>
                    <XCircle className="w-4 h-4" />
                    Desativar Template
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Ativar Template
                  </>
                )}
              </button>
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

export default TaskTemplateDetailPage;
