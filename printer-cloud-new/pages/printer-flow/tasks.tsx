import * as React from 'react';
import Head from 'next/head';
import getConfig from 'next/config';
import { Icon, Typography } from 'printer-ui';
import {
  SessionGroupRequesterProvider,
  useSessionGroupRequester,
  useAws,
} from '../../hooks';
import { NextPageWithLayout } from '../_app';
import Layout from '../../PrinterFlow/components/Layout';
import Header from '../../components/Layout/Header';
import UnauthorizedMessage from '../../PrinterFlow/components/Procedures/Unauthorized';
import TasksPageSkeleton from '../../PrinterFlow/components/Tasks/Skeleton';
import Tasks from '../../PrinterFlow/Tasks';

const TaskPage: NextPageWithLayout = ({ credentials }) => {
  const { sessionGroupRequester, unauthorized } = useSessionGroupRequester();
  const { setCredentials } = useAws();

  React.useEffect(() => {
    setCredentials(credentials);
  }, [credentials]);

  return (
    <>
      <Head>
        <title> Printer Flow | Tarefas</title>
      </Head>
      <Header className="pl-4 sm:pl-4 flex items-center mt-8 mb-1 sm:m-0">
        <Icon
          alt="signature"
          name="tasksV3"
          stroke
          w={35}
          h={35}
          color="darkGray"
        />
        <Typography
          variant="title2"
          family="robotoMedium"
          color="darkGray"
          className="items-center justify-center pl-2 sm:m-0"
        >
          Tarefas
        </Typography>
      </Header>
      <div className="sm:mr-10 sm:mt-5 px-4">
        {!sessionGroupRequester.id ? (
          unauthorized ? (
            <UnauthorizedMessage />
          ) : (
            <TasksPageSkeleton />
          )
        ) : (
          <Tasks />
        )}
      </div>
    </>
  );
};

TaskPage.getLayout = (page: React.ReactElement) => {
  return (
    <SessionGroupRequesterProvider>
      <Layout>{page}</Layout>
    </SessionGroupRequesterProvider>
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

export default TaskPage;
