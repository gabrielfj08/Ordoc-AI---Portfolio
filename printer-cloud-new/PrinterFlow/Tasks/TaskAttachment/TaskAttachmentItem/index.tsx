import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '../../../../queryClient';
import { useAuth, useSnackbar } from '../../../../hooks';
import { TaskAttachmentService } from '../../../../services/printer-flow';
import { TaskAttachmentItemContainerProps } from './types';
import TaskAttachmentItem from './TaskAttachmentItem';
import TaskAttachmentItemSkeleton from './Skeleton';
import TaskAttachmentItemError from './Error';

const TaskAttachmentItemContainer = ({
  taskAttachment,
}: TaskAttachmentItemContainerProps) => {
  const { token, subdomain } = useAuth();
  const { showSnackbar } = useSnackbar();

  const { isError, isLoading, data } = useQuery({
    queryKey: [
      'taskAttachmentItem',
      token,
      subdomain,
      taskAttachment.taskId,
      taskAttachment.id,
    ],
    queryFn: () =>
      TaskAttachmentService.show(token, subdomain, taskAttachment.id),
  });

  if (isLoading) return <TaskAttachmentItemSkeleton />;

  if (isError) return <TaskAttachmentItemError />;

  const handleSubmit = () => {
    TaskAttachmentService.deleteTaskAttachment(token, subdomain, data.id)
      .then(() => {
        queryClient.invalidateQueries([
          'taskAttachments',
          token,
          subdomain,
          taskAttachment.taskId,
        ]),
          showSnackbar('Menção removida com sucesso', 'success');
      })
      .catch((error) => {
        showSnackbar(error.response.data.message, 'error');
      });
  };

  return (
    <TaskAttachmentItem taskAttachment={data} handleSubmit={handleSubmit} />
  );
};

export default TaskAttachmentItemContainer;
