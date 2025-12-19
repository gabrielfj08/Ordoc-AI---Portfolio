'use client';

import * as React from 'react';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { Form, Formik } from 'formik';
import { cpfCnpjMask } from '@/utils/ordoc-cidadao';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RequesterAuth } from '@/services/ordoc-cidadao';
import { LoginFormProps, LoginFormValues } from './types';

const initialValues = {
  cpfCnpj: '',
  password: '',
} as LoginFormValues;

const snackbarTitle = (error: string) => {
  if (error.includes('Senha')) {
    return 'Por favor, verifique se sua senha está correta!';
  }
  if (error.includes('bloqueado')) {
    return 'Usuário bloqueado!';
  }
  if (error.includes('Solicitante')) {
    return 'Por favor, verifique o CPF/CNPJ informado!';
  } else {
    return 'Algo deu errado!';
  }
};

const LoginForm = ({ onSubmit, secret }: LoginFormProps) => {
  const router = useRouter();
  const [error, setError] = React.useState<string>('');

  const handleExternalSession = (token: string) => {
    // Implementar lógica de sessão externa
    localStorage.setItem('external_token', token);
    router.push('/dashboard/ordoc-cidadao');
  };

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Preencha os dados abaixo:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Formik
            initialValues={initialValues}
            onSubmit={(values, actions) => {
              setError('');
              
              // Simular recaptcha - em produção usar o componente real
              const mockRecaptchaSuccess = true;
              
              if (mockRecaptchaSuccess) {
                onSubmit(values)
                  .then((res) => {
                    handleExternalSession(res.data.token);
                  })
                  .catch((err) => {
                    const errorMessage = err.response?.data?.message || 'Erro no login';
                    setError(snackbarTitle(errorMessage));
                  })
                  .finally(() => {
                    actions.setSubmitting(false);
                  });
              } else {
                actions.setSubmitting(false);
                setError('Por favor, verifique que você não é um robô.');
              }
            }}
            validationSchema={Yup.object().shape({
              cpfCnpj: Yup.string().required('Campo obrigatório'),
              password: Yup.string().required('Campo obrigatório'),
            })}
            enableReinitialize
            validateOnChange={false}
          >
            {(formik) => (
              <Form className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="cpfCnpj">Login*</Label>
                  <Input
                    id="cpfCnpj"
                    name="cpfCnpj"
                    type="text"
                    placeholder="Insira o CPF ou CNPJ cadastrado"
                    maxLength={18}
                    onChange={formik.handleChange}
                    value={cpfCnpjMask(formik.values.cpfCnpj)}
                    className={
                      formik.values.cpfCnpj
                        ? formik.values.cpfCnpj.length < 14
                          ? 'border-red-500'
                          : ''
                        : formik.errors.cpfCnpj
                        ? 'border-red-500'
                        : ''
                    }
                  />
                  {formik.touched.cpfCnpj && formik.errors.cpfCnpj && (
                    <p className="text-sm text-red-500">{formik.errors.cpfCnpj}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha*</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Insira sua senha"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    className={
                      formik.touched.password && formik.errors.password
                        ? 'border-red-500'
                        : ''
                    }
                  />
                  {formik.touched.password && formik.errors.password && (
                    <p className="text-sm text-red-500">{formik.errors.password}</p>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Placeholder para ReCAPTCHA - implementar componente real em produção */}
                  <div className="flex justify-center">
                    <div className="border border-gray-300 p-4 rounded bg-gray-50 text-center text-sm text-gray-600">
                      ReCAPTCHA (Implementar em produção)
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={formik.isSubmitting}
                  >
                    {formik.isSubmitting ? 'Entrando...' : 'Entrar'}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>

          <div className="mt-6 space-y-2 text-center">
            <button
              onClick={() => router.push('/ordoc-cidadao/recover-unlock-password')}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              Recuperar senha / desbloquear conta
            </button>
            <div>
              <button
                onClick={() => router.push('/ordoc-cidadao/new-requester')}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                Criar conta
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
