import * as React from 'react';
import { ActionBox, Skeleton } from 'printer-ui';

const DocumentPreviewModalContentSkeleton = () => {
  return (
    <div className="w-full">
      <div className="w-[80vw] min-h-[75vh] w={96} h={96} bg-lighterGray rounded-lg">
        <div>
          <Skeleton h={20} w="full" rounded="default" />
        </div>
        <div className="flex sm:justify-end justify-center p-4">
          <Skeleton h={8} w={60} rounded="default" />
        </div>
        <div className="w-[80vw] h-[55vh] p-4">
          <Skeleton w="full" h="full" rounded="default" />
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewModalContentSkeleton;
