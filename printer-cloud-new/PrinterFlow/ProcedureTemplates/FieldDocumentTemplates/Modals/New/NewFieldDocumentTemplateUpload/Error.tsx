import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const NewFieldDocumentTemplateUploadError = () => {
  return (
    <div className="flex items-center gap-2 border border-lightGray rounded-md h-16 px-5 my-5">
      <Icon name="alert" alt="alert" color="red" stroke w={26} h={26} />
      <Typography variant="footnote2" color="gray">
        Erro ao carregar envio
      </Typography>
    </div>
  );
};

export default NewFieldDocumentTemplateUploadError;
