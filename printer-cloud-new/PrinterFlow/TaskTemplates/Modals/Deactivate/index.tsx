import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { queryClient } from '../../../../queryClient';
import {
  DeactivateTaskTemplateFormValues,
  DeactiveTaskTemplateModalContainerProps,
} from './types';
import DeactiveTaskTemplateModal from './Deactivate';
import {
  BaseTaskTemplate,
  DeactivateTaskTemplatePayload,
} from '../../../../services/printer-flow/types';
import { TaskTemplateService } from '../../../../services/printer-flow';

const DeactiveTaskTemplateModalContainer = ({
  taskTemplateName,
  taskTemplateId,
}: DeactiveTaskTemplateModalContainerProps) => {
  const { subdomain, token } = useAuth();

  const mutation = useMutation(
    (payload: DeactivateTaskTemplatePayload) =>
      TaskTemplateService.deactivate(token, subdomain, taskTemplateId, payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['taskTemplates', token, subdomain, {}]);
      },
    }
  );

  const handleSubmit = (
    values: DeactivateTaskTemplateFormValues
  ): Promise<BaseTaskTemplate> => {
    return mutation.mutateAsync({ ...values });
  };

  return (
    <DeactiveTaskTemplateModal
      onSubmit={handleSubmit}
      taskTemplateName={taskTemplateName}
    />
  );
};

export default DeactiveTaskTemplateModalContainer;
