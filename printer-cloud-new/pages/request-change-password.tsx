import * as React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Typography, Button, Input } from 'printer-ui';
import { useSnackbar } from '../hooks';
import { Auth } from '../services';
import { useAuth } from '../hooks';
import Footer from '../components/Footer';
import Branding from '../components/Branding';

const RequestChangePsw = () => {
  const { subdomain } = useAuth();
  const { showSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email('E-mail inválido')
        .required('Campo obrigatório'),
    }),
    onSubmit: (values) => {
      Auth.requestChangePsw(subdomain, values)
        .then((res) => {
          if (res.status === 200) {
            showSnackbar(
              'Verifique seu e-mail para redefinir sua senha.',
              'success'
            );
          }
        })
        .catch((err) => {
          if (err.response.status === 404) {
            showSnackbar(
              'E-mail inválido. Verifique os dados inseridos.',
              'error'
            );
          } else {
            showSnackbar(
              'Um erro inesperado ocorreu, tente novamente.',
              'error'
            );
          }
        });
    },
  });

  return (
    <div
      className="bg-[url(/assets/login-bg-mobile.png)] bg-cover w-full h-auto min-h-screen 
                 sm:bg-[url(/assets/login-bg.png)] sm:bg-auto sm:bg-center sm:h-full sm:grid sm:bg-clip-border"
    >
      <Head>
        <title>Printer Cloud | Alterar senha</title>
      </Head>
      <main>
        <div className="pt-28 sm:pt-60 flex justify-center">
          <Branding />
        </div>
        <div className="grid justify-center mb-6 mt-4">
          <Typography
            variant="footnote1"
            color="darkGray"
            align="center"
            className="text-[14px] sm:text-[15px]"
          >
            Alterar senha
          </Typography>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="grid justify-center">
            <Input
              placeholder="email"
              id="email"
              name="email"
              w={48}
              onChange={formik.handleChange}
              className="mb-2 sm:h-12 sm:text-base sm:w-60"
              type="email"
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? (
              <Typography variant="footnote2" color="error">
                * {formik.errors.email}
              </Typography>
            ) : null}
          </div>
          <div className="grid justify-center pt-8 invisible sm:visible absolute sm:relative ">
            <Button
              color="info"
              size="md"
              type="submit"
              disabled={formik.isSubmitting}
              label="Reenviar e-mail"
            />
          </div>
          <div className="grid justify-center pt-8 sm:invisible sm:absolute">
            <Button
              color="info"
              size="sm"
              type="submit"
              disabled={formik.isSubmitting}
              label="Reenviar e-mail"
            />
          </div>
        </form>
        <div className="grid text-center mt-6 pb-36 space-y-6">
          <div className="font-roboto-700 text-info text-sm">
            <Link href="/login">Retornar ao acesso</Link>
          </div>
        </div>
        <footer>
          <Footer />
        </footer>
      </main>
    </div>
  );
};

export default RequestChangePsw;
