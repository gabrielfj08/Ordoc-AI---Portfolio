import { Icon, Typography } from 'printer-ui';
import * as React from 'react';

const VerifySignaturesError = () => {
  return (
    <div className="w-full pt-20 flex flex-col sm:flex-row items-center justify-center space-x-2 px-10">
      <Icon alt="error" name="alert" color="error" stroke />
      <Typography variant="footnote1" align="center" color="gray">
        Erro! não foi possível carregar a página de verificação de assinaturas.
        Tente novamente mais tarde.
      </Typography>
    </div>
  );
};

export default VerifySignaturesError;
