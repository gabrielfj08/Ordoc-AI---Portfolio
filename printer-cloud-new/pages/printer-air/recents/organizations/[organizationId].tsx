import * as React from 'react';
import router from 'next/router';
import getConfig from 'next/config';
import Head from 'next/head';
import { Typography } from 'printer-ui';
import { useAws } from '../../../../hooks';
import Header from '../../../../components/Layout/Header';
import Layout from '../../../../PrinterAir/components/Layout';
import Recents from '../../../../PrinterAir/Recents';

const RecentsPage = ({ credentials }) => {
  const { setCredentials } = useAws();

  React.useEffect(() => {
    setCredentials(credentials);
  }, [credentials]);

  return (
    <Layout>
      <Head>
        <title> Printer Air | Recentes</title>
      </Head>
      <Header className="pl-4 sm:pl-4">
        <Typography
          variant="title2"
          family="robotoMedium"
          color="darkGray"
          className="mt-8 mb-1 sm:m-0 sm:pl-4"
        >
          Recentes
        </Typography>
      </Header>
      <main>
        <Recents organizationId={Number(router.query.organizationId)} />
      </main>
    </Layout>
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

export default RecentsPage;
