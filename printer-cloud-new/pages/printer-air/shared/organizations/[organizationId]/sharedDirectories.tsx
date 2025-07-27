import * as React from 'react';
import router from 'next/router';
import getConfig from 'next/config';
import { Typography } from 'printer-ui';
import { useAws } from '../../../../../hooks';
import Header from '../../../../../components/Layout/Header';
import Layout from '../../../../../PrinterAir/components/Layout';
import Shared from '../../../../../PrinterAir/Shared';
import Head from 'next/head';

const SharedPage = ({ credentials }) => {
  const { setCredentials } = useAws();

  React.useEffect(() => {
    setCredentials(credentials);
  }, [credentials]);

  if (!router.query.organizationId) return null;

  return (
    <Layout>
      <Head>
        <title> Printer Air | Compartilhados</title>
      </Head>
      <Header className="pl-4 sm:pl-8">
        <Typography
          variant="title2"
          family="robotoMedium"
          color="darkGray"
          className="mt-8 mb-1 sm:m-0"
        >
          Compartilhados
        </Typography>
      </Header>
      <main>
        {router.query.root ? (
          <Shared
            root={router.query.root}
            organizationId={Number(router.query.organizationId)}
          />
        ) : (
          <Shared
            organizationId={Number(router.query.organizationId)}
            parentSharedId={Number(router.query.parentSharedId)}
          />
        )}
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

export default SharedPage;
