import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const ProcedureRecordsError = () => {
  return (
    <div className="p-5">
      <div className="border-2 bg-white border-lightGray mt-20 flex items-center space-x-2 justify-center py-7 ">
        <Icon alt="alert" name="alert" color="error" stroke />
        <Typography variant="footnote1" color="gray" align="center">
          Erro! Não foi possível carregar a lista de movimentações, tente
          novamente mais tarde.
        </Typography>
      </div>
    </div>
  );
};

export default ProcedureRecordsError;
