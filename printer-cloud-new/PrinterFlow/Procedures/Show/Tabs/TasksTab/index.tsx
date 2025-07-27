import * as React from 'react';
import { TasksTabContainerProps, FilterTasksParams } from './types';
import TasksTab from './TasksTab';

const TasksTabContainer = ({ procedure }: TasksTabContainerProps) => {
  const [params, setParams] = React.useState<FilterTasksParams>({
    order: 'name',
    direction: 'asc',
    q: '',
    page: 1,
    perPage: 5,
    procedureId: procedure.id,
    status: '',
    priority: '',
  });

  return (
    <TasksTab params={params} setParams={setParams} procedure={procedure} />
  );
};

export default TasksTabContainer;
