import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const ShowTaskTemplateError = () => {
  return (
    <div className="border border-lighterGray my-20 sm:mr-10 mx-5 flex items-center space-x-2 justify-center py-7 px-4">
      <Icon alt="alert" name="alert" color="error" stroke />
      <Typography variant="footnote1" color="gray" align="center">
        Erro! Não foi possível carregar os dados do tipo de tarefa, tente
        novamente mais tarde.
      </Typography>
    </div>
  );
};

export default ShowTaskTemplateError;
