import * as React from 'react';
import Head from 'next/head';
import getConfig from 'next/config';
import Link from 'next/link';
import router from 'next/router';
import ReCAPTCHA from 'react-google-invisible-recaptcha';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { Button, Input, Typography } from 'printer-ui';
import { useAuth, useSnackbar, useSession } from '../hooks';
import { Auth, UserService } from '../services';
import Branding from '../components/Branding';
import PasswordChecklist from '../components/PasswordChecklist';
import Footer from '../components/Footer';

interface ChangePasswordProps {
  secret: string;
}

const siteKey =
  getConfig().publicRuntimeConfig.NEXT_PUBLIC_RECAPTCHA_SITE_KEY_INVISIBLE;

const ChangePassword = ({ secret }: ChangePasswordProps) => {
  const { subdomain, token } = useAuth();
  const { session } = useSession();
  const { showSnackbar } = useSnackbar();
  const captchaRef = React.useRef<ReCAPTCHA>(null);
  const [captchaToken, setCaptchaToken] = React.useState<string>('');

  const handleBlur = () => {
    if (!captchaToken) return captchaRef.current?.execute();
  };

  const handleSubmit = (values, actions) => {
    Auth.recaptcha(captchaToken, secret).then((res) => {
      if (res.data.success === true) {
        UserService.updatePassword(token, subdomain, session.user.id, values)
          .then(() => {
            showSnackbar('Senha alterada com sucesso.', 'success');
            router.push('/printer-cloud/home');
          })
          .catch((error) => {
            showSnackbar(error.response.data.message, 'error');
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
    <div className="bg-[url(/assets/login-bg-mobile.png)] sm:bg-[url(/assets/login-bg.png)] bg-bottom min-h-screen bg-cover">
      <Head>
        <title>Printer Cloud | Alterar senha</title>
      </Head>
      <main>
        <div>
          <div className="pt-12 flex justify-center">
            <Branding />
          </div>
          <Formik
            initialValues={{
              currentPassword: '',
              password: '',
              passwordConfirmation: '',
            }}
            validationSchema={Yup.object().shape({
              currentPassword: Yup.string().required('Campo obrigatório'),
              password: Yup.string().required('Campo obrigatório'),
              passwordConfirmation: Yup.string()
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
                      variant="body"
                      color="darkGray"
                      align="center"
                      className="text-[14px] sm:text-[15px]"
                    >
                      Sua senha deve ser atualizada
                    </Typography>
                  </div>
                  <div className="grid justify-center mb-2">
                    <div className="flex-column justify-center mt-2 space-y-2">
                      <Input
                        placeholder="password"
                        name="currentPassword"
                        w={48}
                        onChange={formik.handleChange}
                        className="sm:h-12 sm:text-base sm:w-60"
                        type="password"
                        value={formik.values.currentPassword}
                        onBlur={handleBlur}
                      />
                      {formik.touched.currentPassword &&
                        formik.errors.currentPassword && (
                          <Typography variant="footnote2" color="error">
                            * {formik.errors.currentPassword}
                          </Typography>
                        )}
                    </div>
                    <div className="flex-column justify-center mt-2 space-y-2">
                      <Input
                        placeholder="newPassword"
                        name="password"
                        w={48}
                        onChange={formik.handleChange}
                        className="sm:h-12 sm:text-base sm:w-60"
                        type="password"
                        value={formik.values.password}
                        pattern="(?=.*\W)(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        onBlur={handleBlur}
                      />
                      {formik.touched.password && formik.errors.password && (
                        <Typography variant="footnote2" color="error">
                          * {formik.errors.password}
                        </Typography>
                      )}
                    </div>
                    <div className="flex-column justify-center mt-2 space-y-2">
                      <Input
                        placeholder="repeatPassword"
                        name="passwordConfirmation"
                        w={48}
                        onChange={formik.handleChange}
                        className="sm:h-12 sm:text-base sm:w-60"
                        type="password"
                        value={formik.values.passwordConfirmation}
                        pattern="(?=.*\W)(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        onBlur={handleBlur}
                      />
                      {formik.touched.passwordConfirmation &&
                        formik.errors.passwordConfirmation && (
                          <Typography variant="footnote2" color="error">
                            * {formik.errors.passwordConfirmation}
                          </Typography>
                        )}
                    </div>
                  </div>
                  <div className="grid justify-center ml-16" id="message">
                    <PasswordChecklist password={formik.values.password} />
                  </div>
                  <div className="mt-2 grid justify-center mb-2 ml-6">
                    <ReCAPTCHA
                      sitekey={siteKey}
                      ref={captchaRef}
                      onResolved={(value) => setCaptchaToken(value)}
                    />
                  </div>
                  <div className="grid justify-center pt-8 invisible sm:visible absolute sm:relative ">
                    <Button
                      color="info"
                      size="md"
                      disabled={formik.isSubmitting}
                      label="Alterar senha"
                      type="submit"
                    />
                  </div>
                  <div className="grid text-center mt-6">
                    <div className="font-roboto-700 text-info text-sm">
                      <Link href="/printer-cloud/home">Pular</Link>
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

export default ChangePassword;
