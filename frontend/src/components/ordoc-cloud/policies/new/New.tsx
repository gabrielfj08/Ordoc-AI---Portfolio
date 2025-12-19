'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { NewPolicyProps, NewPolicyFormValues, PolicyService, PolicyEffect, ServiceOption, EffectOption } from './types';

const NewPolicy = ({ onSubmit }: NewPolicyProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  
  const [formData, setFormData] = React.useState<NewPolicyFormValues>({
    name: '',
    description: '',
    service: '' as PolicyService,
    effect: '' as PolicyEffect,
    actionIds: [],
    resource: [''],
  });

  const serviceOptions: ServiceOption[] = [
    {
      id: 'ordoc_air',
      name: 'OrdocAir',
      description: 'Gestão de documentos e arquivos',
      icon: '📁',
    },
    {
      id: 'ordoc_flow',
      name: 'OrdocFlow',
      description: 'Workflow e processos empresariais',
      icon: '🔄',
    },
    {
      id: 'ordoc_sign',
      name: 'OrdocSign',
      description: 'Assinatura digital de documentos',
      icon: '✍️',
    },
    {
      id: 'ordoc_reports',
      name: 'OrdocReports',
      description: 'Relatórios e analytics',
      icon: '📊',
    },
    {
      id: 'ordoc_cloud',
      name: 'OrdocCloud',
      description: 'Configurações e administração',
      icon: '⚙️',
    },
  ];

  const effectOptions: EffectOption[] = [
    {
      id: 'allow',
      name: 'Permitir',
      description: 'Concede acesso aos recursos especificados',
      color: 'green',
    },
    {
      id: 'deny',
      name: 'Negar',
      description: 'Nega acesso aos recursos especificados',
      color: 'red',
    },
  ];

  const actionOptions = React.useMemo(() => {
    const actions: Record<PolicyService, Array<{ id: string; name: string; description: string }>> = {
      ordoc_air: [
        { id: 'read', name: 'Visualizar', description: 'Visualizar documentos e pastas' },
        { id: 'write', name: 'Editar', description: 'Criar e editar documentos' },
        { id: 'delete', name: 'Excluir', description: 'Excluir documentos e pastas' },
        { id: 'share', name: 'Compartilhar', description: 'Compartilhar documentos' },
      ],
      ordoc_flow: [
        { id: 'read', name: 'Visualizar', description: 'Visualizar processos e workflows' },
        { id: 'write', name: 'Editar', description: 'Criar e editar processos' },
        { id: 'approve', name: 'Aprovar', description: 'Aprovar solicitações' },
        { id: 'manage', name: 'Gerenciar', description: 'Gerenciar workflows' },
      ],
      ordoc_sign: [
        { id: 'read', name: 'Visualizar', description: 'Visualizar documentos para assinatura' },
        { id: 'sign', name: 'Assinar', description: 'Assinar documentos digitalmente' },
        { id: 'manage', name: 'Gerenciar', description: 'Gerenciar certificados e assinaturas' },
      ],
      ordoc_reports: [
        { id: 'read', name: 'Visualizar', description: 'Visualizar relatórios' },
        { id: 'create', name: 'Criar', description: 'Criar novos relatórios' },
        { id: 'export', name: 'Exportar', description: 'Exportar relatórios' },
      ],
      ordoc_cloud: [
        { id: 'read', name: 'Visualizar', description: 'Visualizar configurações' },
        { id: 'write', name: 'Editar', description: 'Editar configurações' },
        { id: 'manage_users', name: 'Gerenciar Usuários', description: 'Gerenciar usuários e permissões' },
        { id: 'manage_org', name: 'Gerenciar Organização', description: 'Gerenciar configurações da organização' },
      ],
    };
    
    return formData.service ? actions[formData.service] || [] : [];
  }, [formData.service]);

  const handleInputChange = (field: keyof NewPolicyFormValues, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleResourceChange = (index: number, value: string) => {
    const newResource = [...formData.resource];
    newResource[index] = value;
    setFormData(prev => ({ ...prev, resource: newResource }));
  };

  const addResource = () => {
    setFormData(prev => ({
      ...prev,
      resource: [...prev.resource, '']
    }));
  };

  const removeResource = (index: number) => {
    if (formData.resource.length > 1) {
      const newResource = formData.resource.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, resource: newResource }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Campo obrigatório';
    } else if (formData.name.includes('*')) {
      newErrors.name = 'Nome não pode conter "*"';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Campo obrigatório';
    }

    if (!formData.service) {
      newErrors.service = 'Campo obrigatório';
    }

    if (!formData.effect) {
      newErrors.effect = 'Escolha uma das opções';
    }

    if (formData.actionIds.length === 0) {
      newErrors.actionIds = 'Selecione ao menos uma opção';
    }

    if (formData.resource.length === 0 || formData.resource.every(r => !r.trim())) {
      newErrors.resource = 'Preencha ao menos uma opção';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await onSubmit(formData);
      
      // Success feedback and redirect
      router.push(`/dashboard/policies/${response.id}`);
    } catch (error: any) {
      console.error('Error creating policy:', error);
      setErrors({ submit: error.message || 'Erro ao criar política' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Nova Política de Acesso</h1>
          <p className="text-gray-600 mt-2">
            Crie uma nova política para controlar o acesso aos recursos do sistema.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Policy Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Política *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite o nome da política"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">*{errors.name}</p>
            )}
          </div>

          {/* Policy Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descreva o propósito desta política"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">*{errors.description}</p>
            )}
          </div>

          {/* Service Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aplicativo *
            </label>
            <p className="text-sm text-gray-600 mb-3">
              Escolha a qual aplicativo esta política se aplica:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {serviceOptions.map((option) => (
                <label
                  key={option.id}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.service === option.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="service"
                    value={option.id}
                    checked={formData.service === option.id}
                    onChange={(e) => handleInputChange('service', e.target.value as PolicyService)}
                    className="sr-only"
                  />
                  <span className="text-2xl mr-3">{option.icon}</span>
                  <div>
                    <div className="font-medium text-gray-900">{option.name}</div>
                    <div className="text-sm text-gray-600">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
            {errors.service && (
              <p className="text-red-500 text-sm mt-1">*{errors.service}</p>
            )}
          </div>

          {/* Effect Selection */}
          {formData.service && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Efeito *
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Escolha o efeito desejado:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {effectOptions.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.effect === option.id
                        ? `border-${option.color}-500 bg-${option.color}-50`
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="effect"
                      value={option.id}
                      checked={formData.effect === option.id}
                      onChange={(e) => handleInputChange('effect', e.target.value as PolicyEffect)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full mr-3 ${
                      option.color === 'green' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <div className="font-medium text-gray-900">{option.name}</div>
                      <div className="text-sm text-gray-600">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.effect && (
                <p className="text-red-500 text-sm mt-1">*{errors.effect}</p>
              )}
            </div>
          )}

          {/* Actions Selection */}
          {formData.effect && actionOptions.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ações *
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Escolha a(s) ação(ões) desejadas:
              </p>
              <div className="space-y-2">
                {actionOptions.map((action) => (
                  <label
                    key={action.id}
                    className="flex items-center p-3 border border-gray-300 rounded-lg hover:border-gray-400 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.actionIds.includes(action.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleInputChange('actionIds', [...formData.actionIds, action.id]);
                        } else {
                          handleInputChange('actionIds', formData.actionIds.filter(id => id !== action.id));
                        }
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">{action.name}</div>
                      <div className="text-sm text-gray-600">{action.description}</div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.actionIds && (
                <p className="text-red-500 text-sm mt-1">*{errors.actionIds}</p>
              )}
            </div>
          )}

          {/* Resources */}
          {formData.actionIds.length > 0 && formData.service && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recursos *
              </label>
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Instruções:</p>
                <p className="text-sm text-gray-600 mb-2">
                  Para criar a política você deve seguir os exemplos abaixo:
                </p>
                <div className="space-y-1 text-sm text-gray-500">
                  <p>Ex 1: prn:ordoc_cloud:{user?.organization?.cnpj || 'CNPJ'}:user/john.doe</p>
                  <p>Ex 2: prn:ordoc_air:{user?.organization?.cnpj || 'CNPJ'}:Meu Air/Administração/*</p>
                  <p>Ex 3: prn:ordoc_flow:{user?.organization?.cnpj || 'CNPJ'}:requester_internal/*</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {formData.resource.map((resource, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={resource}
                      onChange={(e) => handleResourceChange(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`prn:${formData.service}:${user?.organization?.cnpj || 'CNPJ'}:*`}
                    />
                    {formData.resource.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeResource(index)}
                        className="px-3 py-2 text-red-600 hover:text-red-800 border border-red-300 rounded-md hover:border-red-400"
                      >
                        Remover
                      </button>
                    )}
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addResource}
                  className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-gray-400 hover:text-gray-800"
                >
                  + Adicionar Recurso
                </button>
              </div>
              {errors.resource && (
                <p className="text-red-500 text-sm mt-1">*{errors.resource}</p>
              )}
            </div>
          )}

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {errors.submit}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.push('/dashboard/policies')}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Criando...' : 'Criar Política'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPolicy;
