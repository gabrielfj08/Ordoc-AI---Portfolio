import * as React from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useAuth } from '../../../../../../hooks';
import { FieldValueOptionService } from '../../../../../../services/printer-flow';
import {
  BaseFieldValueOption,
  BaseFieldValueOptionPayload,
} from '../../../../../../services/printer-flow/types';
import { ValueOptionContainerProps, ValueOptionFormValues } from './types';
import ValueOption from './ValueOption';

const ValueOptionContainer = ({
  type,
  setType,
  fieldValueOption,
  total,
}: ValueOptionContainerProps) => {
  const { subdomain, token } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (payload: BaseFieldValueOptionPayload) =>
      FieldValueOptionService.update(
        token,
        subdomain,
        fieldValueOption.fieldId,
        fieldValueOption.id,
        payload
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          'fieldValueOptions',
          subdomain,
          token,
          fieldValueOption.fieldId,
          {},
        ]);
      },
    }
  );

  const handleSubmit = (
    values: ValueOptionFormValues
  ): Promise<BaseFieldValueOption> => {
    return mutation.mutateAsync({
      ...values,
    });
  };

  return (
    <ValueOption
      onSubmit={handleSubmit}
      type={type}
      fieldValueOption={fieldValueOption}
      total={total}
    />
  );
};

export default ValueOptionContainer;
