'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, X } from 'lucide-react';
import { taskTemplatesService } from '@/services/ordoc-flow/task-templates';
import { TaskTemplate, FormErrors } from '@/types/ordoc-flow';
import ErrorState from '@/components/ui/ErrorState';

const EditTaskTemplatePage = () => {
  const router = useRouter();
  const params = useParams();
  const templateId = parseInt(params.templateId as string);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active' as 'active' | 'inactive',
    order: 1,
    assignee_type: 'user' as 'user' | 'group' | 'role',
    assignee_id: '',
  });

  useEffect(() => {
    loadTemplate();
  }, [templateId]);

  const loadTemplate = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskTemplatesService.getTaskTemplate(templateId);
      if (response.success && response.data) {
        const data = response.data;
        setFormData({
          name: data.name,
          description: data.description || '',
          status: data.status,
          order: data.order,
          assignee_type: data.assignee_type,
          assignee_id: data.assignee_id?.toString() || '',
        });
      } else {
        setError(response.message || 'Erro ao carregar template');
      }
    } catch (error) {
      console.error('Erro ao carregar template de tarefa:', error);
      setError('Erro ao carregar detalhes do template de tarefa.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    } else if (formData.name.length > 255) {
      newErrors.name = 'Nome deve ter no máximo 255 caracteres';
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Descrição deve ter no máximo 1000 caracteres';
    }

    if (formData.order < 1) {
      newErrors.order = 'Ordem deve ser maior que 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      const submitData = {
        name: formData.name,
        description: formData.description,
        status: formData.status,
        order: formData.order,
        assignee_type: formData.assignee_type,
        assignee_id: formData.assignee_id ? parseInt(formData.assignee_id) : undefined,
      };

      const response = await taskTemplatesService.updateTaskTemplate(templateId, submitData);

      if (response.success) {
        router.push(`/dashboard/ordoc-flow/task-templates/${templateId}`);
      } else {
        setErrors(response.errors || {});
      }
    } catch (error) {
      console.error('Erro ao atualizar template de tarefa:', error);
      setErrors({ general: 'Erro interno do servidor. Tente novamente.' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/dashboard/ordoc-flow/task-templates/${templateId}`);
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

  if (error) {
    return (
      <div className="p-6">
        <ErrorState message={error} />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Editar Template de Tarefa</h1>
            <p className="text-gray-600">Atualize as informações do template de tarefa</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Error */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{errors.general}</p>
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Informações Básicas
            </h2>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Digite o nome do template de tarefa"
                  maxLength={255}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  {formData.name.length}/255 caracteres
                </p>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Digite uma descrição para o template de tarefa (opcional)"
                  maxLength={1000}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  {formData.description.length}/1000 caracteres
                </p>
              </div>

              {/* Order */}
              <div>
                <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">
                  Ordem *
                </label>
                <input
                  type="number"
                  id="order"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  min="1"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.order ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Digite a ordem de execução"
                />
                {errors.order && (
                  <p className="mt-1 text-sm text-red-600">{errors.order}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Define a ordem de execução desta tarefa no procedimento
                </p>
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  Templates ativos serão incluídos em novos procedimentos
                </p>
              </div>
            </div>
          </div>

          {/* Assignment Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Informações de Atribuição
            </h2>

            <div className="space-y-4">
              {/* Assignee Type */}
              <div>
                <label htmlFor="assignee_type" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Atribuição *
                </label>
                <select
                  id="assignee_type"
                  name="assignee_type"
                  value={formData.assignee_type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="user">Usuário</option>
                  <option value="group">Grupo</option>
                  <option value="role">Função</option>
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  Define o tipo de responsável pela tarefa
                </p>
              </div>

              {/* Assignee ID */}
              <div>
                <label htmlFor="assignee_id" className="block text-sm font-medium text-gray-700 mb-1">
                  ID do Responsável
                </label>
                <input
                  type="number"
                  id="assignee_id"
                  name="assignee_id"
                  value={formData.assignee_id}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Digite o ID do responsável (opcional)"
                />
                <p className="mt-1 text-sm text-gray-500">
                  ID do {formData.assignee_type === 'user' ? 'usuário' : formData.assignee_type === 'group' ? 'grupo' : 'função'} responsável pela tarefa
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskTemplatePage;
