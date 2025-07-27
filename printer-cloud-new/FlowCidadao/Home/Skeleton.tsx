import * as React from 'react';
import { Skeleton } from 'printer-ui';

const HomeSkeleton = () => {
  return (
    <div className="sm:mr-10 sm:ml-20 mx-6 pt-5 sm:pt-0 ">
      <div className="space-y-1">
        <Skeleton w={16} h={8} rounded="default" />
        <Skeleton w={52} h={4} rounded="default" />
      </div>
      <div className="sm:flex space-y-6 sm:space-y-0 sm:space-x-6 my-8">
        <Skeleton w="full" h={40} rounded="lg" />
        <Skeleton w="full" h={40} rounded="lg" />
        <Skeleton w="full" h={40} rounded="lg" />
        <Skeleton w="full" h={40} rounded="lg" />
      </div>
    </div>
  );
};

export default HomeSkeleton;
