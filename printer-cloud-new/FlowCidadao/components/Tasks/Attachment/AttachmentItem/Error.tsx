import * as React from 'react';
import { Icon, TypographyV3 as Typography } from 'printer-ui';

const AttachmentTaskItemError = () => {
  return (
    <div className="flex items-center space-x-2 bg-lighterGray h-11 px-4 rounded-lg">
      <Icon name="alert" alt="error" color="error" stroke w={30} h={30} />
      <Typography
        family="jakartaBold"
        variant="bodyMd"
        color="error"
        align="center"
      >
        Erro! Não foi possível carregar o anexo. Tente novamente mais tarde.
      </Typography>
    </div>
  );
};

export default AttachmentTaskItemError;
