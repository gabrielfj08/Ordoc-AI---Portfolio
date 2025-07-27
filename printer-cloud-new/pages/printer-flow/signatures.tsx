import * as React from 'react';
import Head from 'next/head';
import {
  SessionGroupRequesterProvider,
  useSessionGroupRequester,
} from '../../hooks';
import { Icon, Typography } from 'printer-ui';
import { NextPageWithLayout } from '../_app';
import Layout from '../../PrinterFlow/components/Layout';
import Header from '../../components/Layout/Header';
import UnauthorizedMessage from '../../PrinterFlow/components/Procedures/Unauthorized';
import SignaturesSkeleton from '../../PrinterFlow/Signatures/Skeleton';
import SignaturesPage from '../../PrinterFlow/Signatures';

const SignaturePage: NextPageWithLayout = () => {
  const { sessionGroupRequester, unauthorized } = useSessionGroupRequester();

  return (
    <>
      <Head>
        <title> Printer Flow | Assinaturas</title>
      </Head>
      <Header className="pl-4 sm:pl-4 flex items-center mt-8 mb-1 sm:m-0">
        <Icon
          alt="signature"
          name="signaturesV3"
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
          Assinaturas
        </Typography>
      </Header>
      <div className="sm:mr-10 sm:mt-5 px-4">
        {!sessionGroupRequester.id ? (
          unauthorized ? (
            <UnauthorizedMessage />
          ) : (
            <SignaturesSkeleton />
          )
        ) : (
          <SignaturesPage />
        )}
      </div>
    </>
  );
};

SignaturePage.getLayout = (page: React.ReactElement) => {
  return (
    <SessionGroupRequesterProvider>
      <Layout>{page}</Layout>
    </SessionGroupRequesterProvider>
  );
};

export default SignaturePage;
