import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordProps {
  onSubmit: (data: ChangePasswordFormData) => Promise<void>;
  loading?: boolean;
}

const validationSchema = Yup.object({
  currentPassword: Yup.string().required('Senha atual é obrigatória'),
  newPassword: Yup.string()
    .min(8, 'Nova senha deve ter pelo menos 8 caracteres')
    .required('Nova senha é obrigatória'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Senhas não coincidem')
    .required('Confirmação de senha é obrigatória'),
});

export default function ChangePassword({ onSubmit, loading = false }: ChangePasswordProps) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: ChangePasswordFormData, { resetForm }: any) => {
    try {
      setError(null);
      await onSubmit(values);
      setSuccess(true);
      resetForm();
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || 'Erro ao alterar senha');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Alterar Senha</h2>

        {success && (
          <Alert variant="success" className="mb-4">
            <AlertDescription>
              Senha alterada com sucesso!
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="error" className="mb-4">
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

        <Formik
          initialValues={{
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Senha Atual</Label>
                <Field
                  as={Input}
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  className="mt-1"
                />
                <ErrorMessage
                  name="currentPassword"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              <div>
                <Label htmlFor="newPassword">Nova Senha</Label>
                <Field
                  as={Input}
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  className="mt-1"
                />
                <ErrorMessage
                  name="newPassword"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <Field
                  as={Input}
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="mt-1"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="w-full"
                >
                  {isSubmitting || loading ? 'Alterando...' : 'Alterar Senha'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
