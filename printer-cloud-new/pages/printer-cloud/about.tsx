import * as React from 'react';
import Layout, { Header } from '../../components/Layout';
import SystemInformation from '../../components/PrinterCloud/SystemInformation';
import ContactInformation from '../../components/PrinterCloud/ContactInformation';
import AddressMap from '../../components/PrinterCloud/ContactInformation/Map';
import { ButtonRounded, Icon, Typography } from 'printer-ui';
import { useRouter } from 'next/router';
import Head from 'next/head';

const AboutPage = () => {
  const router = useRouter();
  return (
    <Layout>
      <Head>
        <title> Printer Cloud | Sobre o sistema</title>
      </Head>
      <Header>
        <div className="w-full flex items-center pt-5 sm:pt-0 justify-between">
          <div className="sm:pl-4 pb-8 sm:pb-0 flex space-x-5">
            <div className="hidden w-0 sm:block sm:w-fit">
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
            <Typography family="robotoBold" variant="title3">
              Sobre o sistema
            </Typography>
          </div>
        </div>
      </Header>
      <main className="w-full sm:pr-20 justify-between">
        <div className="md:flex md:mt-5 space-y-8 md:space-y-0 space-x-0 md:space-x-6">
          <SystemInformation />
          <ContactInformation />
        </div>
        <div className="mt-10">
          <AddressMap />
        </div>
      </main>
    </Layout>
  );
};

export default AboutPage;
