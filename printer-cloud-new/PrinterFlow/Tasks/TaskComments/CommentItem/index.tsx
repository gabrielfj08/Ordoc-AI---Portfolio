import * as React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { TaskCommentService } from '../../../../services/printer-flow';
import { UpdateTaskCommentAPIResponse } from '../../../../services/printer-flow/types/taskComment';
import {
  commentTypeOption,
  EditTaskCommentFormValues,
  TaskCommentListContainerProps,
} from './types';
import TaskCommentItem from './CommentItem';

const TaskCommentItemContainer = ({
  taskComments,
  taskId,
}: TaskCommentListContainerProps) => {
  const { token, subdomain } = useAuth();
  const queryClient = useQueryClient();
  const [type, setType] = React.useState<commentTypeOption>('show');

  const mutation = useMutation(
    (payload: EditTaskCommentFormValues) =>
      TaskCommentService.update(
        token,
        subdomain,
        taskId,
        taskComments.id,
        payload
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          'taskComments',
          token,
          subdomain,
          taskId,
        ]);
      },
    }
  );

  const handleSubmit = (
    values: EditTaskCommentFormValues
  ): Promise<UpdateTaskCommentAPIResponse> => {
    return mutation.mutateAsync({
      ...values,
    });
  };

  return (
    <TaskCommentItem
      taskComments={taskComments}
      onSubmit={handleSubmit}
      setType={setType}
      type={type}
    />
  );
};

export default TaskCommentItemContainer;
