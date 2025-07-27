import * as React from 'react';
import { Icon } from 'printer-ui';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useExternalAuth } from '../../../../../hooks';
import { ExternalTaskDocumentService } from '../../../../../services/flow-cidadao/TaskDocument';
import { CellProps } from '../types';

const TaskDocumentCell = ({ task }: CellProps) => {
  const { subdomain } = useAuth();
  const { externalToken } = useExternalAuth();

  const { isError, isLoading, data } = useQuery({
    queryKey: ['indexTaskDocuments', externalToken, subdomain, task.id],
    queryFn: () =>
      ExternalTaskDocumentService.index(String(externalToken), subdomain, {
        taskId: Number(task.id),
        status: 'finished',
      }),
  });

  if (isError) return null;

  if (isLoading) return null;

  if (data.meta.total === 0) return null;

  return (
    <div className="sm:flex items-center justify-center hidden">
      <Icon alt="anexo" name="clipV3" stroke h={16} w={16} />
    </div>
  );
};

export default TaskDocumentCell;
