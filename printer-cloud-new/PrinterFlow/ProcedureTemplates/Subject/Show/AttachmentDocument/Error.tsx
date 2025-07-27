import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const ShowAttachmentFieldModelError = () => {
  return (
    <div className="border border-lightGray bg-white mt-10 flex items-center justify-center">
      <Icon name="alert" alt="alert" color="red" stroke w={28} h={28} />
      <Typography variant="footnote1" color="gray" align="center">
        Erro! Não foi possível carregar os dados dos modelos de assunto, tente
        novamente mais tarde.
      </Typography>
    </div>
  );
};

export default ShowAttachmentFieldModelError;
