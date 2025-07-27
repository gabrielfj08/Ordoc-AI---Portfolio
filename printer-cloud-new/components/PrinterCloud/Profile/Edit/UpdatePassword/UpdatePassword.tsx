import * as React from 'react';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { Form, Formik } from 'formik';
import { useSnackbar } from '../../../../../hooks';
import PasswordChecklist from '../../../../../components/PasswordChecklist';
import { Button, Input, Typography } from 'printer-ui';

const UpdatePassword = ({ onSubmit }) => {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  return (
    <Formik
      initialValues={{
        currentPassword: '',
        password: '',
        passwordConfirmation: '',
      }}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit(values)
          .then(() => {
            showSnackbar(`Senha alterada com sucesso.`, 'success');
            router.push(`/printer-cloud/profile/edit`);
          })
          .catch((error) => {
            showSnackbar(error.response.data.message, 'error');
            setSubmitting(false);
          });
      }}
      validationSchema={Yup.object().shape({
        currentPassword: Yup.string().required('Campo obrigatório'),
        password: Yup.string()
          .required('Campo obrigatório')
          .matches(
            /(?=.*\W)(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/,
            'Preencha todos os requisitos abaixo'
          ),
        passwordConfirmation: Yup.string()
          .required('Campo obrigatório')
          .oneOf([Yup.ref('password'), null], 'As senhas não coincidem'),
      })}
      enableReinitialize
    >
      {(formik) => (
        <Form className="flex flex-col space-y-8 w-full px-7 sm:px-0 sm:w-5/12 py-8">
          <div className="space-y-2">
            <label htmlFor="currentPassword">
              <Typography variant="footnote1" family="robotoMedium">
                Senha atual:
              </Typography>
            </label>
            <Input
              w="full"
              name="currentPassword"
              id="currentPassword"
              type="password"
              placeholder="Senha atual"
              value={formik.values.currentPassword}
              onChange={formik.handleChange}
            />
            {formik.touched.currentPassword && formik.errors.currentPassword ? (
              <Typography
                variant="footnote2"
                color="error"
                className="flex items-start"
              >
                * {formik.errors.currentPassword}
              </Typography>
            ) : null}
          </div>
          <div className="space-y-2">
            <label htmlFor="password">
              <Typography variant="footnote1" family="robotoMedium">
                Nova senha:
              </Typography>
            </label>
            <Input
              w="full"
              name="password"
              id="password"
              type="password"
              placeholder="Nova senha"
              value={formik.values.password}
              onChange={formik.handleChange}
            />
            {formik.touched.password && formik.errors.password ? (
              <Typography
                variant="footnote2"
                color="error"
                className="flex pb-4 items-start"
              >
                * {formik.errors.password}
              </Typography>
            ) : null}
            <PasswordChecklist password={formik.values.password} />
          </div>
          <div className="space-y-2">
            <label htmlFor="currentPassword">
              <Typography variant="footnote1" family="robotoMedium">
                Confirme a nova senha:
              </Typography>
            </label>
            <Input
              w="full"
              name="passwordConfirmation"
              id="passwordConfirmation"
              type="password"
              placeholder="Confirme a senha"
              value={formik.values.passwordConfirmation}
              onChange={formik.handleChange}
            />
            {formik.touched.passwordConfirmation &&
            formik.errors.passwordConfirmation ? (
              <Typography
                variant="footnote2"
                color="error"
                className="flex items-start"
              >
                * {formik.errors.passwordConfirmation}
              </Typography>
            ) : null}
          </div>
          <div className="flex justify-between">
            <Button
              label="Cancelar"
              color="red"
              type="button"
              onClick={() => router.push('/printer-cloud/profile/edit')}
            />
            <Button
              label="Salvar nova senha"
              color="blue"
              type="submit"
              disabled={formik.isSubmitting}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default UpdatePassword;
