import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '../../../../queryClient';
import { useAuth, useExternalAuth, useV3Snackbar } from '../../../../hooks';
import { ExternalSignatureService } from '../../../../services/flow-cidadao';
import SignatureProcessActionSheet from './SignatureProcess';

const SignatureProcessActionSheetContainer = ({ signatureId }) => {
  const { token, subdomain } = useAuth();
  const { externalToken } = useExternalAuth();
  const { showV3Snackbar } = useV3Snackbar();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['signatureProcess', externalToken, signatureId],
    queryFn: () =>
      ExternalSignatureService.show(
        externalToken as string,
        subdomain,
        signatureId
      ),
    onSuccess: (data) => {
      if (data.status === 'signed') {
        showV3Snackbar(
          'O documento foi assinado com sucesso.',
          'success',
          'Assinatura efetuada com sucesso.'
        );
        queryClient.invalidateQueries(['signatures', subdomain, token, {}]);
      }
    },
    refetchInterval: (data) =>
      data?.status === 'signed' || data?.status === 'refused' ? false : 1000,
  });

  if (isError) return null;

  if (isLoading) return null;

  return <SignatureProcessActionSheet signatureProcess={data} />;
};

export default SignatureProcessActionSheetContainer;
