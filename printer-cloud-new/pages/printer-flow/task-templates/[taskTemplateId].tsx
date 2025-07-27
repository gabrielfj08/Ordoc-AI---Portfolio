import * as React from 'react';
import Head from 'next/head';
import router from 'next/router';
import getConfig from 'next/config';
import { Button, ButtonRounded, Icon, Typography, Skeleton } from 'printer-ui';
import { NextPageWithLayout } from '../../_app';
import { SessionGroupRequesterProvider, useAws } from '../../../hooks';
import { BaseTaskTemplate } from '../../../services/printer-flow/types';
import Layout from '../../../PrinterFlow/components/Layout';
import Header from '../../../components/Layout/Header';
import ShowTaskTemplate from '../../../PrinterFlow/TaskTemplates/Show';

const ShowTaskTemplatePage: NextPageWithLayout = ({ credentials }) => {
  const { setCredentials } = useAws();

  const [taskTemplate, setTaskTemplate] = React.useState<BaseTaskTemplate>({
    id: Number(router.query.taskTemplateId),
    name: '',
    description: '',
    status: '',
    organizationId: 0,
    prn: '',
    createdAt: '',
    updatedAt: '',
  });

  React.useEffect(() => {
    setCredentials(credentials);
  }, [credentials]);

  if (!Number(router.query.taskTemplateId)) return null;

  return (
    <>
      <Head>
        <title> Printer Flow | Visualizar Tipo de Tarefa</title>
      </Head>
      <Header className="pl-4 md:pr-10 pr-5 flex items-center justify-between truncate mt-8 mb-1 md:m-0">
        <div className="flex items-center md:w-[650px] w-[200px] truncate">
          <div className="hidden sm:block sm:w-fit p-2">
            <ButtonRounded
              className="sm:mr-2"
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
          </div>
          <Icon
            alt="taskTemplate"
            name="taskTemplateV3"
            stroke
            w={40}
            h={40}
            color="darkGray"
          />
          <div className="w-48 pl-2 sm:pl-0 sm:w-full truncate">
            <Typography
              variant="title2"
              family="robotoMedium"
              color="darkGray"
              className="truncate sm:pl-2 mr-4"
            >
              {taskTemplate.name}
            </Typography>
          </div>
        </div>
        <Button
          label="Editar"
          size="md"
          color="info"
          onClick={() => {
            router.push(
              `/printer-flow/task-templates/${Number(
                router.query.taskTemplateId
              )}/edit`
            );
          }}
          disabled={taskTemplate.status === 'inactive' ? true : false}
        >
          <Button.Icon
            alt="write"
            name="write"
            color="white"
            fill
            stroke
            h={23}
            w={23}
          />
        </Button>
      </Header>
      <div className="mt-5">
        <ShowTaskTemplate
          taskTemplateId={Number(router.query.taskTemplateId)}
          setTaskTemplate={setTaskTemplate}
        />
      </div>
    </>
  );
};

ShowTaskTemplatePage.getLayout = (page: React.ReactElement) => {
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

export default ShowTaskTemplatePage;
