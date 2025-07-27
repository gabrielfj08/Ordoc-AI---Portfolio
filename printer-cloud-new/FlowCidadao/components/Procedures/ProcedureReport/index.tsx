import * as React from 'react';
import getConfig from 'next/config';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useExternalAuth } from '../../../../hooks';
import { ExternalProcedureReportService } from '../../../../services/flow-cidadao';
import ProcedureReportActionSheet from './ProcedureReport';

const apiUrl = getConfig().publicRuntimeConfig.NEXT_PUBLIC_API_URL;

const ProcedureReportActionSheetContainer = ({
  procedureId,
  procedureReportId,
}) => {
  const { subdomain } = useAuth();
  const { externalToken } = useExternalAuth();
  const [openedWindow, setOpenedWindow] = React.useState<boolean>(false);

  const { isLoading, isError, data } = useQuery({
    queryKey: [
      'procedureReport',
      externalToken,
      subdomain,
      procedureId,
      procedureReportId,
    ],
    queryFn: () =>
      ExternalProcedureReportService.show(
        String(externalToken),
        subdomain,
        procedureId,
        procedureReportId
      ),
    onSuccess: (data) => {
      if (data.status === 'finished' && !openedWindow) {
        window.document.open(
          `${apiUrl}/${data.documentUrl}`,
          '_blank',
          'noreferrer'
        );
        setOpenedWindow(true);
      }
    },
    refetchInterval: (data) =>
      data?.status === 'finished' || data?.status === 'failed' ? false : 1000,
  });

  if (isError) return null;

  if (isLoading) return null;

  return <ProcedureReportActionSheet procedureReport={data} />;
};

export default ProcedureReportActionSheetContainer;
