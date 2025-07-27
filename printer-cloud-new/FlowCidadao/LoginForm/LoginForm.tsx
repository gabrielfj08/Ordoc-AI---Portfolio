import * as React from 'react';
import * as Yup from 'yup';
import router from 'next/router';
import getConfig from 'next/config';
import { Form, Formik } from 'formik';
import { cpfCnpjMask } from '../../utils';
import ReCAPTCHA from 'react-google-recaptcha';
import {
  InputV3 as Input,
  ButtonV3 as Button,
  TypographyV3 as Typography,
} from 'printer-ui';
import { RequesterAuth } from '../../services/flow-cidadao';
import { useExternalAuth, useV3Snackbar } from '../../hooks';
import { LoginFormProps, LoginFormValues } from './types';

const siteKey = getConfig().publicRuntimeConfig.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

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
  const { startExternalSession } = useExternalAuth();
  const captchaRef = React.useRef<ReCAPTCHA>(null);
  const { showV3Snackbar } = useV3Snackbar();

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <div className="space-y-2">
        <div className="justify-center items-center flex">
          <Typography family="jakartaBold" variant="headline5" color="darkGray">
            Login
          </Typography>
        </div>
        <div className="justify-center items-center flex">
          <Typography family="jakartaLight" variant="bodySm" color="darkGray">
            Preencha os dados abaixo:
          </Typography>
        </div>
      </div>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          const captchaToken = captchaRef.current?.getValue();
          captchaRef.current?.reset();

          RequesterAuth.recaptcha(captchaToken, secret).then((res) => {
            if (res.data.success === true) {
              onSubmit(values)
                .then((res) => {
                  startExternalSession(res.data.token);
                })
                .catch((err) => {
                  showV3Snackbar(
                    err.response.data.message,
                    'error',
                    `${snackbarTitle(err.response.data.message)}`
                  );
                })
                .finally(() => {
                  actions.setSubmitting(false);
                });
            } else {
              actions.setSubmitting(false);
              showV3Snackbar(
                'Por favor, verifique que você não é um robô.',
                'error',
                'Recaptcha não selecionado!'
              );
            }
          });
        }}
        validationSchema={Yup.object().shape({
          cpfCnpj: Yup.string().required('Campo obrigatório'),
          password: Yup.string().required('Campo obrigatório'),
        })}
        enableReinitialize
        validateOnChange={false}
      >
        {(formik) => (
          <Form className="xl:w-1/4 px-4 sm:px-0">
            <div className="justify-center space-y-2">
              <Input
                label="Login*"
                textColor="cidOrange"
                borderColor="cidOrange"
                focusBorderColor="cidOrange"
                placeholderColor="gray"
                maxLength={18}
                w="full"
                name="cpfCnpj"
                type="text"
                placeholder="Insira o CPF ou CNPJ cadastrado"
                onChange={formik.handleChange}
                value={cpfCnpjMask(formik.values.cpfCnpj)}
                error={
                  formik.values.cpfCnpj
                    ? formik.values.cpfCnpj.length < 14
                    : formik.errors.cpfCnpj
                    ? true
                    : false
                }
              />
              {formik.touched.cpfCnpj && formik.errors.cpfCnpj ? (
                <Typography family="jakarta" variant="label" color="error">
                  {formik.errors.cpfCnpj}
                </Typography>
              ) : null}
              <Input
                label="Senha*"
                textColor="cidOrange"
                borderColor="cidOrange"
                focusBorderColor="cidOrange"
                placeholderColor="gray"
                w="full"
                id="password"
                name="password"
                type="password"
                placeholder="Insira sua senha"
                onChange={formik.handleChange}
                value={formik.values.password}
                error={
                  formik.touched.password && formik.errors.password
                    ? true
                    : false
                }
              />
              {formik.touched.password && formik.errors.password ? (
                <Typography family="jakarta" variant="label" color="error">
                  {formik.errors.password}
                </Typography>
              ) : null}
            </div>
            <div className="flex-column justify-center mt-4 space-y-2">
              <div className="grid justify-center space-y-2">
                <ReCAPTCHA sitekey={siteKey} ref={captchaRef} />
              </div>
              <div className="grid justify-center pt-2 sm:invisible sm:absolute">
                <Button
                  color="info"
                  size="sm"
                  type="submit"
                  disabled={formik.isSubmitting}
                  label="Entrar"
                />
              </div>
              <div className="grid justify-center pt-2 invisible sm:visible absolute sm:relative space-y-8">
                <Button
                  color="info"
                  type="submit"
                  disabled={formik.isSubmitting}
                  label="Entrar"
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>
      <div className="flex-column justify-center mt-4 space-y-2">
        <button
          onClick={() => router.push('/flow-cidadao/recover-unlock-password')}
        >
          <Typography variant="bodyMd" family="jakartaMedium" color="info">
            Recuperar senha / desbloquear conta
          </Typography>
        </button>
        <div className="flex justify-center pb-6">
          <button onClick={() => router.push('/flow-cidadao/new-requester')}>
            <Typography variant="bodyMd" family="jakartaMedium" color="info">
              Criar conta
            </Typography>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
