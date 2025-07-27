import React from 'react';
import { Tag } from 'printer-ui';
import { ProcedureInfoCasesProps } from './types';

const Status = ({ procedure }: ProcedureInfoCasesProps) => {
  switch (procedure.status) {
    case 'draft':
      return <Tag bgColor="gray" label="RASCUNHO" />;

    case 'archived':
      return <Tag color="cidGreen" bgColor="cidGreenLight" label="ARQUIVADO" />;

    case 'finished':
      return <Tag bgColor="success" label="FINALIZADO" />;

    case 'running':
      return (
        <Tag color="cidOrange" bgColor="cidOrangeLight" label="EM ANÁLISE" />
      );

    case 'started':
      return <Tag bgColor="cidOrange" label="TRAMITANDO" />;

    default:
      return null;
  }
};

export default Status;
