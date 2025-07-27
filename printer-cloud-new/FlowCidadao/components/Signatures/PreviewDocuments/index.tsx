import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useExternalAuth } from '../../../../hooks';
import { ExternalSignatureService } from '../../../../services/flow-cidadao';
import { SignatureExternalDocumentPreviewModalContainerProps } from './types';
import SignatureExternalDocumentPreviewModal from './PreviewDocuments';
import SignatureExternalDocumentPreviewModalError from './Error';
import SignatureExternalDocumentPreviewModalSkeleton from './Skeleton';

const SignatureExternalDocumentPreviewModalContainer = ({
  signatureId,
  isRefusing,
}: SignatureExternalDocumentPreviewModalContainerProps) => {
  const { externalToken } = useExternalAuth();
  const { subdomain } = useAuth();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['previewSignature', externalToken, subdomain, signatureId],
    queryFn: () =>
      ExternalSignatureService.show(
        externalToken as string,
        subdomain,
        signatureId
      ),
  });

  if (isError) return <SignatureExternalDocumentPreviewModalError />;

  if (isLoading) return <SignatureExternalDocumentPreviewModalSkeleton />;

  return (
    <SignatureExternalDocumentPreviewModal
      signature={data}
      isRefusing={isRefusing}
    />
  );
};

export default SignatureExternalDocumentPreviewModalContainer;
