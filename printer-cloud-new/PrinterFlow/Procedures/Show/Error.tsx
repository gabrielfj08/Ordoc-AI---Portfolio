import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const ShowProcedureError = () => {
  return (
    <div className="border border-lighterGray my-4 flex items-center space-x-2 justify-center py-7 px-4">
      <Icon alt="alert" name="alert" color="error" stroke />
      <Typography variant="footnote1" color="gray" align="center">
        Erro! Não foi possível carregar a visualização do processo, tente
        novamente mais tarde.
      </Typography>
    </div>
  );
};

export default ShowProcedureError;
