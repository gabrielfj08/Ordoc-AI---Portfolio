import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../../../hooks';
import { TaskService } from '../../../../../../services/printer-flow';
import { TasksTableContainerProps } from './types';
import TasksTableSkeleton from './Skeleton';
import TasksTableError from './Error';
import TasksTableEmpty from './Empty';
import TasksTable from './Table';

const TasksTableContainer = ({
  params,
  setTotalObjects,
  procedure,
}: TasksTableContainerProps) => {
  const { token, subdomain } = useAuth();

  const { isLoading, isFetching, isError, data } = useQuery({
    queryKey: ['tasks', subdomain, token, { params }],
    queryFn: () => TaskService.index(token, subdomain, { ...params }),
    onSuccess: (data: any) => {
      setTotalObjects(data.meta.total);
    },
  });

  if (isLoading || isFetching) {
    return <TasksTableSkeleton />;
  }

  if (isError) {
    return <TasksTableError />;
  }

  if (!data.meta.total) {
    return <TasksTableEmpty />;
  }

  return <TasksTable data={data.tasks} procedure={procedure} />;
};

export default TasksTableContainer;
