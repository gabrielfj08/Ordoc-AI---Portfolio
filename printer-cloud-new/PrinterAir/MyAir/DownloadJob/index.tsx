import * as React from 'react';
import FileSaver from 'file-saver';
import { DownloadJobService } from '../../../services/printer-air';
import getFileBasename from '../../../utils/getFileBasename';
import { useAuth } from '../../../hooks';
import { DownloadJobContainerProps } from './types';
import { DownloadJobStatus } from '../../constants';
import Error from './Error';
import Skeleton from './Skeleton';
import DownloadJob from './DownloadJob';
import { useQuery } from '@tanstack/react-query';

const DownloadJobContainer = ({ downloadJobId }: DownloadJobContainerProps) => {
  const [openedDownloadLink, setOpenedDownloadLink] =
    React.useState<boolean>(false);
  const { subdomain, token } = useAuth();

  const { isLoading, isError, data } = useQuery({
    queryKey: ['downloadJob', downloadJobId, { token }],
    queryFn: () => DownloadJobService.show(token, subdomain, downloadJobId),
    refetchInterval: (data) =>
      data?.status === DownloadJobStatus.finished
        ? false
        : data?.status === DownloadJobStatus.failed
        ? false
        : 1000,
  });

  if (isError) {
    return <Error />;
  }

  if (isLoading) {
    return <Skeleton />;
  }

  if (data.status === 'finished' && !openedDownloadLink) {
    FileSaver.saveAs(data.downloadLink);
    setOpenedDownloadLink(true);
  }

  const zipName = data.s3Key
    ? (getFileBasename(data.s3Key) as string)
    : 'Compactando arquivos ...';

  return <DownloadJob status={data.status} zipfileName={zipName} />;
};

export default DownloadJobContainer;
