import * as React from 'react';
import router from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../hooks';
import { TaskTemplateService } from '../../../services/printer-flow';
import { UpdateTaskTemplateAPIResponse } from '../../../services/printer-flow/types';
import {
  EditTaskTemplateContainerProps,
  EditTaskTemplateFormValues,
} from './types';
import EditTaskTemplateSkeleton from './Skeleton';
import EditTaskTemplateError from './Error';
import EditTaskTemplate from './Edit';
import EditTaskTemplateUnauthorized from './Unauthorized';

const EditTaskTemplateContainer = ({
  taskTemplateId,
}: EditTaskTemplateContainerProps) => {
  const { subdomain, token } = useAuth();
  const [error, setError] = React.useState<number>();

  if (!router.query.taskTemplateId) {
    return null;
  }

  const { data, isError, isLoading } = useQuery({
    queryKey: ['taskTemplate', subdomain, token, taskTemplateId],
    queryFn: () => TaskTemplateService.show(token, subdomain, taskTemplateId),
    onError: (err: any) => {
      setError(err.response.status);
    },
  });

  if (isLoading) {
    return <EditTaskTemplateSkeleton />;
  }

  if (isError) {
    if (error === 401) {
      return <EditTaskTemplateUnauthorized />;
    }
    return <EditTaskTemplateError />;
  }

  const handleSubmit = (
    values: EditTaskTemplateFormValues
  ): Promise<UpdateTaskTemplateAPIResponse> => {
    return TaskTemplateService.update(token, subdomain, data.id, { ...values });
  };

  return <EditTaskTemplate taskTemplate={data} onSubmit={handleSubmit} />;
};

export default EditTaskTemplateContainer;
