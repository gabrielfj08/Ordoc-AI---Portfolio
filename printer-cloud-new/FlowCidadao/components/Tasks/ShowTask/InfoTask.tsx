import * as React from 'react';
import { useSession } from '../../../../hooks';
import TasksInfo from '../Info';

const ExternalTasksInfo = ({ task }) => {
  const { themeColor } = useSession();

  return (
    <div
      className={`w-full px-4 py-2 border border-${themeColor} rounded-lg space-y-1`}
    >
      <TasksInfo
        title="Nome da tarefa:"
        content={task.name}
        color={themeColor}
      />
      <TasksInfo
        title="Criado por:"
        content={task.createdBy.name}
        color={themeColor}
      />
      <TasksInfo
        title="Data:"
        content={new Intl.DateTimeFormat('pt-BR', {
          dateStyle: 'short',
        }).format(
          new Date(new Date(task.createdAt).toISOString().replace('.000Z', ''))
        )}
        color={themeColor}
      />
      <TasksInfo
        title="Responsável pela tarefa:"
        content={task.groupAssignee?.name}
        color={themeColor}
      />
    </div>
  );
};

export default ExternalTasksInfo;
