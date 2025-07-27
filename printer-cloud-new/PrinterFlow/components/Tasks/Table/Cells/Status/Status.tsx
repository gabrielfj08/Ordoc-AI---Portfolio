import * as React from 'react';
import { Tag } from 'printer-ui';
import { StatusRefusedTaskCellProps } from './types';

const StatusRefusedTaskCell = ({ task }: StatusRefusedTaskCellProps) => {
  switch (task.status) {
    case 'refused':
      return <Tag color="white" bgColor="error" label="RECUSADA" />;

    case 'finished':
      return <Tag bgColor="success" label="FINALIZADA" />;

    default:
      return null;
  }
};

export default StatusRefusedTaskCell;
