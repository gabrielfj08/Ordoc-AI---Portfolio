import * as React from 'react';
import { Icon, TypographyV3 as Typography } from 'printer-ui';

const NewAttachmentTaskItemError = () => {
  return (
    <div className="items-center w-full h-12 rounded-md bg-lighterGray p-5">
      <div className="flex gap-2 items-center">
        <Icon name="alert" color="error" alt="alert" stroke />
        <Typography
          family="jakartaBold"
          variant="bodyMd"
          color="error"
          align="center"
        >
          Erro! Não foi possível carregar o arquivo, tente novamente mais tarde.
        </Typography>
      </div>
    </div>
  );
};

export default NewAttachmentTaskItemError;
