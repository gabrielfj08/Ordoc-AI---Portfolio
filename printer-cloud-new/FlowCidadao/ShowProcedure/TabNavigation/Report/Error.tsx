import * as React from 'react';
import { Icon, TypographyV3 as Typography } from 'printer-ui';

const ReportListError = () => {
  return (
    <div className="my-4 flex-col sm:flex-row flex items-center space-x-2 justify-center py-7 h-[349px]">
      <Icon alt="alert" name="alert" color="error" stroke className="ml-4" />
      <Typography
        family="jakartaBold"
        variant="bodyMd"
        color="error"
        align="center"
      >
        Erro! Não foi possível carregar o histórico do processo, tente novamente
        mais tarde.
      </Typography>
    </div>
  );
};

export default ReportListError;
