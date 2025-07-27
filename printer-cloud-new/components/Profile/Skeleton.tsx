import * as React from 'react';
import { Skeleton } from 'printer-ui';

const UserButtonSkeleton = () => {
  return (
    <>
      <div className="py-4 mx-6 w-56">
        <div className="items-center justify-center flex">
          <Skeleton w={20} h={20} rounded="full" />
        </div>
        <div className="flex justify-center items-center pt-4">
          <Skeleton w={32} h={5} />
        </div>
        <div className="pt-4 pb-4 items-center flex justify-center">
          <Skeleton w={44} h={10} rounded="lg" />
        </div>
        <div className="flex justify-center space-x-4 pb-4">
          <Skeleton w={28} h={14} rounded="lg" />
          <Skeleton w={28} h={14} rounded="lg" />
          <Skeleton w={28} h={14} rounded="lg" />
        </div>
        <div className="flex">
          <Skeleton w={56} h={12} />
        </div>
        <div className="flex pb-2 pt-4 items-center justify-center">
          <Skeleton w={40} h={10} rounded="lg" />
        </div>
      </div>
    </>
  );
};

export default UserButtonSkeleton;
