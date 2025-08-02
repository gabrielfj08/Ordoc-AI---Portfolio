'use client';

import React, { useState } from 'react';
import { formatDate } from '@/lib/utils';
import { ReportSchedule, reportsService } from '@/services/reports';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface SchedulesListProps {
  schedules: {
    results?: ReportSchedule[];
    count?: number;
  } | ReportSchedule[];
  onRefresh: () => void;
}

const getStatusBadge = (status: string) => {
  const statusConfig = {
    active: { label: 'Ativo', color: 'bg-green-100 text-green-800' },
    paused: { label: 'Pausado', color: 'bg-yellow-100 text-yellow-800' },
    inactive: { label: 'Inativo', color: 'bg-gray-100 text-gray-800' },
  };
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
};

const getFrequencyBadge = (frequency: string) => {
  const frequencyConfig = {
    daily: { label: 'Diário', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    weekly: { label: 'Semanal', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    monthly: { label: 'Mensal', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    custom: { label: 'Personalizado', color: 'bg-gray-50 text-gray-700 border-gray-200' },
  };
  
  const config = frequencyConfig[frequency as keyof typeof frequencyConfig] || 
    { label: frequency.toUpperCase(), color: 'bg-gray-50 text-gray-700 border-gray-200' };
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${config.color}`}>
      {config.label}
    </span>
  );
};

export default function SchedulesList({ schedules, onRefresh }: SchedulesListProps) {
  const [selectedSchedules, setSelectedSchedules] = useState<string[]>([]);
  const queryClient = useQueryClient();
  
  // Normalizar dados - pode vir como array direto ou objeto com results
  const schedulesList = Array.isArray(schedules) ? schedules : (schedules?.results || []);
  const totalCount = Array.isArray(schedules) ? schedules.length : (schedules?.count || 0);

  // Mutations para operações CRUD
  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'active' | 'paused' | 'inactive' }) =>
      reportsService.toggleScheduleStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports-schedules'] });
      onRefresh();
    },
    onError: (error) => {
      console.error('Erro ao alterar status:', error);
      alert('Erro ao alterar status do agendamento');
    }
  });

  const deleteScheduleMutation = useMutation({
    mutationFn: (id: string) => reportsService.deleteSchedule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports-schedules'] });
      onRefresh();
    },
    onError: (error) => {
      console.error('Erro ao excluir agendamento:', error);
      alert('Erro ao excluir agendamento');
    }
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: ({ ids, data }: { ids: string[]; data: any }) =>
      reportsService.bulkUpdateSchedules(ids, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports-schedules'] });
      setSelectedSchedules([]);
      onRefresh();
    },
    onError: (error) => {
      console.error('Erro na operação em lote:', error);
      alert('Erro na operação em lote');
    }
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSchedules(schedulesList.map(schedule => schedule.id));
    } else {
      setSelectedSchedules([]);
    }
  };

  const handleSelectSchedule = (scheduleId: string, checked: boolean) => {
    if (checked) {
      setSelectedSchedules(prev => [...prev, scheduleId]);
    } else {
      setSelectedSchedules(prev => prev.filter(id => id !== scheduleId));
    }
  };

  const handleToggleStatus = async (scheduleId: string, currentStatus: 'active' | 'paused' | 'inactive') => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    toggleStatusMutation.mutate({ id: scheduleId, status: newStatus });
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (confirm('Tem certeza que deseja excluir este agendamento?')) {
      deleteScheduleMutation.mutate(scheduleId);
    }
  };

  const handleBulkAction = async (action: 'activate' | 'pause' | 'delete') => {
    if (selectedSchedules.length === 0) {
      alert('Selecione pelo menos um agendamento');
      return;
    }

    let confirmMessage = '';
    let updateData = {};

    switch (action) {
      case 'activate':
        confirmMessage = `Ativar ${selectedSchedules.length} agendamento(s)?`;
        updateData = { status: 'active' };
        break;
      case 'pause':
        confirmMessage = `Pausar ${selectedSchedules.length} agendamento(s)?`;
        updateData = { status: 'paused' };
        break;
      case 'delete':
        confirmMessage = `Excluir ${selectedSchedules.length} agendamento(s)?`;
        // Para delete, vamos fazer chamadas individuais
        if (confirm(confirmMessage)) {
          for (const id of selectedSchedules) {
            await reportsService.deleteSchedule(id);
          }
          queryClient.invalidateQueries({ queryKey: ['reports-schedules'] });
          setSelectedSchedules([]);
          onRefresh();
        }
        return;
    }

    if (confirm(confirmMessage)) {
      bulkUpdateMutation.mutate({ ids: selectedSchedules, data: updateData });
    }
  };

  const handleEdit = (schedule: ReportSchedule) => {
    // TODO: Navegar para página de edição
    window.location.href = `/dashboard/ordoc-reports/schedules/${schedule.id}/edit`;
  };

  if (schedulesList.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum agendamento encontrado</h3>
        <p className="text-gray-600 mb-4">Você ainda não criou nenhum agendamento de relatório.</p>
        <a
          href="/dashboard/ordoc-reports/schedules/create"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Criar primeiro agendamento
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com ações em lote */}
      {selectedSchedules.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900">
                {selectedSchedules.length} agendamento{selectedSchedules.length !== 1 ? 's' : ''} selecionado{selectedSchedules.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleBulkAction('activate')}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-green-700 bg-white border border-green-300 rounded-md hover:bg-green-50"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-5-8V3a1 1 0 011-1h1a1 1 0 011 1v3M8 21h8a2 2 0 002-2V7a2 2 0 00-2-2H8a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Ativar
              </button>
              <button
                onClick={() => handleBulkAction('pause')}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-yellow-700 bg-white border border-yellow-300 rounded-md hover:bg-yellow-50"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Pausar
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabela de agendamentos */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedSchedules.length === schedulesList.length && schedulesList.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agendamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Frequência
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Próxima Execução
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Template
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {schedulesList.map((schedule) => (
                <tr key={schedule.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedSchedules.includes(schedule.id)}
                      onChange={(e) => handleSelectSchedule(schedule.id, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{schedule.name}</div>
                      {schedule.description && (
                        <div className="text-sm text-gray-500">{schedule.description}</div>
                      )}
                      <div className="text-xs text-gray-400 mt-1">
                        Frequência: {schedule.frequency}
                        <span className="ml-2">• ID: {schedule.created_by_id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(schedule.status)}
                  </td>
                  <td className="px-6 py-4">
                    {getFrequencyBadge(schedule.frequency)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {schedule.next_run ? (
                      <div>
                        <div>{formatDate(new Date(schedule.next_run))}</div>
                        {schedule.last_run && (
                          <div className="text-xs text-gray-500 mt-1">
                            Última: {formatDate(new Date(schedule.last_run))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {schedule.template_name || 'Template não encontrado'}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleToggleStatus(schedule.id, schedule.status)}
                        className={`text-sm px-2 py-1 rounded ${
                          schedule.status === 'active' 
                            ? 'text-yellow-600 hover:text-yellow-900' 
                            : 'text-green-600 hover:text-green-900'
                        }`}
                        title={schedule.status === 'active' ? 'Pausar' : 'Ativar'}
                      >
                        {schedule.status === 'active' ? 'Pausar' : 'Ativar'}
                      </button>
                      <button
                        onClick={() => handleEdit(schedule)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Editar"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteSchedule(schedule.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Excluir"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer com informações */}
      <div className="text-sm text-gray-600 text-center">
        {totalCount > 0 && (
          <span>
            Mostrando <span className="font-medium">{schedulesList.length}</span> de{' '}
            <span className="font-medium">{totalCount}</span> agendamento{totalCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  );
}
