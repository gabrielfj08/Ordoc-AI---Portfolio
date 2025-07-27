import * as React from 'react';
import { Icon, Skeleton, Typography } from 'printer-ui';

const InactiveProcedureTemplateDetailsSkeleton = () => {
  const boxClassName =
    'w-full h-24 bg-lighterGray py-5 px-3.5 rounded-lg border border-lightGray flex space-x-2.5 items-center shadow-default';

  return (
    // <div className="w-screen max-w-full h-screen px-4 sm:px-14 flex flex-col py-8 space-y-4 overflow-auto">
    <>
      <Skeleton w="full" h={24} rounded="lg" />

      <Skeleton w="full" h={24} rounded="lg" />

      <Skeleton w="full" h={24} rounded="lg" />
    </>
    // </div>
  );
};

export default InactiveProcedureTemplateDetailsSkeleton;
