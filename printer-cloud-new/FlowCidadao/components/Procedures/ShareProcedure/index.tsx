import * as React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth, useExternalAuth } from '../../../../hooks';
import { ExternalSharedProceduresService } from '../../../../services/flow-cidadao';
import { CreateSharedProcedureAPIResponse } from '../../../../services/flow-cidadao/types';
import {
  ShareProcedureFormValues,
  ShareProcedureModalContainerProps,
} from './types';
import ShareProcedureModal from './ShareProcedure';
import ShareProcedureModalSkeleton from './SharedRequesters/Skeleton';
import ShareProcedureModalError from './SharedRequesters/Error';

const ShareProcedureModalContainer = ({
  procedure,
}: ShareProcedureModalContainerProps) => {
  const { externalToken } = useExternalAuth();
  const { subdomain } = useAuth();

  const { isError, isLoading, data } = useQuery({
    queryKey: ['externalSharedProcedure', externalToken, subdomain],
    queryFn: () =>
      ExternalSharedProceduresService.index(
        externalToken as string,
        subdomain,
        { procedureId: procedure.id, perPage: 1000 }
      ),
  });

  const mutation = useMutation((payload: ShareProcedureFormValues) => {
    return ExternalSharedProceduresService.create(
      externalToken as string,
      subdomain,
      payload
    );
  });

  if (isError) return <ShareProcedureModalError />;

  if (isLoading) return <ShareProcedureModalSkeleton />;

  const handleSubmit = (
    values: ShareProcedureFormValues
  ): Promise<CreateSharedProcedureAPIResponse> => {
    return mutation.mutateAsync(values);
  };

  return (
    <ShareProcedureModal
      onSubmit={handleSubmit}
      sharedProcedures={data.sharedProcedures}
      procedure={procedure}
    />
  );
};

export default ShareProcedureModalContainer;
