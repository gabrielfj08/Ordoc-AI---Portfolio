import * as React from 'react';
import router from 'next/router';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../../../../queryClient';
import { ExternalTaskService } from '../../../../../services/flow-cidadao';
import { menuOptions } from './types';
import {
  AuthExternalProvider,
  ExternalSessionProvider,
  useAuth,
  useExternalAuth,
  useModal,
  useV3Snackbar,
} from '../../../../../hooks';
import { CellProps } from '../../types';
import ShowExternalTaskModal from '../../../../components/Tasks/ShowTask';
import MenuTaskCell from './Menu';

const MenuTaskCellContainer = ({ task }: CellProps) => {
  const { openModal } = useModal();
  const { subdomain } = useAuth();
  const { externalToken } = useExternalAuth();
  const { showV3Snackbar } = useV3Snackbar();

  const handleRedirectToProcessesClick = () => {
    router.push(`/flow-cidadao/procedures/${task.procedureId}`);
    openModal(
      <AuthExternalProvider>
        <ExternalSessionProvider>
          <ShowExternalTaskModal
            taskId={task.id}
            justificationVisibility={false}
          />
        </ExternalSessionProvider>
      </AuthExternalProvider>
    );
  };

  const mutation = useMutation(
    () =>
      ExternalTaskService.accept(externalToken as string, subdomain, task.id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries();
      },
    }
  );

  switch (task.status) {
    case 'running':
      const options: menuOptions[] = [
        {
          label: 'Aceitar',
          icon: 'check',
          fill: false,
          stroke: true,
          onClick: () => {
            mutation
              .mutateAsync()
              .then(() => {
                openModal(
                  <AuthExternalProvider>
                    <ExternalSessionProvider>
                      <ShowExternalTaskModal
                        taskId={task.id}
                        commentVisibility={false}
                        attachmentVisibility={false}
                        justificationVisibility={false}
                      />
                    </ExternalSessionProvider>
                  </AuthExternalProvider>
                );
                showV3Snackbar(
                  'Tarefa aceita com sucesso.',
                  'success',
                  'Sucesso!'
                );
              })
              .catch((error) => {
                showV3Snackbar(
                  error.response.data.message,
                  'error',
                  'Algo deu errado.'
                );
              });
          },
        },
        {
          label: 'Recusar',
          icon: 'closeV3',
          fill: false,
          stroke: true,
          onClick: () => {
            openModal(
              <AuthExternalProvider>
                <ExternalSessionProvider>
                  <ShowExternalTaskModal
                    taskId={task.id}
                    justificationVisibility={true}
                  />
                </ExternalSessionProvider>
              </AuthExternalProvider>
            );
          },
        },
        {
          label: 'Ir para o processo',
          icon: 'proceduresV3',
          fill: false,
          stroke: true,
          onClick: () => {
            handleRedirectToProcessesClick();
          },
        },
      ];
      return <MenuTaskCell options={options} />;

    case 'started': {
      const options: menuOptions[] = [
        {
          label: 'Ir para o processo',
          icon: 'proceduresV3',
          fill: false,
          stroke: true,
          onClick: () => {
            handleRedirectToProcessesClick();
          },
        },
      ];
      return <MenuTaskCell options={options} />;
    }

    default: {
      const options: menuOptions[] = [
        {
          label: 'Ir para o processo',
          icon: 'proceduresV3',
          fill: false,
          stroke: true,
          onClick: () => {
            handleRedirectToProcessesClick();
          },
        },
      ];
      return <MenuTaskCell options={options} />;
    }
  }
};

export default MenuTaskCellContainer;
