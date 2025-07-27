import * as React from 'react';
import Head from 'next/head';
import router from 'next/router';
import getConfig from 'next/config';
import { ButtonRounded, Icon, Typography } from 'printer-ui';
import { SessionGroupRequesterProvider, useAws } from '../../../../../hooks';
import {
  IndexJustificationNote,
  ShowProcedureTemplate,
} from '../../../../../services/printer-flow/types';
import Layout from '../../../../../PrinterFlow/components/Layout';
import Header from '../../../../../components/Layout/Header';
import ShowProcedure from '../../../../../PrinterFlow/Procedures/Show';
import ShowProcedureInfo from '../../../../../PrinterFlow/Procedures/Show/Info';
import { NextPageWithLayout } from '../../../../_app';

const ProcedureViewPage: NextPageWithLayout = ({ credentials }) => {
  const [procedureNumber, setProcedureNumber] = React.useState<string>('');
  const { setCredentials } = useAws();

  React.useEffect(() => {
    setCredentials(credentials);
  }, [credentials]);

  return (
    <>
      <Head>
        <title>Printer Flow | Visualizar Processo</title>
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
        <div className="mt-7 sm:mt-0 sm:mr-10 space-x-2 flex items-center sm:justify-between w-full">
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
            Processo {procedureNumber}
          </Typography>
        </div>
      </Header>
      <div className="sm:px-0 max-w-full">
        <ShowProcedure
          setProcedureNumber={setProcedureNumber}
          justificationNote={{} as IndexJustificationNote}
          subject={{} as ShowProcedureTemplate}
        />
      </div>
    </>
  );
};

ProcedureViewPage.getLayout = (page: React.ReactElement) => {
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

export default ProcedureViewPage;
