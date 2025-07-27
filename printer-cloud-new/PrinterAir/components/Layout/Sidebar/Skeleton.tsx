import * as React from 'react';
import { Icon, Skeleton } from 'printer-ui';

const SidebarAirSkeleton = () => {
  return (
    <div className="mt-2 mr-2">
      <div className="flex w-[16.313rem] h-16 border-2 border-lightGray items-center gap-4 pl-8 rounded-r-full">
        <Icon name="air" alt="air" color="gray" stroke />
        <Skeleton w={28} h={6} rounded="md" />
      </div>
      <div className="flex w-[16.313rem] h-16 border-2 border-lightGray items-center gap-4 pl-8 rounded-r-full">
        <Icon name="shared" alt="shared" color="gray" fill />
        <Skeleton w={36} h={6} rounded="md" />
      </div>
      <div className="flex w-[16.313rem] h-16 border-2 border-lightGray items-center gap-4 pl-8 rounded-r-full">
        <Icon name="clock" alt="clock" color="gray" stroke />
        <Skeleton w={32} h={6} rounded="md" />
      </div>
      <div className="flex w-[16.313rem] h-16 border-2 border-lightGray items-center gap-4 pl-8 rounded-r-full">
        <Icon name="trashV2" alt="trashV2" color="gray" fill stroke />
        <Skeleton w={24} h={6} rounded="md" />
      </div>
    </div>
  );
};

export default SidebarAirSkeleton;
