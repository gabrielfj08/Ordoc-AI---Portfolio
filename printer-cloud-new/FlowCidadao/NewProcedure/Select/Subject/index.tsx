import * as React from 'react';
import { useFormikContext } from 'formik';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useExternalAuth } from '../../../../hooks';
import { ExternalProcedureTemplateService } from '../../../../services/flow-cidadao';
import { SubjectSelectContainerProps } from './types';
import SelectSkeleton from '../Skeleton';
import SubjectSelect from './Subject';
import SubjectEmpty from './Empty';
import SelectError from '../Error';

const SubjectSelectContainer = ({
  formik,
  parentProcedureTemplateId,
}: SubjectSelectContainerProps) => {
  const { subdomain } = useAuth();
  const { externalToken } = useExternalAuth();
  const { resetForm } = useFormikContext();

  const { isLoading, isFetching, isError, data } = useQuery({
    queryKey: [
      'procedureTemplatesExternal',
      subdomain,
      externalToken,
      { parentProcedureTemplateId },
    ],
    queryFn: () =>
      ExternalProcedureTemplateService.index(
        externalToken as string,
        subdomain,
        {
          order: 'name',
          direction: 'asc',
          q: '',
          perPage: 10,
          parentProcedureTemplateId: Number(parentProcedureTemplateId),
        }
      ),
  });

  React.useEffect(
    () =>
      resetForm({
        values: { procedureTemplateId: parentProcedureTemplateId },
      }),
    [parentProcedureTemplateId]
  );

  if (!parentProcedureTemplateId) return <SubjectEmpty />;

  if (isLoading || isFetching) {
    return <SelectSkeleton />;
  }

  if (isError) {
    return <SelectError />;
  }

  return (
    <SubjectSelect
      formik={formik}
      items={data.procedureTemplates.map((item: any) => {
        return { label: item.name, value: item.id };
      })}
    />
  );
};

export default SubjectSelectContainer;
