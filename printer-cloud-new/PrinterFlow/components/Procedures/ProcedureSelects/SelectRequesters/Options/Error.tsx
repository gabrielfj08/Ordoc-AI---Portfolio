import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const RequesterSelectOptionsError = () => {
  return (
    <div className="flex items-center space-x-2 justify-center py-2">
      <Icon alt="alert" name="alert" color="error" stroke />
      <Typography variant="footnote1" color="gray">
        Erro! Não foi possível carregar a lista de solicitantes, tente novamente
        mais tarde.
      </Typography>
    </div>
  );
};

export default RequesterSelectOptionsError;
