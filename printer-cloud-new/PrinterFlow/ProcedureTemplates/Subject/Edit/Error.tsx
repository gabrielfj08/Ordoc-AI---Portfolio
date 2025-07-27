import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const EditSubjectError = () => {
  return (
    <div className="border border-lighterGray flex items-center space-x-2 justify-center py-7 mt-6 mx-6">
      <Icon alt="alert" name="alert" color="error" stroke />
      <Typography variant="footnote1" color="gray" align="center">
        Erro! Não foi possível carregar os dados para edição do assunto. Tente
        novamente mais tarde!
      </Typography>
    </div>
  );
};

export default EditSubjectError;
