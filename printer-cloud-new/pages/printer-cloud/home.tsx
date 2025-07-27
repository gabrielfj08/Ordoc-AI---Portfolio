import * as React from 'react';
import { Typography } from 'printer-ui';
import Layout, { Header } from '../../components/Layout';
import Home from '../../components/PrinterCloud/Home';
import Head from 'next/head';

const HomePage = () => {
  return (
    <Layout>
      <Head>
        <title> Printer Cloud | Home</title>
      </Head>
      <Header>
        <div className="w-full flex items-center pt-5 sm:pt-0 justify-between">
          <div className="pl-4 invisible sm:visible">
            <Typography family="robotoBold" variant="title3">
              Seja bem-vindo!
            </Typography>
          </div>
        </div>
      </Header>
      <Home />
    </Layout>
  );
};

export default HomePage;
