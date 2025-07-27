import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const ShowAttachmentFieldModelEmpty = () => {
  return (
    <div className="border border-lightGray bg-white mt-10 flex items-center space-x-2 justify-center px-2 py-4">
      <Icon alt="info" name="info" color="gray" stroke w={28} h={28} />
      <Typography variant="footnote1" color="gray" align="center">
        Você ainda não possui nenhum modelo de anexo neste assunto!
      </Typography>
    </div>
  );
};

export default ShowAttachmentFieldModelEmpty;
