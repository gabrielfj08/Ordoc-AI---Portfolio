import * as React from 'react';
import router from 'next/router';
import Head from 'next/head';
import { Icon, Typography } from 'printer-ui';
import Layout from '../../PrinterFlow/components/Layout';
import Header from '../../components/Layout/Header';
import ProcedureTemplates from '../../PrinterFlow/ProcedureTemplates';
import { SessionGroupRequesterProvider } from '../../hooks';
import { NextPageWithLayout } from '../_app';

const ProcedureTemplatesPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title> Printer Flow | Tipos de processo</title>
      </Head>
      <Header className="pl-4 sm:pl-4 flex items-center mt-8 mb-1 sm:m-0">
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
          className="pl-2"
        >
          Tipos de processo
        </Typography>
      </Header>
      <ProcedureTemplates />
    </>
  );
};

ProcedureTemplatesPage.getLayout = (page: React.ReactElement) => {
  return (
    <SessionGroupRequesterProvider>
      <Layout>{page}</Layout>
    </SessionGroupRequesterProvider>
  );
};

export default ProcedureTemplatesPage;
