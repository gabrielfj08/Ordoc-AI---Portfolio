import * as React from 'react';
import Head from 'next/head';
import {
  SessionGroupRequesterProvider,
  useSessionGroupRequester,
} from '../../hooks';
import { Icon, Typography } from 'printer-ui';
import Layout from '../../PrinterFlow/components/Layout';
import Header from '../../components/Layout/Header';
import UnauthorizedMessage from '../../PrinterFlow/components/Procedures/Unauthorized';
import { NextPageWithLayout } from '../_app';
import GeneralSearchPage from '../../PrinterFlow/components/Search';

const SearchPage: NextPageWithLayout = () => {
  const { sessionGroupRequester } = useSessionGroupRequester();

  return (
    <>
      <Head>
        <title> Printer Flow | Consulta Geral</title>
      </Head>
      <Header className="pl-4 sm:pl-4 flex items-center mt-8 mb-1 sm:m-0">
        <Icon
          alt="searchProcedure"
          name="searchProcedure"
          stroke
          w={48}
          h={48}
          color="darkGray"
        />
        <Typography
          variant="title2"
          family="robotoMedium"
          color="darkGray"
          className="pl-2"
        >
          Consulta Geral
        </Typography>
      </Header>
      <div className="sm:mr-10 sm:mt-5 px-4">
        {sessionGroupRequester.id ? (
          <GeneralSearchPage setInitialTable={false} />
        ) : (
          <UnauthorizedMessage />
        )}
      </div>
    </>
  );
};

SearchPage.getLayout = (page: React.ReactElement) => {
  return (
    <SessionGroupRequesterProvider>
      <Layout>{page}</Layout>
    </SessionGroupRequesterProvider>
  );
};

export default SearchPage;
