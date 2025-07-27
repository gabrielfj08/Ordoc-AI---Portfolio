import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useExternalAuth } from '../../../hooks';
import { ExternalFieldService } from '../../../services/flow-cidadao';
import ExternalFieldsPreview from './FieldsPreview';
import FieldsPreviewSkeleton from './Skeleton';
import FieldsPreviewError from './Error';
import FieldsPreviewEmpty from './Empty';

const ExternalFieldsPreviewContainer = ({ procedureTemplateId, formik }) => {
  const { subdomain } = useAuth();
  const { externalToken } = useExternalAuth();

  const { isError, isLoading, data } = useQuery({
    queryKey: ['fieldsPreview', externalToken, subdomain, procedureTemplateId],
    queryFn: () =>
      ExternalFieldService.index(
        externalToken as string,
        subdomain,
        procedureTemplateId,
        {
          perPage: 1000,
          order: 'created_at',
          direction: 'asc',
        }
      ),
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

  return <ExternalFieldsPreview fields={data.fields} formik={formik} />;
};

export default ExternalFieldsPreviewContainer;
