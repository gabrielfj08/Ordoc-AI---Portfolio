'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ExternalAuthService } from '@/services/ordoc-cidadao';
import type { GenerateExternalOtpPayload } from '@/services/ordoc-cidadao';

const validationSchema = Yup.object({
  cpfCnpj: Yup.string()
    .required('CPF/CNPJ é obrigatório')
    .min(11, 'CPF/CNPJ deve ter pelo menos 11 caracteres'),
  notification: Yup.string()
    .required('Selecione como deseja receber o código')
    .oneOf(['sms', 'email'], 'Tipo de notificação inválido'),
});

export default function CidadaoForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (values: GenerateExternalOtpPayload) => {
    setIsLoading(true);
    setError(null);

    try {
      await ExternalAuthService.generateOtp('', '', values);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao enviar código. Tente novamente.');
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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Código Enviado!</h2>
            <p className="text-gray-600 mb-6">
              Verifique sua caixa de entrada ou mensagens SMS para o código de recuperação.
            </p>
            <button
              onClick={() => router.push('/cidadao/reset-password')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Continuar para Redefinir Senha
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Esqueceu sua senha?</h1>
          <p className="text-gray-600">Enviaremos um código para redefinir sua senha</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <Formik
            initialValues={{ cpfCnpj: '', notification: 'email' }}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Como deseja receber o código?
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <Field
                        type="radio"
                        name="notification"
                        value="email"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Por email</span>
                    </label>
                    <label className="flex items-center">
                      <Field
                        type="radio"
                        name="notification"
                        value="sms"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Por SMS</span>
                    </label>
                  </div>
                  <ErrorMessage name="notification" component="div" className="mt-1 text-sm text-red-600" />
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
                  {isLoading ? 'Enviando...' : 'Enviar Código'}
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
