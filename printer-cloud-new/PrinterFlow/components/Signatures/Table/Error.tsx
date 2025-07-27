import * as React from 'react';
import { Icon, Typography } from 'printer-ui';
import { signatureStatus } from '../../../../services/printer-flow/types';

export interface SignaturesTableErrorProps {
  status: signatureStatus;
}

const ProceduresTableError = ({ status }: SignaturesTableErrorProps) => {
  const transformProcedureStatus = (status: signatureStatus) => {
    switch (status) {
      case 'created':
        return 'assinaturas pendentes';
      case 'signed':
        return 'documentos assinados';
      case 'refused':
        return 'assinaturas recusadas';
      default:
        return '';
    }
  };

  return (
    <div className="border-2 bg-white border-lightGray mt-20 my-4 flex items-center space-x-2 justify-center py-7">
      <Icon alt="alert" name="alert" color="error" stroke />
      <Typography variant="footnote1" color="gray" align="center">
        Erro! Não foi possível carregar a tabela de{' '}
        {transformProcedureStatus(status)}, tente novamente mais tarde.
      </Typography>
    </div>
  );
};

export default ProceduresTableError;
