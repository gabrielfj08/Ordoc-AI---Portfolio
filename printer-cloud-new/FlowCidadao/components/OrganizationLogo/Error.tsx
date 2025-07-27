import * as React from 'react';
import { Icon, TypographyV3 as Typography } from 'printer-ui';

const OrganizationLogoError = () => {
  return (
    <div className="w-36 h-[100px] sm:w-44 sm:h-[159px] justify-center grid">
      <div className="items-center justify-center flex">
        <Icon alt="alert" name="alertV3" stroke color="error" w={25} h={25} />
      </div>
      <Typography variant="bodySm" family="jakartaThin" align="center">
        Não foi possível carregar a imagem. Tente novamente mais tarde!
      </Typography>
    </div>
  );
};

export default OrganizationLogoError;
