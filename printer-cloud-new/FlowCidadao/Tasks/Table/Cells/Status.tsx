import * as React from 'react';
import { CellProps } from '../types';
import StatusTag from '../../../components/Tasks/ShowTask/StatusTag';

const ExternalStatusCell = ({ task }: CellProps) => {
  return (
    <div className="items-center justify-center flex">
      <StatusTag status={task.status} />
    </div>
  );
};

export default ExternalStatusCell;
