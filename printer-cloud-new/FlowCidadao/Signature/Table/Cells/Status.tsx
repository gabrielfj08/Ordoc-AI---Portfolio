import * as React from 'react';
import { Tag } from 'printer-ui';
import { CellProps } from '../types';

const StatusTag = ({ signature }: CellProps) => {
  switch (signature.status) {
    case 'running':
      return (
        <Tag color="cidOrangeLight" bgColor="cidOrange" label="ASSINANDO" />
      );

    case 'created':
      return (
        <Tag color="cidOrange" bgColor="cidOrangeLight" label="PENDENTE" />
      );

    case 'refused':
      return <Tag bgColor="error" label="RECUSADO" />;

    case 'signed':
      return <Tag bgColor="success" label="ASSINADO" />;

    default:
      return null;
  }
};
const StatusCell = ({ signature }: CellProps) => {
  return (
    <div className="items-center justify-center flex">
      <StatusTag signature={signature} />
    </div>
  );
};

export default StatusCell;
