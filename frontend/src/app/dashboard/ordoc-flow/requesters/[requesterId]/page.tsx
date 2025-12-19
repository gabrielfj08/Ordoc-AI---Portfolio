'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  Trash2,
  UserPlus,
  UserMinus,
  MoreVertical,
  CreditCard,
  Users
} from 'lucide-react';
import { requestersService } from '@/services/ordoc-flow/requesters';
import { Requester } from '@/types/ordoc-flow';
import ErrorState from '@/components/ui/ErrorState';

const RequesterDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const requesterId = parseInt(params.requesterId as string);

  const [requester, setRequester] = useState<Requester | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    loadRequester();
  }, [requesterId]);

  const loadRequester = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await requestersService.getRequester(requesterId);
      if (response.success && response.data) {
        setRequester(response.data);
      } else {
        setError(response.message || 'Erro ao carregar requerente');
      }
    } catch (error) {
      console.error('Erro ao carregar requerente:', error);
      setError('Erro ao carregar detalhes do requerente.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!requester) return;

    const response = await requestersService.toggleRequesterStatus(requester.id);

    if (response.success) {
      loadRequester();
    }
  };

  const handleDelete = async () => {
    if (!requester) return;

    const confirmed = window.confirm(
      `Tem certeza que deseja excluir o requerente "${requester.name}"? Esta ação não pode ser desfeita.`
    );

    if (confirmed) {
      const response = await requestersService.deleteRequester(requester.id);
      if (response.success) {
        router.push('/dashboard/ordoc-flow/requesters');
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

  const getTypeBadge = (type: string) => {
    if (type === 'internal') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          Interno
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
        Externo
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

  if (error || !requester) {
    return (
      <div className="p-6">
        <ErrorState message={error || 'Requerente não encontrado'} />
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
              onClick={() => router.push('/dashboard/ordoc-flow/requesters')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{requester.name}</h1>
              <p className="text-gray-600">Detalhes do requerente</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {getStatusBadge(requester.status)}
            {getTypeBadge(requester.type)}
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
                      router.push(`/dashboard/ordoc-flow/requesters/${requester.id}/edit`);
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
                    {requester.status === 'active' ? (
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
                <p className="text-base text-gray-900 mt-1">{requester.name}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    E-mail
                  </label>
                  <p className="text-base text-gray-900 mt-1">{requester.email}</p>
                </div>

                {requester.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Telefone
                    </label>
                    <p className="text-base text-gray-900 mt-1">{requester.phone}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Documento
                </label>
                <p className="text-base text-gray-900 mt-1">{requester.document}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Tipo</label>
                  <div className="mt-1">
                    {getTypeBadge(requester.type)}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(requester.status)}
                  </div>
                </div>
              </div>
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
                <p className="text-sm text-gray-900 mt-1">{requester.id}</p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Criado em</label>
                <p className="text-sm text-gray-900 mt-1">
                  {new Date(requester.created_at).toLocaleString('pt-BR')}
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Atualizado em</label>
                <p className="text-sm text-gray-900 mt-1">
                  {new Date(requester.updated_at).toLocaleString('pt-BR')}
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
                onClick={() => router.push(`/dashboard/ordoc-flow/requesters/${requester.id}/edit`)}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
                Editar Requerente
              </button>

              <button
                onClick={handleToggleStatus}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {requester.status === 'active' ? (
                  <>
                    <UserMinus className="w-4 h-4" />
                    Desativar Requerente
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Ativar Requerente
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

export default RequesterDetailPage;
