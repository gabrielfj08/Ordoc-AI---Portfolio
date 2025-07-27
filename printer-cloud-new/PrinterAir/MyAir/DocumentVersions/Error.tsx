import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const DocumentVersionsError = () => {
  return (
    <div className="flex items-center justify-center gap-2 border border-lightGray rounded-md h-32 px-5">
      <Icon name="info" alt="info" color="red" stroke w={26} h={26} />
      <Typography variant="footnote2" color="gray">
        Falha ao carregar versões
      </Typography>
    </div>
  );
};

export default DocumentVersionsError;
