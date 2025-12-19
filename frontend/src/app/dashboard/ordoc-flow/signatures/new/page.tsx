'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, X } from 'lucide-react';
import { signaturesService } from '@/services/ordoc-flow/signatures';
import { Signature, FormErrors } from '@/types/ordoc-flow';

const NewSignaturePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const [formData, setFormData] = useState({
    procedure_id: '',
    requester_id: '',
    signable_type: '',
    signable_id: '',
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

    if (!formData.procedure_id) {
      newErrors.procedure_id = 'Procedimento é obrigatório';
    }

    if (!formData.requester_id) {
      newErrors.requester_id = 'Requerente é obrigatório';
    }

    if (!formData.signable_type.trim()) {
      newErrors.signable_type = 'Tipo é obrigatório';
    }

    if (!formData.signable_id) {
      newErrors.signable_id = 'ID do objeto é obrigatório';
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
        procedure_id: parseInt(formData.procedure_id),
        requester_id: parseInt(formData.requester_id),
        signable_type: formData.signable_type,
        signable_id: parseInt(formData.signable_id),
      };

      const response = await signaturesService.createSignature(submitData);
      
      if (response.success) {
        router.push('/dashboard/ordoc-flow/signatures');
      } else {
        setErrors(response.errors || {});
      }
    } catch (error) {
      console.error('Erro ao criar assinatura:', error);
      setErrors({ general: 'Erro interno do servidor. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/ordoc-flow/signatures');
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
            <h1 className="text-2xl font-bold text-gray-900">Nova Assinatura</h1>
            <p className="text-gray-600">Crie uma nova assinatura</p>
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
              Informações da Assinatura
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="procedure_id" className="block text-sm font-medium text-gray-700 mb-1">
                    ID do Procedimento *
                  </label>
                  <input
                    type="number"
                    id="procedure_id"
                    name="procedure_id"
                    value={formData.procedure_id}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.procedure_id ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Digite o ID do procedimento"
                  />
                  {errors.procedure_id && (
                    <p className="mt-1 text-sm text-red-600">{errors.procedure_id}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="requester_id" className="block text-sm font-medium text-gray-700 mb-1">
                    ID do Requerente *
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
                    placeholder="Digite o ID do requerente"
                  />
                  {errors.requester_id && (
                    <p className="mt-1 text-sm text-red-600">{errors.requester_id}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="signable_type" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo do Objeto *
                </label>
                <select
                  id="signable_type"
                  name="signable_type"
                  value={formData.signable_type}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.signable_type ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione o tipo</option>
                  <option value="procedure">Procedimento</option>
                  <option value="task">Tarefa</option>
                  <option value="document">Documento</option>
                </select>
                {errors.signable_type && (
                  <p className="mt-1 text-sm text-red-600">{errors.signable_type}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Tipo do objeto que será assinado
                </p>
              </div>

              <div>
                <label htmlFor="signable_id" className="block text-sm font-medium text-gray-700 mb-1">
                  ID do Objeto *
                </label>
                <input
                  type="number"
                  id="signable_id"
                  name="signable_id"
                  value={formData.signable_id}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.signable_id ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Digite o ID do objeto"
                />
                {errors.signable_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.signable_id}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  ID do objeto específico que será assinado
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
                  Salvar Assinatura
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewSignaturePage;
