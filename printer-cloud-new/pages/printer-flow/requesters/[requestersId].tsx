import * as React from 'react';
import router from 'next/router';
import Head from 'next/head';
import { Button, ButtonRounded, Icon, Typography } from 'printer-ui';
import { NextPageWithLayout } from '../../_app';
import { SessionGroupRequesterProvider } from '../../../hooks';
import { ShowRequester } from '../../../services/printer-flow/types';
import Layout from '../../../PrinterFlow/components/Layout';
import Header from '../../../components/Layout/Header';
import Show from '../../../PrinterFlow/Requesters/Show';

const ShowRequesterPage: NextPageWithLayout = () => {
  const [requester, setRequester] = React.useState<ShowRequester>({
    id: Number(router.query.requestersId),
    name: '',
    organizationId: 0,
    parentGroupId: null,
    cpfCnpj: '',
    prn: '',
    code: null,
    email: '',
    optionalEmail: null,
    type: '',
    status: '',
    phone: '',
    optionalPhone: null,
    occupation: null,
    birthDate: '',
    createdAt: '',
    updatedAt: '',
    address: null,
    user: null,
  });
  if (!Number(router.query.requestersId)) return null;

  return (
    <>
      <Head>
        <title> Printer Flow | Visualizar Solicitante</title>
      </Head>
      <Header className="pl-4 md:pr-10 pr-5 flex items-center justify-between truncate mt-8 mb-1 md:m-0">
        <div className="flex items-center md:w-[650px] w-[200px] truncate">
          <div className="hidden sm:block sm:w-fit p-2">
            <ButtonRounded
              className="sm:mr-2"
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
          <Icon
            alt="requester"
            name="requesterV3"
            fill
            w={35}
            h={35}
            color="darkGray"
          />
          <div className="w-48 pl-2 sm:pl-0 sm:w-full truncate">
            <Typography
              variant="title2"
              family="robotoMedium"
              color="darkGray"
              className="w-32 sm:w-full truncate sm:pl-2 mr-4"
            >
              {requester.name}
            </Typography>
          </div>
        </div>
        <Button
          color="info"
          label="Editar"
          onClick={() => router.push(`${requester.id}/edit`)}
          disabled={requester.status === 'inactive' ? true : false}
        >
          <Button.Icon
            name="write"
            alt="editar"
            fill
            stroke
            color="white"
            h={23}
            w={23}
          />
        </Button>
      </Header>
      <div className="md:flex space-y-8 md:space-y-0 space-x-0 md:space-x-6 mb-20 mt-5">
        <Show setRequester={setRequester} />
      </div>
    </>
  );
};

ShowRequesterPage.getLayout = (page: React.ReactElement) => {
  return (
    <SessionGroupRequesterProvider>
      <Layout>{page}</Layout>
    </SessionGroupRequesterProvider>
  );
};

export default ShowRequesterPage;
