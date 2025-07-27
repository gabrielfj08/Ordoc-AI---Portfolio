import * as React from 'react';
import { Skeleton } from 'printer-ui';

const HomePageSkeleton = () => {
  return (
    <>
      <div className="sm:hidden grid justify-items-center mt-32 space-y-8">
        <Skeleton w={72} h={36} rounded="2xl" />
        <Skeleton w={72} h={36} rounded="2xl" />
        <Skeleton w={72} h={36} rounded="2xl" />
        <Skeleton w={72} h={36} rounded="2xl" />
      </div>
      <div className="hidden sm:block sm:mt-16 sm:ml-5">
        <div className="flex">
          <div className="space-y-3 mr-[152px]">
            <Skeleton w={28} h={28} rounded="md" />
            <Skeleton w={24} h={6} rounded="md" />
            <Skeleton w={28} h={3} rounded="md" />
            <Skeleton w={24} h={3} rounded="md" />
            <Skeleton w={28} h={3} rounded="md" />
            <Skeleton w={24} h={3} rounded="md" />
          </div>
          <div className="space-y-3 mr-[152px]">
            <Skeleton w={28} h={28} rounded="md" />
            <Skeleton w={24} h={6} rounded="md" />
            <Skeleton w={28} h={3} rounded="md" />
            <Skeleton w={24} h={3} rounded="md" />
            <Skeleton w={28} h={3} rounded="md" />
            <Skeleton w={24} h={3} rounded="md" />
          </div>
          <div className="space-y-3 mr-[152px]">
            <Skeleton w={28} h={28} rounded="md" />
            <Skeleton w={24} h={6} rounded="md" />
            <Skeleton w={28} h={3} rounded="md" />
            <Skeleton w={24} h={3} rounded="md" />
            <Skeleton w={28} h={3} rounded="md" />
            <Skeleton w={24} h={3} rounded="md" />
          </div>
          <div className="space-y-3 mr-[152px]">
            <Skeleton w={28} h={28} rounded="md" />
            <Skeleton w={24} h={6} rounded="md" />
            <Skeleton w={28} h={3} rounded="md" />
            <Skeleton w={24} h={3} rounded="md" />
            <Skeleton w={28} h={3} rounded="md" />
            <Skeleton w={24} h={3} rounded="md" />
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePageSkeleton;
