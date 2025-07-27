import * as React from 'react';
import getConfig from 'next/config';
import Head from 'next/head';
import {
  AuthExternalProvider,
  ExternalSessionProvider,
  useAws,
} from '../../hooks';
import Layout from '../../FlowCidadao/components/Layout';
import ExternalTasks from '../../FlowCidadao/Tasks';

const TasksPage = () => {
  return (
    <div className="min-h-screen grid">
      <Head>
        <title>Flow Cidadão | Tarefas</title>
      </Head>
      <Layout
        internal={false}
        subtitle="Aqui se encontram as tarefas solicitadas a você."
      >
        <ExternalTasks />
      </Layout>
    </div>
  );
};

const TasksPageContainer = ({ credentials }) => {
  const { setCredentials } = useAws();

  React.useEffect(() => {
    setCredentials(credentials);
  }, [credentials]);

  return (
    <AuthExternalProvider>
      <ExternalSessionProvider>
        <TasksPage />
      </ExternalSessionProvider>
    </AuthExternalProvider>
  );
};

export async function getServerSideProps() {
  const { serverRuntimeConfig } = getConfig();

  return {
    props: {
      secret: getConfig().serverRuntimeConfig.RECAPTCHA_SECRET_KEY,
      credentials: {
        accessKeyId: serverRuntimeConfig.AWS_ACCESS_KEY_ID,
        secretAccessKey: serverRuntimeConfig.AWS_SECRET_ACCESS_KEY,
      },
    },
  };
}

export default TasksPageContainer;
