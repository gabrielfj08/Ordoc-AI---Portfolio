import * as React from 'react';
import Head from 'next/head';
import { Icon, Typography } from 'printer-ui';
import Header from '../../components/Layout/Header';
import Groups from '../../PrinterFlow/Groups';
import Layout from '../../PrinterFlow/components/Layout';
import { SessionGroupRequesterProvider } from '../../hooks';
import { NextPageWithLayout } from '../_app';

const GroupsPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title> Printer Flow | Grupos</title>
      </Head>
      <Header className="pl-4 sm:pl-4 flex items-center mt-8 mb-1 sm:m-0">
        <Icon
          alt="requesterGroup"
          name="groupRequesterV3"
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
          Grupos
        </Typography>
      </Header>
      <Groups />
    </>
  );
};

GroupsPage.getLayout = (page: React.ReactElement) => {
  return (
    <SessionGroupRequesterProvider>
      <Layout>{page}</Layout>
    </SessionGroupRequesterProvider>
  );
};

export default GroupsPage;
