import { Icon, Typography } from 'printer-ui';
import * as React from 'react';

const ShowProcedureUnauthorized = () => {
  return (
    <div className="flex items-center border-2 border-lighterGray justify-center my-20 py-6 px-4 space-x-1 sm:mr-10">
      <Icon name="alert" alt="alert" color="yellow" stroke w={26} h={26} />
      <Typography variant="footnote2" color="gray">
        Somente usuários com tarefas do processo ou seus criadores podem
        visualizar seu conteúdo. Caso precise, solicite uma tarefa ao criador.
      </Typography>
    </div>
  );
};

export default ShowProcedureUnauthorized;
