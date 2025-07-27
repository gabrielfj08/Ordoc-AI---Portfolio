import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const ProcedureTemplateSelectOptionsError = () => {
  return (
    <div className="m-1 flex items-center space-x-2 justify-center py-2">
      <Icon alt="alert" name="alert" color="error" stroke />
      <Typography variant="footnote1" color="gray">
        Erro! Não foi possível carregar a lista de tipos de processo, tente
        novamente mais tarde.
      </Typography>
    </div>
  );
};

export default ProcedureTemplateSelectOptionsError;
