import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { SignatureService } from '../../../../services/printer-flow';
import { SignatureDocumentModalContainerProps } from './types';
import SignatureDocumentPreviewModal from './PreviewDocuments';
import SignatureDocumentPreviewModalSkeleton from './Skeleton';
import SignatureDocumentPreviewModalError from './Error';

const SignatureDocumentModalContainer = ({
  signatureId,
}: SignatureDocumentModalContainerProps) => {
  const { token, subdomain } = useAuth();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['previewSignature', { token, subdomain, signatureId }],
    queryFn: () => SignatureService.show(token, subdomain, signatureId),
  });

  if (isError) return <SignatureDocumentPreviewModalError />;

  if (isLoading) return <SignatureDocumentPreviewModalSkeleton />;

  return <SignatureDocumentPreviewModal signature={data} />;
};

export default SignatureDocumentModalContainer;
