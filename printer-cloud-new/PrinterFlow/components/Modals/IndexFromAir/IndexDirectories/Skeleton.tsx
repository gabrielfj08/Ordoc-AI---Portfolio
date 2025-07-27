import * as React from 'react';
import { Skeleton } from 'printer-ui';

const IndexDirectoriesFromAirSkeleton = () => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex space-x-2">
        <Skeleton w={6} h={6} rounded="default" />
        <Skeleton w={20} h={6} rounded="default" />
      </div>
      <div className="flex space-x-2">
        <Skeleton w={6} h={6} rounded="default" />
        <Skeleton w={20} h={6} rounded="default" />
      </div>
      <div className="flex space-x-2">
        <Skeleton w={6} h={6} rounded="default" />
        <Skeleton w={20} h={6} rounded="default" />
      </div>
    </div>
  );
};

export default IndexDirectoriesFromAirSkeleton;
