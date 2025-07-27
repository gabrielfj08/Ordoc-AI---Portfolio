import * as React from 'react';
import Head from 'next/head';
import getConfig from 'next/config';
import { AuthExternalProvider } from '../../hooks';
import LoginFormContainer from '../../FlowCidadao/LoginForm';
import FooterFlowCidadao from '../../FlowCidadao/components/Footer';
import OrganizationLogo from '../../FlowCidadao/components/OrganizationLogo';

const LoginExternalRequesterPage = ({ secret }) => {
  return (
    <div className="bg-[url(/assets/login-bg-flow-cidadao-mb.png)] sm:bg-[url(/assets/login-bg-flow-cidadao.png)] bg-bottom min-h-screen min-w-full bg-cover align-bottom grid">
      <Head>
        <title>Flow Cidadão | Login</title>
      </Head>
      <main>
        <div className="sm:p-6 pt-10 sm:justify-start justify-center flex">
          <img src="../../assets/logo-cidadao.svg" />
        </div>
        <div className="flex justify-center pb-4 pt-16">
          <OrganizationLogo />
        </div>
        <LoginFormContainer secret={secret} />
      </main>
      <div className="items-end grid">
        <FooterFlowCidadao />
      </div>
    </div>
  );
};

const LoginExternalRequesterPageContainer = ({ secret }) => {
  return (
    <AuthExternalProvider>
      <LoginExternalRequesterPage secret={secret} />
    </AuthExternalProvider>
  );
};

export async function getServerSideProps() {
  return {
    props: {
      secret: getConfig().serverRuntimeConfig.RECAPTCHA_SECRET_KEY,
    },
  };
}

export default LoginExternalRequesterPageContainer;
