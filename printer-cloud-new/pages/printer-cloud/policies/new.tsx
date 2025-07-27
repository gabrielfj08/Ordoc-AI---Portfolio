import * as React from 'react';
import { useRouter } from 'next/router';
import { ButtonRounded, Icon, Typography } from 'printer-ui';
import Layout, { Header } from '../../../components/Layout';
import NewPolicyContainer from '../../../PrinterCloud/Policies/New';
import Head from 'next/head';

const NewPolicy = () => {
  const router = useRouter();

  return (
    <Layout>
      <Head>
        <title>Printer Cloud | Nova permissão</title>
      </Head>
      <Header>
        <div className="pt-5 sm:pl-4 sm:pt-0 flex space-x-4">
          <div className="hidden w-0 sm:flex sm:w-fit">
            <ButtonRounded
              onClick={() => {
                router.push(`/printer-cloud/policies`);
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
          <Typography variant="title3" family="robotoBold">
            Nova permissão
          </Typography>
        </div>
      </Header>
      <main>
        <NewPolicyContainer />
      </main>
    </Layout>
  );
};

export default NewPolicy;
