import * as React from 'react';
import { useSession } from '../../../../../hooks';
import { FilterTasksParams } from '../types';
import TasksRefusedTab from './TasksRefusedTab';

const TasksRefusedTabContainer = () => {
  const { session } = useSession();

  const [params, setParams] = React.useState<FilterTasksParams>({
    order: 'updated_at',
    direction: 'desc',
    q: '',
    page: 1,
    perPage: 20,
    status: 'refused',
    priority: '',
    createdById: session.user?.id,
  });

  return <TasksRefusedTab params={params} setParams={setParams} />;
};

export default TasksRefusedTabContainer;
