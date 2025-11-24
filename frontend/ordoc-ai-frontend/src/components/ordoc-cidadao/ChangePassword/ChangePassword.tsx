'use client';

import * as React from 'react';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UpdatePasswordPayload } from '@/services/ordoc-cidadao/types';
import { ChangePasswordProps } from './types';
import PasswordChecklist from '../PasswordChecklist';

interface ChangePasswordFormValues extends UpdatePasswordPayload {
  passwordConfirmation: string;
}

const initialValues: ChangePasswordFormValues = {
  currentPassword: '',
  password: '',
  passwordConfirmation: '',
};

const ChangePassword = ({ handleSubmit }: ChangePasswordProps) => {
  const router = useRouter();
  const [success, setSuccess] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');

  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Campo obrigatório'),
    password: Yup.string()
      .required('Campo obrigatório')
      .matches(
        /(?=.*\W)(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/,
        'Preencha todos os requisitos abaixo'
      ),
    passwordConfirmation: Yup.string()
      .required('Campo obrigatório')
      .oneOf([Yup.ref('password')], 'As senhas não coincidem'),
  });

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Cadastro de nova senha</CardTitle>
        </CardHeader>
        <CardContent>
          <Formik
            onSubmit={(values, actions) => {
              setError('');
              setSuccess('');
              
              const payload: UpdatePasswordPayload = {
                currentPassword: values.currentPassword,
                password: values.password,
              };

              handleSubmit(payload)
                .then(() => {
                  setSuccess('Senha alterada com sucesso.');
                  setTimeout(() => {
                    router.push('/ordoc-cidadao/login');
                  }, 2000);
                })
                .catch((err) => {
                  const errorMessage = err.response?.data?.message || 'Erro ao alterar senha';
                  setError(
                    errorMessage.includes('Senha')
                      ? 'Verifique a senha informada!'
                      : 'Algo deu errado!'
                  );
                })
                .finally(() => {
                  actions.setSubmitting(false);
                });
            }}
            initialValues={initialValues}
            validationSchema={validationSchema}
          >
            {(formik) => (
              <Form className="space-y-4">
                {success && (
                  <Alert>
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}
                
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <p className="text-sm text-gray-600 text-center">
                    Insira abaixo a senha enviada no momento do cadastro:
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Senha temporária</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      placeholder="Insira a senha temporária"
                      value={formik.values.currentPassword}
                      onChange={formik.handleChange}
                      className={formik.errors.currentPassword ? 'border-red-500' : ''}
                    />
                    {formik.touched.currentPassword && formik.errors.currentPassword && (
                      <p className="text-sm text-red-500">{formik.errors.currentPassword}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-gray-600 text-center">
                    Insira abaixo sua nova senha:
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="password">Nova senha definitiva</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Senha"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      className={
                        formik.values.password
                          ? !/(?=.*\W)(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(formik.values.password)
                            ? 'border-red-500'
                            : ''
                          : formik.touched.password && formik.errors.password
                          ? 'border-red-500'
                          : ''
                      }
                    />
                    {formik.touched.password && formik.errors.password && (
                      <p className="text-sm text-red-500">{formik.errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passwordConfirmation">Confirmar nova senha</Label>
                    <Input
                      id="passwordConfirmation"
                      name="passwordConfirmation"
                      type="password"
                      placeholder="Digite novamente sua senha"
                      value={formik.values.passwordConfirmation}
                      onChange={formik.handleChange}
                      className={
                        formik.values.passwordConfirmation
                          ? formik.values.passwordConfirmation !== formik.values.password
                            ? 'border-red-500'
                            : ''
                          : formik.touched.passwordConfirmation && formik.errors.passwordConfirmation
                          ? 'border-red-500'
                          : ''
                      }
                    />
                    {formik.touched.passwordConfirmation && formik.errors.passwordConfirmation && (
                      <p className="text-sm text-red-500">{formik.errors.passwordConfirmation}</p>
                    )}
                  </div>
                </div>

                <PasswordChecklist password={formik.values.password} />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? 'Enviando...' : 'Enviar'}
                </Button>
              </Form>
            )}
          </Formik>

          <div className="mt-6 space-y-2 text-center">
            <button
              type="button"
              onClick={() => router.push('/ordoc-cidadao/procedures')}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              Pular
            </button>
            <div>
              <button 
                type="button" 
                onClick={() => router.push('/ordoc-cidadao/login')}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                Retornar à tela de login
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePassword;
