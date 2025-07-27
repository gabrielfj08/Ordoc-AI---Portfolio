import * as React from 'react';
import { Icon, TypographyV3 as Typography } from 'printer-ui';
import { useSession } from '../../../hooks';

const SelectError = () => {
  const { themeColor } = useSession();

  return (
    <div
      className={`border rounded-lg border-${themeColor} my-2 flex items-center space-x-2 justify-center py-2`}
    >
      <Icon alt="alert" name="alert" color="error" stroke className="ml-4" />
      <Typography
        family="jakartaBold"
        variant="bodyMd"
        color="error"
        align="center"
      >
        Erro! Não foi possível carregar as informações da lista, tente novamente
        mais tarde.
      </Typography>
    </div>
  );
};

export default SelectError;
