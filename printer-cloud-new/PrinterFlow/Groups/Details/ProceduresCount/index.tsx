import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../hooks';
import { GroupRequesterInfoService } from '../../../../services/printer-flow';
import { GroupRequesterInfoJobStatus } from '../../../constants';
import {
  CreateGroupRequesterInfoContainerProps,
  ProceduresCountContainerProps,
} from './types';
import ProceduresCountError from './Error';
import ProcedureCountSkeleton from './Skeleton';
import ProceduresCount from './ProceduresCount';

const CreateGroupRequesterInfoContainer = ({
  responsibleGroupId,
}: CreateGroupRequesterInfoContainerProps) => {
  const { token, subdomain } = useAuth();

  const [groupRequesterInfoId, setGroupRequesterInfoId] = React.useState<
    number | null
  >(null);

  React.useEffect(() => {
    GroupRequesterInfoService.create(token, subdomain, responsibleGroupId)
      .then((response) => {
        setGroupRequesterInfoId(response.id);
      })
      .catch(() => {});
  }, [responsibleGroupId]);

  if (groupRequesterInfoId) {
    return (
      <ProceduresCountContainer
        responsibleGroupId={responsibleGroupId}
        groupRequesterInfoId={groupRequesterInfoId}
      />
    );
  }
  return null;
};
const ProceduresCountContainer = ({
  responsibleGroupId,
  groupRequesterInfoId,
}: ProceduresCountContainerProps) => {
  const { token, subdomain } = useAuth();

  const { isError, isLoading, isFetching, data } = useQuery({
    queryKey: [
      'groupDetails',
      subdomain,
      token,
      responsibleGroupId,
      groupRequesterInfoId,
    ],
    queryFn: () =>
      GroupRequesterInfoService.show(
        token,
        subdomain,
        responsibleGroupId,
        groupRequesterInfoId
      ),
    refetchInterval: (data) =>
      data?.status === GroupRequesterInfoJobStatus.finished ||
      data?.status === GroupRequesterInfoJobStatus.failed
        ? false
        : 1000,
  });

  if (isError) {
    return <ProceduresCountError />;
  }

  if (isLoading || isFetching) {
    return <ProcedureCountSkeleton />;
  }

  if (data.status === GroupRequesterInfoJobStatus.failed) {
    return <ProceduresCountError />;
  }

  if (data.status === GroupRequesterInfoJobStatus.running) {
    return <ProcedureCountSkeleton />;
  }

  return <ProceduresCount proceduresCount={data.proceduresCount} />;
};

export default CreateGroupRequesterInfoContainer;
