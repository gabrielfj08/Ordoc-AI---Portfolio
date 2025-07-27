import * as React from 'react';
import router from 'next/router';
import { TasksTableProps } from './types';
import { IndexExternalTasksParams } from '../../../../services/flow-cidadao/types';
import TasksTable from './Tasks';

const TasksTableContainer = ({ color }: TasksTableProps) => {
  const [params, setParams] = React.useState<IndexExternalTasksParams>({
    page: 1,
    perPage: 5,
    procedureId: Number(router.query.procedureId),
  });

  return <TasksTable color={color} params={params} setParams={setParams} />;
};

export default TasksTableContainer;
