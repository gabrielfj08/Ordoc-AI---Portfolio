import * as React from 'react';
import { Skeleton } from 'printer-ui';

const DownloadJobSkeleton = () => {
  return (
    <div className="my-5">
      <Skeleton w="full" h={16} rounded="md" />
    </div>
  );
};

export default DownloadJobSkeleton;
