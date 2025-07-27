import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../../hooks';
import { ProcedureTemplateDocumentService } from '../../../../../services/printer-flow';
import { ShowAttachmentContainerProps } from './types';
import ShowAttachmentInfo from './ShowAttachment';
import ShowAttachmentSkeleton from './Skeleton';
import ShowAttachmentEmpty from './Empty';
import ShowAttachmentError from './Error';

const ShowAttachmentContainer = ({
  procedureTemplateId,
}: ShowAttachmentContainerProps) => {
  const { token, subdomain } = useAuth();

  const { isError, isLoading, data } = useQuery({
    queryKey: [
      'procedureTemplateDocuments',
      token,
      subdomain,
      procedureTemplateId,
    ],
    queryFn: () =>
      ProcedureTemplateDocumentService.index(
        token,
        subdomain,
        procedureTemplateId,
        {}
      ),
  });

  if (isError) return <ShowAttachmentError />;

  if (isLoading) return <ShowAttachmentSkeleton />;

  if (!data.meta.total) return <ShowAttachmentEmpty />;

  return (
    <ShowAttachmentInfo
      procedureTemplateDocuments={data}
      procedureTemplateId={procedureTemplateId}
    />
  );
};

export default ShowAttachmentContainer;
