import * as React from 'react';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import router from 'next/router';
import {
  ButtonV3 as Button,
  InputV3 as Input,
  TypographyV3 as Typography,
} from 'printer-ui';
import { useV3Snackbar } from '../../hooks';
import { UpdatePasswordPayload } from '../../services/flow-cidadao/types';
import { ChangePasswordProps } from './types';
import PasswordChecklist from '../../components/PasswordChecklist';

const initialValues: UpdatePasswordPayload = {
  currentPassword: '',
  password: '',
  passwordConfirmation: '',
};

const ChangePassword = ({ handleSubmit }: ChangePasswordProps) => {
  const { showV3Snackbar } = useV3Snackbar();

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
      .oneOf([Yup.ref('password'), null], 'As senhas não coincidem'),
  });

  return (
    <main className="w-full flex flex-col items-center space-y-4">
      <Typography variant="headline5" family="jakartaBold" color="darkGray">
        Cadastro de nova senha
      </Typography>
      <Formik
        onSubmit={(values, actions) => {
          handleSubmit(values)
            .then(() => {
              showV3Snackbar(
                'Senha alterada com sucesso.',
                'success',
                'Senha alterada!'
              ),
                router.push('/flow-cidadao/login');
            })
            .catch((err) =>
              showV3Snackbar(
                `${err.response.data.message}`,
                'error',
                `${
                  err.response.data.message.includes('Senha')
                    ? 'Verifique a senha informada!'
                    : 'Algo deu errado!'
                }`
              )
            )
            .finally(() => {
              actions.setSubmitting(false);
            });
        }}
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        {(formik) => (
          <Form className="px-12 sm:px-0 xl:w-1/4 space-y-4">
            <div className="flex flex-col items-center space-y-2">
              <Typography variant="bodySm" family="jakarta" color="darkGray">
                Insira abaixo a senha enviada no momento do cadastro:
              </Typography>
              <div className="w-full">
                <Input
                  label="Senha temporária"
                  textColor="cidOrange"
                  borderColor="cidOrange"
                  focusBorderColor="cidOrange"
                  placeholderColor="gray"
                  type="password"
                  w="full"
                  placeholder="Insira a senha temporária"
                  name="currentPassword"
                  value={formik.values.currentPassword}
                  onChange={formik.handleChange}
                  error={!!formik.errors.currentPassword}
                />
                {formik.touched.currentPassword &&
                formik.errors.currentPassword ? (
                  <Typography variant="label" color="error" family="jakarta">
                    {formik.errors.currentPassword}
                  </Typography>
                ) : null}
              </div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Typography variant="bodySm" family="jakarta" color="darkGray">
                Insira abaixo sua nova senha:
              </Typography>
              <div className="w-full">
                <Input
                  label="Nova senha definitiva"
                  textColor="cidOrange"
                  borderColor="cidOrange"
                  focusBorderColor="cidOrange"
                  placeholderColor="gray"
                  type="password"
                  w="full"
                  placeholder="Senha"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={
                    formik.values.password
                      ? !/(?=.*\W)(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(
                          formik.values.password
                        )
                      : formik.touched.password && formik.errors.password
                      ? true
                      : false
                  }
                />
                {formik.touched.password && formik.errors.password ? (
                  <Typography variant="label" color="error" family="jakarta">
                    {formik.errors.password}
                  </Typography>
                ) : null}
              </div>
              <div className="w-full">
                <Input
                  label="Nova senha definitiva"
                  textColor="cidOrange"
                  borderColor="cidOrange"
                  focusBorderColor="cidOrange"
                  placeholderColor="gray"
                  type="password"
                  w="full"
                  placeholder="Digite novamente sua senha"
                  name="passwordConfirmation"
                  value={formik.values.passwordConfirmation}
                  onChange={formik.handleChange}
                  error={
                    formik.values.passwordConfirmation
                      ? formik.values.passwordConfirmation !==
                        formik.values.password
                      : formik.touched.passwordConfirmation &&
                        formik.errors.passwordConfirmation
                      ? true
                      : false
                  }
                />
                {formik.touched.passwordConfirmation &&
                formik.errors.passwordConfirmation ? (
                  <Typography variant="label" color="error" family="jakarta">
                    {formik.errors.passwordConfirmation}
                  </Typography>
                ) : null}
              </div>
            </div>
            <div className="w-full flex flex-col items-center space-y-4">
              <PasswordChecklist
                password={formik.values.password}
                font="jakarta"
              />
              <Button
                type="submit"
                label="Enviar"
                disabled={formik.isSubmitting}
                className="hidden sm:block"
              />
              <Button
                size="sm"
                type="submit"
                label="Enviar"
                disabled={formik.isSubmitting}
                className="sm:hidden"
              />
            </div>
          </Form>
        )}
      </Formik>
      <button
        type="button"
        onClick={() => router.push('/flow-cidadao/procedures')}
      >
        <Typography variant="headline5" family="jakartaMedium" color="primary">
          Pular
        </Typography>
      </button>
      <button type="button" onClick={() => router.push('/flow-cidadao/login')}>
        <Typography variant="headline5" family="jakartaMedium" color="primary">
          Retornar à tela de login
        </Typography>
      </button>
    </main>
  );
};

export default ChangePassword;
