import * as React from 'react';
import { useAuth } from '../../../../hooks';
import { useQuery } from '@tanstack/react-query';
import { TaskAttachmentService } from '../../../../services/printer-flow';
import { TaskAttachmentListContainerProps } from './types';
import TaskAttachmentList from './TaskFileMentionList';
import TaskAttachmentListSkeleton from './Skeleton';
import TaskAttachmentListError from './Error';
import TaskAttachmentListEmpty from './Empty';

const TaskFileMentionListContainer = ({
  taskId,
}: TaskAttachmentListContainerProps) => {
  const { token, subdomain } = useAuth();

  const { isError, isLoading, data } = useQuery({
    queryKey: ['taskAttachments', token, subdomain, taskId],
    queryFn: () =>
      TaskAttachmentService.index(token, subdomain, {
        taskId: taskId,
        perPage: 1000,
      }),
  });

  if (isLoading) return <TaskAttachmentListSkeleton />;

  if (isError) return <TaskAttachmentListError />;

  if (!data.meta.total) return <TaskAttachmentListEmpty />;

  return <TaskAttachmentList taskAttachments={data.taskAttachments} />;
};

export default TaskFileMentionListContainer;
