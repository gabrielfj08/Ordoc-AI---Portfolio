import * as React from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { FieldService } from '../../../../services/printer-flow';
import {
  BaseField,
  BaseFieldPayload,
} from '../../../../services/printer-flow/types';
import { FieldContainerProps, FieldFormValues, fieldActionType } from './types';
import Field from './Field';

const FieldContainer = ({ field, procedureTemplate }: FieldContainerProps) => {
  const [type, setType] = React.useState<fieldActionType>('show');

  const { subdomain, token } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (payload: BaseFieldPayload) =>
      FieldService.update(
        token,
        subdomain,
        field.procedureTemplateId,
        field.id,
        payload
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([
          'fields',
          subdomain,
          token,
          field.procedureTemplateId,
          {},
        ]);
      },
    }
  );

  const handleSubmit = (values: FieldFormValues): Promise<BaseField> => {
    return mutation.mutateAsync({
      ...values,
    });
  };

  return (
    <Field
      onSubmit={handleSubmit}
      field={field}
      procedureTemplate={procedureTemplate}
      type={type}
      setType={setType}
    />
  );
};

export default FieldContainer;
