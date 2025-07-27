import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const TasksTableError = () => {
  return (
    <div className="border-2 bg-white border-lightGray mt-20 my-4 flex items-center space-x-2 justify-center py-7">
      <Icon alt="alert" name="alert" color="error" stroke />
      <Typography variant="footnote1" color="gray" align="center">
        Erro! Não foi possível carregar a tabela de tarefas, tente novamente
        mais tarde.
      </Typography>
    </div>
  );
};

export default TasksTableError;
