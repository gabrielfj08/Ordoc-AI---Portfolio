import * as React from 'react';
import { Icon, TypographyV3 as Typography } from 'printer-ui';

const TaskTableError = () => {
  return (
    <div className="flex-col sm:flex-row flex items-center space-x-2 justify-center h-[289px]">
      <Icon alt="alert" name="alert" color="error" stroke className="ml-4" />
      <Typography
        family="jakartaBold"
        variant="bodyMd"
        color="error"
        align="center"
      >
        Erro! Não foi possível carregar a lista de tarefas, tente novamente mais
        tarde.
      </Typography>
    </div>
  );
};

export default TaskTableError;
