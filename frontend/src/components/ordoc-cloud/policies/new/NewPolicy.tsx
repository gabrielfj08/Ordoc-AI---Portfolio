'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AlertCircle, CheckCircle2, Loader2, Shield, Settings, FileText, PenTool, BarChart } from 'lucide-react';
import { NewPolicyProps, NewPolicyFormValues, PolicyService, PolicyEffect, ServiceOption, EffectOption } from './types';
import { useAuth } from '../../../../contexts/AuthContext';

// Service options with modern Ordoc-AI branding
const SERVICE_OPTIONS: ServiceOption[] = [
  {
    id: 'ordoc_air',
    name: 'Ordoc Air',
    description: 'Gestão de documentos e arquivos',
    icon: 'FileText'
  },
  {
    id: 'ordoc_flow',
    name: 'Ordoc Flow',
    description: 'Workflow e processos empresariais',
    icon: 'Settings'
  },
  {
    id: 'ordoc_sign',
    name: 'Ordoc Sign',
    description: 'Assinatura digital de documentos',
    icon: 'PenTool'
  },
  {
    id: 'ordoc_reports',
    name: 'Ordoc Reports',
    description: 'Relatórios e analytics',
    icon: 'BarChart'
  },
  {
    id: 'ordoc_cloud',
    name: 'Ordoc Cloud',
    description: 'Configurações e administração',
    icon: 'Shield'
  }
];

const EFFECT_OPTIONS: EffectOption[] = [
  {
    id: 'allow',
    name: 'Permitir',
    description: 'Concede acesso aos recursos especificados',
    color: 'text-green-600'
  },
  {
    id: 'deny',
    name: 'Negar',
    description: 'Nega acesso aos recursos especificados',
    color: 'text-red-600'
  }
];

// Mock policy actions - in real app, these would come from API
const MOCK_POLICY_ACTIONS = {
  ordoc_air: [
    { id: 'read', name: 'Visualizar', description: 'Visualizar documentos' },
    { id: 'write', name: 'Editar', description: 'Editar documentos' },
    { id: 'delete', name: 'Excluir', description: 'Excluir documentos' },
    { id: 'share', name: 'Compartilhar', description: 'Compartilhar documentos' }
  ],
  ordoc_flow: [
    { id: 'create_procedure', name: 'Criar Procedimento', description: 'Criar novos procedimentos' },
    { id: 'approve_task', name: 'Aprovar Tarefa', description: 'Aprovar tarefas em workflow' },
    { id: 'assign_task', name: 'Atribuir Tarefa', description: 'Atribuir tarefas a usuários' }
  ],
  ordoc_sign: [
    { id: 'sign_document', name: 'Assinar Documento', description: 'Assinar documentos digitalmente' },
    { id: 'validate_signature', name: 'Validar Assinatura', description: 'Validar assinaturas digitais' }
  ],
  ordoc_reports: [
    { id: 'view_reports', name: 'Visualizar Relatórios', description: 'Visualizar relatórios' },
    { id: 'export_data', name: 'Exportar Dados', description: 'Exportar dados em relatórios' }
  ],
  ordoc_cloud: [
    { id: 'manage_users', name: 'Gerenciar Usuários', description: 'Gerenciar usuários da organização' },
    { id: 'manage_policies', name: 'Gerenciar Políticas', description: 'Gerenciar políticas de acesso' }
  ]
};

const getIconComponent = (iconName: string) => {
  const icons = {
    FileText,
    Settings,
    PenTool,
    BarChart,
    Shield
  };
  return icons[iconName as keyof typeof icons] || Shield;
};

const NewPolicy: React.FC<NewPolicyProps> = ({ onSubmit }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Nome é obrigatório')
      .min(3, 'Nome deve ter pelo menos 3 caracteres')
      .max(100, 'Nome deve ter no máximo 100 caracteres')
      .matches(/^[^*]+$/, 'Nome não pode conter "*"'),
    description: Yup.string()
      .required('Descrição é obrigatória')
      .min(10, 'Descrição deve ter pelo menos 10 caracteres')
      .max(500, 'Descrição deve ter no máximo 500 caracteres'),
    service: Yup.string()
      .required('Selecione um serviço')
      .oneOf(['ordoc_air', 'ordoc_flow', 'ordoc_sign', 'ordoc_reports', 'ordoc_cloud']),
    effect: Yup.string()
      .required('Selecione um efeito')
      .oneOf(['allow', 'deny']),
    actionIds: Yup.array()
      .of(Yup.string())
      .min(1, 'Selecione pelo menos uma ação'),
    resource: Yup.array()
      .of(Yup.string())
      .min(1, 'Adicione pelo menos um recurso')
  });

  const formik = useFormik<NewPolicyFormValues>({
    initialValues: {
      name: '',
      description: '',
      service: '' as PolicyService,
      effect: '' as PolicyEffect,
      actionIds: [],
      resource: []
    },
    validationSchema,
    onSubmit: async (values: NewPolicyFormValues) => {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);

      try {
        const result = await onSubmit(values);
        setSubmitSuccess(true);
        
        // Show success message briefly before redirecting
        setTimeout(() => {
          router.push(`/dashboard/policies/${result.id}`);
        }, 1500);
      } catch (error: any) {
        setSubmitError(error.response?.data?.message || 'Erro ao criar política. Tente novamente.');
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  const handleCancel = () => {
    router.push('/dashboard/policies');
  };

  const addResource = () => {
    const newResource = `prn:${formik.values.service}:${user?.organization?.id || 'org'}:*`;
    formik.setFieldValue('resource', [...formik.values.resource, newResource]);
  };

  const removeResource = (index: number) => {
    const newResources = formik.values.resource.filter((_: string, i: number) => i !== index);
    formik.setFieldValue('resource', newResources);
  };

  const updateResource = (index: number, value: string) => {
    const newResources = [...formik.values.resource];
    newResources[index] = value;
    formik.setFieldValue('resource', newResources);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Nova Política de Acesso</h1>
        <p className="text-gray-600">Crie uma nova política para controlar o acesso aos recursos da organização.</p>
      </div>

      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <span className="text-green-800">Política criada com sucesso! Redirecionando...</span>
        </div>
      )}

      {submitError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span className="text-red-800">{submitError}</span>
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="space-y-8">
        {/* Nome */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nome da Política *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Digite o nome da política"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              formik.touched.name && formik.errors.name
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300'
            }`}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.name}</p>
          )}
        </div>

        {/* Descrição */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Descrição *
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Descreva o propósito desta política"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
              formik.touched.description && formik.errors.description
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300'
            }`}
          />
          {formik.touched.description && formik.errors.description && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.description}</p>
          )}
        </div>

        {/* Serviço */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Serviço *
          </label>
          <p className="text-sm text-gray-600 mb-4">Escolha qual serviço será afetado por esta política:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SERVICE_OPTIONS.map((service) => {
              const IconComponent = getIconComponent(service.icon);
              return (
                <label
                  key={service.id}
                  className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                    formik.values.service === service.id
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="service"
                    value={service.id}
                    checked={formik.values.service === service.id}
                    onChange={formik.handleChange}
                    className="sr-only"
                  />
                  <IconComponent className={`h-6 w-6 mr-3 ${
                    formik.values.service === service.id ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <div>
                    <div className={`font-medium ${
                      formik.values.service === service.id ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {service.name}
                    </div>
                    <div className={`text-sm ${
                      formik.values.service === service.id ? 'text-blue-700' : 'text-gray-500'
                    }`}>
                      {service.description}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
          {formik.touched.service && formik.errors.service && (
            <p className="mt-2 text-sm text-red-600">{formik.errors.service}</p>
          )}
        </div>

        {/* Efeito */}
        {formik.values.service && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Efeito *
            </label>
            <p className="text-sm text-gray-600 mb-4">Escolha o efeito desejado:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {EFFECT_OPTIONS.map((effect) => (
                <label
                  key={effect.id}
                  className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                    formik.values.effect === effect.id
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="effect"
                    value={effect.id}
                    checked={formik.values.effect === effect.id}
                    onChange={formik.handleChange}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                    formik.values.effect === effect.id
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {formik.values.effect === effect.id && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <div>
                    <div className={`font-medium ${effect.color}`}>
                      {effect.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {effect.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {formik.touched.effect && formik.errors.effect && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.effect}</p>
            )}
          </div>
        )}

        {/* Ações */}
        {formik.values.effect && formik.values.service && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Ações *
            </label>
            <p className="text-sm text-gray-600 mb-4">Escolha as ações que serão afetadas:</p>
            <div className="space-y-3">
              {MOCK_POLICY_ACTIONS[formik.values.service as keyof typeof MOCK_POLICY_ACTIONS]?.map((action: any) => (
                <label
                  key={action.id}
                  className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={action.id}
                    checked={formik.values.actionIds.includes(action.id)}
                    onChange={(e) => {
                      const actionIds = e.target.checked
                        ? [...formik.values.actionIds, action.id]
                        : formik.values.actionIds.filter((id: string) => id !== action.id);
                      formik.setFieldValue('actionIds', actionIds);
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="ml-3">
                    <div className="font-medium text-gray-900">{action.name}</div>
                    <div className="text-sm text-gray-500">{action.description}</div>
                  </div>
                </label>
              ))}
            </div>
            {formik.touched.actionIds && formik.errors.actionIds && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.actionIds}</p>
            )}
          </div>
        )}

        {/* Recursos */}
        {formik.values.actionIds.length > 0 && formik.values.service && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Recursos *
            </label>
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Instruções:</h4>
              <p className="text-sm text-blue-800 mb-2">
                Para criar a política você deve seguir os exemplos abaixo:
              </p>
              <div className="space-y-1 text-sm text-blue-700 font-mono">
                <div>Ex 1: prn:ordoc_cloud:{user.organization?.id}:user/john.doe</div>
                <div>Ex 2: prn:ordoc_air:{user.organization?.id}:Meu Air/Administração/*</div>
                <div>Ex 3: prn:ordoc_flow:{user.organization?.id}:requester_internal/*</div>
              </div>
            </div>
            
            <div className="space-y-3">
              {formik.values.resource.map((resource: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={resource}
                    onChange={(e) => updateResource(index, e.target.value)}
                    placeholder={`prn:${formik.values.service}:${user.organization?.id || 'org'}:*`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeResource(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 border border-red-300 rounded-lg transition-colors"
                  >
                    Remover
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addResource}
                className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
              >
                + Adicionar Recurso
              </button>
            </div>
            {formik.touched.resource && formik.errors.resource && (
              <p className="mt-2 text-sm text-red-600">{formik.errors.resource}</p>
            )}
          </div>
        )}

        {/* Botões */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting || !formik.isValid}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>{isSubmitting ? 'Criando...' : 'Criar Política'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewPolicy;
