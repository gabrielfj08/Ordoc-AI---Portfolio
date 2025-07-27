import React from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  useAuth,
  useExternalAuth,
  useV3Snackbar,
} from '../../../../../../hooks';
import { queryClient } from '../../../../../../queryClient';
import { ExternalTaskService } from '../../../../../../services/flow-cidadao';
import { AddExternalCommentModalContainerProps } from './types';
import ShowExternalButtonsModal from './Buttons';

const ShowExternalButtonsModalContainer = ({
  task,
  status,
  justificationModalVisibility,
  setJustificationModalVisibility,
}: AddExternalCommentModalContainerProps) => {
  const { subdomain } = useAuth();
  const { showV3Snackbar } = useV3Snackbar();
  const { externalToken } = useExternalAuth();

  switch (status) {
    case 'running':
      const acceptTaskMutation = useMutation(
        () =>
          ExternalTaskService.accept(String(externalToken), subdomain, task.id),
        {
          onSuccess: () => {
            showV3Snackbar(`Tarefa aceita com sucesso.`, 'success', 'Sucesso!');
            queryClient.invalidateQueries();
            queryClient.invalidateQueries([
              'taskExternalComments',
              externalToken,
              subdomain,
              task.id,
            ]);
          },
          onError: (err: any) => {
            showV3Snackbar(err.response.status, 'error', 'Algo deu errado!');
          },
        }
      );

      const acceptTaskHandleSubmit = () => {
        return acceptTaskMutation.mutateAsync();
      };

      return (
        <ShowExternalButtonsModal
          task={task}
          acceptTaskHandleSubmit={acceptTaskHandleSubmit}
          justificationModalVisibility={justificationModalVisibility}
          setJustificationModalVisibility={setJustificationModalVisibility}
          finishTaskHandleSubmit={() => {}}
        />
      );

    case 'started':
      const finishTaskMutation = useMutation(
        () =>
          ExternalTaskService.finish(String(externalToken), subdomain, task.id),
        {
          onSuccess: () => {
            showV3Snackbar(
              `Tarefa finalizada com sucesso.`,
              'success',
              'Sucesso!'
            );
            queryClient.invalidateQueries();
            queryClient.invalidateQueries([
              'taskExternalComments',
              externalToken,
              subdomain,
              task.id,
            ]);
          },
          onError: (error: any) => {
            showV3Snackbar(
              error.response.data.message,
              'error',
              'Algo deu errado!'
            );
          },
        }
      );

      const finishTaskHandleSubmit = () => {
        return finishTaskMutation.mutateAsync();
      };

      return (
        <ShowExternalButtonsModal
          task={task}
          finishTaskHandleSubmit={finishTaskHandleSubmit}
          justificationModalVisibility={justificationModalVisibility}
          setJustificationModalVisibility={setJustificationModalVisibility}
          acceptTaskHandleSubmit={() => {}}
        />
      );

    case 'refused':
      return null;

    case 'finished':
      return null;

    default:
      return null;
  }
};

export default ShowExternalButtonsModalContainer;
