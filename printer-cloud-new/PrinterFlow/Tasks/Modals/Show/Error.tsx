import * as React from 'react';
import { Typography, Icon } from 'printer-ui';

const ShowTaskModalError = () => {
  return (
    <div className="w-80 h-96 sm:w-[36rem] sm:h-[36rem] flex items-center space-x-2 justify-center bg-lighterGray">
      <Icon alt="alert" name="alert" color="error" stroke />
      <Typography variant="footnote1" color="gray" align="center">
        Erro! Não foi possível visualizar a tarefa, tente novamente mais tarde.
      </Typography>
    </div>
  );
};

export default ShowTaskModalError;
