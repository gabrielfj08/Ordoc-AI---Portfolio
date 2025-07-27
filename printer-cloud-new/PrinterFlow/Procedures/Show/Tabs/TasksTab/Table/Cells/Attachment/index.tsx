import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../../../../../hooks';
import { TaskDocumentService } from '../../../../../../../../services/printer-flow';
import { AttachmentCellContainerProps } from './types';
import AttachmentCellSkeleton from './Skeleton';
import AttachmentCell from './Attachment';

const AttachmentCellContainer = ({ task }: AttachmentCellContainerProps) => {
  const { token, subdomain } = useAuth();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['taskDocuments', token, subdomain, task.id],
    queryFn: () =>
      TaskDocumentService.index(token, subdomain, { taskId: task.id }),
  });

  if (isLoading) return <AttachmentCellSkeleton />;

  if (isError) return null;

  if (!data.meta.total) return null;

  return <AttachmentCell />;
};

export default AttachmentCellContainer;
