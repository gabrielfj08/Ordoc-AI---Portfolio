import * as React from 'react';
import { Icon, Typography } from 'printer-ui';
import { signatureStatus } from '../../../../services/printer-flow/types';

export interface SignaturesTableEmptyProps {
  status: signatureStatus;
}

const SignaturesTableEmpty = ({ status }: SignaturesTableEmptyProps) => {
  const transformSignatureStatus = (status: signatureStatus) => {
    switch (status) {
      case 'created':
        return 'Você não possui assinaturas pendentes.';
      case 'signed':
        return 'Você não possui documentos assinados.';
      case 'refused':
        return 'Você não possui assinaturas recusadas.';
      default:
        return '';
    }
  };

  return (
    <div className="border-2 bg-white border-lightGray mt-20 flex items-center space-x-2 justify-center py-4">
      <Icon alt="info" name="info" color="gray" stroke w={28} h={28} />
      <Typography variant="footnote1" color="gray" align="center">
        {transformSignatureStatus(status)}
      </Typography>
    </div>
  );
};

export default SignaturesTableEmpty;
