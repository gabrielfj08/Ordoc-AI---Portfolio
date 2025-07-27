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

export interface ProceduresTableErrorProps {
  status: procedureStatus;
}

const ProceduresTableError = ({ status }: ProceduresTableErrorProps) => {
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
    <div className="border-2 bg-white border-lightGray mt-20 my-4 flex items-center space-x-2 justify-center py-7">
      <Icon alt="alert" name="alert" color="error" stroke />
      <Typography variant="footnote1" color="gray" align="center">
        Erro! Não foi possível carregar a tabela de processos em{' '}
        {transformProcedureStatus(status)}, tente novamente mais tarde.
      </Typography>
    </div>
  );
};

export default ProceduresTableError;
