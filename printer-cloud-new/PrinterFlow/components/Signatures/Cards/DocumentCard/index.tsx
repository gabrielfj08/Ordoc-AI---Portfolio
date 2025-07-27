import * as React from 'react';
import _ from 'lodash';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../../hooks';
import { SignatureService } from '../../../../../services/printer-flow';
import { DocumentSignaturesCardContainerProps } from './types';
import DocumentCardSkeleton from './Skeleton';
import DocumentCardError from './Error';
import DocumentCardEmpty from './Empty';
import DocumentSignaturesCard from './DocumentCard';

const DocumentSignaturesCardContainer = ({
  params,
  setTotalObjects,
}: DocumentSignaturesCardContainerProps) => {
  const { token, subdomain } = useAuth();

  const { isLoading, isFetching, isError, data } = useQuery({
    queryKey: ['signaturesIndex', token, subdomain, { params }],
    queryFn: () => SignatureService.index(token, subdomain, { ...params }),
    onSuccess: (data) => {
      setTotalObjects(data.meta.total);
    },
  });

  if (isLoading || isFetching) return <DocumentCardSkeleton />;

  if (isError) return <DocumentCardError />;

  if (!data.meta.total) return <DocumentCardEmpty />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {data.signatures.map((signature) => (
        <DocumentSignaturesCard signature={signature} />
      ))}
    </div>
  );
};

export default DocumentSignaturesCardContainer;
