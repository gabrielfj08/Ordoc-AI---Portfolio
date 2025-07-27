import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const ShowAttachmentError = () => {
  return (
    <div className="w-full bg-white flex items-center space-x-2 justify-start my-3 py-3">
      <Icon alt="alert" name="alert" color="error" stroke />
      <Typography variant="footnote1" color="gray" align="center">
        Erro! Não foi possível carregar a lista de anexos do tipo de processo ou
        assunto, tente novamente mais tarde.
      </Typography>
    </div>
  );
};

export default ShowAttachmentError;
