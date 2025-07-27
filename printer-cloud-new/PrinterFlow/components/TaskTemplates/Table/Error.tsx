import * as React from 'react';
import { Icon, Typography } from 'printer-ui';

const TaskTemplatesTableError = () => {
  return (
    <div className="border-2 border-lighterGray mt-20 my-4 flex items-center space-x-2 justify-center py-7">
      <Icon alt="alert" name="alert" color="error" stroke />
      <Typography variant="footnote1" color="gray" align="center">
        Erro! Não foi possível carregar a tabela de tipos de tarefa, tente
        novamente mais tarde.
      </Typography>
    </div>
  );
};

export default TaskTemplatesTableError;
