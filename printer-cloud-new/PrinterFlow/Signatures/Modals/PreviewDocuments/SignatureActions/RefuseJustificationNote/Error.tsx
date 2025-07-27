import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const RefuseJustificationNoteError = () => {
  return (
    <div className="border border-lighterGray flex items-center space-x-2 justify-center w-full">
      <Icon alt="alert" name="alert" color="error" stroke w={30} h={30} />
      <Typography variant="footnote2" className="pl-2">
        Erro ao carregas as informações. Tente novamente mais tarde.
      </Typography>
    </div>
  );
};

export default RefuseJustificationNoteError;
