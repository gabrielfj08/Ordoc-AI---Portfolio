import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../../hooks';
import { ProcedureDocumentService } from '../../../../../services/printer-flow';
import { AttachmentListItemContainerProps } from './types';
import AttachmentListItemError from './Error';
import AttachmentListItemSkeleton from './Skeleton';
import AttachmentListItem from './AttachmentListItem';

const AttachmentListContainer = ({
  procedureId,
  procedureDocumentUuid,
  setProcedureDocumentView,
  procedureDocumentView,
}: AttachmentListItemContainerProps) => {
  const { token, subdomain } = useAuth();

  const { isError, isLoading, data } = useQuery({
    queryKey: [
      'procedureDocument',
      token,
      subdomain,
      procedureId,
      procedureDocumentUuid,
    ],
    queryFn: () =>
      ProcedureDocumentService.show(
        token,
        subdomain,
        procedureId,
        procedureDocumentUuid
      ),
    refetchInterval: (data) =>
      data?.status === 'finished' || data?.status === 'failed' ? false : 200,
  });

  if (isError) {
    return <AttachmentListItemError />;
  }

  if (isLoading) {
    return <AttachmentListItemSkeleton />;
  }

  return (
    <AttachmentListItem
      item={data}
      setProcedureDocumentView={setProcedureDocumentView}
      procedureDocumentView={procedureDocumentView}
    />
  );
};

export default AttachmentListContainer;
