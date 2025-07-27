import * as React from 'react';
import Head from 'next/head';
import type { NextPageWithLayout } from '../_app';
import { Icon, Typography } from 'printer-ui';
import {
  SessionGroupRequesterProvider,
  useSessionGroupRequester,
} from '../../hooks';
import Layout from '../../PrinterFlow/components/Layout';
import Header from '../../components/Layout/Header';
import Procedures from '../../PrinterFlow/Procedures';
import ProceduresPageSkeleton from '../../PrinterFlow/components/Procedures/Skeleton';
import UnauthorizedMessage from '../../PrinterFlow/components/Procedures/Unauthorized';

const ProceduresPage: NextPageWithLayout = () => {
  const { sessionGroupRequester, unauthorized } = useSessionGroupRequester();

  return (
    <>
      <Head>
        <title> Printer Flow | Processos</title>
      </Head>
      <Header className="pl-4 sm:pl-4 flex items-center mt-8 mb-1 sm:m-0">
        <Icon
          alt="procedures"
          name="proceduresV3"
          stroke
          w={35}
          h={35}
          color="darkGray"
        />
        <Typography
          variant="title2"
          family="robotoMedium"
          color="darkGray"
          className="pl-2"
        >
          Processos
        </Typography>
      </Header>
      <div className="sm:mr-10 sm:mt-5 px-4">
        {!sessionGroupRequester.id ? (
          unauthorized ? (
            <UnauthorizedMessage />
          ) : (
            <ProceduresPageSkeleton />
          )
        ) : (
          <Procedures />
        )}
      </div>
    </>
  );
};

ProceduresPage.getLayout = (page: React.ReactElement) => {
  return (
    <SessionGroupRequesterProvider>
      <Layout>{page}</Layout>
    </SessionGroupRequesterProvider>
  );
};

export default ProceduresPage;
