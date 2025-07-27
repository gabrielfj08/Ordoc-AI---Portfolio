import * as React from 'react';
import Head from 'next/head';
import router from 'next/router';
import { ButtonRounded, Icon, Typography } from 'printer-ui';
import { SessionGroupRequesterProvider } from '../../../../hooks';
import EditRequester from '../../../../PrinterFlow/Requesters/Edit';
import Layout from '../../../../PrinterFlow/components/Layout';
import Header from '../../../../components/Layout/Header';
import { NextPageWithLayout } from '../../../_app';

const EditPage: NextPageWithLayout = () => {
  if (!Number(router.query.requestersId)) {
    return null;
  }
  return (
    <>
      <Head>
        <title> Printer Flow | Editar Solicitante</title>
      </Head>
      <Header className="pl-4 sm:pl-4 flex items-center mt-8 mb-1 sm:m-0">
        <div className="hidden sm:block">
          <ButtonRounded
            onClick={() => {
              router.back();
            }}
          >
            <Icon
              name="return"
              alt="voltar"
              color="gray"
              w={30}
              h={30}
              fill
              stroke
            />
          </ButtonRounded>
        </div>
        <div className="flex items-center ml-4">
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
            Editar solicitante
          </Typography>
        </div>
      </Header>
      <EditRequester />
    </>
  );
};

EditPage.getLayout = (page: React.ReactElement) => {
  return (
    <SessionGroupRequesterProvider>
      <Layout>{page}</Layout>
    </SessionGroupRequesterProvider>
  );
};

export default EditPage;
