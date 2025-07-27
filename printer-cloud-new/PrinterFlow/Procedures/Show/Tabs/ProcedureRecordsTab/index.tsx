import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../../hooks';
import { JustificationNotesParams } from '../../../../../services/printer-flow/types';
import { JustificationNotesService } from '../../../../../services/printer-flow/JustificationNotes';
import { ProcedureRecordsTabContainerProps } from './types';
import ProcedureRecordsError from './Error';
import ProcedureRecordsSkeleton from './Skeleton';
import ProcedureRecords from './ProcedureRecordsTab';

const ProcedureRecordsTabContainer = ({
  justifiableId,
}: ProcedureRecordsTabContainerProps) => {
  const [params, setParams] = React.useState<JustificationNotesParams>({
    order: 'created_at',
    direction: 'asc',
    page: 1,
    perPage: 10,
    justifiableId: justifiableId,
    justifiableType: 'procedure',
  });

  const { subdomain, token } = useAuth();
  const { isLoading, isError, data } = useQuery({
    queryKey: ['procedureRecords', subdomain, token, params],
    queryFn: () => JustificationNotesService.index(token, subdomain, params),
  });

  if (isError) return <ProcedureRecordsError />;

  if (isLoading) return <ProcedureRecordsSkeleton />;

  return (
    <ProcedureRecords
      totalObjects={data.meta.total}
      params={params}
      setParams={setParams}
      records={data.justificationNotes}
    />
  );
};

export default ProcedureRecordsTabContainer;
