import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const DocumentModalPreviewContentError = () => {
  return (
    <div className="w-80 h-96 sm:max-w-[700px] sm:w-[80vw] p-5 flex items-center space-x-2 justify-center bg-lighterGray rounded-lg">
      <Icon alt="alert" name="alert" color="error" stroke />
      <Typography variant="headline" className="pl-2">
        Você não possui autorização para visualizar o arquivo.
      </Typography>
    </div>
  );
};

export default DocumentModalPreviewContentError;
