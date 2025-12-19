'use client';

import * as React from 'react';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalAuthService } from '@/services/ordoc-cidadao';
import PasswordChecklist from '../../../../PasswordChecklist';

interface ChangePasswordModalProps {
  externalRequesterId: number;
  onClose: () => void;
}

const ChangePasswordModal = ({ externalRequesterId, onClose }: ChangePasswordModalProps) => {
  const [error, setError] = React.useState<string>('');
  const [success, setSuccess] = React.useState<string>('');

  const initialValues = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Senha atual é obrigatória'),
    newPassword: Yup.string()
      .min(8, 'A senha deve ter pelo menos 8 caracteres')
      .matches(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
      .matches(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
      .matches(/[0-9]/, 'A senha deve conter pelo menos um número')
      .matches(/[^a-zA-Z0-9]/, 'A senha deve conter pelo menos um caractere especial')
      .required('Nova senha é obrigatória'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword')], 'As senhas devem ser iguais')
      .required('Confirmação de senha é obrigatória'),
  });

  const handleSubmit = async (values: any, actions: any) => {
    try {
      setError('');
      setSuccess('');
      
      // TODO: Implement real API call to change password
      console.log('Change password for user:', externalRequesterId, values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Senha alterada com sucesso!');
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || 'Erro ao alterar senha');
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-blue-600">Alterar Senha</DialogTitle>
        </DialogHeader>
        
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

              <div className="space-y-2">
                <Label htmlFor="currentPassword">Senha Atual *</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={formik.values.currentPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={formik.isSubmitting}
                />
                {formik.touched.currentPassword && formik.errors.currentPassword && (
                  <p className="text-sm text-red-500">{formik.errors.currentPassword}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova Senha *</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={formik.values.newPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={formik.isSubmitting}
                />
                {formik.touched.newPassword && formik.errors.newPassword && (
                  <p className="text-sm text-red-500">{formik.errors.newPassword}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha *</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={formik.isSubmitting}
                />
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <p className="text-sm text-red-500">{formik.errors.confirmPassword}</p>
                )}
              </div>

              {formik.values.newPassword && (
                <PasswordChecklist password={formik.values.newPassword} />
              )}

              <div className="flex gap-4 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={formik.isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? 'Alterando...' : 'Alterar Senha'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordModal;
