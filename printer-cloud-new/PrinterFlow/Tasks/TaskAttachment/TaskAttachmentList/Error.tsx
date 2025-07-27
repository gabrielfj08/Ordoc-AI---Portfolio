import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const TaskFileMentionListError = () => {
  return (
    <div className="flex items-center pt-2 space-x-2">
      <Icon name="alert" alt="error" color="error" stroke w={30} h={30} />
      <Typography variant="footnote1" color="gray">
        Erro! Não foi possível carregar a lista de menções. Tente novamente mais
        tarde.
      </Typography>
    </div>
  );
};

export default TaskFileMentionListError;
