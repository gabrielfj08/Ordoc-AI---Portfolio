import * as React from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { FieldService } from '../../../../services/printer-flow';
import {
  BaseField,
  BaseFieldPayload,
} from '../../../../services/printer-flow/types';
import { NewFieldContainerProps, NewFieldFormValues } from './types';
import NewField from './NewField';

const NewFieldContainer = ({
  procedureTemplateId,
  setHidden,
}: NewFieldContainerProps) => {
  const { subdomain, token } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (payload: BaseFieldPayload) =>
      FieldService.create(token, subdomain, procedureTemplateId, payload),
    {
      onSuccess: (data) => {
        if (data.fieldType !== 'checkbox' && data.fieldType !== 'select_field')
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

  const handleSubmit = (values: NewFieldFormValues): Promise<BaseField> => {
    return mutation.mutateAsync({
      ...values,
    });
  };

  return (
    <NewField
      onSubmit={handleSubmit}
      procedureTemplateId={procedureTemplateId}
      setHidden={setHidden}
    />
  );
};

export default NewFieldContainer;
