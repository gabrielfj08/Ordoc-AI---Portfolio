import * as React from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '../../../../../queryClient';
import { useAuth, useExternalAuth } from '../../../../../hooks';
import { ExternalTaskCommentService } from '../../../../../services/flow-cidadao';
import { UpdateExternalTaskCommentAPIResponse } from '../../../../../services/flow-cidadao/types';
import {
  commentTypeOption,
  TaskExternalCommentListContainerProps,
  UpdateExternalTaskCommentFormValues,
} from './types';
import TaskExtenalCommentItem from './CommentItem';
import TaskExternalCommentItemSkeleton from './Skeleton';
import TaskExternalCommentItemError from './Error';

const TaskExternalCommentItemContainer = ({
  task,
  taskComments,
}: TaskExternalCommentListContainerProps) => {
  const { subdomain } = useAuth();
  const { externalToken } = useExternalAuth();
  const [type, setType] = React.useState<commentTypeOption>('show');

  const mutation = useMutation(
    (payload: UpdateExternalTaskCommentFormValues) =>
      ExternalTaskCommentService.update(
        String(externalToken),
        subdomain,
        task.id,
        taskComments.id,
        payload
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries();
        queryClient.invalidateQueries([
          'taskExternalComments',
          externalToken,
          subdomain,
          task.id,
        ]);
      },
    }
  );

  const { isError, isLoading, data } = useQuery({
    queryKey: [
      'taskExternalComments',
      externalToken,
      subdomain,
      { taskId: task?.id },
    ],
    queryFn: () =>
      ExternalTaskCommentService.show(
        String(externalToken),
        subdomain,
        task.id,
        taskComments.id
      ),
  });

  if (isLoading) return <TaskExternalCommentItemSkeleton />;

  if (isError) return <TaskExternalCommentItemError />;

  const handleSubmit = (
    values: UpdateExternalTaskCommentFormValues
  ): Promise<UpdateExternalTaskCommentAPIResponse> => {
    return mutation.mutateAsync({
      ...values,
    });
  };

  return (
    <TaskExtenalCommentItem
      createdBy={data.createdBy.name}
      type={type}
      task={task}
      taskComments={taskComments}
      setType={setType}
      onSubmit={handleSubmit}
    />
  );
};

export default TaskExternalCommentItemContainer;
