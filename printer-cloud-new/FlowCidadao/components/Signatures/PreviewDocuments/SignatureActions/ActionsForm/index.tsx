import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth, useExternalAuth } from '../../../../../../hooks';
import { queryClient } from '../../../../../../queryClient';
import { ExternalSignatureService } from '../../../../../../services/flow-cidadao';
import {
  RefuseExternalSignaturePayload,
  RefuseExternalSignatureAPIResponse,
} from '../../../../../../services/flow-cidadao/types/signatures';
import {
  SignatureExternalActionsFormContainerProps,
  SignatureExternalActionsFormValues,
} from './types';
import SignatureExternalActionsForm from './ActionsForm';

const SignatureExternalActionsFormContainer = ({
  signatureId,
  ...otherProps
}: SignatureExternalActionsFormContainerProps) => {
  const { externalToken } = useExternalAuth();
  const { token, subdomain } = useAuth();

  const mutation = useMutation(
    (payload: RefuseExternalSignaturePayload) =>
      ExternalSignatureService.refuse(
        externalToken as string,
        subdomain,
        signatureId,
        payload
      ),
    {
      onSuccess: () =>
        queryClient.invalidateQueries(['signatures', subdomain, token, {}]),
    }
  );
  const handleSubmit = (
    values: SignatureExternalActionsFormValues
  ): Promise<RefuseExternalSignatureAPIResponse> => {
    return mutation.mutateAsync({ ...values });
  };

  return (
    <SignatureExternalActionsForm onSubmit={handleSubmit} {...otherProps} />
  );
};

export default SignatureExternalActionsFormContainer;
