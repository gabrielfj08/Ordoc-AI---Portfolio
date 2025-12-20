'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Edit,
  Users,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  Trash2,
  UserPlus,
  UserMinus,
  MoreVertical
} from 'lucide-react';
import { groupsService } from '@/services/ordoc-flow/groups';
import { Group } from '@/types/ordoc-flow';
import ErrorState from '@/components/ui/ErrorState';

const GroupDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const groupId = parseInt(params.groupId as string);

  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    loadGroup();
  }, [groupId]);

  const loadGroup = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await groupsService.getGroup(groupId);
      setGroup(data);
    } catch (error) {
      console.error('Erro ao carregar grupo:', error);
      setError('Erro ao carregar detalhes do grupo.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!group) return;

    const newStatus = group.status === 'active' ? 'inactive' : 'active';
    const response = await groupsService.toggleGroupStatus(group.id, newStatus);

    if (response.success) {
      loadGroup();
    }
  };

  const handleDelete = async () => {
    if (!group) return;

    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o grupo "${group.name}"? Esta ação não pode ser desfeita.`
    );

    if (confirmed) {
      const response = await groupsService.deleteGroup(group.id);
      if (response.success) {
        router.push('/dashboard/ordoc-flow/groups');
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

  if (error || !group) {
    return (
      <div className="p-6">
        <ErrorState message={error || 'Grupo não encontrado'} />
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
              onClick={() => router.push('/dashboard/ordoc-flow/groups')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{group.name}</h1>
              <p className="text-gray-600">Detalhes do grupo</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {getStatusBadge(group.status)}
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
                      router.push(`/dashboard/ordoc-flow/groups/${group.id}/edit`);
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
                    {group.status === 'active' ? (
                      <>
                        <UserMinus className="w-4 h-4" />
                        Desativar
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
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
                <p className="text-base text-gray-900 mt-1">{group.name}</p>
              </div>

              {group.description && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Descrição</label>
                  <p className="text-base text-gray-900 mt-1">{group.description}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div className="mt-1">
                  {getStatusBadge(group.status)}
                </div>
              </div>
            </div>
          </div>

          {/* Procedures */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Procedimentos
              </h2>
              <span className="text-2xl font-bold text-blue-600">
                {group.procedures_count || 0}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Total de procedimentos ativos vinculados a este grupo
            </p>
          </div>

          {/* Requesters */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Requerentes
              </h2>
              <span className="text-2xl font-bold text-blue-600">
                {group.requesters_count || 0}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Total de requerentes vinculados a este grupo
            </p>
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
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Procedimentos</span>
                </div>
                <span className="text-lg font-bold text-blue-600">
                  {group.procedures_count || 0}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Requerentes</span>
                </div>
                <span className="text-lg font-bold text-green-600">
                  {group.requesters_count || 0}
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
                <p className="text-sm text-gray-900 mt-1">{group.id}</p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Criado em</label>
                <p className="text-sm text-gray-900 mt-1">
                  {new Date(group.created_at).toLocaleString('pt-BR')}
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Atualizado em</label>
                <p className="text-sm text-gray-900 mt-1">
                  {new Date(group.updated_at).toLocaleString('pt-BR')}
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
                onClick={() => router.push(`/dashboard/ordoc-flow/groups/${group.id}/edit`)}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
                Editar Grupo
              </button>

              <button
                onClick={handleToggleStatus}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {group.status === 'active' ? (
                  <>
                    <UserMinus className="w-4 h-4" />
                    Desativar Grupo
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Ativar Grupo
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

export default GroupDetailPage;
