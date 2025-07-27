import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from './../../../../../../queryClient';
import { useAuth } from '../../../../../../hooks';
import {
  SignatureActionsFormContainerProps,
  SignatureActionsFormValues,
} from './types';
import { SignatureService } from '../../../../../../services/printer-flow';
import {
  RefuseSignatureAPIResponse,
  RefuseSignaturePayload,
} from '../../../../../../services/printer-flow/types';
import SignatureActionsForm from './ActionsForm';

const SignatureActionsFormContainer = ({
  signatureId,
  ...otherProps
}: SignatureActionsFormContainerProps) => {
  const { token, subdomain } = useAuth();

  const mutation = useMutation(
    (payload: RefuseSignaturePayload) =>
      SignatureService.refuse(token, subdomain, signatureId, payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['signaturesCount', token, subdomain]);
        queryClient.invalidateQueries([
          'indexSignatures',
          token,
          subdomain,
          {},
        ]);
      },
    }
  );

  const handleSubmit = (
    values: SignatureActionsFormValues
  ): Promise<RefuseSignatureAPIResponse> => {
    return mutation.mutateAsync({ ...values });
  };

  return <SignatureActionsForm onSubmit={handleSubmit} {...otherProps} />;
};

export default SignatureActionsFormContainer;
