import * as React from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import router from 'next/router';
import {
  useAuth,
  useDrawer,
  useModal,
  useSnackbar,
} from '../../../../../../hooks';
import { TaskTemplateService } from '../../../../../../services/printer-flow';
import { TaskTemplateMenuCellContainerProps } from './types';
import { menuOptions } from '../../../../../../components/MenuButton/types';
import TaskTemplateMenuCell from './Menu';
import DeactiveTaskTemplateModal from '../../../../../TaskTemplates/Modals/Deactivate';
import TaskTemplateDetails from '../../../../../TaskTemplates/Details';

const TaskTemplateMenuCellContainer = ({
  taskTemplate,
}: TaskTemplateMenuCellContainerProps) => {
  const { subdomain, token } = useAuth();
  const queryClient = useQueryClient();
  const { openDrawer } = useDrawer();
  const { openModal } = useModal();
  const { showSnackbar } = useSnackbar();

  const mutation = useMutation(
    () => TaskTemplateService.activate(token, subdomain, taskTemplate.id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['taskTemplates', token, subdomain, {}]);
      },
    }
  );

  const statusIcon = () => {
    if (taskTemplate.status === 'active') {
      return 'switchOff';
    } else {
      return 'switchOn';
    }
  };

  const statusLabel = () => {
    if (taskTemplate.status === 'active') {
      return 'Desativar tipo de tarefa';
    } else {
      return 'Ativar tipo de tarefa';
    }
  };

  const options: Array<menuOptions> = [
    {
      label: 'Editar',
      icon: 'write',
      fill: true,
      stroke: true,
      onClick: () =>
        router.push(`/printer-flow/task-templates/${taskTemplate.id}/edit`),
    },
    {
      icon: 'info',
      fill: false,
      onClick: () => {
        openDrawer(
          <TaskTemplateDetails taskTemplateId={taskTemplate.id} />,
          'right'
        );
      },
      label: 'Detalhes',
      stroke: true,
    },
    {
      icon: statusIcon(),
      fill: false,
      onClick: () => {
        taskTemplate.status === 'active'
          ? openModal(
              <DeactiveTaskTemplateModal
                taskTemplateName={taskTemplate.name}
                taskTemplateId={taskTemplate.id}
              />
            )
          : mutation
              .mutateAsync()
              .then(() => {
                showSnackbar('Tipo de tarefa ativado com sucesso.', 'success');
              })
              .catch((error) => {
                showSnackbar(error.response.data.message, 'error');
              });
      },
      label: statusLabel(),
      stroke: true,
    },
  ];

  return <TaskTemplateMenuCell options={options} />;
};

export default TaskTemplateMenuCellContainer;
