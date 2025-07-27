import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { queryClient } from '../../../../queryClient';
import { TaskFieldService } from '../../../../services/printer-flow';
import {
  UpdateTaskFieldAPIResponse,
  UpdateTaskFieldPayload,
} from '../../../../services/printer-flow/types';
import {
  UpdateTaskFieldContainerProps,
  UpdateTaskFieldFormValues,
  taskFieldActionType,
} from './types';
import UpdateTaskField from './Update';

const UpdateTaskFieldContainer = ({
  taskField,
  taskTemplate,
  type,
  setType,
}: UpdateTaskFieldContainerProps) => {
  const { subdomain, token } = useAuth();

  const mutation = useMutation(
    (payload: UpdateTaskFieldPayload) =>
      TaskFieldService.update(
        token,
        subdomain,
        taskTemplate.id,
        taskField.id,
        payload
      ),
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
    values: UpdateTaskFieldFormValues
  ): Promise<UpdateTaskFieldAPIResponse> => {
    return mutation.mutateAsync({
      ...values,
    });
  };

  return (
    <UpdateTaskField
      onSubmit={handleSubmit}
      taskField={taskField}
      taskTemplate={taskTemplate}
      type={type}
      setType={setType}
    />
  );
};

export default UpdateTaskFieldContainer;
