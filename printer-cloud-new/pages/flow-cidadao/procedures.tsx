import * as React from 'react';
import Head from 'next/head';
import { AuthExternalProvider } from '../../hooks';
import ExternalProcedures from '../../FlowCidadao/Procedure';
import Layout from '../../FlowCidadao/components/Layout';

const ProcedurePage = () => {
  return (
    <div className="grid min-h-screen">
      <Head>
        <title>Flow Cidadão | Processos</title>
      </Head>
      <Layout
        internal={false}
        subtitle="Com o Flow Cidadão você pode criar solicitações e acompanhar processos."
      >
        <ExternalProcedures />
      </Layout>
    </div>
  );
};

const ProcedurePageContainer = () => {
  return (
    <AuthExternalProvider>
      <ProcedurePage />
    </AuthExternalProvider>
  );
};

export default ProcedurePageContainer;
