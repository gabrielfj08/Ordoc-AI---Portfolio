import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../../hooks';
import { DirectoryInfoJobService } from '../../../../../services/printer-air';
import { DirectoryInfoJobStatus } from '../../../../constants';
import {
  CreateDirectoryInfoContainerProps,
  DirectoryInfoContainerProps,
} from './types';
import DirectoryInfoJob from './DirectoryInfoJob';
import DirectoryInfoJobError from './Error';
import DirectoryInfoSkeleton from './Skeleton';
import { getSubdomain } from '../../../../../utils';

const CreateDirectoryInfoJobContainer = ({
  directoryId,
}: CreateDirectoryInfoContainerProps) => {
  const { token } = useAuth();

  const [directoryInfoId, setDirectoryInfoId] = React.useState<number | null>(
    null
  );

  React.useEffect(() => {
    DirectoryInfoJobService.create(token, getSubdomain(), directoryId)
      .then((response) => {
        setDirectoryInfoId(response.id);
      })
      .catch(() => {});
  }, []);

  if (!directoryInfoId) return null;

  return (
    <DirectoryInfoContainer
      directoryId={directoryId}
      directoryInfoId={directoryInfoId}
    />
  );
};

const DirectoryInfoContainer = ({
  directoryId,
  directoryInfoId,
}: DirectoryInfoContainerProps) => {
  const { token } = useAuth();

  const { isLoading, isError, data } = useQuery({
    queryKey: [
      'directories',
      directoryId,
      'directoryInfos',
      directoryInfoId,
      { token },
    ],
    queryFn: () =>
      DirectoryInfoJobService.show(
        token,
        getSubdomain(),
        directoryId,
        directoryInfoId
      ),
    refetchInterval: (data) =>
      data?.status === DirectoryInfoJobStatus.finished ||
      data?.status === DirectoryInfoJobStatus.failed
        ? false
        : 1000,
  });

  if (isError) {
    return <DirectoryInfoJobError />;
  }

  if (isLoading) {
    return <DirectoryInfoSkeleton />;
  }

  if (data.status === DirectoryInfoJobStatus.failed) {
    return <DirectoryInfoJobError />;
  }

  if (data.status === DirectoryInfoJobStatus.running) {
    return <DirectoryInfoSkeleton />;
  }

  return (
    <>
      <DirectoryInfoJob directoryInfo={data} />
    </>
  );
};

export default CreateDirectoryInfoJobContainer;
