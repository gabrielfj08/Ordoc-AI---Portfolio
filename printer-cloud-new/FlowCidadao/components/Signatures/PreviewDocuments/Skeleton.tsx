import * as React from 'react';
import { Skeleton } from 'printer-ui';

const SignatureExternalDocumentPreviewModalSkeleton = () => {
  return (
    <div>
      <Skeleton
        className="sm:w-[55vw] sm:h-[75vh]"
        w={96}
        h={96}
        rounded="lg"
      />
    </div>
  );
};

export default SignatureExternalDocumentPreviewModalSkeleton;
