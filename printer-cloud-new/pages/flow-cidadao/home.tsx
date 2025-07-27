import * as React from 'react';
import Head from 'next/head';
import { AuthExternalProvider } from '../../hooks';
import Layout from '../../FlowCidadao/components/Layout';
import Home from '../../FlowCidadao/Home';

const HomePage = () => {
  return (
    <div className="grid min-h-screen">
      <Head>
        <title>Flow Cidadão | Home</title>
      </Head>
      <Layout
        internal={false}
        subtitle="Esta é sua home. Por aqui, fica fácil de acompanhar seus processos, tarefas e assinaturas pendentes."
      >
        <Home />
      </Layout>
    </div>
  );
};

const ProcedurePageContainer = () => {
  return (
    <AuthExternalProvider>
      <HomePage />
    </AuthExternalProvider>
  );
};

export default ProcedurePageContainer;
