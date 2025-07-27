import * as React from 'react';
import Head from 'next/head';
import router from 'next/router';
import getConfig from 'next/config';
import {
  AuthExternalProvider,
  ExternalSessionProvider,
  useAws,
  useSession,
} from '../../../hooks';
import CreateProcedureStepper from '../../../FlowCidadao/components/Procedures/CreateProcedureStepper';
import NewExternalProcedures from '../../../FlowCidadao/NewProcedure';
import Layout from '../../../FlowCidadao/components/Layout';

const NewProcedurePage = ({ credentials }) => {
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
        subtitle="Com o Flow Cidadão você pode criar solicitações e acompanhar processos."
        icon="doubleChevronLeft"
        onClick={() => router.push('/flow-cidadao/procedures')}
      >
        <div className="w-full flex justify-center mt-6 sm:mt-8">
          <CreateProcedureStepper activeStep={1} />
        </div>
        <NewExternalProcedures />
      </Layout>
    </div>
  );
};

const NewProcedurePageContainer = ({ credentials }) => {
  return (
    <AuthExternalProvider>
      <ExternalSessionProvider>
        <NewProcedurePage credentials={credentials} />
      </ExternalSessionProvider>
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

export default NewProcedurePageContainer;
