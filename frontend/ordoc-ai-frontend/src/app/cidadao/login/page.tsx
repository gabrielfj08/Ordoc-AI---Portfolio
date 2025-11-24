'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { ExternalAuthService } from '@/services/ordoc-cidadao';
import type { AuthCredentials } from '@/services/ordoc-cidadao';

const validationSchema = Yup.object({
  cpfCnpj: Yup.string()
    .required('CPF/CNPJ é obrigatório')
    .min(11, 'CPF/CNPJ deve ter pelo menos 11 caracteres'),
  password: Yup.string()
    .required('Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export default function CidadaoLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (values: AuthCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await ExternalAuthService.login(values);
      
      // Store token and user data
      localStorage.setItem('cidadao_token', response.data.token);
      localStorage.setItem('cidadao_user', JSON.stringify(response));
      
      // Redirect to citizen dashboard
      router.push('/cidadao/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Portal do Cidadão</h1>
          <p className="text-gray-600">Acesse sua conta para acompanhar seus procedimentos</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <Formik
            initialValues={{ cpfCnpj: '', password: '' }}
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
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Senha
                  </label>
                  <div className="relative">
                    <Field
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Digite sua senha"
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
                  {isLoading ? 'Entrando...' : 'Entrar'}
                </button>

                <div className="text-center">
                  <a
                    href="/cidadao/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    Esqueceu sua senha?
                  </a>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Não possui conta?{' '}
            <a href="/cidadao/register" className="text-blue-600 hover:text-blue-500">
              Cadastre-se aqui
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
