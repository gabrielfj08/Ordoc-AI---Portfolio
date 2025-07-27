import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../hooks';
import { TaskTemplateService } from '../../../services/printer-flow';
import { ShowTaskTemplateContainerProps } from './types';
import ShowTaskTemplateError from './Error';
import ShowTaskTemplateSkeleton from './Skeleton';
import ShowTaskTemplate from './Show';
import ShowTaskTemplateUnauthorized from './Unauthorized';

const ShowTaskTemplateContainer = ({
  taskTemplateId,
  setTaskTemplate,
}: ShowTaskTemplateContainerProps) => {
  const { subdomain, token } = useAuth();
  const [error, setError] = React.useState<number>();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['taskTemplate', subdomain, token, {}],
    queryFn: () => TaskTemplateService.show(token, subdomain, taskTemplateId),
    onSuccess: (data) => {
      setTaskTemplate(data);
    },
    onError: (err: any) => {
      setError(err.response.status);
    },
  });

  if (isError) {
    if (error === 401) {
      return <ShowTaskTemplateUnauthorized />;
    }
    return <ShowTaskTemplateError />;
  }

  if (isLoading) return <ShowTaskTemplateSkeleton />;

  return <ShowTaskTemplate taskTemplate={data} />;
};

export default ShowTaskTemplateContainer;
