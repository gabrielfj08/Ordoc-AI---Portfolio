import * as React from 'react';
import router from 'next/router';
import getConfig from 'next/config';
import { Typography, ButtonRounded, Icon } from 'printer-ui';
import { useAws } from '../../../../hooks';
import Layout, { Header } from '../../../../components/Layout';
import EditOrganizationContainer from '../../../../PrinterCloud/Organizations/Edit';

const EditOrganizationPage = ({ credentials }) => {
  const { setCredentials } = useAws();

  setCredentials(credentials);

  if (!router.query.organizationId) {
    return null;
  }

  return (
    <Layout>
      <Header className="pr-5 sm:px-5 py-5 justify-between truncate">
        <div className="flex space-x-5 px-2 w-full truncate items-center h-full">
          <div className="hidden sm:flex sm:w-fit">
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
          <div className="sm:hidden">
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
          <Typography
            variant="title3"
            family="robotoBold"
            className="sm:w-full w-60 sm:truncate-none truncate"
          >
            Editar instituição
          </Typography>
        </div>
      </Header>
      <main className="flex-none sm:flex pl-6">
        <EditOrganizationContainer
          organizationId={Number(router.query.organizationId)}
        />
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

export default EditOrganizationPage;
