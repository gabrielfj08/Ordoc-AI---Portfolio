'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, X } from 'lucide-react';
import { proceduresService } from '@/services/ordoc-flow/procedures';
import { Procedure, FormErrors } from '@/types/ordoc-flow';

const NewProcedurePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'draft' as 'draft' | 'active' | 'completed' | 'cancelled',
    procedure_template_id: '',
    requester_id: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
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
    } else if (formData.name.length > 100) {
      newErrors.name = 'Nome deve ter no máximo 100 caracteres';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Descrição deve ter no máximo 500 caracteres';
    }

    if (!formData.procedure_template_id) {
      newErrors.procedure_template_id = 'Template de procedimento é obrigatório';
    }

    if (!formData.requester_id) {
      newErrors.requester_id = 'Requerente é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const submitData = {
        name: formData.name,
        description: formData.description,
        status: formData.status,
        procedure_template_id: parseInt(formData.procedure_template_id),
        requester_id: parseInt(formData.requester_id),
      };

      const response = await proceduresService.createProcedure(submitData);
      
      if (response.success) {
        router.push('/dashboard/ordoc-flow/procedures');
      } else {
        setErrors(response.errors || {});
      }
    } catch (error) {
      console.error('Erro ao criar procedimento:', error);
      setErrors({ general: 'Erro interno do servidor. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/ordoc-flow/procedures');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Novo Procedimento</h1>
            <p className="text-gray-600">Crie um novo procedimento</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{errors.general}</p>
            </div>
          )}

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Informações Básicas
            </h2>
            
            <div className="space-y-4">
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
                  placeholder="Digite o nome do procedimento"
                  maxLength={100}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  {formData.name.length}/100 caracteres
                </p>
              </div>

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
                  placeholder="Digite uma descrição para o procedimento (opcional)"
                  maxLength={500}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  {formData.description.length}/500 caracteres
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="procedure_template_id" className="block text-sm font-medium text-gray-700 mb-1">
                    Template de Procedimento *
                  </label>
                  <input
                    type="number"
                    id="procedure_template_id"
                    name="procedure_template_id"
                    value={formData.procedure_template_id}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.procedure_template_id ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="ID do template"
                  />
                  {errors.procedure_template_id && (
                    <p className="mt-1 text-sm text-red-600">{errors.procedure_template_id}</p>
                  )}
                  <p className="mt-1 text-sm text-gray-500">
                    Template base para este procedimento
                  </p>
                </div>

                <div>
                  <label htmlFor="requester_id" className="block text-sm font-medium text-gray-700 mb-1">
                    Requerente *
                  </label>
                  <input
                    type="number"
                    id="requester_id"
                    name="requester_id"
                    value={formData.requester_id}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.requester_id ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="ID do requerente"
                  />
                  {errors.requester_id && (
                    <p className="mt-1 text-sm text-red-600">{errors.requester_id}</p>
                  )}
                  <p className="mt-1 text-sm text-gray-500">
                    Pessoa responsável pela solicitação
                  </p>
                </div>
              </div>

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
                  <option value="draft">Rascunho</option>
                  <option value="active">Ativo</option>
                  <option value="completed">Concluído</option>
                  <option value="cancelled">Cancelado</option>
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  Status atual do procedimento
                </p>
              </div>
            </div>
          </div>

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
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Salvar Procedimento
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProcedurePage;
