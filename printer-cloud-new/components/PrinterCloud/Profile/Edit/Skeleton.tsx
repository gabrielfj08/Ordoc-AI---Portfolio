import * as React from 'react';
import { Icon, Skeleton } from 'printer-ui';

const EditPageSkeleton = () => {
  return (
    <>
      <div>
        <div className="sm:flex pl-4 pt-2 flex-none sm:ml-14">
          <div className="pl-32 sm:pl-0">
            <Skeleton w={24} h={24} rounded="full" />
          </div>
          <div className="flex pt-10 space-y-2 space-x-3 pl-8">
            <Icon alt="user" name="user" color="black" stroke />
            <Skeleton w={52} h={5} rounded="sm" />
          </div>
        </div>
        <div className="pl-7 pt-7">
          <Skeleton w={28} h={4} rounded="sm" className="mb-3" />
          <input
            disabled
            className="border-2 border-gray rounded-md w-80 sm:w-[850px] h-12 sm:pl-2"
          />
        </div>
        <div className="sm:w-[55.5rem] w-[30.5rem] space-x-80 sm:flex pl-7 pt-7">
          <Skeleton w={24} h={4} rounded="sm" />
          <Skeleton w={24} h={4} rounded="sm" className="sm:flex hidden" />
        </div>
        <div className="sm:w-[55.5rem] w-[30.5rem] sm:space-y-0 space-y-8 sm:space-x-2 sm:flex pl-7 pt-4">
          <input
            disabled
            className="border-2 border-gray rounded-md w-80 sm:w-[428px] h-12 sm:pl-2"
          />
          <Skeleton w={28} h={4} rounded="sm" className="flex sm:hidden" />
          <input
            disabled
            className="border-2 border-gray rounded-md w-80 sm:w-[428px] h-12 sm:pl-2"
          />
        </div>
        <div className="sm:w-[55.5rem] w-[30.5rem] space-x-80 sm:flex pl-8 pt-7">
          <Skeleton w={28} h={4} rounded="sm" />
          <Skeleton w={28} h={4} rounded="sm" className="sm:flex hidden" />
        </div>
        <div className="sm:w-[55.5rem] w-[30.5rem] sm:space-y-0 space-y-8 sm:space-x-2 sm:flex pl-7 pt-4">
          <input
            disabled
            className="border-2 border-gray rounded-md w-80 sm:w-[428px] h-12 sm:pl-2"
          />
          <Skeleton w={28} h={4} rounded="sm" className="flex sm:hidden" />
          <input
            disabled
            className="border-2 border-gray rounded-md w-80 sm:w-[428px] h-12 sm:pl-2"
          />
        </div>
      </div>
    </>
  );
};

export default EditPageSkeleton;
