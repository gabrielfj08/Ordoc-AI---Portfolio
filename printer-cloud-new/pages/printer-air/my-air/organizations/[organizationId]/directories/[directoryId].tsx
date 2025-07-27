import * as React from 'react';
import getConfig from 'next/config';
import Head from 'next/head';
import { useAws } from '../../../../../../hooks';
import Layout from '../../../../../../PrinterAir/components/Layout';
import MyAir from '../../../../../../PrinterAir/MyAir';

const MyAirPage = ({ credentials }) => {
  const { setCredentials } = useAws();

  React.useEffect(() => {
    setCredentials(credentials);
  }, [credentials]);

  return (
    <Layout>
      <Head>
        <title>Printer Air | Meu Air</title>
      </Head>
      <main>
        <MyAir />
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

export default MyAirPage;
