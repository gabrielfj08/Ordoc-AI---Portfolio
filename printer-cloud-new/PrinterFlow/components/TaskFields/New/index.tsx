import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../../../queryClient';
import { useAuth } from '../../../../hooks';
import { TaskFieldService } from '../../../../services/printer-flow';
import {
  CreateTaskFieldAPIResponse,
  CreateTaskFieldPayload,
} from '../../../../services/printer-flow/types';
import { NewTaskFieldContainerProps, NewTaskFieldFormValues } from './types';
import NewTaskField from './NewTaskField';

const NewTaskFieldContainer = ({
  taskTemplate,
  setHidden,
}: NewTaskFieldContainerProps) => {
  const { subdomain, token } = useAuth();

  const mutation = useMutation(
    (payload: CreateTaskFieldPayload) =>
      TaskFieldService.create(token, subdomain, taskTemplate.id, payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          'taskFields',
          subdomain,
          token,
          taskTemplate.id,
          {},
        ]);
      },
    }
  );

  const handleSubmit = (
    values: NewTaskFieldFormValues
  ): Promise<CreateTaskFieldAPIResponse> => {
    return mutation.mutateAsync({
      ...values,
    });
  };

  return <NewTaskField onSubmit={handleSubmit} setHidden={setHidden} />;
};

export default NewTaskFieldContainer;
