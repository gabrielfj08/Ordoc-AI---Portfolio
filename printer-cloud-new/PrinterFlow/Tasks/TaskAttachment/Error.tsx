import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const TaskAttachmentError = () => {
  return (
    <div>
      <div className=" my-4 flex items-center space-x-2 justify-center py-7 px-4">
        <Icon alt="alert" name="alert" color="error" stroke />
        <Typography variant="footnote1" color="gray" align="center">
          Erro! Não foi possível carregar as informações para adicionar
          menções,tente novamente mais tarde.
        </Typography>
      </div>
    </div>
  );
};

export default TaskAttachmentError;
