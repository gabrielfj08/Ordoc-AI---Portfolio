import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../../hooks';
import { TaskDocumentService } from '../../../../../services/printer-flow';
import { AttachmentTaskListContainerProps } from './types';
import AttachmentTaskListSkeleton from './Skeleton';
import AttachmentTaskListError from './Error';
import TaskAttachmentListEmpty from './Empty';
import TaskAttachmentList from './AttachmentTaskList';

const AttachmentTaskListContainer = ({
  taskId,
}: AttachmentTaskListContainerProps) => {
  const { token, subdomain } = useAuth();

  const { isError, isLoading, data } = useQuery({
    queryKey: ['taskDocuments', token, subdomain, taskId],
    queryFn: () =>
      TaskDocumentService.index(token, subdomain, {
        taskId: taskId,
        perPage: 1000,
      }),
  });

  if (isLoading) return <AttachmentTaskListSkeleton />;

  if (isError) return <AttachmentTaskListError />;

  if (!data.meta.total) return <TaskAttachmentListEmpty />;

  return <TaskAttachmentList taskDocuments={data.taskDocuments} />;
};

export default AttachmentTaskListContainer;
