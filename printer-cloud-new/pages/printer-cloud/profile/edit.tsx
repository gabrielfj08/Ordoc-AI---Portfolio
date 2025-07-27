import * as React from 'react';
import getConfig from 'next/config';
import router from 'next/router';
import { Button, ButtonRounded, Icon, Typography } from 'printer-ui';
import { useAws } from '../../../hooks';
import Layout, { Header } from '../../../components/Layout';
import Edit from '../../../components/PrinterCloud/Profile/Edit';
import Head from 'next/head';

const EditProfilePage = ({ credentials }) => {
  const { setCredentials } = useAws();

  setCredentials(credentials);

  return (
    <Layout>
      <Head>
        <title>Printer Cloud | Editar perfil</title>
      </Head>
      <Header className="pr-5 sm:px-5 py-5 justify-between truncate">
        <div className="flex space-x-5 px-2 w-full truncate items-center h-full">
          <div className="hidden w-0 sm:flex sm:w-fit">
            <ButtonRounded
              onClick={() => {
                router.push(`/printer-cloud/home`);
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
          <Typography
            variant="title3"
            family="robotoBold"
            className="sm:w-full w-60 sm:truncate-none truncate"
          >
            Editar perfil
          </Typography>
          <div className="justify-end flex items-center sm:w-full sm:pr-8">
            <Button
              color="info"
              label="Alterar senha"
              onClick={() => router.push('./change-password')}
            />
          </div>
        </div>
      </Header>
      <main>
        <Edit />
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

export default EditProfilePage;
