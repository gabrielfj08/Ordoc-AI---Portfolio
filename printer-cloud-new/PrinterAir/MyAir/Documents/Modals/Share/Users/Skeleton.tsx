import * as React from 'react';
import { Button, Skeleton } from 'printer-ui';

const ShareDocumentModalUserListSkeleton = () => {
  return (
    <>
      <div className="sm:pl-6 pl-2 w-full h-16 border-b-2 items-center flex border-lightGray bg-lighterGray">
        <Skeleton w={10} h={10} rounded="full" />
        <div className="pl-2 pr-2 space-y-2">
          <Skeleton w={28} h={4} rounded="md" />
          <Skeleton w={32} h={4} rounded="md" />
        </div>
        <div className="sm:pl-60 pl-3">
          <Button label="Remover" color="red" />
        </div>
      </div>
    </>
  );
};

export default ShareDocumentModalUserListSkeleton;
