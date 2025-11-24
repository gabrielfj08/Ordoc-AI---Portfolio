'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { ExternalRequesterService } from '@/services/ordoc-cidadao';
import type { CreateExternalRequesterPayload } from '@/services/ordoc-cidadao';

const validationSchema = Yup.object({
  name: Yup.string().required('Nome é obrigatório'),
  email: Yup.string().email('Email inválido').required('Email é obrigatório'),
  cpfCnpj: Yup.string()
    .required('CPF/CNPJ é obrigatório')
    .min(11, 'CPF/CNPJ deve ter pelo menos 11 caracteres'),
  phone: Yup.string().required('Telefone é obrigatório'),
  password: Yup.string().required('Senha é obrigatória').min(6, 'Senha deve ter pelo menos 6 caracteres'),
  optionalPhone: Yup.string(),
  birthDate: Yup.date().required('Data de nascimento é obrigatória'),
  optionalEmail: Yup.string().email('Email inválido'),
  occupation: Yup.string().required('Ocupação é obrigatória'),
  notification: Yup.string().required('Tipo de notificação é obrigatório'),
  acceptTerms: Yup.boolean().oneOf([true], 'Você deve aceitar os termos de uso'),
});

export default function CidadaoRegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: CreateExternalRequesterPayload & { acceptTerms: boolean }) => {
    setIsLoading(true);
    setError(null);

    try {
      const { acceptTerms, cpfCnpj, password, ...rest } = values;
      const subdomain = localStorage.getItem('subdomain') || '';
      const payload = {
        ...rest,
        cpf_cnpj: cpfCnpj,
        password: password
      };
      await ExternalRequesterService.create(subdomain, payload);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar conta. Verifique os dados informados.');
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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Conta Criada!</h2>
            <p className="text-gray-600 mb-6">
              Sua conta foi criada com sucesso. Você receberá suas credenciais de acesso em breve.
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
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cadastro de Cidadão</h1>
          <p className="text-gray-600">Crie sua conta para acessar o Portal do Cidadão</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <Formik
            initialValues={{
              name: '',
              email: '',
              cpfCnpj: '',
              phone: '',
              password: '',
              optionalPhone: '',
              birthDate: '',
              optionalEmail: '',
              occupation: '',
              notification: 'email',
              acceptTerms: false,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
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
                      placeholder="Digite seu nome completo"
                    />
                    <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600" />
                  </div>

                  <div>
                    <label htmlFor="cpfCnpj" className="block text-sm font-medium text-gray-700 mb-2">
                      CPF/CNPJ *
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
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Principal *
                    </label>
                    <Field
                      type="email"
                      name="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Digite seu email"
                    />
                    <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
                  </div>

                  <div>
                    <label htmlFor="optionalEmail" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Alternativo
                    </label>
                    <Field
                      type="email"
                      name="optionalEmail"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Email alternativo (opcional)"
                    />
                    <ErrorMessage name="optionalEmail" component="div" className="mt-1 text-sm text-red-600" />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone Principal *
                    </label>
                    <Field
                      type="tel"
                      name="phone"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Digite seu telefone"
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
                      placeholder="Telefone alternativo (opcional)"
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
                    <label htmlFor="occupation" className="block text-sm font-medium text-gray-700 mb-2">
                      Ocupação *
                    </label>
                    <Field
                      type="text"
                      name="occupation"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Digite sua ocupação"
                    />
                    <ErrorMessage name="occupation" component="div" className="mt-1 text-sm text-red-600" />
                  </div>
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

                <div className="flex items-center">
                  <Field
                    type="checkbox"
                    name="acceptTerms"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-900">
                    Aceito os{' '}
                    <a href="/terms" className="text-blue-600 hover:text-blue-500" target="_blank">
                      termos de uso
                    </a>{' '}
                    e{' '}
                    <a href="/privacy" className="text-blue-600 hover:text-blue-500" target="_blank">
                      política de privacidade
                    </a>
                  </label>
                </div>
                <ErrorMessage name="acceptTerms" component="div" className="text-sm text-red-600" />

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
                  {isLoading ? 'Criando conta...' : 'Criar Conta'}
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Já possui conta?{' '}
                    <button
                      type="button"
                      onClick={() => router.push('/cidadao/login')}
                      className="text-blue-600 hover:text-blue-500"
                    >
                      Faça login aqui
                    </button>
                  </p>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
