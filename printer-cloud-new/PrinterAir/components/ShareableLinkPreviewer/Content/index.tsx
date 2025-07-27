import * as React from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Icon, Typography } from 'printer-ui';
import { ShareableLinkPreviewerContentContainerProps } from './types';
import ShareableLinkPreviewerContentError from './Error';
import ShareableLinkPreviewerContentSkeleton from './Skeleton';

const ShareableLinkPreviewerContentContainer = ({
  shareableLink,
}: ShareableLinkPreviewerContentContainerProps) => {
  const { isLoading, isError, data } = useQuery({
    queryKey: ['shareableLinks', shareableLink.url],
    queryFn: () => axios.get(shareableLink.url),
  });

  if (isError) return <ShareableLinkPreviewerContentError />;

  if (isLoading) return <ShareableLinkPreviewerContentSkeleton />;

  switch (data.headers['content-type']) {
    case 'application/pdf':
    case 'image/png':
    case 'image/jpg':
    case 'image/jpeg':
      return <iframe src={shareableLink.url} className="w-full h-full" />;
    default:
      return (
        <div className="flex flex-col items-center justify-center border border-lightGray rounded-md h-[80vh] max-w-screen-2xl">
          <div className="flex items-center justify-center gap-2">
            <Icon name="info" alt="info" color="gray" stroke w={26} h={26} />
            <Typography variant="body" color="gray">
              Não foi possível visualizar esse documento.
            </Typography>
          </div>
          <Typography variant="body" color="gray">
            Clique{' '}
            <a
              className="text-blue"
              href={shareableLink.downloadUrl}
              target="_blank"
            >
              aqui
            </a>{' '}
            para baixá-lo
          </Typography>
        </div>
      );
  }
};

export default ShareableLinkPreviewerContentContainer;
