import * as React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout, { Header } from '../../../components/Layout';
import UpdatePassword from '../../../components/PrinterCloud/Profile/Edit/UpdatePassword';
import { ButtonRounded, Icon, Typography } from 'printer-ui';

const ChangePasswordPage = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Printer Cloud | Alterar Senha</title>
      </Head>
      <Layout>
        <Header className="p-5 sm:px-5 flex space-x-4 items-center">
          <ButtonRounded
            className="hidden sm:flex"
            onClick={() => {
              router.push(`/printer-cloud/profile/edit`);
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
          <div className="flex items-center space-x-2">
            <Icon
              name="refresh"
              alt="refresh"
              color="black"
              w={30}
              h={30}
              fill
            />
            <Typography family="robotoBold" variant="title3">
              Alterar Senha
            </Typography>
          </div>
        </Header>
        <main>
          <UpdatePassword />
        </main>
      </Layout>
    </>
  );
};

export default ChangePasswordPage;
