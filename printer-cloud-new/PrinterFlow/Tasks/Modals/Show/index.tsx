import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { TaskService } from '../../../../services/printer-flow';
import { ShowTaskCommentAPIResponse } from '../../../../services/printer-flow/types/taskComment';
import { ShowTaskModalContainerProps } from './types';
import ShowTaskModalSkeleton from './Skeleton';
import ShowTaskModalError from './Error';
import ShowTaskModal from './ShowTask';

const ShowTaskModalContainer = ({
  taskId,
  justificationVisibility,
  resetAssigneeVisibility,
  procedure,
}: ShowTaskModalContainerProps) => {
  const { token, subdomain } = useAuth();

  const { isError, isLoading, data } = useQuery({
    queryKey: ['task', token, subdomain, taskId],
    queryFn: () => TaskService.show(token, subdomain, taskId),
  });

  if (isLoading) return <ShowTaskModalSkeleton />;

  if (isError) return <ShowTaskModalError />;

  return (
    <div>
      <ShowTaskModal
        procedure={procedure}
        task={data}
        justificationVisibility={justificationVisibility}
        resetAssigneeVisibility={resetAssigneeVisibility}
        taskComment={{} as ShowTaskCommentAPIResponse}
      />
    </div>
  );
};

export default ShowTaskModalContainer;
