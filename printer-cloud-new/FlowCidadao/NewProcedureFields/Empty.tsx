import * as React from 'react';
import { Icon, TypographyV3 as Typography } from 'printer-ui';
import { useSession } from '../../hooks';

const ProcedureFieldsEmpty = () => {
  const { themeColor } = useSession();

  return (
    <div className="space-y-6 pb-6">
      <div
        className={`border rounded-lg border-${themeColor} flex items-center space-x-2 justify-center py-7 px-4`}
      >
        <Icon alt="info" name="info" color={themeColor} stroke w={28} h={28} />
        <Typography
          family="jakartaBold"
          variant="bodyMd"
          color={themeColor}
          align="center"
        >
          Este assunto não possui campos a serem preenchidos, continue para
          finalizar o processo.
        </Typography>
      </div>
    </div>
  );
};

export default ProcedureFieldsEmpty;
