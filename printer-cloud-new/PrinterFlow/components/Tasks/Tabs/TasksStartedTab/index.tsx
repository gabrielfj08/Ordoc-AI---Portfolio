import * as React from 'react';
import { useSession, useSessionGroupRequester } from '../../../../../hooks';
import { FilterTasksParams } from '../types';
import TasksStartedTab from './TasksStartedTab';

const TasksStartedTabContainer = ({}) => {
  const { session } = useSession();
  const { sessionGroupRequester } = useSessionGroupRequester();

  const [params, setParams] = React.useState<FilterTasksParams>({
    order: 'updated_at',
    direction: 'desc',
    q: '',
    page: 1,
    perPage: 20,
    status: 'started',
    priority: '',
    assigneeId: session.user?.internalRequester?.id,
    groupAssigneeId: sessionGroupRequester?.id,
  });

  return <TasksStartedTab params={params} setParams={setParams} />;
};

export default TasksStartedTabContainer;
