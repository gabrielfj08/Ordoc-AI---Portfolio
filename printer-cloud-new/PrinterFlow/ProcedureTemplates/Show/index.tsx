import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../hooks';
import { ProcedureTemplateService } from '../../../services/printer-flow';
import { ShowProcedureTemplateContainerProps } from './types';
import ShowProcedureTemplateSkeleton from './Skeleton';
import ShowProcedureTemplateError from './Error';
import ShowProcedureTemplate from './Show';
import ShowProcedureTemplateUnauthorized from './Unauthorized';

const ShowProcedureTemplateContainer = ({
  procedureTemplateId,
  setProcedureTemplate,
  procedureTemplateDocument,
}: ShowProcedureTemplateContainerProps) => {
  const { subdomain, token } = useAuth();
  const [error, setError] = React.useState<number>();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['procedureTemplates', subdomain, token, {}],
    queryFn: () =>
      ProcedureTemplateService.show(token, subdomain, procedureTemplateId),
    onSuccess: (data) => {
      setProcedureTemplate(data);
    },
    onError: (err: any) => {
      setError(err.response.status);
    },
  });

  if (isError) {
    if (error === 401) {
      return <ShowProcedureTemplateUnauthorized />;
    }
    return <ShowProcedureTemplateError />;
  }

  if (isLoading) return <ShowProcedureTemplateSkeleton />;

  return (
    <ShowProcedureTemplate
      procedureTemplate={data}
      procedureTemplateDocument={procedureTemplateDocument}
    />
  );
};

export default ShowProcedureTemplateContainer;
