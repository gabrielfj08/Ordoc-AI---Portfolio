import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { TaskCommentService } from '../../../../services/printer-flow';
import { TaskCommentListContainerProps } from './types';
import TaskCommentListSkeleton from './Skeleton';
import TaskCommentListError from './Error';
import TaskCommentListEmpty from './Empty';
import TaskCommentList from './CommentList';

const TaskCommentListContainer = ({
  taskId,
}: TaskCommentListContainerProps) => {
  const { token, subdomain } = useAuth();

  const { isError, isLoading, data } = useQuery({
    queryKey: ['taskComments', token, subdomain, taskId],
    queryFn: () =>
      TaskCommentService.index(token, subdomain, taskId, {
        order: 'created_at',
        direction: 'asc',
        page: 1,
        perPage: 1000,
      }),
  });

  if (isLoading) return <TaskCommentListSkeleton />;

  if (isError) return <TaskCommentListError />;

  if (!data.meta.total) return <TaskCommentListEmpty />;

  return <TaskCommentList taskId={taskId} taskComments={data.taskComments} />;
};

export default TaskCommentListContainer;
