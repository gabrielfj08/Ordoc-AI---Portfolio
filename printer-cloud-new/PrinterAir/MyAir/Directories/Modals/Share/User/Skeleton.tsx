import * as React from 'react';
import { Button, Skeleton } from 'printer-ui';

const ShareDirectoryModalUserListSkeleton = () => {
  return (
    <>
      <div className="pl-4 w-full h-16 border-b-2 items-center flex border-lightGray bg-lighterGray">
        <Skeleton w={10} h={10} rounded="full" />
        <div className="pl-4 space-y-2">
          <Skeleton w={28} h={4} rounded="md" />
          <Skeleton w={36} h={4} rounded="md" />
        </div>
        <div className="sm:pl-60">
          <Button label="Remover" color="red" />
        </div>
      </div>
    </>
  );
};

export default ShareDirectoryModalUserListSkeleton;
