import * as React from 'react';
import { Icon, TypographyV3 as Typography } from 'printer-ui';
import { useSession } from '../../../hooks';

const SignaturesTableEmpty = () => {
  const { session } = useSession();

  const colorDef = !!session.organization?.theme
    ? session.organization.theme.color
    : 'cidOrange';

  return (
    <div
      className={`border rounded-lg border-${colorDef} my-4 flex items-center space-x-2 justify-center py-7`}
    >
      <Icon alt="info" name="info" color={colorDef} stroke />
      <Typography
        family="jakartaBold"
        variant="bodyMd"
        color={colorDef}
        align="center"
      >
        Nenhuma solicitação de assinatura encontrada!
      </Typography>
    </div>
  );
};

export default SignaturesTableEmpty;
