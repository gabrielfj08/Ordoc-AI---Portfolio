import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const TaskAttachmentItemError = () => {
  return (
    <div className="flex items-center space-x-2 bg-lighterGray h-11 px-4 rounded-lg">
      <Icon name="alert" alt="error" color="error" stroke w={30} h={30} />
      <Typography variant="footnote2" color="gray">
        Erro! Não foi possível carregar a menção. Tente novamente mais tarde.
      </Typography>
    </div>
  );
};

export default TaskAttachmentItemError;
