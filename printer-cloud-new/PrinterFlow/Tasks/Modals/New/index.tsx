import * as React from 'react';
import router from 'next/router';
import { queryClient } from '../../../../queryClient';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { TaskService } from '../../../../services/printer-flow';
import { NewTaksModalContainerProps, NewTaskFormValues } from './types';
import { CreateTaskPayload } from '../../../../services/printer-flow/types/task';
import NewTaskModal from './NewTask';

const NewTaskModalContainer = ({}: NewTaksModalContainerProps) => {
  const { token, subdomain } = useAuth();

  const mutation = useMutation(
    (payload: CreateTaskPayload) =>
      TaskService.create(token, subdomain, {
        ...payload,
        procedureId: Number(router.query.procedureId),
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks']);
      },
    }
  );

  const handleSubmit = (values: NewTaskFormValues) => {
    return mutation.mutateAsync(values);
  };

  return <NewTaskModal onSubmit={handleSubmit} />;
};

export default NewTaskModalContainer;
