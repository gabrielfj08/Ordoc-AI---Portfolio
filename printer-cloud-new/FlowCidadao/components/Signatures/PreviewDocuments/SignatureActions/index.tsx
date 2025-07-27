import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../../../../../queryClient';
import {
  AuthExternalProvider,
  useAuth,
  useExternalAuth,
  useModal,
  useV3ActionSheet,
  useV3Snackbar,
} from '../../../../../hooks';
import { ExternalSignatureService } from '../../../../../services/flow-cidadao';
import { SignExternalSignatureAPIResponse } from '../../../../../services/flow-cidadao/types/signatures';
import { SignatureExternalActionsContainerProps } from './types';
import SignatureExternalActions from './SignatureActions';
import SignatureProcessActionSheet from '../../SignatureProcess';

const SignatureExternalActionsContainer = ({
  signature,
  refuseFormInitialState,
}: SignatureExternalActionsContainerProps) => {
  const { externalToken } = useExternalAuth();
  const { token, subdomain } = useAuth();
  const { showV3Snackbar } = useV3Snackbar();
  const { closeModal } = useModal();
  const { openActionSheet } = useV3ActionSheet();

  const mutation = useMutation(
    () =>
      ExternalSignatureService.sign(
        externalToken as string,
        subdomain,
        signature.id
      ),
    {
      onSuccess: (res) => {
        closeModal();
        queryClient.invalidateQueries(['signatures', subdomain, token, {}]);
        if (res.status === 'signed') {
          showV3Snackbar(
            'O documento foi assinado com sucesso.',
            'success',
            'Assinatura efetuada com sucesso.'
          );
          queryClient.invalidateQueries(['signatures', subdomain, token, {}]);
        } else {
          openActionSheet(
            <AuthExternalProvider>
              <SignatureProcessActionSheet signatureId={res.id} />
            </AuthExternalProvider>
          );
        }
      },
      onError: (err: any) => {
        showV3Snackbar(err.response.data.message, 'error', 'Algo deu errado');
        queryClient.invalidateQueries(['signatures', subdomain, token, {}]);
      },
    }
  );

  const handleSubmit = (): Promise<SignExternalSignatureAPIResponse> => {
    return mutation.mutateAsync();
  };

  return (
    <SignatureExternalActions
      onSubmit={handleSubmit}
      signature={signature}
      refuseFormInitialState={refuseFormInitialState}
    />
  );
};

export default SignatureExternalActionsContainer;
