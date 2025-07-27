import * as React from 'react';
import { Typography, Icon } from 'printer-ui';

const AddRequestersSelectError = () => {
  return (
    <div className="m-2 flex items-center space-x-2 justify-center py-3">
      <Icon alt="alert" name="alert" color="error" stroke />
      <Typography variant="footnote1" color="gray">
        Erro! Não foi possível carregar a lista de solicitantes, tente novamente
        mais tarde.
      </Typography>
    </div>
  );
};

export default AddRequestersSelectError;
