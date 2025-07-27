import * as React from 'react';
import {
  Icon,
  TypographyV3 as Typography,
  ActionBoxV3 as ActionBox,
} from 'printer-ui';

const SignatureExternalDocumentPreviewModalError = () => {
  return (
    <ActionBox className="h-60">
      <div className="my-4 flex items-center space-x-2 justify-center px-4 py-7">
        <Icon alt="alert" name="alert" color="error" stroke />
        <Typography
          family="jakarta"
          variant="bodyLg"
          color="error"
          align="center"
          className="pl-2"
        >
          Você não possui autorização para visualizar o arquivo.
        </Typography>
      </div>
    </ActionBox>
  );
};

export default SignatureExternalDocumentPreviewModalError;
