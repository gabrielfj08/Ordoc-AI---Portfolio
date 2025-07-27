import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const RemoveDocumentError = () => {
  return (
    <div className="flex items-center gap-3 rounded-md bg-lighterGray h-16 px-5">
      <Icon name="info" alt="info" color="red" stroke w={26} h={26} />
      <Typography variant="footnote2" color="gray">
        Não foi possível carregar o nome do arquivo.
      </Typography>
    </div>
  );
};

export default RemoveDocumentError;
