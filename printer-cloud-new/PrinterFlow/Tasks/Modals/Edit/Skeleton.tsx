import * as React from 'react';
import { Skeleton } from 'printer-ui';

const EditTaskModalSkeleton = () => {
  return (
    <div className="w-80 h-96 sm:w-[36rem] sm:h-[36rem] bg-white rounded-lg">
      <div className="h-16 bg-lighterGray sm:space-y-4 rounded-t-lg">
        <div className="h-full flex items-center pl-5 space-x-3">
          <Skeleton w={8} h={8} rounded="full" />
          <Skeleton h={5} w={32} rounded="default" />
        </div>
        <div className="w-8/12 sm:w-11/12 h-full flex flex-wrap items-center space-y-2 sm:pt-4 pt-4 pl-4 sm:pl-6">
          <Skeleton h={5} w={32} rounded="default" />
          <Skeleton h={8} w={112} rounded="default" />
        </div>
        <div className="w-8/12 sm:w-11/12 sm:h-full h-fit flex flex-wrap items-center space-y-2 sm:pt-4 pt-6 pl-4 sm:pl-6">
          <Skeleton h={5} w={32} rounded="default" />
          <Skeleton h={16} w={112} rounded="default" />
        </div>

        <div className="hidden sm:grid sm:grid-cols-2 pt-6">
          <div className="w-8/12 sm:w-6/12 h-full flex flex-wrap items-center space-y-1 sm:space-y-2 sm:pt-6 pt-4 pl-4 sm:pl-6">
            <Skeleton h={5} w={24} rounded="default" />
            <Skeleton h={4} w={40} rounded="default" />
          </div>
          <div className="hidden sm:w-8/12 h-full sm:flex flex-wrap items-center sm:space-y-2 sm:pt-6 pt-4 pl-4 sm:pl-6">
            <Skeleton h={5} w={20} rounded="default" />
            <Skeleton h={4} w={56} rounded="default" />
          </div>
        </div>
        <div className="hidden sm:grid sm:grid-cols-2 ">
          <div className="w-8/12 sm:w-6/12 h-full flex flex-wrap items-center space-y-1 sm:space-y-2 sm:pt-4 pt-4 pl-4 sm:pl-6">
            <Skeleton h={5} w={24} rounded="default" />
            <Skeleton h={4} w={40} rounded="default" />
          </div>
          <div className="hidden sm:w-8/12 h-full sm:flex flex-wrap items-center sm:space-y-2 sm:pt-4 pt-2 pl-4 sm:pl-6">
            <Skeleton h={5} w={20} rounded="default" />
            <Skeleton h={4} w={56} rounded="default" />
          </div>
        </div>
        <div className="w-10/12 sm:w-11/12 sm:h-full h-fit flex flex-wrap items-center space-y-2 sm:pt-2 pt-4 pl-4 sm:pl-6">
          <Skeleton h={5} w={32} rounded="default" />
          <Skeleton h={7} w="full" rounded="default" />
        </div>
        <div className="hidden w-11/12 sm:flex flex-wrap pt-2 pl-4 sm:pl-6 justify-between">
          <Skeleton h={8} w={24} rounded="default" />
          <Skeleton h={8} w={24} rounded="default" />
        </div>
        <div className="w-11/12 flex flex-wrap pt-8 pl-4 sm:pl-6 justify-between sm:hidden ">
          <Skeleton h={6} w={20} rounded="default" />
          <Skeleton h={6} w={20} rounded="default" />
        </div>
      </div>
    </div>
  );
};

export default EditTaskModalSkeleton;
