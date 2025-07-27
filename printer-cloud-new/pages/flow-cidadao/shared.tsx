import * as React from 'react';
import Head from 'next/head';
import { AuthExternalProvider, ExternalSessionProvider } from '../../hooks';
import ExternalSharedProcedure from '../../FlowCidadao/SharedProcedure';
import Layout from '../../FlowCidadao/components/Layout';

const SharedPage = () => {
  return (
    <div className="min-h-screen grid">
      <Head>
        <title>Flow Cidadão | Compartilhados</title>
      </Head>
      <Layout
        internal={false}
        subtitle="Aqui você pode ver as solicitações de compartilhamento enviadas a você."
      >
        <ExternalSharedProcedure />
      </Layout>
    </div>
  );
};

const SharedPageContainer = () => {
  return (
    <AuthExternalProvider>
      <ExternalSessionProvider>
        <SharedPage />
      </ExternalSessionProvider>
    </AuthExternalProvider>
  );
};

export default SharedPageContainer;
