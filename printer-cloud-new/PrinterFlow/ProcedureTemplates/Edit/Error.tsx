import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const EditProcedureTemplateError = () => {
  return (
    <div className="border border-lighterGray flex items-center space-x-2 justify-center py-7 mt-10 mx-6">
      <Icon alt="alert" name="alert" color="error" stroke />
      <Typography variant="footnote1" color="gray" align="center">
        Erro! Não foi possível carregar os dados para edição do tipo de
        processo. Tente novamente mais tarde!
      </Typography>
    </div>
  );
};

export default EditProcedureTemplateError;
