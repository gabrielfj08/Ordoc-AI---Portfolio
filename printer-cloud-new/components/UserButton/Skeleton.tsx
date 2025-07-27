import * as React from 'react';
import { Skeleton } from 'printer-ui';

const UserButtonSkeleton = () => {
  return (
    <>
      <div className="sm:visible invisible flex justify-center items-center gap-4 h-16 w-60 bg-white rounded-lg">
        <Skeleton w={10} h={10} rounded="full" />
        <Skeleton w={40} h={5} />
      </div>
      <Skeleton className="sm:hidden" w={8} h={8} rounded="full" />
    </>
  );
};

export default UserButtonSkeleton;
