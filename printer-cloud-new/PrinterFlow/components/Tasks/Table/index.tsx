import * as React from 'react';
import { queryClient } from '../../../../queryClient';
import { useQuery } from '@tanstack/react-query';
import {
  useAuth,
  useSession,
  useSessionGroupRequester,
} from '../../../../hooks';
import { TaskService } from '../../../../services/printer-flow';
import { TasksTableContainerProps } from './types';
import TasksTableSkeleton from './Skeleton';
import TasksTableError from './Error';
import TasksTableEmpty from './Empty';
import TasksTable from './Table';

const TasksTableContainer = ({
  params,
  setTotalObjects,
}: TasksTableContainerProps) => {
  const { session } = useSession();
  const { token, subdomain } = useAuth();
  const { sessionGroupRequester } = useSessionGroupRequester();

  React.useEffect(() => {
    queryClient.invalidateQueries([
      'tasks',
      subdomain,
      token,
      { groupAssigneeId: sessionGroupRequester?.id },
    ]);
  }, [sessionGroupRequester.id]);

  const { isLoading, isFetching, isError, data } = useQuery({
    queryKey: ['tasks', subdomain, token, { params }],
    queryFn: () =>
      TaskService.index(token, subdomain, {
        ...params,
      }),
    onSuccess: (data: any) => {
      setTotalObjects(data.meta.total);
    },
    enabled: !!sessionGroupRequester.id || !!session.user?.id,
  });

  if (isLoading || isFetching) {
    return <TasksTableSkeleton />;
  }

  if (isError) {
    return <TasksTableError status={params.status} />;
  }

  if (!data.meta.total) {
    return <TasksTableEmpty status={params.status} />;
  }

  return <TasksTable data={data.tasks} filter={params.status} />;
};

export default TasksTableContainer;
