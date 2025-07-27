import * as React from 'react';
import { Tag } from 'printer-ui';
import { CellProps } from '../types';

const StatusTag = ({ status }) => {
  switch (status) {
    case 'draft':
      return (
        <Tag
          label="Rascunho"
          bgColor="gray"
          color="white"
          className="uppercase"
        />
      );
    case 'running':
      return (
        <Tag
          label="Aguardando"
          bgColor="cidOrangeLight"
          color="cidOrange"
          className="uppercase"
        />
      );
    case 'started':
      return (
        <Tag
          label="Tramitando"
          bgColor="cidOrange"
          color="white"
          className="uppercase"
        />
      );
    case 'finished':
      return (
        <Tag
          label="Finalizada"
          bgColor="success"
          color="white"
          className="uppercase"
        />
      );
    case 'refused':
      return (
        <Tag
          label="Recusada"
          bgColor="error"
          color="white"
          className="uppercase"
        />
      );
    default:
      return null;
  }
};

const StatusCell = ({ task }: CellProps) => {
  return (
    <div className="items-center justify-center flex">
      <StatusTag status={task.status} />
    </div>
  );
};

export default StatusCell;
