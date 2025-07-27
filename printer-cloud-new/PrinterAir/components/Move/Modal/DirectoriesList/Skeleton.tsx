import * as React from 'react';
import { Skeleton } from 'printer-ui';

const DirectoriesListSkeleton = () => {
  const ListItem = () => {
    return (
      <div className="flex items-center h-10 rounded">
        <Skeleton w={4} h={4} rounded="full" className="mx-3" />
        <div className="truncate flex items-center w-full justify-between">
          <span className="flex items-center">
            <Skeleton w={7} h={7} rounded="sm" />
            <Skeleton w={36} h={5} rounded="sm" className="mx-3" />
          </span>
          <Skeleton w={5} h={5} rounded="sm" />
        </div>
      </div>
    );
  };

  return (
    <div className="h-72 overflow-x-auto space-y-4 pr-2 min-w-[310px]">
      <ListItem />
      <ListItem />
      <ListItem />
      <ListItem />
      <ListItem />
    </div>
  );
};

export default DirectoriesListSkeleton;
