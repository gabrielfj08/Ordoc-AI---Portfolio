import * as React from 'react';
import * as Yup from 'yup';
import Head from 'next/head';
import getConfig from 'next/config';
import Link from 'next/link';
import ReCAPTCHA from 'react-google-invisible-recaptcha';
import { Formik, Form } from 'formik';
import { Button, Input, Typography } from 'printer-ui';
import { useAuth, useSnackbar } from '../hooks';
import { Auth } from '../services';
import Branding from '../components/Branding';
import Footer from '../components/Footer';

interface LoginPageProps {
  secret: string;
}

const siteKey =
  getConfig().publicRuntimeConfig.NEXT_PUBLIC_RECAPTCHA_SITE_KEY_INVISIBLE;

const initialValues = {
  username: '',
  password: '',
};

const LoginPage = ({ secret }: LoginPageProps) => {
  const { subdomain, startSession } = useAuth();
  const { showSnackbar } = useSnackbar();
  const captchaRef = React.useRef<ReCAPTCHA>(null);
  const formikRef = React.useRef<Formik>(null);

  const handleSubmit = (value) => {
    captchaRef.current?.execute();
  };

  const authenticateUser = (captchaToken) => {
    Auth.recaptcha(captchaToken, secret).then((res) => {
      if (res.data.success === true) {
        Auth.login(subdomain, formikRef.current?.values)
          .then((res) => {
            if (res.status === 200) {
              startSession(res.data.token);
            }
          })
          .catch((error) => {
            showSnackbar(error.response.data.message, 'error');
            captchaRef.current?.reset();
          })
          .finally(() => {
            formikRef.current?.setSubmitting(false);
          });
      } else {
        formikRef.current?.setSubmitting(false);
        captchaRef.current?.reset();
        showSnackbar(
          'Erro ao realizar a validação do captcha, recarregue a página e tente novamente',
          'error'
        );
      }
    });
  };

  return (
    <div className="bg-[url(/assets/login-bg-mobile.png)] bg-cover min-h-screen sm:bg-[url(/assets/login-bg.png)] bg-no-repeat">
      <Head>
        <title>Printer Cloud | Login</title>
      </Head>
      <main>
        <div>
          <div className="pt-24 flex justify-center">
            <Branding />
          </div>
          <Formik
            innerRef={formikRef}
            initialValues={initialValues}
            validationSchema={Yup.object().shape({
              password: Yup.string().required('Campo obrigatório'),
              username: Yup.string().required('Campo obrigatório'),
            })}
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={handleSubmit}
          >
            {(formik) => {
              return (
                <Form>
                  <div className="grid justify-center mt-12 space-y-2">
                    <Input
                      name="username"
                      type="text"
                      placeholder="Username"
                      onChange={formik.handleChange}
                      value={formik.values?.username}
                    />
                    {formik.touched.username && formik.errors.username ? (
                      <Typography variant="footnote2" color="error">
                        * {formik.errors.username}
                      </Typography>
                    ) : null}
                    <Input
                      id="password"
                      name="password"
                      onChange={formik.handleChange}
                      type="password"
                      value={formik.values.password}
                    />
                    {formik.touched.password && formik.errors.password ? (
                      <Typography variant="footnote2" color="error">
                        * {formik.errors.password}
                      </Typography>
                    ) : null}
                  </div>
                  <div className="flex-column justify-center mt-6 space-y-2">
                    <div className="grid justify-center space-y-2">
                      <ReCAPTCHA
                        sitekey={siteKey}
                        ref={captchaRef}
                        onResolved={(value) => authenticateUser(value)}
                      />
                    </div>
                    <div className="grid justify-center pt-4 sm:invisible sm:absolute">
                      <Button
                        color="info"
                        size="sm"
                        type="submit"
                        disabled={formik.isSubmitting}
                        label="Entrar"
                      />
                    </div>
                    <div className="grid justify-center pt-4 invisible sm:visible absolute sm:relative space-y-8">
                      <Button
                        color="info"
                        size="md"
                        type="submit"
                        disabled={formik.isSubmitting}
                        label="Entrar"
                      />
                    </div>
                    <div className="flex h-fit w-full justify-center pt-6">
                      <Typography
                        variant="footnote1"
                        family="robotoMedium"
                        color="info"
                        className="cursor-pointer"
                      >
                        <Link href="/recover-password">Recuperar senha</Link>
                      </Typography>
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </main>
      <div>
        <Footer />
      </div>
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

export default LoginPage;
