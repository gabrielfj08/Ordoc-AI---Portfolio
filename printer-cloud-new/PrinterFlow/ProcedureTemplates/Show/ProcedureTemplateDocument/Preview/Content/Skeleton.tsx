import * as React from 'react';
import { Skeleton } from 'printer-ui';

const ProcedureTemplateDocumentModalContentSkeleton = () => {
  return (
    <div>
      <Skeleton className="w-[80vw] h-[75vh]" w={96} h={96} />
    </div>
  );
};

export default ProcedureTemplateDocumentModalContentSkeleton;
