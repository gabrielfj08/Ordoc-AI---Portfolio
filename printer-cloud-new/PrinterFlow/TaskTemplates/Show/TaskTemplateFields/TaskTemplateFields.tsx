import * as React from 'react';
import { Button } from 'printer-ui';
import { TaskTemplateFieldsProps } from './types';
import Pagination from '../../../../components/Pagination/Pagination';
import NewTaskField from '../../../components/TaskFields/New';
import TaskFields from '../../../components/TaskFields';

const TaskTemplateFields = ({
  taskFields,
  taskTemplate,
  totalDocs,
  page,
  setPage,
}: TaskTemplateFieldsProps) => {
  const docsPerPage = 3;

  const [hidden, setHidden] = React.useState<string>('hidden');

  return (
    <div className="mt-2 items-center p-4 rounded-lg bg-lighterGray">
      <div className="flex mb-4 space-x-2 justify-between items-center">
        <Button
          type="submit"
          color="info"
          label="Novo campo"
          onClick={() => setHidden('block')}
          disabled={taskTemplate.status === 'inactive' ? true : false}
        >
          <Button.Icon name="plus" alt="plus" color="white" stroke fill />
        </Button>
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={Math.ceil(totalDocs / docsPerPage)}
          totalObjects={totalDocs}
          objectsPerPage={docsPerPage}
        />
      </div>
      <div className="space-y-4">
        <div className={hidden}>
          <NewTaskField taskTemplate={taskTemplate} setHidden={setHidden} />
        </div>
        {taskFields.map((taskField) => (
          <TaskFields
            key={taskField.id}
            taskField={taskField}
            taskTemplate={taskTemplate}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskTemplateFields;
