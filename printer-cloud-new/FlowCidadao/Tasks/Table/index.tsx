import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useExternalAuth, useSession } from '../../../hooks';
import { ExternalTaskService } from '../../../services/flow-cidadao/Task';
import { ExternalTasksTableContainerProps } from './types';
import ExternalTasksTable from './Table';
import TasksTableSkeleton from './Skeleton';
import TasksTableEmpty from './Empty';
import TasksTableError from './Error';

const ExternalTasksTableContainer = ({
  params,
  setTotalObjects,
}: ExternalTasksTableContainerProps) => {
  const { subdomain } = useAuth();
  const { externalToken } = useExternalAuth();
  const { session, themeColor } = useSession();

  if (!session) return null;

  const { isLoading, isFetching, isError, data } = useQuery({
    queryKey: ['externalTasks', subdomain, externalToken, { ...params }],
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

  if (data.meta.total === 0) {
    return <TasksTableEmpty />;
  }

  return <ExternalTasksTable data={data.tasks} color={themeColor} />;
};

export default ExternalTasksTableContainer;
