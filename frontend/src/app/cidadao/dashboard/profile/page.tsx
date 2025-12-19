'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { UserCircleIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { ExternalAuthService, ExternalRequesterService } from '@/services/ordoc-cidadao';
import type { 
  MeExternalRequesterAPIResponse, 
  UpdateExternalRequesterPayload,
  UpdatePasswordPayload 
} from '@/services/ordoc-cidadao';

const profileValidationSchema = Yup.object({
  name: Yup.string().required('Nome é obrigatório'),
  email: Yup.string().email('Email inválido').required('Email é obrigatório'),
  phone: Yup.string().required('Telefone é obrigatório'),
  optionalPhone: Yup.string(),
  birthDate: Yup.date().required('Data de nascimento é obrigatória'),
  optionalEmail: Yup.string().email('Email inválido'),
  occupation: Yup.string().required('Ocupação é obrigatória'),
  notification: Yup.string().required('Tipo de notificação é obrigatório'),
});

const passwordValidationSchema = Yup.object({
  currentPassword: Yup.string().required('Senha atual é obrigatória'),
  password: Yup.string()
    .required('Nova senha é obrigatória')
    .min(8, 'Senha deve ter pelo menos 8 caracteres'),
  confirmPassword: Yup.string()
    .required('Confirmação de senha é obrigatória')
    .oneOf([Yup.ref('password')], 'Senhas não coincidem'),
});

export default function CidadaoProfilePage() {
  const [user, setUser] = useState<MeExternalRequesterAPIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await ExternalAuthService.me();
      setUser(userData.data);
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      router.push('/cidadao/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = async (values: UpdateExternalRequesterPayload) => {
    try {
      const token = localStorage.getItem('token') || '';
      const subdomain = localStorage.getItem('subdomain') || '';
      const response = await ExternalRequesterService.update(token, subdomain, user?.id || 0, values);
      setUser(response);
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      alert('Erro ao atualizar perfil. Tente novamente.');
    }
  };

  const handlePasswordSubmit = async (values: UpdatePasswordPayload & { confirmPassword: string }) => {
    try {
      const { confirmPassword, ...payload } = values;
      await ExternalAuthService.updatePassword(payload);
      alert('Senha atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      alert('Erro ao atualizar senha. Verifique sua senha atual.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erro ao carregar perfil</h2>
          <button
            onClick={() => router.push('/cidadao/dashboard')}
            className="text-blue-600 hover:text-blue-500"
          >
            Voltar ao dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/cidadao/dashboard')}
                className="text-gray-500 hover:text-gray-700"
              >
                ← Voltar
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Meu Perfil</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Dados Pessoais
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'password'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Alterar Senha
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'profile' ? (
              /* Profile Form */
              <Formik
                initialValues={{
                  name: user.name || '',
                  email: user.email || '',
                  phone: user.phone || '',
                  optionalPhone: user.optionalPhone || '',
                  birthDate: user.birthDate ? user.birthDate.split('T')[0] : '',
                  optionalEmail: user.optionalEmail || '',
                  occupation: user.occupation || '',
                  notification: user.notification || 'email',
                }}
                validationSchema={profileValidationSchema}
                onSubmit={handleProfileSubmit}
                enableReinitialize
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Nome Completo *
                        </label>
                        <Field
                          type="text"
                          name="name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600" />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Principal *
                        </label>
                        <Field
                          type="email"
                          name="email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Telefone Principal *
                        </label>
                        <Field
                          type="tel"
                          name="phone"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <ErrorMessage name="phone" component="div" className="mt-1 text-sm text-red-600" />
                      </div>

                      <div>
                        <label htmlFor="optionalPhone" className="block text-sm font-medium text-gray-700 mb-2">
                          Telefone Alternativo
                        </label>
                        <Field
                          type="tel"
                          name="optionalPhone"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <ErrorMessage name="optionalPhone" component="div" className="mt-1 text-sm text-red-600" />
                      </div>

                      <div>
                        <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                          Data de Nascimento *
                        </label>
                        <Field
                          type="date"
                          name="birthDate"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <ErrorMessage name="birthDate" component="div" className="mt-1 text-sm text-red-600" />
                      </div>

                      <div>
                        <label htmlFor="optionalEmail" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Alternativo
                        </label>
                        <Field
                          type="email"
                          name="optionalEmail"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <ErrorMessage name="optionalEmail" component="div" className="mt-1 text-sm text-red-600" />
                      </div>

                      <div>
                        <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mb-2">
                          Ocupação *
                        </label>
                        <Field
                          type="text"
                          name="occupation"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <ErrorMessage name="occupation" component="div" className="mt-1 text-sm text-red-600" />
                      </div>

                      <div>
                        <label htmlFor="notification" className="block text-sm font-medium text-gray-700 mb-2">
                          Preferência de Notificação *
                        </label>
                        <Field
                          as="select"
                          name="notification"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="email">Email</option>
                          <option value="sms">SMS</option>
                        </Field>
                        <ErrorMessage name="notification" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                    </div>

                    {/* Read-only fields */}
                    <div className="border-t border-gray-200 pt-6">
                      <h4 className="text-md font-medium text-gray-900 mb-4">Informações Não Editáveis</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">CPF/CNPJ</label>
                          <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-500">
                            {user.cpfCnpj}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">PRN</label>
                          <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-500">
                            {user.prn}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                          <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user.status === 'active' ? 'Ativo' : 'Inativo'}
                            </span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Membro desde</label>
                          <div className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => router.push('/cidadao/dashboard')}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            ) : (
              /* Password Form */
              <Formik
                initialValues={{ currentPassword: '', password: '', confirmPassword: '' }}
                validationSchema={passwordValidationSchema}
                onSubmit={handlePasswordSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-6 max-w-md">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Senha Atual *
                      </label>
                      <div className="relative">
                        <Field
                          type={showCurrentPassword ? 'text' : 'password'}
                          name="currentPassword"
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Digite sua senha atual"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      <ErrorMessage name="currentPassword" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Nova Senha *
                      </label>
                      <div className="relative">
                        <Field
                          type={showNewPassword ? 'text' : 'password'}
                          name="password"
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Digite sua nova senha"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      <ErrorMessage name="password" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmar Nova Senha *
                      </label>
                      <div className="relative">
                        <Field
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Confirme sua nova senha"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      <ErrorMessage name="confirmPassword" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => setActiveTab('profile')}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Alterando...' : 'Alterar Senha'}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
