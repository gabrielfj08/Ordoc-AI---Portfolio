import * as React from 'react';
import { Icon, Skeleton } from 'printer-ui';

const AvatarButtonSkeleton = () => {
  return (
    <div className="rounded-full flex -space-x-8 w-24 h-24">
      <Skeleton w={24} h={24} rounded="full" />
      <div className="w-8 pl-2 justify-center items-center flex mt-14">
        <Icon
          h={35}
          w={35}
          name="photo"
          alt="icon"
          color="white"
          stroke
          className="ring-1 p-1 ring-white bg-blue rounded-full"
        ></Icon>
      </div>
    </div>
  );
};

export default AvatarButtonSkeleton;
