import * as React from 'react';
import router from 'next/router';
import getConfig from 'next/config';
import { useQuery } from '@tanstack/react-query';
import { ProcedureReportService } from '../../../../services/printer-flow';
import { useAuth } from '../../../../hooks';
import { NewProcedureReportContainerProps } from './types';
import { GeneratePDFStatus } from '../../../../PrinterAir/constants';
import NewProcedureReport from './NewProcedureReport';
import NewProcedureReportSkeleton from './Skeleton';
import NewProcedureReportError from './Error';

const apiUrl = getConfig().publicRuntimeConfig.NEXT_PUBLIC_API_URL;

const NewProcedureReportContainer = ({
  documentId,
  procedureId,
}: NewProcedureReportContainerProps) => {
  const [openedWindow, setOpenedWindow] = React.useState<boolean>(false);
  const { subdomain, token } = useAuth();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['procedureReport'],
    queryFn: () =>
      ProcedureReportService.show(token, subdomain, procedureId, documentId),
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
      data?.status === GeneratePDFStatus.finished ||
      data?.status === GeneratePDFStatus.failed
        ? false
        : 1000,
  });

  if (isError) return <NewProcedureReportError />;

  if (isLoading) return <NewProcedureReportSkeleton />;

  return <NewProcedureReport procedureReports={data} />;
};

export default NewProcedureReportContainer;
