import * as React from 'react';
import Head from 'next/head';
import { Icon, Typography } from 'printer-ui';
import { NextPageWithLayout } from '../_app';
import { SessionGroupRequesterProvider } from '../../hooks';
import Layout from '../../PrinterFlow/components/Layout';
import Header from '../../components/Layout/Header';
import TaskTemplates from '../../PrinterFlow/TaskTemplates';

const TaskTemplatesPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title> Printer Flow | Tipos de tarefa</title>
      </Head>
      <Header className="pl-4 flex items-center mt-8 mb-1 sm:m-0">
        <Icon
          alt="taskTemplate"
          name="taskTemplateV3"
          stroke
          w={40}
          h={40}
          color="darkGray"
        />
        <Typography
          variant="title2"
          family="robotoMedium"
          color="darkGray"
          className="pl-2"
        >
          Tipos de tarefa
        </Typography>
      </Header>
      <TaskTemplates />
    </>
  );
};

TaskTemplatesPage.getLayout = (page: React.ReactElement) => {
  return (
    <SessionGroupRequesterProvider>
      <Layout>{page}</Layout>
    </SessionGroupRequesterProvider>
  );
};

export default TaskTemplatesPage;
