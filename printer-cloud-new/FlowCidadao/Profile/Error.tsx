import * as React from 'react';
import { Icon, TypographyV3 as Typography } from 'printer-ui';
import { useSession } from '../../hooks';

const ExternalRequesterProfileError = () => {
  const { themeColor } = useSession();

  return (
    <div className="w-full flex flex-col sm:my-6 sm:pr-10 sm:pl-20 px-4">
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
          Erro! Não foi possível carregar os dados do perfil, tente novamente
          mais tarde.
        </Typography>
      </div>
    </div>
  );
};

export default ExternalRequesterProfileError;
