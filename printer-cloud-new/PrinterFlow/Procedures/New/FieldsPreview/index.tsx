import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { FieldService } from '../../../../services/printer-flow';
import FieldsPreview from './FieldsPreview';
import FieldsPreviewError from './Error';
import FieldsPreviewSkeleton from './Skeleton';
import FieldsPreviewEmpty from './Empty';

const FieldsPreviewContainer = ({ procedureTemplateId }) => {
  const { token, subdomain } = useAuth();
  const { isError, isLoading, data } = useQuery({
    queryKey: ['fieldsPreview', token, subdomain, procedureTemplateId],
    queryFn: () =>
      FieldService.index(token, subdomain, procedureTemplateId, {
        perPage: 1000,
        order: 'created_at',
        direction: 'asc',
      }),
  });

  if (isError) {
    return <FieldsPreviewError />;
  }

  if (isLoading) {
    return <FieldsPreviewSkeleton />;
  }

  if (data.meta.total === 0) {
    return <FieldsPreviewEmpty />;
  }

  return <FieldsPreview fields={data.fields} />;
};

export default FieldsPreviewContainer;
