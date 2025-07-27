import * as React from 'react';
import Head from 'next/head';
import router from 'next/router';
import Layout from '../../../PrinterFlow/components/Layout';
import { Header } from '../../../components/Layout';
import { ButtonRounded, Icon, Typography } from 'printer-ui';
import NewGroupRequesterPage from '../../../PrinterFlow/Groups/New';
import NewGroupRequesterForm from '../../../PrinterFlow/Groups/New/form';
import { SessionGroupRequesterProvider } from '../../../hooks';
import { NextPageWithLayout } from '../../_app';

const CreateGroupPage: NextPageWithLayout = () => {
  const [showForm, setShowForm] = React.useState<boolean>(false);
  return (
    <>
      <Head>
        <title>Printer Flow | Novo Grupo</title>
      </Head>
      <Header className="pl-4 sm:pl-4 flex items-center mt-8 mb-1 sm:m-0">
        <div className="sm:flex hidden">
          <ButtonRounded
            className="sm:mr-4"
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
          name="groupRequesterV3"
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
          Novo grupo solicitante
        </Typography>
      </Header>
      <div className="px-3 sm:px-0 sm:mr-10 w-screen md:w-auto mt-6">
        <NewGroupRequesterPage />
        <div className={showForm ? 'block' : 'hidden'}>
          <NewGroupRequesterForm
            id={null}
            onCancel={() => setShowForm(false)}
          />
        </div>
      </div>
    </>
  );
};

CreateGroupPage.getLayout = (page: React.ReactElement) => {
  return (
    <SessionGroupRequesterProvider>
      <Layout>{page}</Layout>
    </SessionGroupRequesterProvider>
  );
};

export default CreateGroupPage;
