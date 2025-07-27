import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const ShareableLinksHistoryError = () => {
  return (
    <div className="m-2 flex items-center space-x-2 justify-center py-3">
      <Icon alt="alert" name="alert" color="error" stroke />
      <Typography variant="footnote1" color="gray">
        Erro! Não foi possível ver o histórico de links criados, tente novamente
        mais tarde.
      </Typography>
    </div>
  );
};

export default ShareableLinksHistoryError;
