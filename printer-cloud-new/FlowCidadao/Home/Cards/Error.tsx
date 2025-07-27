import * as React from 'react';
import { Icon, TypographyV3 as Typography } from 'printer-ui';
import { useSession } from '../../../hooks';

const CardsError = () => {
  const { themeColor } = useSession();

  return (
    <div
      className={`h-full border rounded-lg border-${themeColor} my-4 flex flex-col sm:flex-row items-center space-x-2 justify-center py-7 sm:mr-10 sm:ml-20 mx-6`}
    >
      <Icon alt="alert" name="alert" color="error" stroke className="ml-4" />
      <Typography
        family="jakartaBold"
        variant="bodyMd"
        color="error"
        align="center"
      >
        Erro! Não foi possível carregar as informações, tente novamente mais
        tarde.
      </Typography>
    </div>
  );
};

export default CardsError;
