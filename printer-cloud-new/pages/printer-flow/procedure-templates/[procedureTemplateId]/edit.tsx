import * as React from 'react';
import router from 'next/router';
import Head from 'next/head';
import { ButtonRounded, Icon, Typography } from 'printer-ui';
import Layout from '../../../../PrinterFlow/components/Layout';
import Header from '../../../../components/Layout/Header';
import EditProcedureTemplate from '../../../../PrinterFlow/ProcedureTemplates/Edit';
import { SessionGroupRequesterProvider } from '../../../../hooks';
import { NextPageWithLayout } from '../../../_app';

const EditProcedureTemplatePage: NextPageWithLayout = () => {
  if (!Number(router.query.procedureTemplateId)) return null;

  return (
    <>
      <Head>
        <title> Printer Flow | Editar Tipo de Processo</title>
      </Head>
      <Header className="pl-4 truncate">
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
              color="darkGray"
              w={30}
              h={30}
              fill
              stroke
            />
          </ButtonRounded>
        </div>
        <div className="sm:mr-10 flex items-center sm:justify-between w-full">
          <Icon
            alt="procedureTemplate"
            name="procedureTemplateV3"
            fill
            stroke
            w={40}
            h={40}
          />
          <Typography
            variant="title2"
            family="robotoMedium"
            color="darkGray"
            className="w-32 sm:w-full sm:pl-2 mr-4"
          >
            Editar tipo de processo
          </Typography>
        </div>
      </Header>
      <div className="mt-5">
        <EditProcedureTemplate />
      </div>
    </>
  );
};

EditProcedureTemplatePage.getLayout = (page: React.ReactElement) => {
  return (
    <SessionGroupRequesterProvider>
      <Layout>{page}</Layout>
    </SessionGroupRequesterProvider>
  );
};

export default EditProcedureTemplatePage;
