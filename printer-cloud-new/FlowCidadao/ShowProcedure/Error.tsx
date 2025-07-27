import * as React from 'react';
import { Icon, TypographyV3 as Typography } from 'printer-ui';

const ExternalFieldsPreviewError = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center lg:space-x-2">
      <Icon alt="alert" name="alert" color="error" stroke />
      <Typography
        family="jakartaBold"
        variant="bodyLg"
        color="error"
        align="center"
      >
        Erro! Não foi possível carregar a visualização do processo, tente
        novamente mais tarde.
      </Typography>
    </div>
  );
};

export default ExternalFieldsPreviewError;
