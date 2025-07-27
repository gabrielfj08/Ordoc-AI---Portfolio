import * as React from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useAuth } from '../../../../../../hooks';
import { FieldValueOptionService } from '../../../../../../services/printer-flow';
import {
  BaseFieldValueOption,
  BaseFieldValueOptionPayload,
} from '../../../../../../services/printer-flow/types';
import {
  NewValueOptionContainerProps,
  NewValueOptionFormValues,
} from './types';
import NewValueOption from './NewValueOption';

const NewValueOptionContainer = ({ fieldId }: NewValueOptionContainerProps) => {
  const { subdomain, token } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (payload: BaseFieldValueOptionPayload) =>
      FieldValueOptionService.create(token, subdomain, fieldId, payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          'fieldValueOptions',
          subdomain,
          token,
          fieldId,
          {},
        ]);
      },
    }
  );

  const handleSubmit = (
    values: NewValueOptionFormValues
  ): Promise<BaseFieldValueOption> => {
    return mutation.mutateAsync({
      ...values,
    });
  };

  return <NewValueOption onSubmit={handleSubmit} />;
};

export default NewValueOptionContainer;
