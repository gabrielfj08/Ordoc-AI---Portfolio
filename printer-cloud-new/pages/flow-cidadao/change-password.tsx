import * as React from 'react';
import Head from 'next/head';
import { AuthExternalProvider, ExternalSessionProvider } from '../../hooks';
import OrganizationLogo from '../../FlowCidadao/components/OrganizationLogo';
import FooterFlowCidadao from '../../FlowCidadao/components/Footer';
import ChangePassword from '../../FlowCidadao/ChangePassword';

const ChangePasswordPage = () => {
  return (
    <div className="bg-[url(/assets/login-bg-flow-cidadao-mb.png)] sm:bg-[url(/assets/login-bg-flow-cidadao.png)] bg-bottom min-h-screen min-w-full bg-cover align-bottom grid">
      <Head>
        <title>Flow Cidadão | Alterar Senha</title>
      </Head>
      <main>
        <div className="sm:p-6 pt-10 sm:justify-start justify-center flex">
          <img src="../../assets/logo-cidadao.svg" />
        </div>
        <div className="flex justify-center pb-4 pt-11 sm:pt-0">
          <OrganizationLogo />
        </div>
        <ChangePassword />
      </main>
      <div className="items-end grid">
        <FooterFlowCidadao />
      </div>
    </div>
  );
};

const ChangePasswordPageContainer = () => {
  return (
    <AuthExternalProvider>
      <ExternalSessionProvider>
        <ChangePasswordPage />
      </ExternalSessionProvider>
    </AuthExternalProvider>
  );
};

export default ChangePasswordPageContainer;
