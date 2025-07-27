import * as React from 'react';
import { Tag, Typography } from 'printer-ui';
import { TaskCellProps } from './types';

const TaskCell = ({ task }: TaskCellProps) => {
  const TableStatus = () => {
    switch (task.status) {
      case 'refused':
        return <Tag color="white" bgColor="error" label="RECUSADA" />;

      case 'finished':
        return <Tag bgColor="success" label="FINALIZADA" />;

      case 'started':
        return <Tag bgColor="cidOrange" label="TRAMITANDO" />;

      case 'draft':
        return <Tag bgColor="gray" label="RASCUNHO" />;

      case 'running':
        return (
          <Tag color="cidOrange" bgColor="cidOrangeLight" label="AGUARDANDO" />
        );

      default:
        return null;
    }
  };

  return (
    <div className="block sm:w-72 w-48 px-3 sm:pl-0 justify-start space-y-1 items-center truncate">
      <Typography variant="footnote1" className="truncate">
        {task.name}
      </Typography>
      <div className="flex sm:hidden items-center">
        <div className="flex sm:hidden items-center justify-center">
          <TableStatus />
        </div>
      </div>
    </div>
  );
};

export default TaskCell;
