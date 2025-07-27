import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { RequesterInfoService } from '../../../../services/printer-flow';
import { RequesterInfoJobStatus } from '../../../constants';
import {
  CreateRequesterInfoContainerProps,
  ProceduresCountContainerProps,
} from './types';
import ProceduresCountError from './Error';
import ProcedureCountSkeleton from './Skeleton';
import ProceduresCount from './ProceduresCount';

const CreateRequesterInfoContainer = ({
  requesterId,
}: CreateRequesterInfoContainerProps) => {
  const { token, subdomain } = useAuth();

  const [requesterInfoId, setRequesterInfoId] = React.useState<number | null>(
    null
  );

  React.useEffect(() => {
    RequesterInfoService.create(token, subdomain, requesterId)
      .then((response) => {
        setRequesterInfoId(response.id);
      })
      .catch(() => {});
  }, [requesterId]);

  if (requesterInfoId) {
    return (
      <ProceduresCountContainer
        requesterId={requesterId}
        requesterInfoId={requesterInfoId}
      />
    );
  }
  return null;
};
const ProceduresCountContainer = ({
  requesterId,
  requesterInfoId,
}: ProceduresCountContainerProps) => {
  const { token, subdomain } = useAuth();

  const { isError, isLoading, isFetching, data } = useQuery({
    queryKey: [
      'requesterDetails',
      subdomain,
      token,
      requesterId,
      requesterInfoId,
    ],
    queryFn: () =>
      RequesterInfoService.show(token, subdomain, requesterId, requesterInfoId),
    refetchInterval: (data) =>
      data?.status === RequesterInfoJobStatus.finished ||
      data?.status === RequesterInfoJobStatus.failed
        ? false
        : 1000,
  });

  if (isError) {
    return <ProceduresCountError />;
  }

  if (isLoading || isFetching) {
    return <ProcedureCountSkeleton />;
  }

  if (data.status === RequesterInfoJobStatus.failed) {
    return <ProceduresCountError />;
  }

  if (data.status === RequesterInfoJobStatus.running) {
    return <ProcedureCountSkeleton />;
  }

  return <ProceduresCount proceduresCount={data.proceduresCount} />;
};

export default CreateRequesterInfoContainer;
