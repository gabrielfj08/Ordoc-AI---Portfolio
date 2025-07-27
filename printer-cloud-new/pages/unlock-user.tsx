import * as React from 'react';
import getConfig from 'next/config';
import * as Yup from 'yup';
import Link from 'next/link';
import Head from 'next/head';
import router from 'next/router';
import ReCAPTCHA from 'react-google-invisible-recaptcha';
import { Formik, Form } from 'formik';
import { Auth } from '../services';
import { useAuth, useSnackbar } from '../hooks';
import { Button, Input, Typography } from 'printer-ui';
import Footer from '../components/Footer';
import PasswordChecklist from '../components/PasswordChecklist';
import Branding from '../components/Branding';

interface UnlockUserProps {
  secret: string;
}

const siteKey =
  getConfig().publicRuntimeConfig.NEXT_PUBLIC_RECAPTCHA_SITE_KEY_INVISIBLE;

const UnlockUser = ({ secret }: UnlockUserProps) => {
  const { subdomain } = useAuth();
  const { showSnackbar } = useSnackbar();
  const captchaRef = React.useRef<ReCAPTCHA>(null);
  const [captchaToken, setCaptchaToken] = React.useState<string>('');

  const handleBlur = () => {
    if (!captchaToken) return captchaRef.current?.execute();
  };

  const handleSubmit = (values, actions) => {
    Auth.recaptcha(captchaToken, secret).then((res) => {
      if (res.data.success === true) {
        Auth.unlockUser(subdomain, values)
          .then(() => {
            showSnackbar('Usuário desbloqueado com sucesso.', 'success');
            router.push('/login');
          })
          .catch((error) => {
            if (error.response.status === 422) {
              router.push('/expired-token');
              showSnackbar(
                'Solicitação inválida, solicite o reenvio do e-mail.',
                'error'
              );
            } else {
              showSnackbar(error.response.data.message, 'error');
            }
            captchaRef.current?.reset();
            setCaptchaToken('');
          })
          .finally(() => {
            actions.setSubmitting(false);
          });
      } else {
        actions.setSubmitting(false);
        showSnackbar('Erro! Tente novamente mais tarde.', 'error');
      }
    });
  };

  return (
    <div className="bg-[url(/assets/login-bg-mobile.png)] bg-cover w-full h-auto min-h-screen sm:bg-[url(/assets/login-bg.png)] sm:bg-auto sm:bg-center sm:h-full sm:grid sm:bg-clip-border">
      <Head>
        <title>Printer Cloud | Desbloquear usuário</title>
      </Head>
      <main>
        <div>
          <div className="pt-28 flex justify-center">
            <Branding />
          </div>
          <Formik
            initialValues={{
              password: '',
              confirmPassword: '',
              unlockToken: router.query.reset_account_token,
            }}
            validationSchema={Yup.object().shape({
              password: Yup.string().required('Campo obrigatório'),
              confirmPassword: Yup.string()
                .required('Campo obrigatório')
                .oneOf([Yup.ref('password'), null], 'As senhas não coincidem'),
            })}
            onSubmit={handleSubmit}
          >
            {(formik) => {
              return (
                <Form>
                  <div className="grid justify-center mb-12 mt-4">
                    <Typography
                      variant="footnote1"
                      color="darkGray"
                      align="center"
                      className="text-[14px] sm:text-[15px]"
                    >
                      Desbloquear usuário
                    </Typography>
                  </div>
                  <div className="grid justify-center mb-2">
                    <div className="flex-column justify-center mt-2 space-y-2">
                      <Input
                        placeholder="newPassword"
                        id="password"
                        name="password"
                        w={48}
                        onChange={formik.handleChange}
                        className="sm:h-12 sm:text-base sm:w-60"
                        type="password"
                        value={formik.values.password}
                        pattern="(?=.*\W)(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        onBlur={handleBlur}
                      />
                      {formik.touched.password && formik.errors.password ? (
                        <Typography variant="footnote2" color="error">
                          * {formik.errors.password}
                        </Typography>
                      ) : null}
                    </div>
                    <div className="flex-column justify-center mt-2 space-y-2">
                      <Input
                        placeholder="repeatPassword"
                        id="confirmPassword"
                        name="confirmPassword"
                        w={48}
                        onChange={formik.handleChange}
                        className="sm:h-12 sm:text-base sm:w-60"
                        type="password"
                        value={formik.values.confirmPassword}
                        pattern="(?=.*\W)(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        onBlur={handleBlur}
                      />
                      {formik.touched.confirmPassword &&
                      formik.errors.confirmPassword ? (
                        <Typography variant="footnote2" color="error">
                          * {formik.errors.confirmPassword}
                        </Typography>
                      ) : null}
                    </div>
                  </div>
                  <div className="grid ml-16 justify-center" id="message">
                    <PasswordChecklist password={formik.values.password} />
                  </div>
                  <div className="mt-2 grid justify-center mb-2 ml-6">
                    <ReCAPTCHA
                      sitekey={siteKey}
                      ref={captchaRef}
                      onResolved={(value) => setCaptchaToken(value)}
                    />
                  </div>
                  <p id="recaptchaError"></p>
                  <div className="grid justify-center pt-8 invisible sm:visible absolute sm:relative ">
                    <Button
                      color="info"
                      size="md"
                      type="submit"
                      label="Alterar senha"
                      disabled={formik.isSubmitting}
                    />
                  </div>
                  <div className="grid justify-center pt-8 sm:invisible sm:absolute">
                    <Button
                      color="info"
                      size="sm"
                      type="submit"
                      label="Alterar senha"
                      disabled={formik.isSubmitting}
                    />
                  </div>
                  <div className="grid text-center mt-6">
                    <div className="font-roboto-700 text-info text-sm">
                      <Link href="/login">Retornar ao acesso</Link>
                    </div>
                  </div>
                  <div>
                    <Footer />
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </main>
    </div>
  );
};

export async function getServerSideProps() {
  return {
    props: {
      secret: getConfig().serverRuntimeConfig.RECAPTCHA_SECRET_KEY_INVISIBLE,
    },
  };
}

export default UnlockUser;
