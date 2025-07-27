import * as React from 'react';
import { Skeleton } from 'printer-ui';

const EditDocumentInfoSkeleton = () => {
  return (
    <div className="flex justify-center lg:justify-end mb-5">
      <Skeleton className="rounded-md" w={48} h={10} />
    </div>
  );
};

export default EditDocumentInfoSkeleton;
