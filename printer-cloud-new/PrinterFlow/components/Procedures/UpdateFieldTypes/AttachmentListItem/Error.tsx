import { Icon, Typography } from 'printer-ui';
import * as React from 'react';

const AttachmentListItemError = () => {
  return (
    <div className="flex items-center w-full h-12 rounded-md bg-lighterGray p-5">
      <div className="flex gap-2 items-center">
        <Icon name="alert" color="error" alt="alert" stroke />
        <Typography variant="footnote1">
          Erro! Não foi possível carregar o arquivo, tente novamente mais tarde.
        </Typography>
      </div>
    </div>
  );
};

export default AttachmentListItemError;
