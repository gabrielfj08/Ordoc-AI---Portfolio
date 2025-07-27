import * as React from 'react';
import Head from 'next/head';
import { AuthExternalProvider } from '../../hooks';
import ResetPassword from '../../FlowCidadao/ResetPassword';
import OrganizationLogo from '../../FlowCidadao/components/OrganizationLogo';
import FooterFlowCidadao from '../../FlowCidadao/components/Footer';

const ResetPasswordPage = () => {
  return (
    <div className="bg-[url(/assets/login-bg-flow-cidadao-mb.png)] sm:bg-[url(/assets/login-bg-flow-cidadao.png)] bg-bottom min-h-screen min-w-full bg-cover align-bottom grid">
      <Head>
        <title>Flow Cidadão | Criar Nova Senha</title>
      </Head>
      <main>
        <div className="sm:p-6 pt-10 sm:justify-start justify-center flex">
          <img src="../../assets/logo-cidadao.svg" />
        </div>
        <div className="flex justify-center pb-4 pt-11 sm:pt-0">
          <OrganizationLogo />
        </div>
        <ResetPassword />
      </main>
      <div className="items-end grid">
        <FooterFlowCidadao />
      </div>
    </div>
  );
};

const ResetPasswordPageContainer = () => {
  return (
    <AuthExternalProvider>
      <ResetPasswordPage />
    </AuthExternalProvider>
  );
};

export default ResetPasswordPageContainer;
