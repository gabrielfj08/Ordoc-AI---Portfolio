import * as React from 'react';
import Head from 'next/head';
import router from 'next/router';
import getConfig from 'next/config';
import {
  SessionGroupRequesterProvider,
  useAws,
  useModal,
} from '../../../../../hooks';
import { Button, ButtonRounded, Icon, Typography, Skeleton } from 'printer-ui';
import { NextPageWithLayout } from '../../../../_app';
import { ShowProcedureTemplate } from '../../../../../services/printer-flow/types';
import ShowSubject from '../../../../../PrinterFlow/ProcedureTemplates/Subject/Show';
import Layout from '../../../../../PrinterFlow/components/Layout';
import Header from '../../../../../components/Layout/Header';
import FieldDocumentTemplatePreviewModal from '../../../../../PrinterFlow/ProcedureTemplates/FieldDocumentTemplates/Modals/Preview';

const ShowSubjectPage: NextPageWithLayout = ({
  credentials,
  procedureTemplateDocument,
}) => {
  const { setCredentials } = useAws();
  const { openModal } = useModal();

  const [subject, setSubject] = React.useState<ShowProcedureTemplate>({
    id: Number(router.query.id),
    name: '',
    prn: '',
    source: '',
    status: '',
    organizationId: 0,
    parentProcedureTemplateId: Number(router.query.procedureTemplateId),
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

  if (!router.query.id) return null;

  return (
    <>
      <Head>
        <title> Printer Flow | Visualizar assunto</title>
      </Head>
      <Header className="pl-4 md:pr-10 pr-5 flex items-center justify-between truncate mt-8 mb-1 md:m-0">
        <div className="flex items-center md:w-[650px] w-[200px] truncate">
          <div className="hidden w-0 sm:block sm:w-fit p-2">
            <ButtonRounded
              className="sm:mr-4"
              onClick={() => {
                router.push(
                  `/printer-flow/procedure-templates/${router.query.procedureTemplateId}`
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
          <Icon
            alt="procedureTemplate"
            name="procedureTemplateV3"
            fill
            stroke
            w={40}
            h={40}
            color="darkGray"
          />
          <div className="w-32 sm:w-full">
            {subject.name === '' ? (
              <Skeleton w={48} h={8} rounded="default" />
            ) : (
              <Typography
                variant="title2"
                family="robotoMedium"
                color="darkGray"
                className="truncate sm:pl-2 mr-4"
              >
                {subject.name}
              </Typography>
            )}
          </div>
        </div>
        <Button
          color="info"
          label="Editar"
          onClick={() =>
            router.push(
              `/printer-flow/procedure-templates/${router.query.procedureTemplateId}/subjects/${router.query.id}/edit`
            )
          }
          disabled={subject.status === 'inactive' ? true : false}
        >
          <Button.Icon
            name="write"
            alt="white"
            fill
            stroke
            color="white"
            h={23}
            w={23}
          />
        </Button>
      </Header>
      <ShowSubject
        setSubject={setSubject}
        subjectId={Number(router.query.id)}
        procedureTemplateDocument={procedureTemplateDocument}
      />
    </>
  );
};

ShowSubjectPage.getLayout = (page: React.ReactElement) => {
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

export default ShowSubjectPage;
