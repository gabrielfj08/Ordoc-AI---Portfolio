import * as React from 'react';
import router from 'next/router';
import { MenuCellContainerProps } from './types';
import {
  useAuth,
  useModal,
  useSessionGroupRequester,
  useSnackbar,
} from '../../../../../../hooks';
import { menuOptions } from '../../../../../../components/MenuButton/types';
import ShowTaskModal from '../../../../../Tasks/Modals/Show';
import MenuCell from './Menu';
import { TaskService } from '../../../../../../services/printer-flow';
import { queryClient } from '../../../../../../queryClient';

const MenuCellContainer = ({ task }: MenuCellContainerProps) => {
  const { token, subdomain } = useAuth();
  const { openModal } = useModal();
  const { showSnackbar } = useSnackbar();
  const { sessionGroupRequester } = useSessionGroupRequester();

  if (task.status === 'running') {
    const options: menuOptions[] = [
      {
        icon: 'finished',
        fill: true,
        onClick: () => {
          TaskService.accept(token, subdomain, task.id)
            .then(() => {
              showSnackbar('Tarefa aceita com sucesso.', 'success');
              queryClient.invalidateQueries(['tasks', subdomain, token]);
              queryClient.invalidateQueries([
                'tasksRunning',
                subdomain,
                token,
                {
                  status: 'running',
                  groupAssigneeId: sessionGroupRequester?.id,
                },
              ]);
              queryClient.invalidateQueries([
                'tasksStarted',
                subdomain,
                token,
                {
                  status: 'started',
                  groupAssigneeId: sessionGroupRequester?.id,
                },
              ]);
            })
            .catch((err) => showSnackbar(err.response.data.message, 'error'));
        },
        color: 'success',
        label: 'Aceitar',
        stroke: false,
      },
      {
        icon: 'failed',
        fill: true,
        onClick: () => {
          openModal(<ShowTaskModal taskId={task.id} justificationVisibility />);
        },
        color: 'error',
        label: 'Recusar',
        stroke: false,
      },
      {
        icon: 'groupRequesterV3',
        fill: true,
        onClick: () => {
          openModal(<ShowTaskModal taskId={task.id} resetAssigneeVisibility />);
        },
        label: 'Alterar destino',
        stroke: false,
      },
      {
        icon: 'proceduresV3',
        fill: false,
        onClick: () => {
          router.push(
            `/printer-flow/group-requesters/${task.procedure.responsibleGroupId}/procedures/${task.procedureId}`
          );
          openModal(<ShowTaskModal taskId={task.id} />);
        },
        label: 'Ir para o processo',
        stroke: true,
      },
    ];

    return <MenuCell options={options} />;
  }

  if (task.status === 'started') {
    const options: menuOptions[] = [
      {
        icon: 'taskFinished',
        fill: true,
        onClick: () => {
          TaskService.finish(token, subdomain, task.id)
            .then(() => {
              showSnackbar('Tarefa finalizada com sucesso.', 'success');
              queryClient.invalidateQueries(['tasks', subdomain, token]);
              queryClient.invalidateQueries([
                'tasksStarted',
                subdomain,
                token,
                {},
              ]);
              queryClient.invalidateQueries([
                'tasksFinished',
                subdomain,
                token,
              ]);
            })
            .catch((err) => showSnackbar(err.response.data.message, 'error'));
        },
        label: 'Finalizar',
        stroke: false,
      },
      {
        icon: 'groupRequesterV3',
        fill: true,
        onClick: () => {
          openModal(<ShowTaskModal taskId={task.id} resetAssigneeVisibility />);
        },
        label: 'Alterar destino',
        stroke: false,
      },
      {
        icon: 'proceduresV3',
        fill: false,
        onClick: () => {
          router.push(
            `/printer-flow/group-requesters/${task.procedure.responsibleGroupId}/procedures/${task.procedureId}`
          );
          openModal(<ShowTaskModal taskId={task.id} />);
        },
        label: 'Ir para o processo',
        stroke: true,
      },
    ];

    return <MenuCell options={options} />;
  }

  if (task.status === 'refused') {
    const options: menuOptions[] = [
      {
        icon: 'proceduresV3',
        fill: false,
        onClick: () => {
          router.push(
            `/printer-flow/group-requesters/${task.procedure.responsibleGroupId}/procedures/${task.procedureId}`
          );
          openModal(<ShowTaskModal taskId={task.id} />);
        },
        label: 'Ir para o processo',
        stroke: true,
      },
    ];

    return <MenuCell options={options} />;
  }

  if (task.status === 'finished') {
    const options: menuOptions[] = [
      {
        icon: 'proceduresV3',
        fill: false,
        onClick: () => {
          router.push(
            `/printer-flow/group-requesters/${task.procedure.responsibleGroupId}/procedures/${task.procedureId}`
          );
          openModal(<ShowTaskModal taskId={task.id} />);
        },
        label: 'Ir para o processo',
        stroke: true,
      },
    ];

    return <MenuCell options={options} />;
  }

  return null;
};

export default MenuCellContainer;
