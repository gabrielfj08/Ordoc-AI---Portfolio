import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { TaskFieldService } from '../../../../services/printer-flow';
import { TaskTemplateFieldsContainerProps } from './types';
import TaskTemplateFieldsSkeleton from './Skeleton';
import TaskTemplateFieldsError from './Error';
import TaskTemplateFieldsEmpty from './Empty';
import TaskTemplateFields from './TaskTemplateFields';

const TaskTemplateFieldsContainer = ({
  taskTemplate,
}: TaskTemplateFieldsContainerProps) => {
  const { subdomain, token } = useAuth();
  const [page, setPage] = React.useState(1);

  const { isLoading, isFetching, isError, data } = useQuery({
    queryKey: ['taskFields', subdomain, token, taskTemplate.id, { page }],
    queryFn: () =>
      TaskFieldService.index(token, subdomain, taskTemplate.id, {
        page,
        perPage: 3,
      }),
  });

  if (isError) return <TaskTemplateFieldsError taskTemplate={taskTemplate} />;

  if (isLoading || isFetching) return <TaskTemplateFieldsSkeleton />;

  if (!data.meta.total)
    return <TaskTemplateFieldsEmpty taskTemplate={taskTemplate} />;

  const totalDocs = data.meta.total;

  return (
    <TaskTemplateFields
      taskFields={data.taskFields}
      taskTemplate={taskTemplate}
      totalDocs={totalDocs}
      page={page}
      setPage={setPage}
    />
  );
};

export default TaskTemplateFieldsContainer;
