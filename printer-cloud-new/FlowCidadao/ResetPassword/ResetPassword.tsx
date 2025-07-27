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
import { ResetPasswordPayload } from '../../services/flow-cidadao/types';
import { ResetPasswordProps } from './types';
import PasswordChecklist from '../../components/PasswordChecklist';

const initialValues: ResetPasswordPayload = {
  oneTimePassword: '',
  password: '',
  passwordConfirmation: '',
};

const ResetPassword = ({ handleSubmit }: ResetPasswordProps) => {
  const { showV3Snackbar } = useV3Snackbar();

  const validationSchema = Yup.object().shape({
    oneTimePassword: Yup.string()
      .required('Campo obrigatório')
      .matches(/^\d+$/, 'Preencha os seis dígitos númericos corretamente'),
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
        Criar nova senha
      </Typography>
      <Formik
        onSubmit={(values) =>
          handleSubmit(values)
            .then(() => {
              showV3Snackbar(
                'Nova senha criada com sucesso.',
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
                  err.response.data.message.includes('Código')
                    ? 'Código inválido!'
                    : 'Algo deu errado!'
                }`
              )
            )
        }
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        {(formik) => (
          <Form className="px-12 sm:px-0 xl:w-1/4 space-y-4">
            <div className="flex flex-col items-center space-y-2">
              <Typography variant="bodySm" family="jakarta" color="darkGray">
                Preencha os dados abaixo:
              </Typography>
              <div className="w-full">
                <Input
                  label="Código"
                  textColor="cidOrange"
                  borderColor="cidOrange"
                  focusBorderColor="cidOrange"
                  placeholderColor="gray"
                  type="text"
                  w="full"
                  placeholder="Insira o código recebido"
                  name="oneTimePassword"
                  value={formik.values.oneTimePassword}
                  onChange={formik.handleChange}
                  maxLength={6}
                  error={
                    formik.values.oneTimePassword
                      ? formik.values.oneTimePassword.length !== 6
                      : formik.errors.oneTimePassword
                      ? true
                      : false
                  }
                />
                {formik.touched.oneTimePassword &&
                formik.errors.oneTimePassword ? (
                  <Typography variant="label" color="error" family="jakarta">
                    {formik.errors.oneTimePassword}
                  </Typography>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() =>
                  router.push(`/flow-cidadao/recover-unlock-password`)
                }
              >
                <Typography
                  variant="headline5"
                  family="jakartaMedium"
                  color="primary"
                >
                  Solicitar novo código
                </Typography>
              </button>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Typography variant="bodySm" family="jakarta" color="darkGray">
                Cadastre abaixo sua nova senha:
              </Typography>
              <div className="w-full">
                <Input
                  label="Senha"
                  textColor="cidOrange"
                  borderColor="cidOrange"
                  focusBorderColor="cidOrange"
                  placeholderColor="gray"
                  type="password"
                  w="full"
                  placeholder="Insira a nova senha"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  disabled={!formik.values.oneTimePassword}
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
                  label="Confirme sua senha"
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
                  disabled={!formik.values.oneTimePassword}
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
      <button type="button" onClick={() => router.push('/flow-cidadao/login')}>
        <Typography variant="headline5" family="jakartaMedium" color="primary">
          Retornar à tela de login
        </Typography>
      </button>
    </main>
  );
};

export default ResetPassword;
