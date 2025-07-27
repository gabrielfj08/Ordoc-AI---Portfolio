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
  RadioV3 as Radio,
} from 'printer-ui';
import { useV3Snackbar, useSnackbar } from '../../hooks';
import { RequesterAuth } from '../../services/flow-cidadao';
import {
  RecoverUnlockPasswordFormProps,
  RecoverUnlockPasswordForms,
} from './types';

const siteKey = getConfig().publicRuntimeConfig.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

const initialValues = {
  cpfCnpj: '',
  notification: '',
} as RecoverUnlockPasswordForms;

const RecoverUnlockPasswordForm = ({
  onSubmit,
  secret,
}: RecoverUnlockPasswordFormProps) => {
  const { showV3Snackbar } = useV3Snackbar();
  const captchaRef = React.useRef<ReCAPTCHA>(null);

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <div className="space-y-2">
        <div className="justify-center items-center flex">
          <Typography family="jakartaBold" variant="headline5" color="darkGray">
            Recuperação / desbloqueio de conta
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
                  router.push('/flow-cidadao/reset-password');
                  showV3Snackbar(
                    `${res.message}`,
                    'success',
                    'Código enviado!'
                  );
                })
                .catch((err) => {
                  showV3Snackbar(
                    err.response.data.message,
                    'error',
                    `${
                      err.response.data.message.includes('Solicitante')
                        ? 'Por favor, verifique o CPF/CNPJ informado!'
                        : 'Algo deu errado!'
                    }`
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
          notification: Yup.string().required('Escolha uma das opções'),
        })}
        enableReinitialize
        validateOnChange={false}
      >
        {(formik) => (
          <Form className="xl:w-1/4 px-4 sm:px-0">
            <div className="justify-center space-y-2">
              <Input
                label="Login"
                textColor="cidOrange"
                borderColor="cidOrange"
                focusBorderColor="cidOrange"
                placeholderColor="gray"
                maxLength={18}
                w="full"
                name="cpfCnpj"
                type="text"
                placeholder="Insira seu CPF ou CNPJ cadastrado"
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
              {formik.errors.cpfCnpj ? (
                <Typography family="jakarta" variant="label" color="error">
                  {formik.errors.cpfCnpj}
                </Typography>
              ) : null}
            </div>
            <div className="pt-10">
              <Typography
                family="jakartaBold"
                variant="bodySm"
                align="center"
                color="darkGray"
              >
                Receber código via:
              </Typography>
            </div>
            <div className="flex flex-col items-center justify-center space-y-3 my-5">
              <div className="flex space-x-6">
                <Radio
                  id="sms"
                  name="notification"
                  value="sms"
                  onChange={formik.handleChange}
                />
                <label
                  id="sms"
                  htmlFor="sms"
                  className="flex space-x-3 items-center cursor-pointer"
                >
                  <Typography family="jakartaBold" variant="bodySm">
                    SMS
                  </Typography>
                </label>
                <Radio
                  id="email"
                  name="notification"
                  value="email"
                  onChange={formik.handleChange}
                />
                <label
                  id="email"
                  htmlFor="email"
                  className="flex space-x-3 items-center cursor-pointer"
                >
                  <Typography family="jakartaBold" variant="bodySm">
                    E-mail
                  </Typography>
                </label>
              </div>
              {formik.errors.notification ? (
                <Typography family="jakarta" variant="label" color="error">
                  {formik.errors.notification}
                </Typography>
              ) : null}
            </div>
            <div className="grid justify-center pt-4">
              <ReCAPTCHA sitekey={siteKey} ref={captchaRef} />
            </div>
            <div className="flex-column justify-center pt-2">
              <div className="grid justify-center pt-4 sm:invisible sm:absolute">
                <Button
                  color="info"
                  size="sm"
                  type="submit"
                  label="Enviar"
                  disabled={formik.isSubmitting}
                />
              </div>
              <div className="grid justify-center pt-4 invisible sm:visible absolute sm:relative space-y-8">
                <Button
                  color="info"
                  type="submit"
                  label="Enviar"
                  disabled={formik.isSubmitting}
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>
      <div className="flex h-fit w-full justify-center pb-6">
        <button onClick={() => router.push('/flow-cidadao/login')}>
          <Typography variant="bodyMd" family="jakartaMedium" color="info">
            Retornar a tela de login
          </Typography>
        </button>
      </div>
    </div>
  );
};

export default RecoverUnlockPasswordForm;
