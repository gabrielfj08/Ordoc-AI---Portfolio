import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../../../../../queryClient';
import {
  useAuth,
  useExternalAuth,
  useV3Snackbar,
} from '../../../../../../hooks';
import {
  RefuseExternalTaskFormValues,
  TaskExternalActionsModalProps,
} from './types';
import {
  RefuseExternalTaskAPIResponse,
  RefuseExternalTaskPayload,
} from '../../../../../../services/flow-cidadao/types';
import { ExternalTaskService } from '../../../../../../services/flow-cidadao';
import RefuseExternalTaskModal from './Refuse';

const RefuseExternalTaskModalContainer = ({
  task,
  status,
  justificationModalVisibility,
  setJustificationModalVisibility,
}: TaskExternalActionsModalProps) => {
  const { subdomain } = useAuth();
  const { showV3Snackbar } = useV3Snackbar();
  const { externalToken } = useExternalAuth();

  switch (status) {
    case 'running':
      const mutation = useMutation(
        (payload: RefuseExternalTaskPayload) =>
          ExternalTaskService.refuse(
            String(externalToken),
            subdomain,
            task.id,
            payload
          ),
        {
          onSuccess: () => {
            showV3Snackbar(
              `Sua recusa foi enviada com sucesso.`,
              'success',
              'Sucesso!'
            );
            queryClient.invalidateQueries();
            queryClient.invalidateQueries([
              'procedureExternalTasks',
              subdomain,
              externalToken,
              {},
            ]);
          },
        }
      );

      const handleSubmit = (
        values: RefuseExternalTaskFormValues
      ): Promise<RefuseExternalTaskAPIResponse> => {
        return mutation.mutateAsync({ ...values });
      };

      return (
        <RefuseExternalTaskModal
          onSubmit={handleSubmit}
          justificationModalVisibility={justificationModalVisibility}
          setJustificationModalVisibility={setJustificationModalVisibility}
        />
      );

    default:
      return null;
  }
};

export default RefuseExternalTaskModalContainer;
