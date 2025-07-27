import * as React from 'react';
import { Tag } from 'printer-ui';
import { StatusCellProps } from './types';

const StatusCell = ({ procedure }: StatusCellProps) => {
  switch (procedure.status) {
    case 'archived':
      return <Tag color="cidGreen" bgColor="cidGreenLight" label="ARQUIVADO" />;

    case 'finished':
      return <Tag bgColor="success" label="FINALIZADO" />;

    case 'started':
      return <Tag bgColor="cidOrange" label="TRAMITANDO" />;

    case 'draft':
      return <Tag bgColor="gray" label="RASCUNHO" />;

    case 'running':
      return (
        <Tag color="cidOrange" bgColor="cidOrangeLight" label="EM ANÁLISE" />
      );

    default:
      return null;
  }
};

export default StatusCell;
