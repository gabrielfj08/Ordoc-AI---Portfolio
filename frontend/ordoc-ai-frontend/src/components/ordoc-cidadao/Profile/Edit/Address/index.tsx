'use client';

import * as React from 'react';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface EditAddressExternalRequesterProfileProps {
  externalRequester: {
    id: number;
    address?: {
      street: string;
      number: string;
      complement?: string;
      neighborhood: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
  setType: (type: 'show' | 'edit') => void;
}

const EditAddressExternalRequesterProfile = ({ externalRequester, setType }: EditAddressExternalRequesterProfileProps) => {
  const [error, setError] = React.useState<string>('');
  const [success, setSuccess] = React.useState<string>('');

  const initialValues = {
    street: externalRequester.address?.street || '',
    number: externalRequester.address?.number || '',
    complement: externalRequester.address?.complement || '',
    neighborhood: externalRequester.address?.neighborhood || '',
    city: externalRequester.address?.city || '',
    state: externalRequester.address?.state || '',
    zipCode: externalRequester.address?.zipCode || '',
  };

  const validationSchema = Yup.object().shape({
    street: Yup.string().required('Logradouro é obrigatório'),
    number: Yup.string().required('Número é obrigatório'),
    neighborhood: Yup.string().required('Bairro é obrigatório'),
    city: Yup.string().required('Cidade é obrigatória'),
    state: Yup.string().required('Estado é obrigatório'),
    zipCode: Yup.string().required('CEP é obrigatório'),
  });

  const handleSubmit = async (values: any, actions: any) => {
    try {
      setError('');
      setSuccess('');
      
      // TODO: Implement real API call to update address
      console.log('Update address:', values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Endereço atualizado com sucesso!');
      
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar endereço');
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-blue-600">Editar Endereço</CardTitle>
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
                  <Label htmlFor="zipCode">CEP *</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formik.values.zipCode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={formik.isSubmitting}
                    placeholder="00000-000"
                  />
                  {formik.touched.zipCode && formik.errors.zipCode && (
                    <p className="text-sm text-red-500">{formik.errors.zipCode}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="street">Logradouro *</Label>
                  <Input
                    id="street"
                    name="street"
                    value={formik.values.street}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={formik.isSubmitting}
                  />
                  {formik.touched.street && formik.errors.street && (
                    <p className="text-sm text-red-500">{formik.errors.street}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="number">Número *</Label>
                  <Input
                    id="number"
                    name="number"
                    value={formik.values.number}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={formik.isSubmitting}
                  />
                  {formik.touched.number && formik.errors.number && (
                    <p className="text-sm text-red-500">{formik.errors.number}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="complement">Complemento</Label>
                  <Input
                    id="complement"
                    name="complement"
                    value={formik.values.complement}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={formik.isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Bairro *</Label>
                  <Input
                    id="neighborhood"
                    name="neighborhood"
                    value={formik.values.neighborhood}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={formik.isSubmitting}
                  />
                  {formik.touched.neighborhood && formik.errors.neighborhood && (
                    <p className="text-sm text-red-500">{formik.errors.neighborhood}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Cidade *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={formik.isSubmitting}
                  />
                  {formik.touched.city && formik.errors.city && (
                    <p className="text-sm text-red-500">{formik.errors.city}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">Estado *</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formik.values.state}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={formik.isSubmitting}
                  />
                  {formik.touched.state && formik.errors.state && (
                    <p className="text-sm text-red-500">{formik.errors.state}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-4 justify-end pt-4">
                <Button
                  type="submit"
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? 'Salvando...' : 'Salvar Endereço'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
};

export default EditAddressExternalRequesterProfile;
