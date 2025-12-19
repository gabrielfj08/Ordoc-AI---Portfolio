'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { ExternalAuthService } from '@/services/ordoc-cidadao';
import type { ResetPasswordPayload } from '@/services/ordoc-cidadao';

const validationSchema = Yup.object({
  cpfCnpj: Yup.string()
    .required('CPF/CNPJ é obrigatório')
    .min(11, 'CPF/CNPJ deve ter pelo menos 11 caracteres'),
  onTimePassword: Yup.string()
    .required('Código de verificação é obrigatório')
    .min(6, 'Código deve ter pelo menos 6 caracteres'),
  password: Yup.string()
    .required('Nova senha é obrigatória')
    .min(8, 'Senha deve ter pelo menos 8 caracteres'),
  confirmPassword: Yup.string()
    .required('Confirmação de senha é obrigatória')
    .oneOf([Yup.ref('password')], 'Senhas não coincidem'),
});

export default function CidadaoResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: ResetPasswordPayload & { confirmPassword: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      const { confirmPassword, ...payload } = values;
      await ExternalAuthService.resetPassword(payload.token, payload.password);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao redefinir senha. Verifique os dados informados.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Senha Redefinida!</h2>
            <p className="text-gray-600 mb-6">
              Sua senha foi redefinida com sucesso. Agora você pode fazer login com sua nova senha.
            </p>
            <button
              onClick={() => router.push('/cidadao/login')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Ir para Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Redefinir Senha</h1>
          <p className="text-gray-600">Digite o código recebido e sua nova senha</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <Formik
            initialValues={{ 
              cpfCnpj: '', 
              onTimePassword: '', 
              password: '', 
              confirmPassword: '',
              token: ''
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <label htmlFor="cpfCnpj" className="block text-sm font-medium text-gray-700 mb-2">
                    CPF/CNPJ
                  </label>
                  <Field
                    type="text"
                    name="cpfCnpj"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Digite seu CPF ou CNPJ"
                  />
                  <ErrorMessage name="cpfCnpj" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                <div>
                  <label htmlFor="onTimePassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Código de Verificação
                  </label>
                  <Field
                    type="text"
                    name="onTimePassword"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Digite o código recebido"
                  />
                  <ErrorMessage name="onTimePassword" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Nova Senha
                  </label>
                  <div className="relative">
                    <Field
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Digite sua nova senha"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
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
                    Confirmar Nova Senha
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

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Redefinindo...' : 'Redefinir Senha'}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => router.push('/cidadao/login')}
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    Voltar para o login
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
