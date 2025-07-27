import * as React from 'react';
import { Skeleton, Typography } from 'printer-ui';

const EditRequesterSkeleton = () => {
  return (
    <div className="m-1 items-center justify-center md:mt-5 space-y-10 my-20 sm:block mb-6">
      <div className="hidden sm:block space-y-6 pl-4 sm:pl-0">
        <Skeleton w={72} h={10} rounded="lg" />

        <div className="w-11/12 flex space-x-10">
          <Skeleton w="full" h={10} rounded="lg" />
          <Skeleton w={144} h={10} rounded="lg" />
        </div>
        <div className="w-11/12 flex space-x-10">
          <Skeleton w="full" h={10} rounded="lg" />
          <Skeleton w="full" h={10} rounded="lg" />
        </div>
        <div className="w-11/12 flex space-x-10">
          <Skeleton w="full" h={10} rounded="lg" />
          <Skeleton w="full" h={10} rounded="lg" />
        </div>
      </div>
      <div className="sm:hidden w-auto flex flex-col space-y-6 mr-4">
        <Skeleton w={60} h={10} rounded="lg" />
        <div className="space-y-5">
          <Skeleton w="full" h={10} rounded="lg" />
          <Skeleton w="full" h={10} rounded="lg" />
        </div>
        <div className="space-y-5">
          <Skeleton w="full" h={10} rounded="lg" />
          <Skeleton w="full" h={10} rounded="lg" />
        </div>
        <div className="space-y-5">
          <Skeleton w="full" h={10} rounded="lg" />
          <Skeleton w="full" h={10} rounded="lg" />
        </div>
      </div>
      <div className="hidden sm:block space-y-4 pt-6 pl-4 sm:pl-0">
        <Skeleton w={72} h={10} rounded="lg" />

        <div className="w-11/12 flex space-x-10">
          <Skeleton w="full" h={10} rounded="lg" />
          <Skeleton w={144} h={10} rounded="lg" />
        </div>
        <div className="w-11/12 flex space-x-10">
          <Skeleton w="full" h={10} rounded="lg" />
          <Skeleton w="full" h={10} rounded="lg" />
          <Skeleton w="full" h={10} rounded="lg" />
        </div>
        <div className="w-11/12 flex space-x-10 ">
          <Skeleton w="full" h={10} rounded="lg" />
          <Skeleton w="full" h={10} rounded="lg" />
        </div>
      </div>
      <div className="sm:hidden w-auto flex flex-col space-y-6 mr-4">
        <Skeleton w={60} h={10} rounded="lg" />
        <div className="space-y-5">
          <Skeleton w="full" h={10} rounded="lg" />
          <Skeleton w="full" h={10} rounded="lg" />
        </div>
        <div className="space-y-5">
          <Skeleton w="full" h={10} rounded="lg" />
          <Skeleton w="full" h={10} rounded="lg" />
          <Skeleton w="full" h={10} rounded="lg" />
        </div>
        <div className="space-y-5">
          <Skeleton w="full" h={10} rounded="lg" />
          <Skeleton w="full" h={10} rounded="lg" />
        </div>
      </div>
    </div>
  );
};

export default EditRequesterSkeleton;
