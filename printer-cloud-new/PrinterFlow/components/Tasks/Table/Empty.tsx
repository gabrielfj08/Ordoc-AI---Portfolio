import * as React from 'react';
import { Icon, Typography } from 'printer-ui';
import { taskStatus } from '../../../../services/printer-flow/types/task';
import { TasksTableEmptyProps } from './types';

const TasksTableEmpty = ({ status }: TasksTableEmptyProps) => {
  const transformTaskStatus = (status: taskStatus) => {
    switch (status) {
      case 'running':
        return 'aguardando';
      case 'started':
        return 'tramitando';
      case 'finished':
        return 'concluída';
      case 'refused':
        return 'retornada';
      default:
        return '';
    }
  };

  return (
    <div className="w-full border-2 bg-white border-lightGray mt-20 flex items-center space-x-2 justify-center py-4">
      <Icon alt="info" name="info" color="gray" stroke w={28} h={28} />
      <Typography variant="footnote1" color="gray" align="center">
        Nenhuma tarefa {transformTaskStatus(status)} encontrada!
      </Typography>
    </div>
  );
};

export default TasksTableEmpty;
