import { Icon, TypographyV3 as Typography } from 'printer-ui';
import * as React from 'react';

const UploadProcedureAttachmentUploadListItemError = () => {
  return (
    <div className="flex items-center w-full h-10 rounded-md bg-lighterGray px-4">
      <div className="flex gap-2 items-center">
        <Icon name="alertV3" color="error" alt="alert" stroke w={16} h={16} />
        <Typography variant="bodySm" family="jakartaBold" color="darkGray">
          Não foi possível carregar o arquivo.
        </Typography>
      </div>
    </div>
  );
};

export default UploadProcedureAttachmentUploadListItemError;
