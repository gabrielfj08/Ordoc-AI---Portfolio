import * as React from 'react';
import { useSession, useSessionGroupRequester } from '../../../../../hooks';
import { FilterTasksParams } from '../types';
import TasksFinishedTab from './TasksFinishedTab';

const TasksFinishedTabContainer = ({}) => {
  const { session } = useSession();
  const { sessionGroupRequester } = useSessionGroupRequester();

  const [params, setParams] = React.useState<FilterTasksParams>({
    order: 'updated_at',
    direction: 'desc',
    q: '',
    page: 1,
    perPage: 20,
    status: 'doneByMe',
    priority: '',
    assigneeId: session.user?.internalRequester?.id,
    groupAssigneeId: sessionGroupRequester?.id,
  });

  return <TasksFinishedTab params={params} setParams={setParams} />;
};

export default TasksFinishedTabContainer;
