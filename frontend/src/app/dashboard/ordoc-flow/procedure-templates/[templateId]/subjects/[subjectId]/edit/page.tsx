'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, X, Plus, Trash2 } from 'lucide-react';
import { subjectsService } from '@/services/ordoc-flow/subjects';
import { Subject, FormErrors } from '@/types/ordoc-flow';
import ErrorState from '@/components/ui/ErrorState';

const EditSubjectPage = () => {
  const router = useRouter();
  const params = useParams();
  const templateId = parseInt(params.templateId as string);
  const subjectId = parseInt(params.subjectId as string);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active' as 'active' | 'inactive',
    field_type: 'text' as 'text' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox',
    is_required: false,
    order: 1,
    options: [] as string[],
  });

  const [newOption, setNewOption] = useState('');

  useEffect(() => {
    loadSubject();
  }, [subjectId]);

  const loadSubject = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await subjectsService.getSubject(subjectId);
      if (response.success && response.data) {
        const data = response.data;
        setFormData({
          name: data.name,
          description: data.description || '',
          status: data.status,
          field_type: data.field_type,
          is_required: data.is_required,
          order: data.order,
          options: data.options || [],
        });
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddOption = () => {
    if (newOption.trim()) {
      setFormData(prev => ({
        ...prev,
        options: [...prev.options, newOption.trim()]
      }));
      setNewOption('');
    }
  };

  const handleRemoveOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Descrição deve ter no máximo 500 caracteres';
    }

    if (formData.order < 1) {
      newErrors.order = 'Ordem deve ser maior que 0';
    }

    if (formData.field_type === 'select' && formData.options.length === 0) {
      newErrors.options = 'Adicione pelo menos uma opção para campos de seleção';
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
        ...formData,
        options: formData.field_type === 'select' ? formData.options : undefined,
      };

      const response = await subjectsService.updateSubject(subjectId, submitData);

      if (response.success) {
        router.push(`/dashboard/ordoc-flow/procedure-templates/${templateId}/subjects/${subjectId}`);
      } else {
        setErrors(response.errors || {});
      }
    } catch (error) {
      console.error('Erro ao atualizar subject:', error);
      setErrors({ general: 'Erro interno do servidor. Tente novamente.' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/dashboard/ordoc-flow/procedure-templates/${templateId}/subjects/${subjectId}`);
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
            <h1 className="text-2xl font-bold text-gray-900">Editar Campo</h1>
            <p className="text-gray-600">Atualize as informações do campo do formulário</p>
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
                  Nome do Campo *
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
                  placeholder="Ex: Nome completo, CPF, Data de nascimento"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
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
                  rows={2}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Descrição ou instruções para o campo (opcional)"
                  maxLength={500}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              {/* Field Type */}
              <div>
                <label htmlFor="field_type" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Campo *
                </label>
                <select
                  id="field_type"
                  name="field_type"
                  value={formData.field_type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="text">Texto</option>
                  <option value="number">Número</option>
                  <option value="date">Data</option>
                  <option value="select">Seleção (dropdown)</option>
                  <option value="textarea">Área de Texto</option>
                  <option value="checkbox">Checkbox</option>
                </select>
              </div>

              {/* Options for select type */}
              {formData.field_type === 'select' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Opções *
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newOption}
                        onChange={(e) => setNewOption(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddOption();
                          }
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Digite uma opção e pressione Enter"
                      />
                      <button
                        type="button"
                        onClick={handleAddOption}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Adicionar
                      </button>
                    </div>
                    {formData.options.length > 0 && (
                      <div className="border border-gray-200 rounded-lg p-3 space-y-2">
                        {formData.options.map((option, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm text-gray-900">{option}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveOption(index)}
                              className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {errors.options && (
                      <p className="mt-1 text-sm text-red-600">{errors.options}</p>
                    )}
                  </div>
                </div>
              )}

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
                />
                {errors.order && (
                  <p className="mt-1 text-sm text-red-600">{errors.order}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Define a ordem de exibição do campo no formulário
                </p>
              </div>

              {/* Is Required */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_required"
                  name="is_required"
                  checked={formData.is_required}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="is_required" className="text-sm font-medium text-gray-700">
                  Campo obrigatório
                </label>
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

export default EditSubjectPage;
