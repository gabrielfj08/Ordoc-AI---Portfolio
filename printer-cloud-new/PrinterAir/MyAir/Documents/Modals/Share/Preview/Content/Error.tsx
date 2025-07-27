import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const PreviewSharedDocumentContentError = () => {
  return (
    <div className="border border-lighterGray my-4 flex items-center space-x-2 justify-center py-7">
      <Icon alt="alert" name="alert" color="error" stroke />
      <Typography variant="headline" className="pl-2">
        Você não possui autorização para visualizar o arquivo.
      </Typography>
    </div>
  );
};

export default PreviewSharedDocumentContentError;
