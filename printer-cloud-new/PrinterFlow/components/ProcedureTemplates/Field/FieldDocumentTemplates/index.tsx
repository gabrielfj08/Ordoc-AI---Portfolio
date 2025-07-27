import * as React from 'react';
import router from 'next/router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../../../hooks';
import { FieldService } from '../../../../../services/printer-flow';
import {
  FieldDocumentTemplatesContainerProps,
  FieldDocumentTemplateFormValues,
} from './types';
import FieldDocumentTemplates from './FieldDocumentTemplates';

const FieldDocumentTemplatesContainer = ({
  type,
  setType,
  fieldDocumentTemplate,
  fieldId,
  procedureTemplateId,
}: FieldDocumentTemplatesContainerProps) => {
  const { subdomain, token } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (values: FieldDocumentTemplateFormValues) => {
      return FieldService.attachDocumentTemplate(
        token,
        subdomain,
        fieldId,
        values
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          'fields',
          subdomain,
          token,
          procedureTemplateId,
          {},
        ]);
      },
    }
  );

  const handleSubmit = (values: FieldDocumentTemplateFormValues) => {
    return mutation.mutateAsync(values);
  };

  return (
    <FieldDocumentTemplates
      type={type}
      setType={setType}
      fieldId={fieldId}
      procedureTemplateId={procedureTemplateId}
      fieldDocumentTemplate={fieldDocumentTemplate}
      onSubmit={handleSubmit}
    />
  );
};

export default FieldDocumentTemplatesContainer;
