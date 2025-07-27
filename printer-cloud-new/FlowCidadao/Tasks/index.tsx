import * as React from 'react';
import router from 'next/router';
import { useExternalSession } from '../../hooks';
import {
  IndexExternalTasksParams,
  taskExternalStatus,
} from '../../services/flow-cidadao/types';
import ExternalTasks from './Tasks';

const ExternalTasksContainer = () => {
  const { externalSession } = useExternalSession();

  const [params, setParams] = React.useState<IndexExternalTasksParams>({
    order: 'status',
    groupAssigneeId: externalSession?.user?.id,
    direction: 'asc',
    page: 1,
    perPage: 10,
    q: '',
    status: router.query.status
      ? (router.query.status as taskExternalStatus)
      : '',
  });

  return <ExternalTasks params={params} setParams={setParams} />;
};

export default ExternalTasksContainer;
