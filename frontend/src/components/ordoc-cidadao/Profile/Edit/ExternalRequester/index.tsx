'use client';

import * as React from 'react';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cpfMask, cnpjMask, phoneNumberMask } from '@/utils/ordoc-cidadao';

interface EditExternalRequesterProfileProps {
  externalRequester: {
    id: number;
    name: string;
    email?: string;
    cpf?: string;
    cnpj?: string;
    phone?: string;
    birthDate?: string;
  };
  setType: (type: 'show' | 'edit') => void;
}

const EditExternalRequesterProfile = ({ externalRequester, setType }: EditExternalRequesterProfileProps) => {
  const [error, setError] = React.useState<string>('');
  const [success, setSuccess] = React.useState<string>('');

  const initialValues = {
    name: externalRequester.name || '',
    email: externalRequester.email || '',
    phone: externalRequester.phone || '',
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Nome é obrigatório'),
    email: Yup.string().email('Email inválido').required('Email é obrigatório'),
    phone: Yup.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  });

  const handleSubmit = async (values: any, actions: any) => {
    try {
      setError('');
      setSuccess('');
      
      // TODO: Implement real API call to update profile
      console.log('Update profile:', values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Dados atualizados com sucesso!');
      setTimeout(() => {
        setType('show');
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar dados');
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-blue-600">Editar Dados Pessoais</CardTitle>
      </CardHeader>
      <CardContent>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {(formik) => (
            <Form className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={formik.isSubmitting}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <p className="text-sm text-red-500">{formik.errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={formik.isSubmitting}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-sm text-red-500">{formik.errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={phoneNumberMask(formik.values.phone)}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      formik.setFieldValue('phone', value);
                    }}
                    onBlur={formik.handleBlur}
                    disabled={formik.isSubmitting}
                    placeholder="(00) 00000-0000"
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <p className="text-sm text-red-500">{formik.errors.phone}</p>
                  )}
                </div>

                {externalRequester.cpf && (
                  <div className="space-y-2">
                    <Label>CPF</Label>
                    <Input
                      value={cpfMask(externalRequester.cpf)}
                      disabled
                      className="bg-gray-100"
                    />
                    <p className="text-xs text-gray-500">
                      Para alterar o CPF, procure a prefeitura
                    </p>
                  </div>
                )}

                {externalRequester.cnpj && (
                  <div className="space-y-2">
                    <Label>CNPJ</Label>
                    <Input
                      value={cnpjMask(externalRequester.cnpj)}
                      disabled
                      className="bg-gray-100"
                    />
                    <p className="text-xs text-gray-500">
                      Para alterar o CNPJ, procure a prefeitura
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-4 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setType('show')}
                  disabled={formik.isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
};

export default EditExternalRequesterProfile;
