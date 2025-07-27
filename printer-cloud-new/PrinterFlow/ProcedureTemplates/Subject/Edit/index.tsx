import * as React from 'react';
import router from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { UpdateProcedureTemplate } from '../../../../services/printer-flow/types/procedureTemplate';
import { ProcedureTemplateService } from '../../../../services/printer-flow';
import { EditProcedureTemplateFormValues } from '../../Edit/types';
import EditSubjectSkeleton from './Skeleton';
import EditSubjectError from './Error';
import EditSubject from './Edit';

const EditSubjectContainer = () => {
  const { subdomain, token } = useAuth();
  if (!router.query.id) {
    return null;
  }

  const {
    data: subjectData,
    isError: subjectIsError,
    isLoading: subjectIsLoading,
  } = useQuery({
    queryKey: ['procedureTemplates', subdomain, token, Number(router.query.id)],
    queryFn: () =>
      ProcedureTemplateService.show(token, subdomain, Number(router.query.id)),
  });

  const {
    data: procedureTemplateData,
    isError: procedureTemplateIsError,
    isLoading: procedureTemplateIsLoading,
  } = useQuery({
    queryKey: [
      'parentProcedureTemplates',
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
  });

  if (subjectIsError || procedureTemplateIsError) {
    return <EditSubjectError />;
  }

  if (subjectIsLoading || procedureTemplateIsLoading) {
    return <EditSubjectSkeleton />;
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
    return subjectData.source;
  };

  const handleSubmit = (
    values: EditProcedureTemplateFormValues
  ): Promise<UpdateProcedureTemplate> => {
    return ProcedureTemplateService.update(token, subdomain, subjectData.id, {
      ...values,
      source: transformSource(values.source),
    });
  };

  return (
    <EditSubject
      onSubmit={handleSubmit}
      data={subjectData}
      parentProcedureTemplate={procedureTemplateData}
    />
  );
};

export default EditSubjectContainer;
