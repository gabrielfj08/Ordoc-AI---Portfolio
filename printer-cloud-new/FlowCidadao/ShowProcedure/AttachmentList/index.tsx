import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useExternalAuth } from '../../../hooks';
import { ExternalProcedureDocumentService } from '../../../services/flow-cidadao';
import { AttachmentListContainerProps } from './types';
import AttachmentList from './AttachmentList';
import AttachmentListSkeleton from './Skeleton';
import AttachmentListError from './Error';

const AttachmentListContainer = ({
  procedureId,
  value,
}: AttachmentListContainerProps) => {
  const { externalToken } = useExternalAuth();
  const { subdomain } = useAuth();

  const { isError, isLoading, data } = useQuery({
    queryKey: ['indexProcedureDocuments', procedureId],
    queryFn: () =>
      ExternalProcedureDocumentService.index(
        String(externalToken),
        subdomain,
        procedureId,
        { perPage: 1000 }
      ),
  });

  if (isError) return <AttachmentListSkeleton />;

  if (isLoading) return <AttachmentListError />;

  const attachments = new Set(value);

  const filteredAttachments = data.procedureDocuments.filter(
    (procedureDocument) => attachments.has(procedureDocument.uuid)
  );

  return <AttachmentList procedureDocuments={filteredAttachments} />;
};

export default AttachmentListContainer;
