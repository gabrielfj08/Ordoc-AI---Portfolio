import * as React from 'react';
import router from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../hooks';
import { ProcedureTemplateService } from '../../../services/printer-flow';
import { UpdateProcedureTemplate } from '../../../services/printer-flow/types/procedureTemplate';
import { EditProcedureTemplateFormValues } from './types';
import EditProcedureTemplateSkeleton from './Skeleton';
import EditProcedureTemplateError from './Error';
import EditProcedureTemplate from './Edit';
import EditProcedureTemplateUnauthorized from './Unauthorized';

const EditProcedureTemplateContainer = () => {
  const { subdomain, token } = useAuth();
  const [error, setError] = React.useState<number>();

  if (!router.query.procedureTemplateId) {
    return null;
  }

  const { data, isError, isLoading } = useQuery({
    queryKey: [
      'procedureTemplates',
      subdomain,
      token,
      Number(router.query.procedureTemplateId),
    ],
    queryFn: () =>
      ProcedureTemplateService.show(
        token,
        subdomain,
        Number(router.query.procedureTemplateId)
      ),
    onError: (err: any) => {
      setError(err.response.status);
    },
  });

  if (isError) {
    if (error === 401) {
      return <EditProcedureTemplateUnauthorized />;
    }
    return <EditProcedureTemplateError />;
  }

  if (isLoading) {
    return <EditProcedureTemplateSkeleton />;
  }

  const transformSource = (source: Array<string>): string => {
    if (source.includes('internal') && source.includes('external')) {
      return 'internal_external';
    }

    if (source.includes('external')) {
      return 'external';
    }

    if (source.includes('internal')) {
      return 'internal';
    }
    return data.source;
  };

  const handleSubmit = (
    values: EditProcedureTemplateFormValues
  ): Promise<UpdateProcedureTemplate> => {
    return ProcedureTemplateService.update(token, subdomain, data.id, {
      ...values,
      source: transformSource(values.source),
    });
  };

  return <EditProcedureTemplate onSubmit={handleSubmit} data={data} />;
};

export default EditProcedureTemplateContainer;
