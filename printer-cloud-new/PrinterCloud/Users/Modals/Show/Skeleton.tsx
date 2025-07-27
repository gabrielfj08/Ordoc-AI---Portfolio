import * as React from 'react';
import { Skeleton } from 'printer-ui';

const ShowUserModalSkeleton = () => {
  return (
    <div className="sm:h-[592.5px] sm:w-[617px] w-full">
      <div className="w-full h-[88px] bg-lightGray rounded-t-lg" />
      <div className="bg-white p-6">
        <div className="sm:w-full h-[390.5px] flex flex-col space-y-[12.5px] w-72">
          <div className="flex flex-col justify-between space-y-1">
            <Skeleton h={6} w={12} rounded="default" className="mb-[1.5px]" />
            <Skeleton h={4} w={40} rounded="default" />
          </div>
          <div className="flex flex-col justify-between space-y-1">
            <Skeleton h={6} w={12} rounded="default" className="mb-[1.5px]" />
            <Skeleton h={4} w={56} rounded="default" />
          </div>
          <div className="flex flex-col justify-between space-y-1">
            <Skeleton h={6} w={8} rounded="default" className="mb-[1.5px]" />
            <Skeleton h={4} w={28} rounded="default" />
          </div>
          <div className="flex flex-col justify-between space-y-1">
            <Skeleton h={6} w={36} rounded="default" className="mb-[1.5px]" />
            <Skeleton h={4} w={20} rounded="default" />
          </div>
          <div className="flex flex-col justify-between space-y-1">
            <Skeleton h={6} w={16} rounded="default" className="mb-[1.5px]" />
            <Skeleton h={4} w={28} rounded="default" />
          </div>
          <div className="flex flex-col justify-between space-y-1">
            <Skeleton h={6} w={28} rounded="default" className="mb-[1.5px]" />
            <Skeleton h={4} w={20} rounded="default" />
          </div>
          <div className="flex flex-col justify-between space-y-1">
            <Skeleton h={6} w={20} rounded="default" className="mb-[1.5px]" />
            <Skeleton h={4} w={24} rounded="default" />
          </div>
        </div>
      </div>
      <div className="hidden h-[66px] w-full bg-white border-t-2 border-lightGray rounded-b-lg px-6 py-3.5 sm:flex justify-between">
        <Skeleton h={9} w={24} rounded="default" />
        <div className="flex space-x-2">
          <Skeleton h={9} w={44} rounded="default" />
          <Skeleton h={9} w={48} rounded="default" />
        </div>
      </div>
      <div className="h-[94px] w-full bg-white border-t-2 border-lightGray rounded-b-lg px-6 py-3.5 flex justify-between sm:hidden">
        <Skeleton h={7} w={20} rounded="default" />
        <div className="space-y-2">
          <Skeleton h={7} w={36} rounded="default" />
          <Skeleton h={7} w={36} rounded="default" />
        </div>
      </div>
    </div>
  );
};

export default ShowUserModalSkeleton;
