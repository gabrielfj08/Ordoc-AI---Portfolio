import { useQuery } from '@tanstack/react-query';
import * as React from 'react';
import { useAuth } from '../../../../../../hooks';
import { ProcedureDocumentService } from '../../../../../../services/printer-flow';
import { AttachmentListItemContainerProps } from '../types';
import AttachmentListItem from './AttachmentItem';
import AttachmentListItemError from './Error';
import AttachmentListItemSkeleton from './Skeleton';

const AttachmentListItemContainer = ({
  procedureId,
  procedureDocumentUuid,
}: AttachmentListItemContainerProps) => {
  const { token, subdomain } = useAuth();
  const { isError, isLoading, data } = useQuery({
    queryKey: ['attachmentItem', procedureId, procedureDocumentUuid],
    queryFn: () =>
      ProcedureDocumentService.show(
        token,
        subdomain,
        procedureId,
        procedureDocumentUuid
      ),
  });

  if (isError) {
    return <AttachmentListItemError />;
  }

  if (isLoading) {
    return <AttachmentListItemSkeleton />;
  }

  return <AttachmentListItem item={data} />;
};

export default AttachmentListItemContainer;
