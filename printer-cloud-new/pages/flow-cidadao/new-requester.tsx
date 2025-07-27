import * as React from 'react';
import Head from 'next/head';
import getConfig from 'next/config';
import { useAws } from '../../hooks';
import OrganizationLogo from '../../FlowCidadao/components/OrganizationLogo';
import FooterFlowCidadao from '../../FlowCidadao/components/Footer';
import NewExternalRequesterForm from '../../FlowCidadao/NewExternalRequester';

const RecoverUnlockPasswordPage = ({ secret, credentials }) => {
  const { setCredentials } = useAws();

  React.useEffect(() => {
    setCredentials(credentials);
  }, [credentials]);

  return (
    <div className="bg-[url(/assets/login-bg-flow-cidadao-mb.png)] sm:bg-[url(/assets/login-bg-flow-cidadao.png)] bg-bottom min-h-screen min-w-full bg-cover align-bottom grid">
      <Head>
        <title>Flow Cidadão | Criar conta</title>
      </Head>
      <main>
        <div className="sm:p-6 pt-10 sm:justify-start justify-center flex">
          <img src="../../assets/logo-cidadao.svg" />
        </div>
        <div className="flex justify-center pb-4 sm:pt-0 pt-8">
          <OrganizationLogo />
        </div>
        <NewExternalRequesterForm secret={secret} />
      </main>
      <div className="items-end grid">
        <FooterFlowCidadao />
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  const { serverRuntimeConfig } = getConfig();

  return {
    props: {
      secret: getConfig().serverRuntimeConfig.RECAPTCHA_SECRET_KEY,
      credentials: {
        accessKeyId: serverRuntimeConfig.AWS_ACCESS_KEY_ID,
        secretAccessKey: serverRuntimeConfig.AWS_SECRET_ACCESS_KEY,
      },
    },
  };
}

export default RecoverUnlockPasswordPage;
