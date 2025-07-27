import * as React from 'react';
import router from 'next/router';
import Head from 'next/head';
import { ButtonRounded, Icon, Typography } from 'printer-ui';
import { NextPageWithLayout } from '../../_app';
import { SessionGroupRequesterProvider } from '../../../hooks';
import Layout from '../../../PrinterFlow/components/Layout';
import Header from '../../../components/Layout/Header';
import NewTaskTemplate from '../../../PrinterFlow/TaskTemplates/New';

const NewTaskTemplatePage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title> Printer Flow | Novo Tipo de Tarefa</title>
      </Head>
      <Header className="pl-4 flex items-center space-x-3 sm:space-x-0 mt-8 mb-1 sm:m-0 truncate">
        <ButtonRounded
          className="sm:mr-4"
          onClick={() => {
            router.push(`/printer-flow/task-templates`);
          }}
        >
          <Icon
            name="return"
            alt="voltar"
            color="gray"
            w={30}
            h={30}
            fill
            stroke
          />
        </ButtonRounded>
        <div className="sm:mr-10 space-x-3 sm:space-x-0 flex items-center sm:justify-between w-full">
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
            className="w-32 sm:w-full sm:pl-2 mr-4"
          >
            Novo tipo de tarefa
          </Typography>
        </div>
      </Header>
      <div className="mt-5">
        <NewTaskTemplate />
      </div>
    </>
  );
};

NewTaskTemplatePage.getLayout = (page: React.ReactElement) => {
  return (
    <SessionGroupRequesterProvider>
      <Layout>{page}</Layout>
    </SessionGroupRequesterProvider>
  );
};

export default NewTaskTemplatePage;
