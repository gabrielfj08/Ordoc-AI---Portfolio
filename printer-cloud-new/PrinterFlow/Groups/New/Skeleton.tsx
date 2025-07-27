import * as React from 'react';
import { Skeleton } from 'printer-ui';

const NewGroupPageSkeleton = () => {
  return (
    <div className="space-y-3">
      <Skeleton h={4} w={96} rounded="default" />
      <div className=" flex flex-wrap gap-4">
        <Skeleton h={9} w={44} rounded="default" />
        <Skeleton h={9} w={36} rounded="default" />
        <Skeleton h={9} w={40} rounded="default" />
        <Skeleton h={9} w={44} rounded="default" />
        <Skeleton h={9} w={32} rounded="default" />
        <Skeleton h={9} w={36} rounded="default" />
        <Skeleton h={9} w={28} rounded="default" />
        <Skeleton h={9} w={44} rounded="default" />
        <Skeleton h={9} w={36} rounded="default" />
        <Skeleton h={9} w={40} rounded="default" />
        <Skeleton h={9} w={44} rounded="default" />
        <Skeleton h={9} w={44} rounded="default" />
        <Skeleton h={9} w={36} rounded="default" />
        <Skeleton h={9} w={40} rounded="default" />
        <Skeleton h={9} w={44} rounded="default" />
      </div>
    </div>
  );
};

export default NewGroupPageSkeleton;
