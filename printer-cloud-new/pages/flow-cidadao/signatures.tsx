import * as React from 'react';
import Head from 'next/head';
import { AuthExternalProvider } from '../../hooks';
import ExternalSignatures from '../../FlowCidadao/Signature';
import Layout from '../../FlowCidadao/components/Layout';

const SignaturePage = () => {
  return (
    <div className="grid min-h-screen">
      <Head>
        <title>Flow Cidadão | Assinaturas</title>
      </Head>
      <Layout
        internal={false}
        subtitle="Aqui se encontram os documentos que requerem sua assinatura, os assinados e recusados."
      >
        <ExternalSignatures />
      </Layout>
    </div>
  );
};

const SignaturePageContainer = () => {
  return (
    <AuthExternalProvider>
      <SignaturePage />
    </AuthExternalProvider>
  );
};

export default SignaturePageContainer;
