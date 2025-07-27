import * as React from 'react';
import { Icon, TypographyV3 as Typography } from 'printer-ui';
import { useSession } from '../../../hooks';

const ExternalFieldsPreviewError = () => {
  const { themeColor } = useSession();

  return (
    <div className="">
      <Typography family="jakartaBold" variant="bodyLg" color={themeColor}>
        Prévia dos campos obrigatórios a serem preenchidos:
      </Typography>
      <div
        className={`border rounded-lg border-${themeColor} my-4 flex items-center space-x-2 justify-center py-7`}
      >
        <Icon alt="alert" name="alert" color="error" stroke className="ml-4" />
        <Typography
          family="jakartaBold"
          variant="bodyMd"
          color="error"
          align="center"
        >
          Erro! Não foi possível carregar a pré visualização dos campos do
          processo, tente novamente mais tarde.
        </Typography>
      </div>
    </div>
  );
};

export default ExternalFieldsPreviewError;
