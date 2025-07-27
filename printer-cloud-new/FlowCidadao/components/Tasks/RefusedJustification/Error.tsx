import * as React from 'react';
import { Typography, Icon } from 'printer-ui';

const RefuseJustificationNoteError = () => {
  return (
    <div className="flex sm:w-96 items-center space-x-2 justify-center">
      <Icon alt="alert" name="alert" color="error" stroke />
      <Typography variant="footnote1" color="gray" align="center">
        Erro! Não foi possível carregar a justificativa da recusa, tente
        novamente mais tarde.
      </Typography>
    </div>
  );
};

export default RefuseJustificationNoteError;
