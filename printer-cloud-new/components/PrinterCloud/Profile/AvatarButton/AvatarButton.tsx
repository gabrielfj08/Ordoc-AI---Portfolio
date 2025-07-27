import * as React from 'react';
import { Avatar, Icon, Typography } from 'printer-ui';
import { AvatarProps } from './types';

const AvatarButton = ({ onClick, user }: AvatarProps) => {
  return (
    <div className="rounded-full flex -space-x-8 w-36 h-36">
      {user.avatarUrl ? (
        <Avatar
          size="xl2"
          className="w-screen rounded-full mx-auto block cursor-pointer"
          onClick={onClick}
          placeholder={`${user.name}`.charAt(0)}
          src={user.avatarUrl}
        />
      ) : (
        <div
          className="w-screen rounded-full mx-auto cursor-pointer flex justify-center items-center bg-blue"
          onClick={onClick}
        >
          <Typography variant="title1" color="white">
            {user.name.charAt(0)}
          </Typography>
        </div>
      )}
      <div className="w-8 justify-center items-center flex mt-20">
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

export default AvatarButton;
