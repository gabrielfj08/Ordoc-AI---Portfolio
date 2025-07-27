import * as React from 'react';
import router from 'next/router';
import Head from 'next/head';
import { Icon, Typography } from 'printer-ui';
import Layout from '../../PrinterFlow/components/Layout';
import Header from '../../components/Layout/Header';
import Requesters from '../../PrinterFlow/Requesters';
import { SessionGroupRequesterProvider } from '../../hooks';
import { NextPageWithLayout } from '../_app';

const RequestersPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title> Printer Flow | Solicitantes</title>
      </Head>
      <Header className="pl-4 sm:pl-4 flex items-center mt-8 mb-1 sm:m-0">
        <Icon
          alt="requester"
          name="requesterV3"
          fill
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
          Solicitantes
        </Typography>
      </Header>
      <Requesters />
    </>
  );
};

RequestersPage.getLayout = (page: React.ReactElement) => {
  return (
    <SessionGroupRequesterProvider>
      <Layout>{page}</Layout>
    </SessionGroupRequesterProvider>
  );
};

export default RequestersPage;
