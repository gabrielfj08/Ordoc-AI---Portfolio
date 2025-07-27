import * as React from 'react';
import { TypographyV3 as Typography, Icon } from 'printer-ui';

const JustificationNoteError = () => {
  return (
    <div className="flex w-full pt-4 items-center space-x-2 justify-center">
      <Icon alt="alert" name="alert" color="error" stroke />
      <Typography variant="bodySm" color="gray" align="center">
        Erro! Não foi possível carregar a justificativa da recusa, tente
        novamente mais tarde.
      </Typography>
    </div>
  );
};

export default JustificationNoteError;
