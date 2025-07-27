import * as React from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { TaskService } from '../../../../services/printer-flow';
import EditTaskModal from './EditTask';
import { EditTaskModalContainerProps, UpdateTaskFormValue } from './types';
import { UpdateTaskAPIResponse } from '../../../../services/printer-flow/types/task';
import EditTaskModalError from './Error';
import EditTaskModalSkeleton from './Skeleton';
import { queryClient } from '../../../../queryClient';

const EditTaskModalContainer = ({
  task,
  justificationModalVisibility,
  setJustificationModalVisibility,
  commentModalVisibility,
  setCommentModalVisibility,
  setAttachmentModalVisibility,
  attachmentModalVisibility,
}: EditTaskModalContainerProps) => {
  const { subdomain, token } = useAuth();

  const mutation = useMutation(
    (payload: UpdateTaskFormValue) =>
      TaskService.update(token, subdomain, task.id, payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks', subdomain, token, {}]);
      },
    }
  );

  const { data, isError, isLoading } = useQuery({
    queryKey: ['tasks', subdomain, token, task.id],
    queryFn: () => TaskService.show(token, subdomain, task.id),
  });

  if (isError) {
    return <EditTaskModalError />;
  }

  if (isLoading) {
    return <EditTaskModalSkeleton />;
  }

  const handleSubmit = (
    values: UpdateTaskFormValue
  ): Promise<UpdateTaskAPIResponse> => {
    return mutation.mutateAsync({
      ...values,
    });
  };

  return (
    <EditTaskModal
      task={data}
      justificationModalVisibility={justificationModalVisibility}
      setJustificationModalVisibility={setJustificationModalVisibility}
      commentModalVisibility={commentModalVisibility}
      setCommentModalVisibility={setCommentModalVisibility}
      attachmentModalVisibility={attachmentModalVisibility}
      setAttachmentModalVisibility={setAttachmentModalVisibility}
      onSubmit={handleSubmit}
    />
  );
};

export default EditTaskModalContainer;
