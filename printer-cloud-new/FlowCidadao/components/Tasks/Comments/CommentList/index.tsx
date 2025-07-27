import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useExternalAuth } from '../../../../../hooks';
import { ExternalTaskCommentService } from '../../../../../services/flow-cidadao';
import { TaskCommentListContainerProps } from './types';
import TaskExternalCommentList from './CommentList';
import TaskExternalCommentListSkeleton from './Skeleton';
import TaskExternalCommentListError from './Error';
import TaskExternalCommentListEmpty from './Empty';

const TaskCommentListContainer = ({ task }: TaskCommentListContainerProps) => {
  const { subdomain } = useAuth();
  const { externalToken } = useExternalAuth();

  const { isError, isLoading, data } = useQuery({
    queryKey: ['taskExternalComments', externalToken, subdomain, task?.id],
    queryFn: () =>
      ExternalTaskCommentService.index(
        String(externalToken),
        subdomain,
        task.id,
        {
          order: 'created_at',
          direction: 'desc',
          perPage: 1000,
        }
      ),
  });

  if (isLoading) return <TaskExternalCommentListSkeleton />;

  if (isError) return <TaskExternalCommentListError />;

  if (!data.meta.total) return <TaskExternalCommentListEmpty />;

  return (
    <TaskExternalCommentList task={task} taskComments={data.taskComments} />
  );
};

export default TaskCommentListContainer;
