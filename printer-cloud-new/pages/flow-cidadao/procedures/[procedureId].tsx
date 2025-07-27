import * as React from 'react';
import Head from 'next/head';
import router from 'next/router';
import getConfig from 'next/config';
import { AuthExternalProvider, useAws } from '../../../hooks';
import Layout from '../../../FlowCidadao/components/Layout';
import ShowProcedure from '../../../FlowCidadao/ShowProcedure';

const ShowProcedurePage = ({ credentials }) => {
  const [procedureName, setProcedureName] = React.useState<string>('');
  const { setCredentials } = useAws();

  React.useEffect(() => {
    setCredentials(credentials);
  }, [credentials]);

  return (
    <div className="min-h-screen grid">
      <Head>
        <title>Flow Cidadão | Visualizar processo</title>
      </Head>
      <Layout
        internal
        title={`Processo ${procedureName}`}
        icon="doubleChevronLeft"
        subtitle="Aqui você visualiza os detalhes do processo."
        onClick={() => router.back()}
      >
        <div className="mx-4 sm:mx-6 my-4 sm:ml-20 sm:mr-10 sm:my-9">
          <ShowProcedure setProcedureName={setProcedureName} />
        </div>
      </Layout>
    </div>
  );
};

const ShowProcedurePageContainer = ({ credentials }) => {
  return (
    <AuthExternalProvider>
      <ShowProcedurePage credentials={credentials} />
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

export default ShowProcedurePageContainer;
