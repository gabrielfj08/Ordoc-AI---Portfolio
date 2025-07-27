import * as React from 'react';
import { Tag } from 'printer-ui';

const TaskStatus = ({ status }) => {
  switch (status) {
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

export default TaskStatus;
