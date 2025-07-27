import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const AttachmentTaskListError = () => {
  return (
    <div className="flex items-center space-x-2">
      <Icon name="alert" alt="error" color="error" stroke w={30} h={30} />
      <Typography variant="footnote1" color="gray">
        Erro! Não foi possível carregar a lista de anexos. Tente novamente mais
        tarde.
      </Typography>
    </div>
  );
};

export default AttachmentTaskListError;
