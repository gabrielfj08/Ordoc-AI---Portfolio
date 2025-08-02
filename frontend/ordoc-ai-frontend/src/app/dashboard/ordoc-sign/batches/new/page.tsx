'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package, X, Plus, Trash2, Upload } from 'lucide-react';
import { signatureService } from '@/services/signature';
import { CreateSignatureBatchData, FormErrors } from '@/types/ordoc-sign';

export default function NewSignatureBatchPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const [formData, setFormData] = useState<Omit<CreateSignatureBatchData, 'requests'> & { 
    requests: Array<{
      title: string;
      document_file?: File;
      signers: Array<{
        email: string;
        full_name: string;
        signing_order: number;
      }>;
    }>;
  }>({
    name: '',
    description: '',
    template_id: '',
    requests: [{
      title: '',
      signers: [{ email: '', full_name: '', signing_order: 1 }]
    }],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRequestChange = (index: number, field: string, value: string) => {
    const newRequests = [...formData.requests];
    newRequests[index] = { ...newRequests[index], [field]: value };
    setFormData(prev => ({ ...prev, requests: newRequests }));
  };

  const handleRequestFileChange = (index: number, file: File) => {
    const newRequests = [...formData.requests];
    newRequests[index] = { ...newRequests[index], document_file: file };
    setFormData(prev => ({ ...prev, requests: newRequests }));
  };

  const handleSignerChange = (requestIndex: number, signerIndex: number, field: string, value: string) => {
    const newRequests = [...formData.requests];
    const newSigners = [...newRequests[requestIndex].signers];
    newSigners[signerIndex] = { ...newSigners[signerIndex], [field]: value };
    newRequests[requestIndex] = { ...newRequests[requestIndex], signers: newSigners };
    setFormData(prev => ({ ...prev, requests: newRequests }));
  };

  const addRequest = () => {
    setFormData(prev => ({
      ...prev,
      requests: [...prev.requests, {
        title: '',
        signers: [{ email: '', full_name: '', signing_order: 1 }]
      }]
    }));
  };

  const removeRequest = (index: number) => {
    if (formData.requests.length > 1) {
      const newRequests = formData.requests.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, requests: newRequests }));
    }
  };

  const addSigner = (requestIndex: number) => {
    const newRequests = [...formData.requests];
    const currentSigners = newRequests[requestIndex].signers;
    newRequests[requestIndex].signers = [...currentSigners, {
      email: '',
      full_name: '',
      signing_order: currentSigners.length + 1
    }];
    setFormData(prev => ({ ...prev, requests: newRequests }));
  };

  const removeSigner = (requestIndex: number, signerIndex: number) => {
    const newRequests = [...formData.requests];
    if (newRequests[requestIndex].signers.length > 1) {
      newRequests[requestIndex].signers = newRequests[requestIndex].signers.filter((_, i) => i !== signerIndex);
      newRequests[requestIndex].signers.forEach((signer, i) => {
        signer.signing_order = i + 1;
      });
      setFormData(prev => ({ ...prev, requests: newRequests }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    formData.requests.forEach((request, requestIndex) => {
      if (!request.title.trim()) {
        newErrors[`request_${requestIndex}_title`] = 'Título é obrigatório';
      }
      
      if (!request.document_file) {
        newErrors[`request_${requestIndex}_document`] = 'Documento é obrigatório';
      }

      request.signers.forEach((signer, signerIndex) => {
        if (!signer.email.trim()) {
          newErrors[`request_${requestIndex}_signer_${signerIndex}_email`] = 'Email é obrigatório';
        } else if (!/\S+@\S+\.\S+/.test(signer.email)) {
          newErrors[`request_${requestIndex}_signer_${signerIndex}_email`] = 'Email inválido';
        }
        
        if (!signer.full_name.trim()) {
          newErrors[`request_${requestIndex}_signer_${signerIndex}_name`] = 'Nome é obrigatório';
        }
      });
    });

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
      const batchData: CreateSignatureBatchData = {
        name: formData.name,
        description: formData.description || undefined,
        template_id: formData.template_id || undefined,
        requests: formData.requests.map(request => ({
          title: request.title,
          document_file: request.document_file!,
          signers: request.signers,
        })),
      };

      await signatureService.createBatch(batchData);
      router.push('/dashboard/ordoc-sign/batches');
    } catch (error: any) {
      console.error('Erro ao criar lote:', error);
      if (error.response?.data?.error) {
        setErrors({ general: error.response.data.error });
      } else {
        setErrors({ general: 'Erro interno do servidor. Tente novamente.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/ordoc-sign/batches');
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
            <h1 className="text-2xl font-bold text-gray-900">Novo Lote de Assinaturas</h1>
            <p className="text-gray-600">Crie um lote para processar múltiplas solicitações</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{errors.general}</p>
            </div>
          )}

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Informações do Lote
            </h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Lote *
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
                  placeholder="Digite o nome do lote"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Digite uma descrição (opcional)"
                />
              </div>

              <div>
                <label htmlFor="template_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Template ID
                </label>
                <input
                  type="text"
                  id="template_id"
                  name="template_id"
                  value={formData.template_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ID do template (opcional)"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Solicitações ({formData.requests.length})
              </h2>
              <button
                type="button"
                onClick={addRequest}
                className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Adicionar Solicitação
              </button>
            </div>
            
            <div className="space-y-6">
              {formData.requests.map((request, requestIndex) => (
                <div key={requestIndex} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-md font-medium text-gray-900">
                      Solicitação {requestIndex + 1}
                    </h3>
                    {formData.requests.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRequest(requestIndex)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Título *
                      </label>
                      <input
                        type="text"
                        value={request.title}
                        onChange={(e) => handleRequestChange(requestIndex, 'title', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors[`request_${requestIndex}_title`] ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Título da solicitação"
                      />
                      {errors[`request_${requestIndex}_title`] && (
                        <p className="mt-1 text-sm text-red-600">{errors[`request_${requestIndex}_title`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Documento *
                      </label>
                      <div className={`relative border-2 border-dashed rounded-lg p-4 text-center ${
                        errors[`request_${requestIndex}_document`] 
                          ? 'border-red-300 bg-red-50' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => e.target.files?.[0] && handleRequestFileChange(requestIndex, e.target.files[0])}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        {request.document_file ? (
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {request.document_file.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {(request.document_file.size / 1024 / 1024).toFixed(1)} MB
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-600">
                            Clique para selecionar documento
                          </p>
                        )}
                      </div>
                      {errors[`request_${requestIndex}_document`] && (
                        <p className="mt-1 text-sm text-red-600">{errors[`request_${requestIndex}_document`]}</p>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-gray-900">
                          Assinantes
                        </h4>
                        <button
                          type="button"
                          onClick={() => addSigner(requestIndex)}
                          className="flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Adicionar
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        {request.signers.map((signer, signerIndex) => (
                          <div key={signerIndex} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1 grid grid-cols-2 gap-3">
                              <div>
                                <input
                                  type="text"
                                  value={signer.full_name}
                                  onChange={(e) => handleSignerChange(requestIndex, signerIndex, 'full_name', e.target.value)}
                                  className={`w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent ${
                                    errors[`request_${requestIndex}_signer_${signerIndex}_name`] ? 'border-red-300' : 'border-gray-300'
                                  }`}
                                  placeholder="Nome completo"
                                />
                                {errors[`request_${requestIndex}_signer_${signerIndex}_name`] && (
                                  <p className="mt-1 text-xs text-red-600">{errors[`request_${requestIndex}_signer_${signerIndex}_name`]}</p>
                                )}
                              </div>
                              <div>
                                <input
                                  type="email"
                                  value={signer.email}
                                  onChange={(e) => handleSignerChange(requestIndex, signerIndex, 'email', e.target.value)}
                                  className={`w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent ${
                                    errors[`request_${requestIndex}_signer_${signerIndex}_email`] ? 'border-red-300' : 'border-gray-300'
                                  }`}
                                  placeholder="email@exemplo.com"
                                />
                                {errors[`request_${requestIndex}_signer_${signerIndex}_email`] && (
                                  <p className="mt-1 text-xs text-red-600">{errors[`request_${requestIndex}_signer_${signerIndex}_email`]}</p>
                                )}
                              </div>
                            </div>
                            {request.signers.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeSigner(requestIndex, signerIndex)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
                  Criando...
                </>
              ) : (
                <>
                  <Package className="w-4 h-4" />
                  Criar Lote
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
