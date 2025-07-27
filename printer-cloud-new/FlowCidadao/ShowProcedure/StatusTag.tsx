import * as React from 'react';
import { Tag } from 'printer-ui';
import { ProcedureStatus } from '../constants/ProcedureStatus';

const ProcedureStatusTag = ({ status }) => {
  switch (status) {
    case ProcedureStatus.draft:
      return <Tag label="RASCUNHO" bgColor="gray" color="white" />;
    case ProcedureStatus.running:
      return (
        <Tag label="EM ANÁLISE" bgColor="cidOrangeLight" color="cidOrange" />
      );
    case ProcedureStatus.archived:
      return <Tag label="ARQUIVADO" bgColor="cidGreenLight" color="cidGreen" />;
    case ProcedureStatus.finished:
      return <Tag label="FINALIZADO" bgColor="success" color="white" />;

    case ProcedureStatus.started:
      return <Tag label="TRAMITANDO" bgColor="cidOrange" color="white" />;

    default:
      return null;
  }
};

export default ProcedureStatusTag;
