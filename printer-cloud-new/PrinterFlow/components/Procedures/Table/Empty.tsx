import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

export type procedureStatus =
  | ''
  | 'draft'
  | 'started'
  | 'running'
  | 'finished'
  | 'archived'
  | 'progress';

export interface ProceduresTableEmptyProps {
  status: procedureStatus;
}

const ProceduresTableEmpty = ({ status }: ProceduresTableEmptyProps) => {
  const transformProcedureStatus = (status: procedureStatus) => {
    switch (status) {
      case 'draft':
        return 'rascunho';
      case 'running':
        return 'tramitando';
      case 'archived':
        return 'arquivado';
      case 'finished':
        return 'finalizado';
      default:
        return '';
    }
  };

  return (
    <div className="border-2 bg-white border-lightGray mt-20 flex items-center space-x-2 justify-center py-4">
      <Icon alt="info" name="info" color="gray" stroke w={28} h={28} />
      <Typography variant="footnote1" color="gray" align="center">
        Nenhum processo em {transformProcedureStatus(status)} encontrado!
      </Typography>
    </div>
  );
};

export default ProceduresTableEmpty;
