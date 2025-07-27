import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { TaskTemplateService } from '../../../../services/printer-flow';
import { TaskTemplatesTableContainerProps } from './types';
import TaskTemplatesTableSkeleton from './Skeleton';
import TaskTemplatesTableError from './Error';
import TaskTemplatesTableEmpty from './Empty';
import TaskTemplatesTable from './Table';

const TaskTemplatesTableContainer = ({
  params,
  setTotalObjects,
}: TaskTemplatesTableContainerProps) => {
  const { token, subdomain } = useAuth();

  const { isLoading, isFetching, isError, data } = useQuery({
    queryKey: ['taskTemplates', token, subdomain, { params }],
    queryFn: () => TaskTemplateService.index(token, subdomain, params),
    onSuccess: (data) => {
      setTotalObjects(data.meta.total);
    },
  });

  if (isLoading || isFetching) return <TaskTemplatesTableSkeleton />;

  if (isError) return <TaskTemplatesTableError />;

  if (!data.meta.total) return <TaskTemplatesTableEmpty />;

  return <TaskTemplatesTable data={data.taskTemplates} />;
};

export default TaskTemplatesTableContainer;
