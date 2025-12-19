'use client';

import * as React from 'react';
import { Form, Formik } from 'formik';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, MessageSquare } from 'lucide-react';

interface EditNotificationExternalRequesterProfileProps {
  externalRequester: {
    id: number;
    notifications?: {
      email: boolean;
      sms: boolean;
    };
  };
  setType: (type: 'show' | 'edit') => void;
}

const EditNotificationExternalRequesterProfile = ({ externalRequester, setType }: EditNotificationExternalRequesterProfileProps) => {
  const [error, setError] = React.useState<string>('');
  const [success, setSuccess] = React.useState<string>('');

  const initialValues = {
    email: externalRequester.notifications?.email || false,
    sms: externalRequester.notifications?.sms || false,
  };

  const handleSubmit = async (values: any, actions: any) => {
    try {
      setError('');
      setSuccess('');
      
      // TODO: Implement real API call to update notifications
      console.log('Update notifications:', values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Preferências de notificação atualizadas com sucesso!');
      
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar preferências');
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-blue-600">Editar Preferências de Notificação</CardTitle>
      </CardHeader>
      <CardContent>
        <Formik
          initialValues={initialValues}
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

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <div>
                      <Label htmlFor="email" className="text-base font-medium">
                        Notificações por Email
                      </Label>
                      <p className="text-sm text-gray-500">
                        Receba atualizações sobre seus procedimentos por email
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="email"
                    checked={formik.values.email}
                    onCheckedChange={(checked) => formik.setFieldValue('email', checked)}
                    disabled={formik.isSubmitting}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-gray-500" />
                    <div>
                      <Label htmlFor="sms" className="text-base font-medium">
                        Notificações por SMS
                      </Label>
                      <p className="text-sm text-gray-500">
                        Receba alertas importantes via mensagem de texto
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="sms"
                    checked={formik.values.sms}
                    onCheckedChange={(checked) => formik.setFieldValue('sms', checked)}
                    disabled={formik.isSubmitting}
                  />
                </div>
              </div>

              <div className="flex gap-4 justify-end pt-4">
                <Button
                  type="submit"
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? 'Salvando...' : 'Salvar Preferências'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
};

export default EditNotificationExternalRequesterProfile;
