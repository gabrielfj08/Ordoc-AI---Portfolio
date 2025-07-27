import * as React from 'react';
import Head from 'next/head';
import { AuthExternalProvider } from '../../hooks';
import Transition from '../../FlowCidadao/Transition';

const StartSessionPage = () => {
  return (
    <div className="bg-[url(/assets/login-bg-flow-cidadao.png)] bg-right-bottom min-h-screen min-w-full bg-cover align-bottom grid">
      <Head>
        <title>Flow Cidadão</title>
      </Head>
      <main>
        <div className="sm:p-6 pt-10 sm:justify-start justify-center flex">
          <img src="../../assets/logo-cidadao.svg" />
        </div>
      </main>
      <Transition />
    </div>
  );
};

const StartSessionPageContainer = () => {
  return (
    <AuthExternalProvider>
      <StartSessionPage />
    </AuthExternalProvider>
  );
};

export default StartSessionPageContainer;
