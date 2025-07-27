import * as React from 'react';
import { Icon } from 'printer-ui';

import { AvatarLogoProps } from './types';

const AvatarLogo = ({ src, onClick }: AvatarLogoProps) => {
  return (
    <div className="rounded-full flex -space-x-8 w-[5.8rem] h-[5.8rem]">
      <img
        className="w-screen rounded-full mx-auto block cursor-pointer"
        onClick={onClick}
        src={`${src || '../../assets/institution-logo.png'}`}
      />
      <div className="w-8 pl-2 justify-center items-center flex mt-14">
        <Icon
          h={20}
          w={20}
          name="photo"
          alt="icon"
          color="info"
          stroke
          className="ring-1 ring-white bg-white rounded-full"
        ></Icon>
      </div>
    </div>
  );
};

export default AvatarLogo;
