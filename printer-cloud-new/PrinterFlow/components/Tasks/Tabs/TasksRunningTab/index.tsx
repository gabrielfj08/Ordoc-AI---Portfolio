import * as React from 'react';
import { useSessionGroupRequester } from '../../../../../hooks';
import { FilterTasksParams } from '../types';
import TasksRunningTab from './TasksRunningTab';

const TasksRunningTabContainer = ({}) => {
  const { sessionGroupRequester } = useSessionGroupRequester();

  const [params, setParams] = React.useState<FilterTasksParams>({
    order: 'updated_at',
    direction: 'desc',
    q: '',
    page: 1,
    perPage: 20,
    status: 'running',
    priority: '',
    groupAssigneeId: sessionGroupRequester?.id,
  });

  return <TasksRunningTab params={params} setParams={setParams} />;
};

export default TasksRunningTabContainer;
