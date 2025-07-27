import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../../../../queryClient';
import { useAuth } from '../../../../../hooks';
import { TaskService } from '../../../../../services/printer-flow';
import {
  ResetTaskAssigneeAPIResponse,
  ResetTaskAssigneePayload,
} from '../../../../../services/printer-flow/types';
import {
  ResetTaskAssigneeFormValues,
  ResetAssigneeFormContainerProps,
} from './types';
import ResetAssigneeForm from './ResetAssignee';

const ResetAssigneFormContainer = ({
  task,
  setResetGroupAssignee,
  resetGroupAssignee,
}: ResetAssigneeFormContainerProps) => {
  const { token, subdomain } = useAuth();
  const mutation = useMutation(
    (payload: ResetTaskAssigneePayload) =>
      TaskService.resetAssignee(token, subdomain, task.id, payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['task', token, subdomain, task.id]);
        queryClient.invalidateQueries(['tasksRunning', subdomain, token, {}]);
      },
    }
  );

  const handleSubmit = (
    values: ResetTaskAssigneeFormValues
  ): Promise<ResetTaskAssigneeAPIResponse> => {
    return mutation.mutateAsync({ ...values });
  };

  return (
    <ResetAssigneeForm
      task={task}
      setResetGroupAssignee={setResetGroupAssignee}
      resetGroupAssignee={resetGroupAssignee}
      onSubmit={handleSubmit}
    />
  );
};

export default ResetAssigneFormContainer;
