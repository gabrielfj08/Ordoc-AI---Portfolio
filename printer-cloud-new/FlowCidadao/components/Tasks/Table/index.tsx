import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useExternalAuth, useSession } from '../../../../hooks';
import { ExternalTaskService } from '../../../../services/flow-cidadao/Task';
import { TasksTableContainerProps } from './types';
import TasksTableSkeleton from './Skeleton';
import TasksTableError from './Error';
import TasksTable from './Table';

const TasksTableContainer = ({
  params,
  setTotalObjects,
}: TasksTableContainerProps) => {
  const { subdomain } = useAuth();
  const { externalToken } = useExternalAuth();
  const { session, themeColor } = useSession();

  if (!session) return null;

  const { isLoading, isFetching, isError, data } = useQuery({
    queryKey: [
      'procedureExternalTasks',
      subdomain,
      externalToken,
      { ...params },
    ],
    queryFn: () =>
      ExternalTaskService.index(externalToken as string, subdomain, {
        ...params,
      }),
    onSuccess: (data: any) => {
      setTotalObjects(data.meta.total);
    },
    enabled: !!session.organization,
  });

  if (isLoading || isFetching) {
    return <TasksTableSkeleton />;
  }

  if (isError) {
    return <TasksTableError />;
  }

  return <TasksTable data={data.tasks} color={themeColor} />;
};

export default TasksTableContainer;
