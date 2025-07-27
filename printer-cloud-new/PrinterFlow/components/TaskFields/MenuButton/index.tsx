import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../../../queryClient';
import { useAuth, useSnackbar } from '../../../../hooks';
import { TaskFieldService } from '../../../../services/printer-flow';
import { menuOptions } from '../../../../components/MenuButton/types';
import { TaskFieldsMenuButtonContainerProps } from './types';
import TaskFieldsMenuButton from './MenuButton';

const TaskFieldsMenuButtonContainer = ({
  taskField,
  taskTemplate,
  setType,
}: TaskFieldsMenuButtonContainerProps) => {
  const { subdomain, token } = useAuth();
  const { showSnackbar } = useSnackbar();

  const mutation = useMutation(
    () =>
      TaskFieldService.deleteTaskField(
        token,
        subdomain,
        taskTemplate.id,
        taskField.id
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

  const options: Array<menuOptions> = [
    {
      label: 'Editar',
      icon: 'write',
      fill: true,
      stroke: true,
      onClick: () => {
        setType('edit');
      },
    },
    {
      label: 'Remover',
      icon: 'trashV2',
      fill: true,
      stroke: true,
      onClick: () => {
        mutation
          .mutateAsync()
          .then(() => {
            showSnackbar(`Campo removido com sucesso.`, 'success');
          })
          .catch((error) => {
            showSnackbar(error.response.data.message, 'error');
          });
      },
    },
  ];

  return <TaskFieldsMenuButton options={options} />;
};

export default TaskFieldsMenuButtonContainer;
