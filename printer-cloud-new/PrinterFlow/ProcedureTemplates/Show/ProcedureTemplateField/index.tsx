import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { FieldService } from '../../../../services/printer-flow';
import { ShowProcedureTemplateFieldContainerProps } from './types';
import ShowProcedureTemplateFieldError from './Error';
import ShowProcedureTemplateFieldSkeleton from './Skeleton';
import ShowProcedureTemplateFieldEmpty from './Empty';
import ShowProcedureTemplateField from './ProcedureTemplateField';

const ShowProcedureTemplateFieldContainer = ({
  procedureTemplate,
}: ShowProcedureTemplateFieldContainerProps) => {
  const { subdomain, token } = useAuth();
  const [page, setPage] = React.useState(1);

  const { isLoading, isFetching, isError, data } = useQuery({
    queryKey: ['fields', subdomain, token, procedureTemplate.id, { page }],
    queryFn: () =>
      FieldService.index(token, subdomain, procedureTemplate.id, {
        page,
        perPage: 3,
      }),
  });

  if (isError)
    return (
      <ShowProcedureTemplateFieldError procedureTemplate={procedureTemplate} />
    );

  if (isLoading || isFetching) return <ShowProcedureTemplateFieldSkeleton />;

  if (!data.meta.total) {
    return (
      <ShowProcedureTemplateFieldEmpty procedureTemplate={procedureTemplate} />
    );
  }

  const totalDocs = data.meta.total;

  return (
    <ShowProcedureTemplateField
      procedureTemplate={procedureTemplate}
      fields={data.fields}
      totalDocs={totalDocs}
      page={page}
      setPage={setPage}
    />
  );
};

export default ShowProcedureTemplateFieldContainer;
