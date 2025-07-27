import * as React from 'react';
import getConfig from 'next/config';
import router from 'next/router';
import { useQuery } from '@tanstack/react-query';
import {
  AuthExternalProvider,
  useV3ActionSheet,
  useAuth,
  useExternalAuth,
  useV3Snackbar,
} from '../../hooks';
import {
  ExternalProcedureReportService,
  ExternalProcedureService,
} from '../../services/flow-cidadao';
import { ShowProcedureContainerProps } from './types';
import { ShowExternalProcedureAPIResponse } from '../../services/flow-cidadao/types';
import ShowProcedure from './ShowProcedure';
import ShowProcedureError from './Error';
import ShowProcedureSkeleton from './Skeleton';
import ProcedureReportActionSheet from '../components/Procedures/ProcedureReport';

const apiUrl = getConfig().publicRuntimeConfig.NEXT_PUBLIC_API_URL;

const ShowProcedureContainer = ({
  setProcedureName,
}: ShowProcedureContainerProps) => {
  const { externalToken } = useExternalAuth();
  const { subdomain } = useAuth();
  const { showV3Snackbar } = useV3Snackbar();
  const { openActionSheet } = useV3ActionSheet();

  const { isError, isLoading, data } = useQuery({
    queryKey: [
      'showProcedure',
      router.query.procedureId,
      externalToken,
      subdomain,
    ],
    queryFn: () =>
      ExternalProcedureService.show(
        String(externalToken),
        subdomain,
        Number(router.query.procedureId)
      ),
    onSuccess: (procedure: ShowExternalProcedureAPIResponse) =>
      setProcedureName(procedure.processNumber),
  });

  const generateReport = () => {
    return ExternalProcedureReportService.create(
      String(externalToken),
      subdomain,
      Number(router.query.procedureId)
    )
      .then((res) => {
        if (res.status === 'finished') {
          showV3Snackbar(
            'Seu comprovante abrirá em uma nova aba.',
            'success',
            'PDF criado com sucesso.'
          );
          window.document.open(
            `${apiUrl}/${res.documentUrl}`,
            '_blank',
            'noreferrer'
          );
        } else {
          openActionSheet(
            <AuthExternalProvider>
              <ProcedureReportActionSheet
                procedureId={res.procedureId}
                procedureReportId={res.id}
              />
            </AuthExternalProvider>
          );
        }
      })
      .catch((error) => {
        showV3Snackbar(
          error.response.data.message,
          'error',
          'Falha na criação do PDF.'
        );
      });
  };

  if (isError) return <ShowProcedureError />;

  if (isLoading) return <ShowProcedureSkeleton />;

  return <ShowProcedure procedure={data} generateReport={generateReport} />;
};

export default ShowProcedureContainer;
