import * as React from 'react';
import Head from 'next/head';
import router from 'next/router';
import getConfig from 'next/config';
import {
  useSessionGroupRequester,
  useAws,
  SessionGroupRequesterProvider,
} from '../../../hooks';
import { ButtonRounded, Icon, Typography } from 'printer-ui';
import {
  ProcedureRequester,
  ShowProcedureAPIResponse,
} from '../../../services/printer-flow/types';
import {
  IndexProcedureTemplate,
  ShowProcedureTemplate,
} from '../../../services/printer-flow/types/procedureTemplate';
import Header from '../../../components/Layout/Header';
import Layout from '../../../PrinterFlow/components/Layout';
import NewProcedureInfo from '../../../PrinterFlow/Procedures/New/Info';
import ProcedureFields from '../../../PrinterFlow/Procedures/New/Fields';
import ShowProcedureInfo from '../../../PrinterFlow/Procedures/Show/Info';
import { NextPageWithLayout } from '../../_app';

const NewProcedurePage: NextPageWithLayout = ({ credentials }) => {
  const { sessionGroupRequester } = useSessionGroupRequester();
  const { setCredentials } = useAws();

  React.useEffect(() => {
    setCredentials(credentials);
  }, [credentials]);

  const [procedureCreated, setProcedureCreated] =
    React.useState<ShowProcedureAPIResponse>({} as ShowProcedureAPIResponse);

  if (!sessionGroupRequester) return null;

  return (
    <>
      <Head>
        <title> Printer Flow | Novo Processo</title>
      </Head>
      <Header className="pl-4 truncate">
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
        <div className="mt-7 sm:mt-0 sm:mr-10 flex items-center sm:justify-between w-full">
          <Icon
            alt="procedures"
            name="proceduresV3"
            stroke
            w={35}
            h={35}
            color="darkGray"
          />
          <Typography
            variant="title2"
            family="robotoMedium"
            color="darkGray"
            className="w-32 sm:w-full sm:pl-2 mr-4"
          >
            {procedureCreated.id
              ? `Processo ${procedureCreated.processNumber}`
              : 'Novo processo'}
          </Typography>
        </div>
      </Header>
      <div className="w-full min-h-screen">
        {procedureCreated.id ? (
          <ShowProcedureInfo
            procedure={procedureCreated}
            subject={{} as ShowProcedureTemplate}
          />
        ) : (
          <div className="mt-5">
            <NewProcedureInfo
              requesters={{} as ProcedureRequester}
              procedureTemplates={{} as IndexProcedureTemplate}
              setProcedureData={setProcedureCreated}
            />
          </div>
        )}
        {procedureCreated.id ? (
          <div className="mb-48">
            <ProcedureFields procedure={procedureCreated} />
          </div>
        ) : null}
      </div>
    </>
  );
};

NewProcedurePage.getLayout = (page: React.ReactElement) => {
  return (
    <SessionGroupRequesterProvider>
      <Layout>{page}</Layout>
    </SessionGroupRequesterProvider>
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

export default NewProcedurePage;
