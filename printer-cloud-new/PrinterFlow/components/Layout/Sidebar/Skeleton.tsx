import * as React from 'react';
import { Icon, Skeleton } from 'printer-ui';

const SidebarFlowSkeleton = () => {
  return (
    <div className="mt-2 mr-2">
      <div className="flex w-[16.313rem] h-16 border-2 border-lighterGray items-center gap-4 pl-8 rounded-r-full">
        <Icon name="proceduresV3" alt="procedure" color="gray" stroke />
        <Skeleton w={28} h={6} rounded="md" />
      </div>
      <div className="flex w-[16.313rem] h-16 border-2 border-lighterGray items-center gap-4 pl-8 rounded-r-full">
        <Icon name="tasksV3" alt="task" color="gray" stroke />
        <Skeleton w={24} h={6} rounded="md" />
      </div>
      <div className="flex w-[16.313rem] h-16 border-2 border-lighterGray items-center gap-4 pl-8 rounded-r-full">
        <Icon name="signaturesV3" alt="signature" color="gray" stroke />
        <Skeleton w={28} h={6} rounded="md" />
      </div>
      <div className="flex w-[16.313rem] h-16 border-2 border-lighterGray items-center gap-4 pl-8 rounded-r-full">
        <Icon name="search" alt="searchProcedure" color="gray" stroke />
        <Skeleton w={32} h={6} rounded="md" />
      </div>
      <div className="flex w-[16.313rem] h-16 border-2 border-lighterGray items-center gap-4 pl-8 rounded-r-full">
        <Icon
          name="procedureTemplateV3"
          alt="procedureTemplate"
          color="gray"
          fill
          stroke
        />
        <Skeleton w={36} h={6} rounded="md" />
      </div>
      <div className="flex w-[16.313rem] h-16 border-2 border-lighterGray items-center gap-4 pl-8 rounded-r-full">
        <Icon name="requesterV3" alt="requester" color="gray" fill />
        <Skeleton w={28} h={6} rounded="md" />
      </div>
      <div className="flex w-[16.313rem] h-16 border-2 border-lighterGray items-center gap-4 pl-8 rounded-r-full">
        <Icon name="groupRequesterV3" alt="groupRequester" color="gray" fill />
        <Skeleton w={24} h={6} rounded="md" />
      </div>
    </div>
  );
};

export default SidebarFlowSkeleton;
