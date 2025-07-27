import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../hooks';
import { TaskTemplateService } from '../../../services/printer-flow/TaskTemplate';
import { TaskTemplateDetailsContainerProps } from './types';
import TaskTemplateDetails from './Details';
import TaskTemplateDetailsError from './Error';
import TaskTemplateDetailsSkeleton from './Skeleton';

const taskTemplateDetailsContainer = ({
  taskTemplateId,
}: TaskTemplateDetailsContainerProps) => {
  const { token, subdomain } = useAuth();

  const { isError, isLoading, data } = useQuery({
    queryKey: ['taskTemplates', taskTemplateId, { token }],
    queryFn: () => TaskTemplateService.show(token, subdomain, taskTemplateId),
  });

  if (isError) {
    return <TaskTemplateDetailsError />;
  }
  if (isLoading) {
    return <TaskTemplateDetailsSkeleton />;
  }
  return <TaskTemplateDetails taskTemplate={data} />;
};

export default taskTemplateDetailsContainer;
