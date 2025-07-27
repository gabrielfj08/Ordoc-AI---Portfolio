import * as React from 'react';
import router from 'next/router';
import { Icon, Typography, Button } from 'printer-ui';
import { TaskTemplateFieldsEmptyProps } from './types';
import NewTaskField from '../../../components/TaskFields/New';

const TaskTemplateFieldsEmpty = ({
  taskTemplate,
}: TaskTemplateFieldsEmptyProps) => {
  const [hidden, setHidden] = React.useState<string>('hidden');

  if (!Number(router.query.taskTemplateId)) return null;

  return (
    <div className="items-center p-4 rounded-lg bg-lighterGray">
      <div className="w-full justify-start flex">
        <Button
          type="submit"
          color="info"
          label="Novo campo"
          onClick={() => setHidden('block')}
          disabled={taskTemplate.status === 'inactive' ? true : false}
        >
          <Button.Icon name="plus" alt="plus" color="white" stroke fill />
        </Button>
      </div>
      <div className={hidden}>
        <NewTaskField taskTemplate={taskTemplate} setHidden={setHidden} />
      </div>
      {hidden === 'hidden' ? (
        <div className="w-full bg-white flex items-center space-x-2 justify-center my-4 py-4">
          <Icon alt="info" name="info" color="gray" stroke w={28} h={28} />
          <Typography variant="footnote1" color="gray" align="center">
            Você ainda não possui nenhum campo no tipo de tarefa.
          </Typography>
        </div>
      ) : null}
    </div>
  );
};

export default TaskTemplateFieldsEmpty;
