'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { FileText, Plus, X, User } from 'lucide-react';
import { signatureService } from '@/services/signature';
import { CreateSignatureRequestData } from '@/types/ordoc-sign';

interface SignerData {
  name: string;
  email: string;
  order: number;
  require_certificate: boolean;
}

export default function NewSignatureRequestPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Omit<CreateSignatureRequestData, 'signers' | 'document_file'> & { document_file: File | null }>({
    title: '',
    description: '',
    document_file: null,
    template_id: '',
    expires_in_days: 30,
    require_certificate: false,
    allow_decline: true,
    sequential_signing: false
  });

  const [signers, setSigners] = useState<SignerData[]>([
    { name: '', email: '', order: 1, require_certificate: false }
  ]);

  const { data: templatesData } = useQuery({
    queryKey: ['signature-templates'],
    queryFn: () => signatureService.getTemplates({ page: 1, page_size: 100 }),
  });

  const templates = templatesData?.results || [];

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, document_file: file }));
  };

  const addSigner = () => {
    setSigners(prev => [
      ...prev,
      { name: '', email: '', order: prev.length + 1, require_certificate: false }
    ]);
  };

  const removeSigner = (index: number) => {
    if (signers.length > 1) {
      setSigners(prev => prev.filter((_, i) => i !== index).map((signer, i) => ({
        ...signer,
        order: i + 1
      })));
    }
  };

  const updateSigner = (index: number, field: keyof SignerData, value: any) => {
    setSigners(prev => prev.map((signer, i) => 
      i === index ? { ...signer, [field]: value } : signer
    ));
  };

  const validateForm = (): string | null => {
    if (!formData.title.trim()) return 'Título é obrigatório';
    if (!formData.document_file) return 'Documento é obrigatório';
    
    for (let i = 0; i < signers.length; i++) {
      const signer = signers[i];
      if (!signer.name.trim()) return `Nome do signatário ${i + 1} é obrigatório`;
      if (!signer.email.trim()) return `Email do signatário ${i + 1} é obrigatório`;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signer.email)) {
        return `Email do signatário ${i + 1} é inválido`;
      }
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (!formData.document_file) {
        setError('Documento é obrigatório');
        return;
      }

      const requestData: CreateSignatureRequestData = {
        ...formData,
        document_file: formData.document_file,
        signers: signers.map(signer => ({
          full_name: signer.name,
          email: signer.email,
          signing_order: signer.order,
          require_certificate: signer.require_certificate
        }))
      };

      await signatureService.createRequest(requestData);
      router.push('/dashboard/ordoc-sign/requests');
    } catch (error) {
      console.error('Erro ao criar solicitação:', error);
      setError('Erro ao criar solicitação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/ordoc-sign/requests" className="text-gray-500 hover:text-gray-700">
                ← Voltar
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-bold text-gray-900">Nova Solicitação de Assinatura</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="text-red-800">{error}</div>
            </div>
          )}

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Informações da Solicitação</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Digite o título da solicitação"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Descrição opcional da solicitação"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template
                </label>
                <select
                  value={formData.template_id}
                  onChange={(e) => handleInputChange('template_id', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione um template (opcional)</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expira em (dias)
                </label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={formData.expires_in_days}
                  onChange={(e) => handleInputChange('expires_in_days', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Documento *
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Formatos aceitos: PDF, DOC, DOCX
                </p>
              </div>

              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="require_certificate"
                    checked={formData.require_certificate}
                    onChange={(e) => handleInputChange('require_certificate', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="require_certificate" className="ml-2 text-sm text-gray-700">
                    Exigir certificado digital
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allow_decline"
                    checked={formData.allow_decline}
                    onChange={(e) => handleInputChange('allow_decline', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="allow_decline" className="ml-2 text-sm text-gray-700">
                    Permitir recusa de assinatura
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="sequential_signing"
                    checked={formData.sequential_signing}
                    onChange={(e) => handleInputChange('sequential_signing', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="sequential_signing" className="ml-2 text-sm text-gray-700">
                    Assinatura sequencial (por ordem)
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900">Signatários</h2>
              <button
                type="button"
                onClick={addSigner}
                className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Adicionar Signatário
              </button>
            </div>

            <div className="space-y-4">
              {signers.map((signer, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <User className="w-5 h-5 text-gray-400 mr-2" />
                      <h3 className="text-sm font-medium text-gray-900">
                        Signatário {index + 1}
                      </h3>
                    </div>
                    {signers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSigner(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome *
                      </label>
                      <input
                        type="text"
                        value={signer.name}
                        onChange={(e) => updateSigner(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nome completo"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={signer.email}
                        onChange={(e) => updateSigner(index, 'email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="email@exemplo.com"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`signer_cert_${index}`}
                          checked={signer.require_certificate}
                          onChange={(e) => updateSigner(index, 'require_certificate', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`signer_cert_${index}`} className="ml-2 text-sm text-gray-700">
                          Exigir certificado digital para este signatário
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Link
              href="/dashboard/ordoc-sign/requests"
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Criando...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Criar Solicitação
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
