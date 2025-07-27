import * as React from 'react';
import router from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useExternalAuth } from '../../../../hooks';
import { ExternalJustificationNoteService } from '../../../../services/flow-cidadao';
import { ReportListContainerProps } from './types';
import ReportList from './Report';
import ReportListError from './Error';
import ReportListSkeleton from './Skeleton';

const ReportListContainer = ({ color }: ReportListContainerProps) => {
  const { externalToken } = useExternalAuth();
  const { subdomain } = useAuth();

  const { isError, isLoading, data } = useQuery({
    queryKey: [
      'indexProcedureJustificationNotes',
      externalToken,
      subdomain,
      router.query.procedureId,
    ],
    queryFn: () =>
      ExternalJustificationNoteService.index(String(externalToken), subdomain, {
        justifiableType: 'procedure',
        justifiableId: Number(router.query.procedureId),
        order: 'created_at',
        direction: 'asc',
        perPage: 1000,
      }),
  });

  if (isError) return <ReportListError />;

  if (isLoading) return <ReportListSkeleton />;

  return (
    <ReportList justificationNotes={data.justificationNotes} color={color} />
  );
};

export default ReportListContainer;
