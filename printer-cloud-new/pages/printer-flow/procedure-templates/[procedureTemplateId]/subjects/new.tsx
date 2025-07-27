import * as React from 'react';
import router from 'next/router';
import Head from 'next/head';
import { ButtonRounded, Icon, Typography } from 'printer-ui';
import { SessionGroupRequesterProvider } from '../../../../../hooks';
import NewSubject from '../../../../../PrinterFlow/ProcedureTemplates/Subject/New';
import Field from '../../../../../PrinterFlow/components/ProcedureTemplates/Field';
import Layout from '../../../../../PrinterFlow/components/Layout';
import Header from '../../../../../components/Layout/Header';
import { NextPageWithLayout } from '../../../../_app';

const NewSubjectPage: NextPageWithLayout = () => {
  if (!router.query.procedureTemplateId) return null;

  return (
    <>
      <Head>
        <title> Printer Flow | Adicionar novo assunto</title>
      </Head>
      <Header className="pl-4 sm:pl-4">
        <div className="sm:flex hidden">
          <ButtonRounded
            className="sm:mr-4"
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
        <Typography
          variant="title2"
          family="robotoMedium"
          color="darkGray"
          className="items-center justify-center pl-2 sm:m-0"
        >
          Adicionar novo assunto
        </Typography>
      </Header>

      <NewSubject
        parentProcedureTemplateId={Number(router.query.procedureTemplateId)}
      />
    </>
  );
};

NewSubjectPage.getLayout = (page: React.ReactElement) => {
  return (
    <SessionGroupRequesterProvider>
      <Layout>{page}</Layout>
    </SessionGroupRequesterProvider>
  );
};

export default NewSubjectPage;
