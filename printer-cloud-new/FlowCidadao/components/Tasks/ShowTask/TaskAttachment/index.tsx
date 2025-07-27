import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useExternalAuth } from '../../../../../hooks';
import { ExternalTaskDocumentService } from '../../../../../services/flow-cidadao/TaskDocument';
import { AttachmentExternalTaskListContainerProps } from './types';
import AttachmentExternalTaskListSkeleton from './Skeleton';
import TaskAttachmentList from './AttachmentTaskList';
import AttachmentExternalTaskListError from './Error';

const TaskAttachmentListContainer = ({
  task,
}: AttachmentExternalTaskListContainerProps) => {
  const { subdomain } = useAuth();
  const { externalToken } = useExternalAuth();

  const { isError, isLoading, data } = useQuery({
    queryKey: ['indexListDocuments', externalToken, subdomain, task.id],
    queryFn: () =>
      ExternalTaskDocumentService.index(String(externalToken), subdomain, {
        order: 'created_at',
        direction: 'asc',
        taskId: task.id,
        perPage: 1000,
      }),
  });

  if (isLoading) return <AttachmentExternalTaskListSkeleton />;

  if (isError) return <AttachmentExternalTaskListError />;

  if (!data.meta.total) return null;

  return <TaskAttachmentList taskDocuments={data.taskDocuments} />;
};

export default TaskAttachmentListContainer;
