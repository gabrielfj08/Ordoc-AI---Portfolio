import * as React from 'react';
import router from 'next/router';
import { Typography } from 'printer-ui';
import Header from '../../../../components/Layout/Header';
import Layout from '../../../../PrinterAir/components/Layout';
import RecycleBin from '../../../../PrinterAir/RecycleBin';
import Head from 'next/head';

const RecycleBinPage = () => {
  return (
    <Layout>
      <Head>
        <title> Printer Air | Lixeira</title>
      </Head>
      <Header className="pl-4 sm:pl-8">
        <Typography
          variant="title2"
          family="robotoMedium"
          color="darkGray"
          className="mt-8 mb-1 sm:m-0"
        >
          Lixeira
        </Typography>
      </Header>
      <RecycleBin />
    </Layout>
  );
};

export default RecycleBinPage;
