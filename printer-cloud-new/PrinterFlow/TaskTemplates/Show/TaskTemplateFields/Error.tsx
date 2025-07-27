import * as React from 'react';
import router from 'next/router';
import { Icon, Typography, Button } from 'printer-ui';
import { TaskTemplateFieldsErrorProps } from './types';
import NewTaskField from '../../../components/TaskFields/New';

const TaskTemplateFieldsError = ({
  taskTemplate,
}: TaskTemplateFieldsErrorProps) => {
  const [hidden, setHidden] = React.useState<string>('hidden');

  return (
    <div className="items-center p-4 rounded-lg bg-lighterGray">
      <div className="w-full justify-start flex">
        <Button
          type="submit"
          color="info"
          label="Novo campo"
          disabled={taskTemplate.status === 'inactive' ? true : false}
        >
          <Button.Icon name="plus" alt="plus" color="white" stroke fill />
        </Button>
      </div>
      <div className={hidden}>
        <NewTaskField taskTemplate={taskTemplate} setHidden={setHidden} />
      </div>
      {hidden === 'hidden' ? (
        <div className="w-full  bg-white flex items-center space-x-2 justify-center my-4 py-4">
          <Icon alt="alert" name="alert" color="error" stroke />
          <Typography variant="footnote1" color="gray" align="center">
            Erro! Não foi possível carregar a lista de campos do tipo de tarefa,
            tente novamente mais tarde.
          </Typography>
        </div>
      ) : null}
    </div>
  );
};

export default TaskTemplateFieldsError;
