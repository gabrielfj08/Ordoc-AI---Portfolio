import * as React from 'react';
import { Skeleton } from 'printer-ui';

const ShowProcedureSkeleton = () => {
  return (
    <>
      <div className="w-full flex sm:justify-between sm:items-center gap-2 sm:space-y-0 flex-col-reverse sm:flex-row">
        <span className="hidden sm:flex space-x-6">
          <Skeleton h={12} w={64} rounded="lg" />
          <Skeleton h={12} w={64} rounded="lg" />
        </span>
        <span className="sm:hidden w-full space-y-2">
          <Skeleton h={8} w="full" rounded="lg" />
          <Skeleton h={8} w="full" rounded="lg" />
        </span>
        <div className="flex space-x-2 items-center justify-end">
          <Skeleton h={6} w={14} rounded="lg" />
          <Skeleton h={6} w={24} rounded="lg" />
        </div>
      </div>
      <div className="sm:pt-6 space-y-6 pb-6">
        <div className="hidden sm:block">
          <Skeleton h={8} w={56} rounded="lg" />
        </div>
        <div className="sm:hidden">
          <Skeleton h={6} w={40} rounded="lg" />
        </div>
        <div
          className={`w-full p-2 sm:p-4 border border-lightGray rounded-lg space-y-1`}
        >
          <div className="hidden sm:flex space-x-1.5">
            <Skeleton h={7} w={36} rounded="md" />
            <Skeleton h={7} w={24} rounded="md" />
          </div>
          <div className="flex space-x-1.5 sm:hidden">
            <Skeleton h={4} w={24} rounded="default" />
            <Skeleton h={4} w={20} rounded="default" />
          </div>

          <div className="hidden sm:flex space-x-1.5">
            <Skeleton h={7} w={24} rounded="md" />
            <Skeleton h={7} w={40} rounded="md" />
          </div>
          <div className="flex space-x-1.5 sm:hidden">
            <Skeleton h={4} w={20} rounded="default" />
            <Skeleton h={4} w={28} rounded="default" />
          </div>

          <div className="hidden sm:flex space-x-1.5">
            <Skeleton h={7} w={40} rounded="md" />
            <Skeleton h={7} w={32} rounded="md" />
          </div>
          <div className="flex space-x-1.5 sm:hidden">
            <Skeleton h={4} w={28} rounded="default" />
            <Skeleton h={4} w={20} rounded="default" />
          </div>

          <div className="hidden sm:flex space-x-1.5">
            <Skeleton h={7} w={48} rounded="md" />
            <Skeleton h={7} w={40} rounded="md" />
          </div>
          <div className="flex space-x-1.5 sm:hidden">
            <Skeleton h={4} w={32} rounded="default" />
            <Skeleton h={4} w={28} rounded="default" />
          </div>

          <div className="hidden sm:flex space-x-1.5">
            <Skeleton h={7} w={44} rounded="md" />
            <Skeleton h={7} w={48} rounded="md" />
          </div>
          <div className="flex space-x-1.5 sm:hidden">
            <Skeleton h={4} w={28} rounded="default" />
            <Skeleton h={4} w={32} rounded="default" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowProcedureSkeleton;
