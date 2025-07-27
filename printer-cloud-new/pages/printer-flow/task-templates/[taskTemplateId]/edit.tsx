import * as React from 'react';
import router from 'next/router';
import Head from 'next/head';
import { ButtonRounded, Icon, Typography } from 'printer-ui';
import { SessionGroupRequesterProvider } from '../../../../hooks';
import { NextPageWithLayout } from '../../../_app';
import Layout from '../../../../PrinterFlow/components/Layout';
import Header from '../../../../components/Layout/Header';
import EditTaskTemplate from '../../../../PrinterFlow/TaskTemplates/Edit';

const EditTaskTemplatePage: NextPageWithLayout = () => {
  if (!Number(router.query.taskTemplateId)) return null;

  return (
    <>
      <Head>
        <title> Printer Flow | Editar Tipo de Tarefa</title>
      </Head>
      <Header className="pl-4 truncate mt-8 sm:mt-0">
        <div className="sm:flex hidden">
          <ButtonRounded
            className="sm:mr-4"
            onClick={() => {
              router.push(
                `/printer-flow/task-templates/${router.query.taskTemplateId}`
              );
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
        </div>
        <div className="sm:mr-10 flex items-center sm:justify-between w-full">
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
            className="w-32 sm:w-full pl-2 mr-4"
          >
            Editar tipo de tarefa
          </Typography>
        </div>
      </Header>
      <div className="mt-5">
        <EditTaskTemplate
          taskTemplateId={Number(router.query.taskTemplateId)}
        />
      </div>
    </>
  );
};

EditTaskTemplatePage.getLayout = (page: React.ReactElement) => {
  return (
    <SessionGroupRequesterProvider>
      <Layout>{page}</Layout>
    </SessionGroupRequesterProvider>
  );
};

export default EditTaskTemplatePage;
