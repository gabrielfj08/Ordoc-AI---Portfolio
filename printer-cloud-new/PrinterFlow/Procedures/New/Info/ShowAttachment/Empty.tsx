import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const ShowAttachmentEmpty = () => {
  return (
    <div className="w-full bg-white flex items-center space-x-2 justify-start my-3 py-3">
      <Icon alt="info" name="info" color="gray" stroke w={28} h={28} />
      <Typography variant="footnote1" color="gray" align="center">
        Este tipo de processo ou assunto não possui anexo.
      </Typography>
    </div>
  );
};

export default ShowAttachmentEmpty;
