import * as React from 'react';
import { Skeleton, Typography } from 'printer-ui';
import ShowProcedureInfoSkeleton from './Info/Skeleton';
import ShowProcedureFieldsSkeleton from './Fields/Skeleton';

const ShowProcedureSkeleton = () => {
  return (
    <div className="pl-14">
      <div className="mt-8 pl-4 flex space-x-4">
        <Skeleton h={9} w={36} rounded="md" />
        <Skeleton h={9} w={36} rounded="md" />
        <Skeleton h={9} w={36} rounded="md" />
      </div>
      <ShowProcedureInfoSkeleton />
      <ShowProcedureFieldsSkeleton />
    </div>
  );
};

export default ShowProcedureSkeleton;
