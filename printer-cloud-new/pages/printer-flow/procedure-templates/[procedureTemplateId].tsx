import * as React from 'react';
import Head from 'next/head';
import router from 'next/router';
import getConfig from 'next/config';
import { Button, ButtonRounded, Icon, Typography, Skeleton } from 'printer-ui';
import { NextPageWithLayout } from '../../_app';
import {
  SessionGroupRequesterProvider,
  useAws,
  useModal,
} from '../../../hooks';
import { ShowProcedureTemplate } from '../../../services/printer-flow/types';
import Layout from '../../../PrinterFlow/components/Layout';
import Header from '../../../components/Layout/Header';
import ShowProcedureTemplateContainer from '../../../PrinterFlow/ProcedureTemplates/Show';
import FieldDocumentTemplatePreviewModal from '../../../PrinterFlow/ProcedureTemplates/FieldDocumentTemplates/Modals/Preview';

const ShowProcedureTemplatePage: NextPageWithLayout = ({
  credentials,
  procedureTemplateDocument,
}) => {
  const { setCredentials } = useAws();
  const { openModal } = useModal();

  const [procedureTemplate, setProcedureTemplate] =
    React.useState<ShowProcedureTemplate>({
      id: Number(router.query.procedureTemplateId),
      name: '',
      prn: '',
      source: '',
      status: '',
      organizationId: 0,
      parentProcedureTemplateId: null,
      groupRequesterId: null,
      createdAt: '',
      updatedAt: '',
      groupRequester: null,
      proceduresCount: 0,
    });

  React.useEffect(() => {
    if (router.query.fieldDocumentTemplateId)
      openModal(
        <FieldDocumentTemplatePreviewModal
          fieldDocumentTemplateId={Number(router.query.fieldDocumentTemplateId)}
        />
      );
  }, [router.query.fieldDocumentTemplateId]);

  React.useEffect(() => {
    setCredentials(credentials);
  }, [credentials]);

  if (!Number(router.query.procedureTemplateId)) return null;

  return (
    <>
      <Head>
        <title> Printer Flow | Visualizar Tipo de Processo</title>
      </Head>
      <Header className="pl-4 md:pr-10 pr-5 flex items-center justify-between truncate mt-8 mb-1 md:m-0">
        <div className="flex items-center md:w-[650px] w-[200px] truncate">
          <div className="hidden sm:block sm:w-fit p-2">
            <ButtonRounded
              className="sm:mr-2"
              onClick={() => {
                router.back();
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
            alt="procedureTemplate"
            name="procedureTemplateV3"
            fill
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
              {procedureTemplate.name}
            </Typography>
          </div>
        </div>
        <Button
          label="Editar"
          size="md"
          color="info"
          onClick={() => {
            router.push(
              `/printer-flow/procedure-templates/${Number(
                router.query.procedureTemplateId
              )}/edit`
            );
          }}
          disabled={procedureTemplate.status === 'inactive' ? true : false}
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
      <ShowProcedureTemplateContainer
        procedureTemplateId={Number(router.query.procedureTemplateId)}
        setProcedureTemplate={setProcedureTemplate}
        procedureTemplateDocument={procedureTemplateDocument}
      />
    </>
  );
};

ShowProcedureTemplatePage.getLayout = (page: React.ReactElement) => {
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

export default ShowProcedureTemplatePage;
