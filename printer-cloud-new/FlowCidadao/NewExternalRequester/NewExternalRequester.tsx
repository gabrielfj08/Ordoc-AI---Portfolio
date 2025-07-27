import * as React from 'react';
import * as Yup from 'yup';
import router from 'next/router';
import getConfig from 'next/config';
import { Form, Formik } from 'formik';
import ReCAPTCHA from 'react-google-recaptcha';
import {
  CheckboxV3 as Checkbox,
  ButtonV3 as Button,
  TypographyV3 as Typography,
} from 'printer-ui';
import { useModal, useV3Snackbar } from '../../hooks';
import { phoneMask, emailMask, noEmojiValidator } from '../../utils';
import { RequesterAuth } from '../../services/flow-cidadao';
import { NewExternalRequesterFormProps } from './types';
import PrivacyTermsModal from '../components/PrivacyTerms';
import NewRegistrationRequesterForm from './Registration';
import NotificationRequester from './Notification';
import NewAddressRequesterForm from './Address';

const siteKey = getConfig().publicRuntimeConfig.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

const initialValues = {
  name: '',
  cpfCnpj: '',
  email: '',
  birthDate: '',
  phone: '',
  optionalPhone: '',
  optionalEmail: '',
  occupation: '',
  notification: '',
  address: {
    street: '',
    number: 0,
    complement: '',
    city: '',
    state: '',
    postalCode: '',
    neighborhood: '',
  },
  checkbox: false,
};

const NewExternalRequesterForm = ({
  onSubmit,
  secret,
}: NewExternalRequesterFormProps) => {
  const captchaRef = React.useRef<ReCAPTCHA>(null);
  const { showV3Snackbar } = useV3Snackbar();
  const { openModal } = useModal();

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <div className="space-y-2">
        <div className="justify-center items-center flex">
          <Typography family="jakartaBold" variant="headline5" color="darkGray">
            Cadastro de novo usuário
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
                .then(() => {
                  router.push('/flow-cidadao/login');
                  showV3Snackbar(
                    values.notification.includes('sms')
                      ? `Por favor, verifique a caixa de mensagens do número  ${phoneMask(
                          values.phone
                        )}`
                      : `Por favor, verifique a caixa de mensagens do email ${emailMask(
                          values.email
                        )}`,
                    'success',
                    'Usuário criado com sucesso.'
                  );
                })
                .catch((err) => {
                  showV3Snackbar(
                    `${
                      (err.response.data.message
                        ? err.response.data.message
                        : 'Verifique os dados informados e tente novamente.',
                      err.response.data.message.includes('cpf')
                        ? 'Retorne à tela de login  e utilize o nome de usuário e senha cadastrados anteriormente.'
                        : 'Verifique o email informado e tente novamente.')
                    }`,
                    'error',
                    `${
                      err.response.data.message.includes('cpf')
                        ? err.response.data.message
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
          name: Yup.string()
            .required('Campo obrigatório')
            .test(
              'regex',
              'Não utilize emojis (desenhos ou pictogramas).',
              noEmojiValidator
            ),
          cpfCnpj: Yup.string().required('Campo obrigatório'),
          email: Yup.string()
            .required('Campo obrigatório')
            .matches(/^[^*]+$/, 'Nome não pode conter "*"')
            .test(
              'regex',
              'Não utilize emojis (desenhos ou pictogramas).',
              noEmojiValidator
            ),
          optionalEmail: Yup.string()
            .matches(/^[^*]+$/, 'Nome não pode conter "*"')
            .test(
              'regex',
              'Não utilize emojis (desenhos ou pictogramas).',
              noEmojiValidator
            ),
          birthDate: Yup.string().required('Campo obrigatório'),
          phone: Yup.string().required('Campo obrigatório'),
          occupation: Yup.string()
            .matches(/^[^*]+$/, 'Nome não pode conter "*"')
            .test(
              'regex',
              'Não utilize emojis (desenhos ou pictogramas).',
              noEmojiValidator
            ),
          notification: Yup.string().required('Escolha uma das opções'),
          address: Yup.object().shape({
            postalCode: Yup.string().required('Campo obrigatório'),
            street: Yup.string()
              .required('Campo obrigatório')
              .matches(/^[^*]+$/, 'Nome não pode conter "*"')
              .test(
                'regex',
                'Não utilize emojis (desenhos ou pictogramas).',
                noEmojiValidator
              ),
            number: Yup.number().required('Campo obrigatório'),
            complement: Yup.string()
              .matches(/^[^*]+$/, 'Nome não pode conter "*"')
              .test(
                'regex',
                'Não utilize emojis (desenhos ou pictogramas).',
                noEmojiValidator
              ),
            city: Yup.string().required('Campo obrigatório'),
            state: Yup.string().required('Campo obrigatório'),
            neighborhood: Yup.string()
              .required('Campo obrigatório')
              .matches(/^[^*]+$/, 'Nome não pode conter "*"')
              .test(
                'regex',
                'Não utilize emojis (desenhos ou pictogramas).',
                noEmojiValidator
              ),
          }),
          checkbox: Yup.bool().oneOf(
            [true],
            'Marque a caixa acima para prosseguir'
          ),
        })}
        validateOnChange={false}
        validateOnBlur={false}
        enableReinitialize
      >
        {(formik) => (
          <Form className="xl:w-8/12 space-y-2 px-4 sm:px-0">
            <NewRegistrationRequesterForm />
            <NotificationRequester />
            <NewAddressRequesterForm />
            <div className="justify-center items-center sm:space-x-2 flex pt-4">
              <div className="grid items-center justify-center">
                <label
                  id="checkbox"
                  className="cursor-pointer flex justify-center items-center space-x-2"
                >
                  <Checkbox
                    id="checkbox"
                    name="checkbox"
                    onChange={formik.handleChange}
                    checked={formik.values.checkbox}
                  />
                  <Typography variant="bodyMd" family="jakarta">
                    Li e concordo com a
                  </Typography>
                </label>
                <Typography variant="bodyMd" family="jakarta" color="info">
                  <button
                    type="button"
                    onClick={() => openModal(<PrivacyTermsModal />)}
                  >
                    Política de Privacidade e Termos de Uso
                  </button>
                </Typography>
                <div className="pt-2 justify-center items-center flex">
                  {formik.errors.checkbox ? (
                    <Typography family="jakarta" variant="label" color="error">
                      {formik.errors.checkbox}
                    </Typography>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="grid justify-center pt-4">
              <ReCAPTCHA sitekey={siteKey} ref={captchaRef} />
            </div>
            <div className="flex-column justify-center pt-2">
              <div className="grid justify-center py-4 sm:invisible sm:absolute">
                <Button
                  color="info"
                  size="sm"
                  type="submit"
                  label="Criar conta"
                  disabled={formik.isSubmitting}
                />
              </div>
              <div className="grid justify-center py-4 invisible sm:visible absolute sm:relative space-y-8">
                <Button
                  color="info"
                  type="submit"
                  label="Criar conta"
                  disabled={formik.isSubmitting}
                />
              </div>
            </div>
            <div className="flex h-fit w-full justify-center pb-4">
              <button onClick={() => router.push('/flow-cidadao/login')}>
                <Typography
                  variant="bodyMd"
                  family="jakartaMedium"
                  color="info"
                >
                  Retornar a tela de login
                </Typography>
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default NewExternalRequesterForm;
