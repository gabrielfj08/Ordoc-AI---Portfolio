import * as React from 'react';
import { Skeleton } from 'printer-ui';

const DocumentVersionSkeleton = () => {
  return (
    <div className="flex flex-col gap-5">
      <Skeleton h={32} w="full" rounded="md" />
      <Skeleton h={32} w="full" rounded="md" />
      <Skeleton h={32} w="full" rounded="md" />
    </div>
  );
};

export default DocumentVersionSkeleton;
