import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../../hooks';
import { DocumentService } from '../../../../../services/printer-air';
import { IndexDocumentsFromAirContainerProps } from './types';
import IndexDocumentsFromAir from './IndexDocuments';
import IndexDocumentsFromAirSkeleton from './Skeleton';
import IndexDocumentsFromAirError from './Error';

const IndexDocumentsFromAirContainer = ({
  directoryId,
  formik,
  setDirectoryId,
  total,
  setTotal,
}: IndexDocumentsFromAirContainerProps) => {
  const { token, subdomain } = useAuth();

  const { isError, isLoading, data } = useQuery({
    queryKey: ['indexAirDocuments', subdomain, token, directoryId],
    queryFn: () =>
      DocumentService.index(token, subdomain, {
        directoryId: directoryId,
      }),
    onSuccess: (data: any) =>
      setTotal({ ...total, documents: data.meta.total }),
  });

  if (isError) return <IndexDocumentsFromAirError />;

  if (isLoading) return <IndexDocumentsFromAirSkeleton />;

  return <IndexDocumentsFromAir formik={formik} documents={data.documents} />;
};

export default IndexDocumentsFromAirContainer;
