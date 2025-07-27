import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShareableLinkService } from '../../../services/printer-air';
import { ShareableLinkPreviewerContainerProps } from './types';
import ShareableLinkPreviewerError from './Error';
import ShareableLinkPreviewerSkeleton from './Skeleton';
import ShareableLinkPreviewer from './ShareableLinkPreviewer';

const ShareableLinkPreviewerContainer = ({
  uuid,
}: ShareableLinkPreviewerContainerProps) => {
  const { isLoading, isError, data } = useQuery({
    queryKey: ['shareableLinks', uuid],
    queryFn: () => ShareableLinkService.show(uuid),
    refetchOnWindowFocus: false,
  });

  if (isError) return <ShareableLinkPreviewerError />;

  if (isLoading) return <ShareableLinkPreviewerSkeleton />;

  return <ShareableLinkPreviewer shareableLink={data} />;
};

export default ShareableLinkPreviewerContainer;
