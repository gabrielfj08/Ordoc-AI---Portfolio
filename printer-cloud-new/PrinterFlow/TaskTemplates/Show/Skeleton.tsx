import * as React from 'react';
import { Skeleton } from 'printer-ui';

const ShowTaskTemplateSkeleton = () => {
  return (
    <div className="w-full mb-12">
      <div className="w-full mt-4 sm:w-6/12 space-y-8 px-4">
        <div className="space-y-2">
          <Skeleton w={52} h={6} rounded="default" />
          <Skeleton w="full" h={8} rounded="default" />
        </div>
        <div className="space-y-2">
          <Skeleton w={40} h={6} rounded="default" />
          <Skeleton w="full" h={8} rounded="default" />
        </div>
        <div className="w-full">
          <Skeleton w="auto" h={16} rounded="default" />
        </div>
      </div>
    </div>
  );
};

export default ShowTaskTemplateSkeleton;
