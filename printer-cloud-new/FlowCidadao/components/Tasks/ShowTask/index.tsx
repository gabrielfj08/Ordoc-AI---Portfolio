import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useExternalAuth } from '../../../../hooks';
import { ExternalTaskService } from '../../../../services/flow-cidadao/Task';
import { ShowExternalTakModalContainerProps } from './types';
import ShowExternalTaskModal from './ShowTask';
import TaskInfoModalSkeleton from './Skeleton';
import TaskInfoModalError from './Error';

const ShowExternalTaskModalContainer = ({
  taskId,
  justificationVisibility,
  attachmentVisibility,
  commentVisibility,
}: ShowExternalTakModalContainerProps) => {
  const { subdomain } = useAuth();
  const { externalToken } = useExternalAuth();

  const { isError, isLoading, data } = useQuery({
    queryKey: ['externalTask', externalToken, subdomain, taskId],
    queryFn: () =>
      ExternalTaskService.show(String(externalToken), subdomain, taskId),
  });

  if (isLoading) return <TaskInfoModalSkeleton />;

  if (isError) return <TaskInfoModalError />;

  return (
    <ShowExternalTaskModal
      task={data}
      commentVisibility={commentVisibility}
      attachmentVisibility={attachmentVisibility}
      justificationVisibility={justificationVisibility}
    />
  );
};

export default ShowExternalTaskModalContainer;
