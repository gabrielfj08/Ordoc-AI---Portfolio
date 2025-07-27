import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../../hooks';
import { FieldValueOptionService } from '../../../../../services/printer-flow';
import { FieldValueOptionsContainerProps } from './types';
import FieldValueOptionsError from './Error';
import FieldValueOptionsSkeleton from './Skeleton';
import FieldValueOptions from './FieldValueOptions';

const FieldValueOptionsContainer = ({
  type,
  setType,
  fieldId,
}: FieldValueOptionsContainerProps) => {
  const { subdomain, token } = useAuth();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['fieldValueOptions', subdomain, token, fieldId, {}],
    queryFn: () => FieldValueOptionService.index(token, subdomain, fieldId),
  });

  if (isError) return <FieldValueOptionsError />;

  if (isLoading) return <FieldValueOptionsSkeleton />;

  return (
    <FieldValueOptions
      type={type}
      setType={setType}
      fieldId={fieldId}
      fieldValueOptions={data.fieldValueOptions}
      total={data.meta.total}
    />
  );
};

export default FieldValueOptionsContainer;
