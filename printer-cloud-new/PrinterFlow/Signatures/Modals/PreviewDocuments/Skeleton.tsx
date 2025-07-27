import * as React from 'react';
import { Skeleton } from 'printer-ui';

const SignatureDocumentPreviewModalSkeleton = () => {
  return (
    <div>
      <Skeleton className="w-[30vw] h-[75vh]" w={96} h={96} />
    </div>
  );
};

export default SignatureDocumentPreviewModalSkeleton;
