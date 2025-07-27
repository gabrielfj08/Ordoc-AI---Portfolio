import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../../../hooks';
import { ProcedureDocumentService } from '../../../../../../services/printer-flow';
import { AttachmentListContainerProps } from '../types';
import AttachmentList from './AttachmentList';
import AttachmentListError from './Error';
import AttachmentListSkeleton from './Skeleton';

const AttachmentListContainer = ({
  procedureId,
  fieldName,
  attachmentUuids,
}: AttachmentListContainerProps) => {
  const { token, subdomain } = useAuth();

  const { isError, isLoading, data } = useQuery({
    queryKey: ['attachmentList', procedureId],
    queryFn: () =>
      ProcedureDocumentService.index(token, subdomain, procedureId, {
        status: 'finished',
        perPage: 1000,
      }),
  });

  if (isError) {
    return <AttachmentListError />;
  }

  if (isLoading) {
    return <AttachmentListSkeleton />;
  }

  const attachments = new Set(attachmentUuids);

  const filteredAttachments = data.procedureDocuments.filter(
    (procedureDocument) => attachments.has(procedureDocument.uuid)
  );

  return (
    <AttachmentList
      procedureId={procedureId}
      attachments={filteredAttachments}
      fieldName={fieldName}
    />
  );
};

export default AttachmentListContainer;
