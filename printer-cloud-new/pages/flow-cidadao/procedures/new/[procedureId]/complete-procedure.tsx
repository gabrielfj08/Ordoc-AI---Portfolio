import * as React from 'react';
import Head from 'next/head';
import getConfig from 'next/config';
import { AuthExternalProvider, useAws, useSession } from '../../../../../hooks';
import CreateProcedureStepper from '../../../../../FlowCidadao/components/Procedures/CreateProcedureStepper';
import NewProcedureFields from '../../../../../FlowCidadao/NewProcedureFields';
import Layout from '../../../../../FlowCidadao/components/Layout';

const CompleteProcedurePage = ({ credentials }) => {
  const { session } = useSession();
  const { setCredentials } = useAws();

  React.useEffect(() => {
    setCredentials(credentials);
  }, [credentials]);

  if (!session) return null;

  return (
    <div className="min-h-screen grid">
      <Head>
        <title>Flow Cidadão | Novo processo</title>
      </Head>
      <Layout
        internal={true}
        title="Novo processo"
        onClick={() => {}}
        subtitle="Com o Flow Cidadão você pode criar solicitações e acompanhar processos."
      >
        <div className="w-full flex justify-center mt-6 sm:mt-8">
          <CreateProcedureStepper activeStep={2} />
        </div>
        <NewProcedureFields />
      </Layout>
    </div>
  );
};

const CompleteProcedurePageContainer = ({ credentials }) => {
  return (
    <AuthExternalProvider>
      <CompleteProcedurePage credentials={credentials} />
    </AuthExternalProvider>
  );
};

export async function getServerSideProps() {
  const { serverRuntimeConfig } = getConfig();

  return {
    props: {
      credentials: {
        accessKeyId: serverRuntimeConfig.AWS_ACCESS_KEY_ID,
        secretAccessKey: serverRuntimeConfig.AWS_SECRET_ACCESS_KEY,
      },
    },
  };
}

export default CompleteProcedurePageContainer;
