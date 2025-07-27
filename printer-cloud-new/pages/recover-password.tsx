import * as React from 'react';
import Head from 'next/head';
import Branding from '../components/Branding';
import Link from 'next/link';
import { Typography } from 'printer-ui';
import RecoverPasswordForm from '../components/RecoverPassword';

const RedefinePasswordPage = () => {
  return (
    <div
      className="bg-[url(/assets/login-bg-mobile.png)] mi-w-screen
    min-h-screen sm:bg-[url(/assets/login-bg.png)] bg-fixed bg-cover bg-no-repeat"
    >
      <Head>
        <title>Printer Cloud | Recuperar Senha</title>
      </Head>
      <main>
        <div className="pt-24 flex justify-center">
          <Branding />
        </div>
        <div className="flex flex-col h-fit w-full items-center  pt-6 space-y-6">
          <Typography
            variant="footnote1"
            color="darkGray"
            family="robotoMedium"
          >
            Recuperar senha
          </Typography>
          <RecoverPasswordForm />
          <Typography
            variant="footnote1"
            family="robotoMedium"
            color="info"
            className="cursor-pointer"
          >
            <Link href="/login">Retornar ao acesso</Link>
          </Typography>
        </div>
      </main>
    </div>
  );
};

export default RedefinePasswordPage;
