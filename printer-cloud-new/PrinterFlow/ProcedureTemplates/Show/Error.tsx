import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const ShowProcedureTemplateError = () => {
  return (
    <div className="flex justify-center items-center my-20 sm:mr-10 space-x-3 p-4 py-7 sm:ml-0 ml-3 w-11/12 border border-lighterGray">
      <Icon alt="alert" name="alert" color="error" stroke />
      <Typography variant="footnote1" color="gray" align="center">
        Erro! Não foi possível carregar os dados do tipo de processo, tente
        novamente mais tarde.
      </Typography>
    </div>
  );
};

export default ShowProcedureTemplateError;
