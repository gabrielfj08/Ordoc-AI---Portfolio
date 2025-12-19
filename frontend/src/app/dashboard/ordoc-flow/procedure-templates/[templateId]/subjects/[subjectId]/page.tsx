'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Edit,
  Calendar,
  CheckCircle,
  XCircle,
  Trash2,
  MoreVertical,
  ListOrdered,
  FileText,
  AlertCircle
} from 'lucide-react';
import { subjectsService } from '@/services/ordoc-flow/subjects';
import { Subject } from '@/types/ordoc-flow';
import ErrorState from '@/components/ui/ErrorState';

const SubjectDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const templateId = parseInt(params.templateId as string);
  const subjectId = parseInt(params.subjectId as string);

  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    loadSubject();
  }, [subjectId]);

  const loadSubject = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await subjectsService.getSubject(subjectId);
      if (response.success && response.data) {
        setSubject(response.data);
      } else {
        setError(response.message || 'Erro ao carregar campo');
      }
    } catch (error) {
      console.error('Erro ao carregar subject:', error);
      setError('Erro ao carregar detalhes do campo.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!subject) return;

    const response = await subjectsService.toggleSubjectStatus(subject.id);

    if (response.success) {
      loadSubject();
    }
  };

  const handleDelete = async () => {
    if (!subject) return;

    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o campo "${subject.name}"? Esta ação não pode ser desfeita.`
    );

    if (confirmed) {
      const response = await subjectsService.deleteSubject(subject.id);
      if (response.success) {
        router.push(`/dashboard/ordoc-flow/procedure-templates/${templateId}/subjects`);
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

  const getFieldTypeBadge = (type: string) => {
    const typeConfig = {
      text: { color: 'blue', label: 'Texto' },
      number: { color: 'green', label: 'Número' },
      date: { color: 'purple', label: 'Data' },
      select: { color: 'orange', label: 'Seleção' },
      textarea: { color: 'indigo', label: 'Área de Texto' },
      checkbox: { color: 'pink', label: 'Checkbox' },
    };

    const config = typeConfig[type as keyof typeof typeConfig] || { color: 'gray', label: type };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${config.color}-100 text-${config.color}-800`}>
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

  if (error || !subject) {
    return (
      <div className="p-6">
        <ErrorState message={error || 'Campo não encontrado'} />
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
              onClick={() => router.push(`/dashboard/ordoc-flow/procedure-templates/${templateId}/subjects`)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{subject.name}</h1>
              <p className="text-gray-600">Detalhes do campo</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {getStatusBadge(subject.status)}
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
                      router.push(`/dashboard/ordoc-flow/procedure-templates/${templateId}/subjects/${subject.id}/edit`);
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
                    {subject.status === 'active' ? (
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
                <label className="text-sm font-medium text-gray-500">Nome do Campo</label>
                <p className="text-base text-gray-900 mt-1">{subject.name}</p>
              </div>

              {subject.description && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Descrição</label>
                  <p className="text-base text-gray-900 mt-1">{subject.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Tipo de Campo</label>
                  <div className="mt-1">
                    {getFieldTypeBadge(subject.field_type)}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <ListOrdered className="w-4 h-4" />
                    Ordem
                  </label>
                  <p className="text-base text-gray-900 mt-1">{subject.order}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Campo Obrigatório</label>
                  <div className="mt-1">
                    {subject.is_required ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        <AlertCircle className="w-4 h-4" />
                        Sim
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        Não
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(subject.status)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Options (for select fields) */}
          {subject.field_type === 'select' && subject.options && subject.options.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Opções de Seleção
              </h2>
              <div className="space-y-2">
                {subject.options.map((option, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-900">{option}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
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
                <p className="text-sm text-gray-900 mt-1">{subject.id}</p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Template de Procedimento</label>
                <p className="text-sm text-gray-900 mt-1">#{subject.procedure_template_id}</p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Criado em</label>
                <p className="text-sm text-gray-900 mt-1">
                  {new Date(subject.created_at).toLocaleString('pt-BR')}
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Atualizado em</label>
                <p className="text-sm text-gray-900 mt-1">
                  {new Date(subject.updated_at).toLocaleString('pt-BR')}
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
                onClick={() => router.push(`/dashboard/ordoc-flow/procedure-templates/${templateId}/subjects/${subject.id}/edit`)}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
                Editar Campo
              </button>

              <button
                onClick={handleToggleStatus}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {subject.status === 'active' ? (
                  <>
                    <XCircle className="w-4 h-4" />
                    Desativar Campo
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Ativar Campo
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

export default SubjectDetailPage;
