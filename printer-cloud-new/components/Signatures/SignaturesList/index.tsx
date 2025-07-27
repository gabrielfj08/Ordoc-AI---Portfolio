import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import _ from 'lodash';
import { PublicSignatureService } from '../../../services';
import { useAuth } from '../../../hooks';
import { VerifySignaturesListContainerProps } from '../types';
import VerifySignaturesSkeleton from '../Skeleton';
import VerifySignaturesError from '../Error';
import SignaturesList from './SignaturesList';

const VerifySignaturesListContainer = ({
  params,
  setDocumentName,
}: VerifySignaturesListContainerProps) => {
  const { subdomain } = useAuth();
  const { isError, isLoading, data } = useQuery({
    queryKey: ['verifySignatures', params],
    queryFn: () => PublicSignatureService.index(subdomain, params),
    enabled: !_.isEmpty(params.documentToken),
    onSuccess: (data) => {
      data.signatures.length &&
        setDocumentName(data.signatures[0].signable.name.split('.')[0]);
    },
  });

  if (isError) {
    return <VerifySignaturesError />;
  }

  if (isLoading) {
    return <VerifySignaturesSkeleton />;
  }

  return <SignaturesList signatures={data.signatures} />;
};

export default VerifySignaturesListContainer;
