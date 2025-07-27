import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../../../queryClient';
import { useAuth } from '../../../../hooks';
import { ProcedureTemplateService } from '../../../../services/printer-flow';
import {
  BaseProcedureTemplate,
  DeactivateProcedureTemplatePayload,
} from '../../../../services/printer-flow/types';
import {
  DeactivateProcedureTemplateContainerModalProps,
  DeactivateProcedureTemplateFormValues,
} from './types';
import DeactivateProcedureTemplateModal from './Deactivate';

const DeactivateProcedureTemplateContainerModal = ({
  procedureTemplateId,
  procedureTemplateName,
  parentProcedureTemplateId,
}: DeactivateProcedureTemplateContainerModalProps) => {
  const { subdomain, token } = useAuth();

  const mutation = useMutation(
    (payload: DeactivateProcedureTemplatePayload) =>
      ProcedureTemplateService.deactivate(
        token,
        subdomain,
        procedureTemplateId,
        payload
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          'procedureTemplates',
          subdomain,
          token,
          {},
        ]);
      },
    }
  );

  const handleSubmit = (
    values: DeactivateProcedureTemplateFormValues
  ): Promise<BaseProcedureTemplate> => {
    return mutation.mutateAsync({ ...values });
  };

  return (
    <DeactivateProcedureTemplateModal
      parentProcedureTemplateId={parentProcedureTemplateId}
      onSubmit={handleSubmit}
      procedureTemplateName={procedureTemplateName}
    />
  );
};

export default DeactivateProcedureTemplateContainerModal;
