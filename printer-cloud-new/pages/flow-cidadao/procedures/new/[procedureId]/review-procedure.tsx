import * as React from 'react';
import Head from 'next/head';
import router from 'next/router';
import getConfig from 'next/config';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from 'printer-ui';
import {
  AuthExternalProvider,
  useAuth,
  useAws,
  useExternalAuth,
  useSession,
} from '../../../../../hooks';
import { ExternalProcedureService } from '../../../../../services/flow-cidadao';
import CreateProcedureStepper from '../../../../../FlowCidadao/components/Procedures/CreateProcedureStepper';
import ReviewProcedureFields from '../../../../../FlowCidadao/ReviewProcedureFields';
import Layout from '../../../../../FlowCidadao/components/Layout';

const ReviewProcedurePage = ({ credentials }) => {
  const { session } = useSession();
  const { subdomain } = useAuth();
  const { externalToken } = useExternalAuth();
  const { setCredentials } = useAws();

  React.useEffect(() => {
    setCredentials(credentials);
  }, [credentials]);

  const { isLoading, isError, data } = useQuery({
    queryKey: [
      'fieldsProcedure',
      subdomain,
      externalToken as String,
      Number(router.query.procedureId),
    ],
    queryFn: () =>
      ExternalProcedureService.show(
        String(externalToken),
        subdomain,
        Number(router.query.procedureId)
      ),
  });

  if (isError)
    return (
      <div className="text-base text-error mr-10">
        Erro! Não foi possível carregar o número do processo.
      </div>
    );

  if (isLoading) return <Skeleton w={44} h={8} rounded="md" />;

  if (!session) return null;

  return (
    <div className="min-h-screen grid">
      <Head>
        <title>Flow Cidadão | Novo processo</title>
      </Head>
      <Layout
        internal={true}
        title={`${'Processo'} ${data.processNumber}`}
        subtitle="Com o Flow Cidadão você pode criar solicitações e acompanhar processos."
        onClick={() =>
          router.push(
            `/flow-cidadao/procedures/new/${router.query.procedureId}/complete-procedure`
          )
        }
        icon="doubleChevronLeft"
      >
        <div className="w-full flex justify-center mt-6 sm:mt-8">
          <CreateProcedureStepper activeStep={3} />
        </div>
        <ReviewProcedureFields />
      </Layout>
    </div>
  );
};

const ReviewProcedurePageContainer = ({ credentials }) => {
  return (
    <AuthExternalProvider>
      <ReviewProcedurePage credentials={credentials} />
    </AuthExternalProvider>
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

export default ReviewProcedurePageContainer;
