import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useExternalAuth } from '../../../../hooks';
import { ExternalProcedureDocumentService } from '../../../../services/flow-cidadao';
import { AttachmentListItemContainerProps } from './types';
import AttachmentListItem from './AttachmentListItem';
import AttachmentListItemError from './Error';
import AttachmentListItemSkeleton from './Skeleton';

const AttachmentListItemContainer = ({
  procedureId,
  procedureDocumentUuid,
}: AttachmentListItemContainerProps) => {
  const { subdomain } = useAuth();
  const { externalToken } = useExternalAuth();

  const { isError, isLoading, data } = useQuery({
    queryKey: [
      'showProcedureDocument',
      externalToken,
      subdomain,
      procedureId,
      procedureDocumentUuid,
    ],
    queryFn: () =>
      ExternalProcedureDocumentService.show(
        String(externalToken),
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
