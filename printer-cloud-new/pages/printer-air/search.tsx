import * as React from 'react';
import getConfig from 'next/config';
import router from 'next/router';
import Head from 'next/head';
import { Typography } from 'printer-ui';
import { useAws } from '../../hooks';
import Header from '../../components/Layout/Header';
import Layout from '../../PrinterAir/components/Layout';
import Search from '../../PrinterAir/Search';

const SearchPage = ({ credentials }) => {
  const { setCredentials } = useAws();

  React.useEffect(() => {
    setCredentials(credentials);
  }, [credentials]);

  if (Object.keys(router.query).length === 0) {
    return null;
  }

  return (
    <Layout
      queryString={new URLSearchParams(
        router.query as Record<string, string>
      ).toString()}
    >
      <Head>
        <title> Printer Air | Resultado de busca</title>
      </Head>
      <Header className="pl-4 sm:pl-8">
        <Typography
          variant="title2"
          family="robotoMedium"
          color="darkGray"
          className="mt-8 mb-1 sm:m-0"
        >
          Resultados de Busca
        </Typography>
      </Header>
      <Search
        queryString={new URLSearchParams(
          router.query as Record<string, string>
        ).toString()}
      />
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

export default SearchPage;
